// lib/userLookup.ts

import { executeQuery } from "@/lib/db"

export async function getUserByEmailOrStudentId(email: string, studentId: string) {
  interface User {
    id: number
    email: string
    student_id: string
    role: string
    first_name: string
    last_name: string
    password: string
  }

  const result = await executeQuery(`
    SELECT id, email, student_id, role, first_name, last_name, password 
    FROM users 
    WHERE email = $1 OR student_id = $2
  `, [email, studentId])
  
  const user = result.rows[0] as User

  return user
}
