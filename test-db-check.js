import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Disable SSL certificate validation for Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Disable SSL to avoid certificate issues
});

async function checkDatabase() {
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    
    // Test connection first
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful!');
    
    // Check student users
    const studentsResult = await pool.query("SELECT id, email, first_name, last_name, role FROM users WHERE role = 'student' LIMIT 5");
    console.log('\nStudent users found:', studentsResult.rows.length);
    studentsResult.rows.forEach(user => {
      console.log('Student:', user.email, '| ID:', user.id, '| Name:', user.first_name, user.last_name);
    });
    
    // Check complaints
    const complaintsResult = await pool.query("SELECT id, reference_number, user_id, exam_name, status FROM complaints LIMIT 5");
    console.log('\nComplaints found:', complaintsResult.rows.length);
    complaintsResult.rows.forEach(complaint => {
      console.log('Complaint ID:', complaint.id, '| User ID:', complaint.user_id, '| Exam:', complaint.exam_name, '| Status:', complaint.status);
    });
    
    // Check if any student has complaints
    const studentComplaintsResult = await pool.query(`
      SELECT u.email, u.first_name, c.id as complaint_id, c.exam_name, c.status 
      FROM users u 
      JOIN complaints c ON u.id = c.user_id 
      WHERE u.role = 'student' 
      LIMIT 3
    `);
    console.log('\nStudent-complaint relationships found:', studentComplaintsResult.rows.length);
    studentComplaintsResult.rows.forEach(row => {
      console.log('Student:', row.email, '| Complaint:', row.complaint_id, '| Exam:', row.exam_name);
    });
    
  } catch (error) {
    console.error('Database error:', error.message);
    if (error.code) console.error('Error code:', error.code);
  } finally {
    await pool.end();
  }
}

checkDatabase();
