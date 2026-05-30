import { embedSingle } from "@/lib/embed";
import pool from "@/lib/db";

//转换向量数组为字符串格式
function formatVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

//拼接rag上下文
export async function buildRagContext(
  query: string,
  documentIds: string[],
  topK = 5,
): Promise<string | null> {
  const queryVector = await embedSingle(query);

  const result = await pool.query(
    `SELECT dc.content, d.filename
     FROM document_chunks dc
     JOIN documents d ON dc.document_id = d.id
     WHERE dc.document_id = ANY($1)
     ORDER BY dc.embedding <=> $2::vector
     LIMIT $3`,
    [documentIds, formatVector(queryVector), topK],
  );

  if (result.rows.length === 0) return null;

  const chunks = result.rows as { content: string; filename: string }[];
  let context = "## 参考资料\n\n";
  for (const chunk of chunks) {
    context += `### 来自文档：${chunk.filename}\n${chunk.content}\n\n`;
  }
  context +=
    "请基于以上参考资料回答用户的问题。如果参考资料不足以回答，请如实告知，不要编造\n" +
    "禁止在段落开头或中间放置引用标注，统一放到对应内容的末尾。\n" +
    "重要：在回答中必须明确标注引用的文档来源。标注时，请将引用来源放在对应段落或句子的末尾，格式为「（根据《xxx.md》文档）」。" +
    "例如：某个观点来源于 reference.md 文件，请在引用该信息的句子或段落结尾加上（根据 reference.md 文档）。";

  return context;
}
//AI润色用户提示词
export async function rewriteQuery(query: string): Promise<string> {
  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是一个搜索关键词优化专家。将用户的口语化问题改写成适合知识库检索的专业关键词组合。
规则：
1. 保留核心语义
2. 使用专业术语
3. 添加同义词
4. 只输出改写结果，不要解释
5. 输出不超过30个字

示例：
用户：怎么让我的程序跑快点？
输出：代码性能优化 程序加速方法 运行效率提升

用户：这个bug怎么修？
输出：代码调试 错误修复方案 BUG排查`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.3,
        max_tokens: 60,
      }),
    });

    if (!response.ok) {
      console.error("改写失败:", response.status);
      return query;
    }

    const data = await response.json();
    const rewritten = data.choices[0].message.content;
    return rewritten || query;
  } catch (error) {
    console.error("改写出错:", error);
    return query;
  }
}
