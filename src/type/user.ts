// src/type/user.ts

export interface User {
  id?: string
  username: string
  password: string
  role: "admin" | "user"
}

export const USER_API =
  "https://6954c2091cd5294d2c7d6378.mockapi.io/api/quiz/users"
