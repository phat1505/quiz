import { useState, useEffect } from "react"
import type { Quiz } from "../type/quiz"
import { API_URL } from "../type/quiz"
import { SCORE_API } from "../type/score"

type UserRank = {
  username: string
  total_score: number
  total_questions: number
}

type CategoryRank = {
  category: string
  total_users: number
}

type CategoryScoreRank = {
  username: string
  score: number
  total_questions: number
}
export default function QuizPage() {
  //Rank
  const [globalRank, setGlobalRank] = useState<UserRank[]>([])
  const [topCategories, setTopCategories] = useState<CategoryRank[]>([])
  const [categoryRank, setCategoryRank] = useState<CategoryScoreRank[]>([])

  const [questions, setQuestions] = useState<Quiz[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [textAnswer, setTextAnswer] = useState("")
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    fetch("http://localhost:3001/api/rank/global")
      .then(res => res.json())
      .then(setGlobalRank)

    fetch("http://localhost:3001/api/rank/categories/popular")
      .then(res => res.json())
      .then(setTopCategories)
  }, [])

  useEffect(() => {
    if (!showScore || !selectedCategory) return

    fetch(`http://localhost:3001/api/rank/category/${selectedCategory}`)
      .then(res => res.json())
      .then(setCategoryRank)
  }, [showScore, selectedCategory])

  useEffect(() => {
    if (!showScore || !user) return

    const saveScore = async () => {
      await fetch(SCORE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          score,
          total: filteredQuestions.length,
          category: selectedCategory
        })
      })
    }

    saveScore()
  }, [showScore])
  const categories = [...new Set(questions.map(q => q.category))]
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setQuestions)
  }, [])


  const filteredQuestions = questions.filter(
    q => q.category === selectedCategory
  )
  const currentQuestion = filteredQuestions[currentIndex]
  // ===== TIMER =====
  useEffect(() => {
    if (!started || showScore) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleNext()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [started, currentIndex, showScore])
  useEffect(() => {
    if (!started || showScore) return
    if (!currentQuestion) return

    setTimeLeft(getTimeLimit(currentQuestion))
  }, [currentIndex, started])


  const handleNext = () => {
    if (currentQuestion.isMultipleChoice) {
      if (selectedOption === currentQuestion.correctAnswer) {
        setScore(s => s + 1)
      }
    } else {
      if (
        textAnswer.trim().toLowerCase() ===
        currentQuestion.correctTextAnswer?.toLowerCase()
      ) {
        setScore(s => s + 1)
      }
    }

    setSelectedOption(null)
    setTextAnswer("")
    setTimeLeft(getTimeLimit(filteredQuestions[currentIndex + 1] || currentQuestion))

    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(i => i + 1)
    } else {
      setShowScore(true)
    }
  }
  const getTimeLimit = (q: Quiz) => {
    return q.isMultipleChoice ? 10 : 20
  }

  // ===== LOADING =====
  if (questions.length === 0) {
    return <p className="text-center">Loading...</p>
  }

  return (
    <div className="flex gap-6 px-6 mt-6">
      {/* ==============================================Quiz============================================ */}
      <div className="flex-1">
        {!selectedCategory && (
          <div className="flex flex-col items-center mt-20 gap-4">
            <h1 className="text-3xl font-bold">Choose Category</h1>

            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setStarted(false)
                  setCurrentIndex(0)
                  setScore(0)
                  setShowScore(false)
                  setStarted(false)

                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-xl"
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {selectedCategory && !started && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h1 className="text-3xl font-bold mb-6">Ready for the Quiz?</h1>
            <button
              onClick={() => {
                setStarted(true)
                setTimeLeft(getTimeLimit(filteredQuestions[0]))
              }}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              Start Quiz
            </button>
          </div>
        )}

        {started && !showScore && currentQuestion && (
          <div className="w-full max-w-xl mx-auto mt-10">
            <div className="flex justify-between mb-4">
              <span className="font-bold">
                Question {currentIndex + 1}/{filteredQuestions.length}
              </span>
              <span className={`font-bold ${timeLeft <= 5 ? "text-red-500" : "text-green-600"}`}>
                ⏱ {timeLeft}s
              </span>
            </div>

            <h1 className="text-xl font-bold mb-4">
              {currentQuestion.question}
            </h1>

            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.isMultipleChoice ? (
                currentQuestion.options?.map((opt, index) => (
                  <label key={index} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      checked={selectedOption === index}
                      onChange={() => setSelectedOption(index)}
                    />
                    {opt}
                  </label>
                ))
              ) : (
                <input
                  type="text"
                  className="border p-2 rounded col-span-2"
                  value={textAnswer}
                  onChange={e => setTextAnswer(e.target.value)}
                />
              )}
            </div>

            <button
              disabled={
                currentQuestion.isMultipleChoice
                  ? selectedOption === null
                  : textAnswer.trim() === ""
              }
              onClick={handleNext}
              className="bg-green-500 text-white px-4 py-2 rounded-xl mt-6 hover:bg-green-700 disabled:opacity-50"
            >
              {currentIndex + 1 === filteredQuestions.length ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        )}
        {showScore && (
          <div className="text-center mt-20">
            <h1 className="text-3xl font-bold mb-4">Quiz Finished</h1>
            <p className="text-xl">
              Your Score: {score} / {filteredQuestions.length}
            </p>
          </div>
        )}
      </div>
      {/* ==============================================Ranking=============================================*/}
      <div className="w-[360px] space-y-6">
        {!showScore && (
          <>
            <div className="bg-white shadow rounded-xl p4">
              <h2 className="font-bold mb-3"> Top Users</h2>
              {globalRank.map((u, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{i + 1}. {u.username}</span>
                  <span>{u.total_score}/{u.total_questions}</span>
                </div>
              ))}
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <h2 className="font-bold mb-3"> Popular Categories</h2>
              {topCategories.map((c, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{i + 1}. {c.category}</span>
                  <span>{c.total_users} users</span>
                </div>
              ))}
            </div>
          </>
        )}
        {showScore && (
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="font-bold mb-3">{selectedCategory}</h2>
            {categoryRank.map((u, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{i + 1}. {u.username}</span>
                <span>{u.score}/{u.total_questions}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
