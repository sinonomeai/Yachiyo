import pool from "./db";

export async function saveUserMessage({ sessionId, parts }: { sessionId: string; parts: any[] }) {
  await pool.query(`INSERT INTO chat_messages (session_id, role, parts) VALUES ($1, $2, $3)`, [
    sessionId,
    "user",
    JSON.stringify(parts),
  ]);
}

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
