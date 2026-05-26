import pool from "./db";

//api层流式输出时存储用户消息
export async function saveUserMessage({ sessionId, parts }: { sessionId: string; parts: any[] }) {
  await pool.query(`INSERT INTO chat_messages (session_id, role, parts) VALUES ($1, $2, $3)`, [
    sessionId,
    "user",
    JSON.stringify(parts),
  ]);
}
//结束时存储ai消息
export async function saveAssistantMessage({
  sessionId,
  parts,
}: {
  sessionId: string;
  parts: any[];
}) {
  await pool.query(`INSERT INTO chat_messages (session_id, role, parts) VALUES ($1, $2, $3)`, [
    sessionId,
    "assistant",
    JSON.stringify(parts),
  ]);
}
