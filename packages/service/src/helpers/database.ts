import mysql, {
  Pool,
  PoolOptions,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

// 数据库连接配置
const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ai_line",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// 创建连接池
let pool: Pool | null = null;

/**
 * 获取数据库连接池
 */
export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool(poolConfig);
  }
  return pool;
}

/**
 * 初始化数据库连接
 */
export async function connectTest(): Promise<void> {
  try {
    const connection = await getPool().getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

/**
 * 关闭数据库连接池
 */
export async function close(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("🔌 Database connection pool closed");
  }
}

/**
 * 执行查询语句，返回结果集
 */
export async function query<T extends RowDataPacket[]>(
  sql: string,
  params?: unknown[],
  connection?: mysql.PoolConnection
): Promise<T> {
  const executor = connection || getPool();
  const [rows] = await executor.query<T>(sql, params);
  return rows;
}

/**
 * 执行单条数据查询
 */
export async function queryOne<T extends RowDataPacket>(
  sql: string,
  params?: unknown[],
  connection?: mysql.PoolConnection
): Promise<T | null> {
  const rows = await query<T[]>(sql, params, connection);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * 执行插入操作，返回插入的ID
 */
export async function insert(
  sql: string,
  params?: unknown[],
  connection?: mysql.PoolConnection
): Promise<number> {
  const executor = connection || getPool();
  const [result] = await executor.execute<ResultSetHeader>(sql, params);
  return result.insertId;
}

/**
 * 执行更新操作，返回受影响的行数
 */
export async function update(
  sql: string,
  params?: unknown[],
  connection?: mysql.PoolConnection
): Promise<number> {
  const executor = connection || getPool();
  const [result] = await executor.execute<ResultSetHeader>(sql, params);
  return result.affectedRows;
}

/**
 * 执行删除操作，返回受影响的行数
 */
export async function remove(
  sql: string,
  params?: unknown[],
  connection?: mysql.PoolConnection
): Promise<number> {
  const executor = connection || getPool();
  const [result] = await executor.execute<ResultSetHeader>(sql, params);
  return result.affectedRows;
}

/**
 * 执行事务
 */
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
