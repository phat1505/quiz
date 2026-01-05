import { useState, useEffect } from "react"
import type { Quiz } from "../type/quiz"
import { API_URL } from "../type/quiz"

export default function QuizPage() {
  const [questions, setQuestions] = useState<Quiz[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [textAnswer, setTextAnswer] = useState("")
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setQuestions)
  }, [])

  const currentQuestion = questions[currentIndex]

  // ===== TIMER =====
  useEffect(() => {
    if (!started || showScore) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNext()
          return prev
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [started, currentIndex, showScore])


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
    setTimeLeft(getTimeLimit(questions[currentIndex + 1] || currentQuestion))

    if (currentIndex + 1 < questions.length) {
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

  // ===== START SCREEN =====
  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-3xl font-bold mb-6">Ready for the Quiz?</h1>
        <button
          onClick={() => {
            setStarted(true)
            setTimeLeft(getTimeLimit(questions[0]))
          }}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Start Quiz
        </button>
      </div>
    )
  }

  // ===== SCORE =====
  if (showScore) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold mb-4">Quiz Finished</h1>
        <p className="text-xl">
          Your Score: {score} / {questions.length}
        </p>
      </div>
    )
  }

  // ===== QUIZ UI =====
  return (
    <div className="w-full max-w-xl mx-auto mt-10">
      <div className="flex justify-between mb-4">
        <span className="font-bold">
          Question {currentIndex + 1}/{questions.length}
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
        {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
      </button>
    </div>
  )
}
