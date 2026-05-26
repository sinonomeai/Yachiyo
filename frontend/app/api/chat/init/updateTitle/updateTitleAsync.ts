import pool from "@/lib/db";

export async function updateTitleAsync(sessionId: string, firstMessage: string) {
  const title = await generateTitle(firstMessage);
  await pool.query(`UPDATE chat_sessions SET title = $1 WHERE id = $2`, [title, sessionId]);
  console.log(`会话 ${sessionId} 标题已更新: ${title}`);
}

async function generateTitle(firstMessage: string): Promise<string> {
  const apiUrl = "https://api.deepseek.com/chat/completions";

  try {
    const response = await fetch(apiUrl, {
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
            content: `请将用户的第一句话精炼成一个简洁、准确的标题，要求：
          1. 标题长度控制在5-10个字之间；
          2. 只返回标题本身，不要输出任何解释、说明、引号、括号或标点符号；
          3. 标题应准确概括用户问题的核心主题；
          4. 使用中文，不要添加"标题："等前缀；
          5. 如果用户消息不足5个字，可适当补充关键词使其通顺。

          示例：
          用户："Python怎么读取CSV文件？" → Python读取CSV
          用户："推荐几本好看的历史小说" → 历史小说推荐
          用户："如何做红烧肉" → 红烧肉做法
          用户："你好" → 打招呼
          用户："天气怎么样" → 今日天气查询
          用户："帮我写一段JavaScript代码实现数组去重" → JS数组去重
          用户："什么是量子力学" → 量子力学简介
          用户："明天北京会下雨吗" → 北京明日天气
          用户："介绍一下《三体》这本书" → 三体书籍介绍
          用户："怎么减肥最有效" → 有效减肥方法`,
          },
          {
            role: "user",
            content: firstMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 20,
      }),
    });

    if (!response.ok) {
      return "新对话";
    }

    const data = await response.json();
    let title = data.choices[0].message.content;
    title = title.replace(/["''《》<>]/g, "").trim();

    return title || "新对话";
  } catch (error) {
    console.error("生成标题失败:", error);
    return "新对话";
  }
}
