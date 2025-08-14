import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function checkCourseFields() {
  try {
    const result = await pool.query('SELECT course, complaint_type, exam_name FROM complaints LIMIT 1');
    if (result.rows.length > 0) {
      console.log('Course field value:', result.rows[0].course);
      console.log('Exam name:', result.rows[0].exam_name);
      console.log('Complaint type:', result.rows[0].complaint_type);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkCourseFields();
