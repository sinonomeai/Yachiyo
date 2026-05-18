import { Pool } from "pg";

// 直接写死密码测试（测试完后改回来）
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Exusiai520", // 直接写你的密码
  database: "yachiyo",
});

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ 数据库连接成功:", result.rows[0]);

    const tables = await pool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    console.log(
      "📋 已有表:",
      tables.rows.map((r) => r.tablename),
    );
  } catch (error) {
    console.error("❌ 数据库连接失败:", error);
  } finally {
    await pool.end();
  }
}

testConnection();
