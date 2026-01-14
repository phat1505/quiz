// src/type/user.ts

export interface User {
  id: number
  username: string
  password: string
  role: "admin" | "user"
}

export const USER_API =
  "http://localhost:3001/api/auth"
  export const REGISTER_API = "http://localhost:3001/api/auth/register"
