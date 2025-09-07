import { Pool, Client } from 'pg'
import { config as dotenvConfig } from 'dotenv'
import bcrypt from "bcryptjs"
dotenvConfig()

// Disable SSL certificate validation for Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Supabase-compatible PostgreSQL configuration
const config = {
  connectionString: process.env.DATABASE_URL,
  // Alternative individual parameters if DATABASE_URL is not used
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 40, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 10000, // how long to try connecting before timing out
  ssl: false // Disable SSL entirely to avoid certificate issues
}

let pool: Pool | null = null
let isInitialized = false
let initializationInProgress = false

export async function getDb(): Promise<Pool> {
  try {
    if (!pool) {
      console.log('Creating new PostgreSQL connection pool for Supabase...');
      pool = new Pool(config);
      console.log('PostgreSQL connection pool created successfully!');
      
      // Auto-initialize tables on first connection
      if (!isInitialized && !initializationInProgress) {
        console.log('Initializing database tables...');
        await initDb();
      }
    }
    
    return pool;
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
    throw error;
  }
}

// Initialize database tables for Supabase PostgreSQL
export async function initDb() {
  if (isInitialized || initializationInProgress) return;
  
  initializationInProgress = true;
  try {
    if (!pool) {
      throw new Error('Database pool not initialized');
    }
    
    console.log('Creating database tables for Supabase...');
    
    // Test connection first
    const client = await pool.connect();
    await client.query('SELECT 1');
    console.log('Database connection test successful');
    
    // Enable UUID extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    console.log('✅ UUID extension enabled');

    // Create users table with proper PostgreSQL schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        student_id VARCHAR(50) UNIQUE,
        staff_id VARCHAR(50) UNIQUE,
        role VARCHAR(50) NOT NULL DEFAULT 'student',
        level VARCHAR(50),
        position VARCHAR(255),
        phone VARCHAR(20),
        department VARCHAR(255),
        faculty VARCHAR(255),
        courses TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        profile_pic_url VARCHAR(512),
        last_login_at TIMESTAMP,
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP,
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255)
      )
    `);
    console.log('✅ Users table created');

    // Create complaints table with proper foreign key references
    await client.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        reference_number VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        student_id VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        exam_name VARCHAR(255) NOT NULL,
        exam_date VARCHAR(50) NOT NULL,
        complaint_type VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        desired_resolution TEXT NOT NULL,
        evidence_file VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        course VARCHAR(255),
        department VARCHAR(255),
        faculty VARCHAR(255),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        assigned_to UUID REFERENCES users(id),
        resolution_notes TEXT,
        priority VARCHAR(20) DEFAULT 'medium'
      )
    `);
    console.log('✅ Complaints table created');

    // Create password_reset_tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Password reset tokens table created');

    // Create complaint_status_history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS complaint_status_history (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        old_status VARCHAR(50),
        new_status VARCHAR(50) NOT NULL,
        changed_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        changed_by_name VARCHAR(255) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Complaint status history table created');

    // Create responses table (rename to complaint_responses for consistency)
    await client.query(`
      CREATE TABLE IF NOT EXISTS complaint_responses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        message TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        is_admin_response BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attachment_url VARCHAR(500)
      )
    `);
    console.log('✅ Complaint responses table created');

    // Also create the old 'responses' table for backward compatibility
    await client.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        text TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Responses table created (backward compatibility)');

    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        related_id UUID,
        complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        action_url VARCHAR(500)
      )
    `);
    console.log('✅ Notifications table created');

    // Create audit logs table for tracking changes
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(100),
        entity_id UUID,
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Audit logs table created');

    // Create indexes for better performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_complaints_reference ON complaints(reference_number)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_complaint_responses_complaint_id ON complaint_responses(complaint_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_responses_complaint_id ON responses(complaint_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_user_notifications ON notifications (user_id, created_at DESC)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_unread_notifications ON notifications (user_id, is_read)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)`);
    console.log('✅ Database indexes created');

    // Create triggers for updated_at timestamps
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    // Drop existing triggers first, then create them
    await client.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON users`);
    await client.query(`
      CREATE TRIGGER update_users_updated_at 
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await client.query(`DROP TRIGGER IF EXISTS update_complaints_updated_at ON complaints`);
    await client.query(`
      CREATE TRIGGER update_complaints_updated_at 
      BEFORE UPDATE ON complaints
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await client.query(`DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications`);
    await client.query(`
      CREATE TRIGGER update_notifications_updated_at 
      BEFORE UPDATE ON notifications
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log('✅ Database triggers created');

    // Insert a default admin user if it doesn't exist
    const adminPassword = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO users (
        first_name, 
        last_name, 
        email, 
        password, 
        role, 
        department,
        is_verified
      ) VALUES (
        'System',
        'Administrator', 
        'admin@excos.edu',
        $1,
        'admin',
        'IT Department',
        true
      ) ON CONFLICT (email) DO NOTHING
    `, [adminPassword]);
    console.log('✅ Default admin user created');

    client.release();
    isInitialized = true;
    initializationInProgress = false;
    console.log('✅ All database tables initialized successfully for Supabase');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    initializationInProgress = false;
    throw error;
  }
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    isInitialized = false;
    console.log('Database connection pool closed');
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const db = await getDb();
    const client = await db.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Database connection test successful');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

export async function executeQuery(query: string, params: any[] = []): Promise<any> {
  let retries = 3;
  
  while (retries > 0) {
    try {
      const db = await getDb();
      const client = await db.connect();
      try {
        const result = await client.query(query, params);
        return result;
      } finally {
        client.release();
      }
    } catch (error: any) {
      retries--;
      console.error(`Query execution failed (${3 - retries}/3):`, error?.message);
      
      if (error?.code === 'ECONNRESET' ||
          error?.code === 'ETIMEDOUT' ||
          error?.code === 'ENOTFOUND' ||
          error?.code === 'ECONNREFUSED' ||
          error?.code === 'SELF_SIGNED_CERT_IN_CHAIN' ||
          error?.message?.includes('certificate')) {
        
        if (pool) {
          try {
            await pool.end();
          } catch (e) {
            console.log('Error closing pool:', e);
          }
          pool = null;
          isInitialized = false;
        }
        
        if (retries > 0) {
          console.log('Retrying query with new connection pool...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
      }
      
      if (retries === 0) {
        throw error;
      }
    }
  }
  throw new Error('Query failed after 3 retries');
}

// Update generateId to use UUID
export function generateId(): string {
  // For PostgreSQL with UUID, we'll let the database generate UUIDs
  // This function can still be used for reference numbers
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 9)
  );
}

// Update functions to work with UUID
export async function updateUserPassword(userId: string, hashedPassword: string): Promise<boolean> {
  try {
    const result = await executeQuery(
      `UPDATE users 
       SET password = $1, 
           password_updated_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2::uuid`,
      [hashedPassword, userId]
    );
    
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Failed to update password");
  }
}

export async function verifyUserPassword(userId: string, currentPassword: string): Promise<boolean> {
  try {
    const result = await executeQuery(
      `SELECT password FROM users WHERE id = $1::uuid`,
      [userId]
    );

    if (!result.rows || result.rows.length === 0) {
      return false;
    }

    return await bcrypt.compare(currentPassword, result.rows[0].password);
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Failed to verify password");
  }
}

export function generateReferenceNumber() {
  return 'REF-' + Math.floor(100000 + Math.random() * 900000);
}
