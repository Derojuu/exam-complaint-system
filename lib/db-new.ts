import { Pool } from 'pg'
import { config as dotenvConfig } from 'dotenv'
import bcrypt from "bcryptjs"
dotenvConfig()

// Supabase-compatible PostgreSQL configuration
const config = {
  connectionString: process.env.DATABASE_URL,
  // Alternative individual parameters if DATABASE_URL is not used
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 50, // Increased from 10 to 50
  idleTimeoutMillis: 300000, // 5 minutes
  connectionTimeoutMillis: 60000, // 60 seconds
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
}

let pool: Pool | null = null
let isInitialized = false

export async function getDb(): Promise<Pool> {
  try {
    if (!pool) {
      console.log('Creating new PostgreSQL connection pool for Supabase...');
      pool = new Pool(config);
      console.log('PostgreSQL connection pool created successfully!');
    }
    
    // Only initialize database once
    if (!isInitialized) {
      await initDb(pool);
      isInitialized = true;
      console.log('Database initialized successfully!');
    }
    
    return pool;
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
    throw error;
  }
}

// Function to close the connection pool
export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    isInitialized = false;
    console.log('Database connection pool closed');
  }
}

// Function to test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const db = await getDb();
    const client = await db.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// Function to safely execute queries with connection retry
export async function executeQuery(query: string, params: any[] = []): Promise<any> {
  let retries = 3;
  
  while (retries > 0) {
    try {
      const db = await getDb();
      const client = await db.connect();
      try {
        return await client.query(query, params);
      } finally {
        client.release();
      }
    } catch (error: any) {
      retries--;
      console.error(`Query execution failed (${3 - retries}/3):`, error?.message);
      
      if (error?.code === 'ECONNRESET' || error?.code === 'ECONNREFUSED') {
        // Connection issues - close pool and retry
        if (pool) {
          await pool.end();
          pool = null;
          isInitialized = false;
        }
        
        if (retries > 0) {
          console.log('Retrying query with new connection pool...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          continue;
        }
      }
      
      throw error;
    }
  }
}

async function initDb(pool: Pool) {
  try {
    console.log('PostgreSQL database initialization: Skipping table creation to avoid connection issues');
    return; // Skip table creation for now - tables will be created via Prisma migrations
  } catch (error) {
    console.error('PostgreSQL database initialization failed:', error);
    throw error;
  }
}

// Helper function to generate a unique ID
export function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 9)
  );
}

// Add a helper function for password updates
export async function updateUserPassword(userId: string, hashedPassword: string): Promise<boolean> {
  try {
    const result = await executeQuery(
      'UPDATE users SET password = $1, password_updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Failed to update password");
  }
}

// Add a helper function for password verification
export async function verifyUserPassword(userId: string, currentPassword: string): Promise<boolean> {
  try {
    const result = await executeQuery(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (!result.rows || result.rows.length === 0) {
      throw new Error("User not found");
    }

    return await bcrypt.compare(currentPassword, result.rows[0].password);
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Failed to verify password");
  }
}

// Function to generate a unique reference number
export function generateReferenceNumber() {
  return 'REF-' + Math.floor(100000 + Math.random() * 900000);
}
