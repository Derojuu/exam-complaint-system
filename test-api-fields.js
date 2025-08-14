import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function testAPIResponse() {
  try {
    const result = await pool.query('SELECT id, user_id FROM complaints LIMIT 1');
    const { id, user_id } = result.rows[0];
    
    console.log('Testing with complaint ID:', id);
    console.log('Testing with user ID:', user_id);
    
    // Test the updated API query
    const apiResult = await pool.query(`
      SELECT 
        c.id,
        c.reference_number as "referenceNumber",
        c.full_name as "fullName",
        c.student_id as "studentId",
        c.email,
        c.phone,
        c.exam_name as "examName",
        c.exam_date as "examDate",
        c.complaint_type as "complaintType",
        c.description,
        c.desired_resolution as "desiredResolution",
        c.evidence_file as "evidenceFile",
        c.status,
        c.course,
        c.department,
        c.faculty,
        c.user_id as "userId",
        u.department AS "userDepartment",
        u.faculty AS "userFaculty",
        u.level AS "userLevel",
        TO_CHAR(c.created_at, 'YYYY-MM-DD HH24:MI:SS') as "createdAt"
      FROM complaints c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.id = $1 AND c.user_id = $2
    `, [id, user_id]);
    
    console.log('\n=== Updated API Response Fields ===');
    console.log(Object.keys(apiResult.rows[0]));
    
    console.log('\n=== Key Field Values ===');
    const complaint = apiResult.rows[0];
    console.log('referenceNumber:', complaint.referenceNumber);
    console.log('examName:', complaint.examName);
    console.log('complaintType:', complaint.complaintType);
    console.log('description exists:', !!complaint.description);
    console.log('desiredResolution exists:', !!complaint.desiredResolution);
    console.log('evidenceFile:', complaint.evidenceFile);
    console.log('status:', complaint.status);
    console.log('createdAt:', complaint.createdAt);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testAPIResponse();
