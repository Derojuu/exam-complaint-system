// Simple test to check the complaint details API
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function testComplaintAPI() {
  try {
    console.log('Testing complaint details API...');
    
    // Get the actual complaint and user IDs from database
    const result = await pool.query(`
      SELECT c.id as complaint_id, c.user_id, u.email, u.role 
      FROM complaints c 
      JOIN users u ON c.user_id = u.id 
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      console.log('No complaints found in database');
      return;
    }
    
    const { complaint_id, user_id, email, role } = result.rows[0];
    console.log('Found complaint:');
    console.log('- Complaint ID:', complaint_id);
    console.log('- User ID:', user_id);
    console.log('- Email:', email);
    console.log('- Role:', role);
    
    // Test the API endpoint manually by simulating the query
    const apiResult = await pool.query(`
      SELECT 
        c.*,
        u.department AS user_department,
        u.faculty AS user_faculty,
        u.level AS user_level,
        c.exam_date,
        TO_CHAR(c.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
      FROM complaints c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.id = $1 AND c.user_id = $2
    `, [complaint_id, user_id]);
    
    console.log('\nAPI Query Result:');
    console.log('- Found complaints:', apiResult.rows.length);
    if (apiResult.rows.length > 0) {
      const complaint = apiResult.rows[0];
      console.log('- Complaint Title:', complaint.exam_name);
      console.log('- Status:', complaint.status);
      console.log('- Description:', complaint.description ? complaint.description.substring(0, 100) + '...' : 'No description');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testComplaintAPI();
