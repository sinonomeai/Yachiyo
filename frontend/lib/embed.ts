const EMBEDDING_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings";
const EMBEDDING_MODEL = "text-embedding-v4";
const MAX_BATCH = 10; // text-embedding-v4 单次最多 10 条

//将上传的文档向量化
export async function embedChunks(chunks: string[]): Promise<number[][]> {
  if (chunks.length === 0) return [];

  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) throw new Error("DASHSCOPE_API_KEY is not set");

  const allEmbeddings: number[][] = [];

  for (let i = 0; i < chunks.length; i += MAX_BATCH) {
    const batch = chunks.slice(i, i + MAX_BATCH);

    const res = await fetch(EMBEDDING_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: batch,
        parameters: {
          text_type: "document",
          dimension: 1024,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DashScope embedding failed: ${res.status} ${err}`);
    }

    const json = await res.json();
    for (const d of json.data) {
      allEmbeddings.push(d.embedding as number[]);
    }
  }

  return allEmbeddings;
}
//调用text-embedding-v4模型将用户提示词向量化
export async function embedSingle(text: string): Promise<number[]> {
  const result = await embedChunks([text]);
  return result[0];
}
