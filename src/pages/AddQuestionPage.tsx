import { useState, useEffect } from "react";
import type { Quiz } from "../type/quiz";
import { API_URL } from "../type/quiz";
export default function AddQuestionPage() {
    const [questions, setQuestions] = useState<Quiz[]>([])
    const [open, setOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Quiz | null>(null)

    const [question, setQuestion] = useState("")
    const [mcOptions, setMcOptions] = useState(["", "", "", ""])
    const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
    const [textAnswer, setTextAnswer] = useState("")
    const [isMultipleChoice, setIsMultipleChoice] = useState(true)
    const [category, setCategory] = useState("")
    const isValid = isMultipleChoice
        ? question.trim() !== "" &&
        category.trim() !== "" &&
        mcOptions.every(opt => opt.trim() !== "") &&
        correctAnswer !== null
        : question.trim() !== "" &&
        category.trim() !== "" &&
        textAnswer.trim() !== ""


    const fetchQuestions = async () => {
        const res = await fetch(API_URL)
        const data = await res.json()
        setQuestions(data)
    }

    useEffect(() => {
        fetchQuestions()
    }, [])
    useEffect(() => {
        if (!editingQuestion) {
            resetForm()
            return
        }

        setQuestion(editingQuestion.question)
        setIsMultipleChoice(editingQuestion.isMultipleChoice)

        if (editingQuestion.isMultipleChoice) {
            setMcOptions(editingQuestion.options ?? ["", "", "", ""])
            setCorrectAnswer(editingQuestion.correctAnswer ?? null)
            setTextAnswer("")
        } else {
            setTextAnswer(editingQuestion.correctTextAnswer ?? "")
            setMcOptions(["", "", "", ""])
            setCorrectAnswer(null)
        }
    }, [editingQuestion])


    const resetForm = () => {
        setQuestion("")
        setMcOptions(["", "", "", ""])
        setTextAnswer("")
        setCorrectAnswer(null)
        setIsMultipleChoice(true)
    }
    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isValid) return

        const newQuestion: Quiz = isMultipleChoice
            ? {
                question,
                category,
                isMultipleChoice: true,
                options: mcOptions,
                correctAnswer: correctAnswer!,
            }
            : {
                question,
                category,
                isMultipleChoice: false,
                correctTextAnswer: textAnswer,
            }

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newQuestion)
        })

        alert("Question added!")
        fetchQuestions()
        setOpen(false)
        resetForm()
    }


    const hanldeDeleteQuestion = async (id?: string) => {
        if (!confirm("Are you sure you want to delete this question:")) return

        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        alert("Question deleted successfully!")
        fetchQuestions()
    }

    return (
        <div>
            <button onClick={() => setOpen(true)} className="bg-yellow-300 text-white px-3 py-2 rounded-2xl hover:bg-yellow-600 m-4">+ Add Question</button>
            <table className="w-full text-center text-2xl">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Question</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="border px-4 py-2 text-center">
                                No question added
                            </td>
                        </tr>
                    ) : (
                        questions.map(q => (
                            <tr key={q.id}>
                                <td className="border px-4 py-2">{q.id}</td>
                                <td className="border px-4 py-2">{q.question}</td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => {
                                        setEditingQuestion(q)
                                        setOpen(true)
                                    }} className="bg-indigo-400 hover:bg-indigo-600 rounded-2xl text-white px-3 py-2 mx-2">
                                        Edit
                                    </button>
                                    <button onClick={() => hanldeDeleteQuestion(q.id)} className="bg-red-400 hover:bg-red-600 rounded-2xl text-white px-3 py-2 mx-2">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )))}
                </tbody>
            </table>
            {open && (
                <form className="w-[570px] mx-auto flex flex-col bg-gray-200 rounded-2xl fixed inset-0 top-10 h-[500px]" onSubmit={handleAddQuestion}>
                    <h1 className="text-3xl font-bold mb-4 text-center">Add New Question</h1>
                    <div className="mb-4 flex items-center gap-4">
                        <label className="block mb-2 mx-3">Question:</label>
                        <input type="text" className="p-2 border rounded-xl w-[456px] focus:outline-none" value={question} onChange={e => setQuestion(e.target.value)} />
                    </div>
                    <div className="flex gap-4 my-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={isMultipleChoice}
                                onChange={() => setIsMultipleChoice(true)}
                            />
                            Multiple choice
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={!isMultipleChoice}
                                onChange={() => setIsMultipleChoice(false)}
                            />
                            Text answer
                        </label>
                    </div>

                    {isMultipleChoice && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                {mcOptions.map((opt, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        className="border p-2 rounded-xl"
                                        value={opt}
                                        onChange={e => {
                                            const copy = [...mcOptions]
                                            copy[index] = e.target.value
                                            setMcOptions(copy)
                                        }}
                                    />
                                ))}
                            </div>
                            <p>Correct option:</p>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-xl mx-2">

                                {mcOptions.map((_, index) => (
                                    <label key={index} className="block">
                                        <input
                                            className="mx-2"
                                            type="radio"
                                            checked={correctAnswer === index}
                                            onChange={() => setCorrectAnswer(index)}
                                        />
                                        Option {index + 1}
                                    </label>
                                ))}
                            </div>
                        </>
                    )}

                    {!isMultipleChoice && (
                        <div className="mt-4">
                            <label>Correct text answer:</label>
                            <input
                                type="text"
                                className="border p-2 rounded-xl w-full"
                                value={textAnswer}
                                onChange={e => setTextAnswer(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="mt-4">
                        <label>Category:</label>
                        <input
                            type="text"
                            className="border p-2 rounded-xl w-full"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        />
                    </div>

                    <div className="flex mx-auto">
                        <button type="button" disabled={!isValid} onClick={handleAddQuestion} className="bg-cyan-400 text-white w-32 mx-auto mt-2 p-2 rounded-full hover:bg-cyan-600">Add Question</button>
                        <button type="button" onClick={() => {
                            setOpen(false)
                            setEditingQuestion(null)
                            resetForm()
                        }} className="bg-gray-400 text-white w-32 mx-auto mt-2 p-2 rounded-full hover:bg-gray-600 ml-4">Cancel</button>
                    </div>
                </form>
            )}
        </div>
    )
}
