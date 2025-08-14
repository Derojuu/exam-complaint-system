import { executeQuery, generateId } from '../lib/db.ts';
import bcrypt from 'bcryptjs';

async function createTestAdmins() {
  try {
    
    // Test admin data
    const testAdmins = [
      {
        email: 'lecturer@test.com',
        firstName: 'John',
        lastName: 'Lecturer',
        staffId: 'LEC001',
        password: 'password123',
        position: 'lecturer',
        department: 'Computer Science',
        faculty: 'Engineering',
        courses: 'CS101, CS202, CS303'
      },
      {
        email: 'hod@test.com',
        firstName: 'Jane',
        lastName: 'HOD',
        staffId: 'HOD001',
        password: 'password123',
        position: 'hod',
        department: 'Computer Science',
        faculty: 'Engineering',
        courses: null
      },
      {
        email: 'dean@test.com',
        firstName: 'Bob',
        lastName: 'Dean',
        staffId: 'DEAN001',
        password: 'password123',
        position: 'dean',
        department: null,
        faculty: 'Engineering',
        courses: null
      },
      {
        email: 'sysadmin@test.com',
        firstName: 'Alice',
        lastName: 'Admin',
        staffId: 'SYS001',
        password: 'password123',
        position: 'admin',
        department: null,
        faculty: null,
        courses: null
      }
    ];

    for (const admin of testAdmins) {
      // Check if admin already exists
      const existingResult = await db.query(
        'SELECT id FROM admins WHERE email = $1 OR staff_id = $2',
        [admin.email, admin.staffId]
      );

      if (existingResult.rows && existingResult.rows.length > 0) {
        console.log(`Admin ${admin.email} already exists, skipping...`);
        continue;
      }

      const adminId = generateId();
      const hashedPassword = await bcrypt.hash(admin.password, 10);

      const client = await db.connect();
      try {
        await client.query(`
          INSERT INTO admins (
            id, email, password, first_name, last_name, staff_id, 
            position, department, faculty, courses, role
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          adminId,
          admin.email,
          hashedPassword,
          admin.firstName,
          admin.lastName,
          admin.staffId,
          admin.position,
          admin.department,
          admin.faculty,
          admin.courses,
          'admin'
        ]);
      } finally {
        client.release();
      }

      console.log(`Created admin: ${admin.email} (${admin.position})`);
    }

    console.log('Test admin creation completed!');
    console.log('\nTest Login Credentials:');
    console.log('Lecturer: lecturer@test.com / password123');
    console.log('HOD: hod@test.com / password123');
    console.log('Dean: dean@test.com / password123');
    console.log('System Admin: sysadmin@test.com / password123');

  } catch (error) {
    console.error('Error creating test admins:', error);
  } finally {
    process.exit(0);
  }
}

createTestAdmins();
