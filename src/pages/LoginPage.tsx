import { useState } from "react"
import { USER_API } from "../type/user"
import type { User } from "../type/user"
import { Link } from "react-router-dom"
type Props = {
    onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: Props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async () => {
        const res = await fetch(USER_API)
        const users: User[] = await res.json()

        const foundUser = users.find(
            u => u.username === username && u.password === password
        )

        if (!foundUser) {
            setError("Invalid username or password")
            return
        }

        // ✅ lưu localStorage (giả lập session)
        localStorage.setItem("user", JSON.stringify(foundUser))
        onLogin(foundUser)
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-3xl font-bold">Login</h1>

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
                onClick={handleLogin}
                className="bg-blue-500 text-white px-6 py-2 rounded-xl"
            >
                Login
            </button>
            <p className="text-sm">
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-600 underline">
                    Register
                </Link>
            </p>

        </div>
    )
}
