import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { USER_API } from "../type/user"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Please fill all fields")
      return
    }

    // check username tồn tại
    const res = await fetch(USER_API)
    const users = await res.json()

    const exists = users.find((u: any) => u.username === username)
    if (exists) {
      setError("Username already exists")
      return
    }

    // tạo user mới
    await fetch(USER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        role: "user" // 
      })
    })

    alert("Register success! Please login.")
    navigate("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Register</h1>

      <input
        className="border p-2 rounded w-64"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 rounded w-64"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleRegister}
        className="bg-green-500 text-white px-6 py-2 rounded-xl"
      >
        Register
      </button>

      <Link to="/login" className="text-blue-600 underline text-sm">
        Back to Login
      </Link>
    </div>
  )
}
