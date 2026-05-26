import { Pool } from "pg";
//创建一个可复用的数据库连接池，在整个应用中共享，避免每次查询都创建新连接。
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "yachiyo",
  max: 20,
  idleTimeoutMillis: 30000,
});

export default pool;
