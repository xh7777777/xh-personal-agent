import env from "@/utils/load-env.js";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/db/schema.js";

const poolConnection = mysql.createPool({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  database: env.DATABASE_NAME,
  port: env.DATABASE_PORT,
  password: env.DATABASE_PASSWORD,
  waitForConnections: true, // 连接池满时等待
  connectionLimit: 10, // 最大连接数
  queueLimit: 0, // 0 = 不限制排队
});
const db = drizzle(poolConnection, { schema, mode: 'default' });

export default db;
