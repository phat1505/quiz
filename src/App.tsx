import { Routes, Route, Link, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import LoginPage from "./pages/LoginPage"
import QuizPage from "./pages/QuizPage"
import AddQuestionPage from "./pages/AddQuestionPage"
import type { User } from "./type/user"
import RegisterPage from "./pages/RegisterPage"
export default function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <div className="w-screen h-screen">
      {/* ===== NAV ===== */}
      {user && (
        <nav className="flex justify-center gap-5 text-white text-2xl mb-6">
          <Link to="/quiz" className="bg-green-400 px-3 py-2 rounded-2xl">
            Quiz
          </Link>

          {user.role === "admin" && (
            <Link
              to="/add-question"
              className="bg-red-400 px-3 py-2 rounded-2xl"
            >
              Add Question
            </Link>
          )}
          
          <button
            onClick={logout}
            className="bg-gray-500 px-3 py-2 rounded-2xl"
          >
            Logout
          </button>
        </nav>
      )}

      {/* ===== ROUTES ===== */}
      <Routes>
        {!user && (
          <>
            <Route path="/login" element={<LoginPage onLogin={setUser} />} />
            <Route path="/register" element={<RegisterPage />} />
          </>
        )}

        {user && (
          <>
            <Route path="/quiz" element={<QuizPage />} />
            {user.role === "admin" && (
              <Route path="/add-question" element={<AddQuestionPage />} />
            )}
          </>
        )}

        <Route
          path="*"
          element={<Navigate to={user ? "/quiz" : "/login"} />}
        />
      </Routes>
    </div>
  )
}
