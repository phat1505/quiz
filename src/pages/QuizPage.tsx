import { useState, useEffect } from "react";
import type { Quiz } from "../type/quiz";
import { API_URL } from "../type/quiz";

export default function QuizPage() {
  const [questions, setQuestions] = useState<Quiz[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [textAnswer, setTextAnswer] = useState("")

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch(API_URL)
      const data = await res.json()
      setQuestions(data)
    }
    fetchQuestions()
  }, [])

  const currentQuestion = questions[currentIndex]
  if (questions.length === 0) {
    return <p className="text-center">Loading...</p>
  }
  const handleNext = () => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1)
    }
    setSelectedOption(null)

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setShowScore(true)
    }
  }
  if (showScore) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Finished</h1>
        <p className="text-xl">Your Score: {score} / {questions.length}</p>
      </div>
    )
  }
  return (
    <div className="w-full max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Question {currentIndex + 1} of {questions.length}</h1>
      <h1 className="text-xl font-bold">{currentQuestion.question}</h1>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {currentQuestion.isMultipleChoice ? (
          // ===== MULTIPLE CHOICE =====
          currentQuestion.options.map((opt, index) => (
            <label key={index} className="block">
              <input
                type="radio"
                checked={selectedOption === index}
                onChange={() => setSelectedOption(index)}
              />
              {opt}
            </label>
          ))
        ) : (
          // ===== TEXT ANSWER =====
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Type your answer"
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
        className="bg-green-400 text-white px-4 py-2 rounded-2xl mt-4 hover:bg-green-700 disabled:opacity-50"
      >
        {currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>

  )
}