import { useState, useEffect } from "react";
import type { Quiz } from "../type/quiz";
import { API_URL } from "../type/quiz";
export default function AddQuestionPage() {
    const [questions, setQuestions] = useState<Quiz[]>([])
    const [open, setOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Quiz | null>(null)

    const [question, setQuestion] = useState("")
    const [options, setOptions] = useState(["", "", "", ""])
    const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
    const [isMultipleChoice, setIsMultipleChoice] = useState(true)
    const isValid = question.trim() !== "" && options.every(opt => opt.trim() !== "") && correctAnswer !== null

    const fetchQuestions = async () => {
        const res = await fetch(API_URL)
        const data = await res.json()
        setQuestions(data)
    }

    useEffect(() => {
        fetchQuestions()
    }, [])
    useEffect(() => {
        if (editingQuestion) {
            setQuestion(editingQuestion.question)
            setOptions(editingQuestion.options)
            setCorrectAnswer(editingQuestion.correctAnswer)
        } else {
            resetForm()
        }
    }, [editingQuestion])
    const resetForm = () => {
        setQuestion("")
        setOptions(["", "", "", ""])
        setCorrectAnswer(null)
    }
    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isValid) return
        const newQuestion: Quiz = {
            question,
            options,
            correctAnswer,
            isMultipleChoice
        }
        try {
            if (editingQuestion) {
                // Update existing question
                await fetch(`${API_URL}/${editingQuestion.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newQuestion)
                })
                alert("Question updated successfully!")
                setEditingQuestion(null)
            } else {
                // Add new question
                await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newQuestion)
                })
                alert("Question added successfully!")
            }
            //Refresh question list
            fetchQuestions()
            setOpen(false)
            setEditingQuestion(null)
            resetForm()
        } catch (error) {
            console.error("Error adding question:", error)
            alert("Failed to add question. Please try again.")
        }
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
                    {questions.map(q => (
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
                    ))}
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
                        <label className="flex items-center gap-2 mx-3">
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
                            <div className="grid grid-cols-2 w-full">
                                {options.map((opt, index) => (
                                    <div className="mb-4 flex items-center gap-3" key={index}>
                                        <label className="block mx-2">Options {index + 1}:</label>
                                        <input

                                            type="text"
                                            placeholder={`Answer ${index + 1}`}
                                            className="p-2 border rounded-xl w-[184px] focus:outline-none"
                                            value={opt}
                                            onChange={e => {
                                                const copy = [...options]
                                                copy[index] = e.target.value
                                                setOptions(copy)
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="mx-2">Choose correct option: </p>
                                <div className="grid grid-cols-2 gap-1">
                                    {options.map((_, index) => (
                                        <div className="border border-gray-300 rounded-xl m-2 h-9 w-[275px]">
                                            <label key={index} className="block mb-2 bg-white rounded-xl">
                                                <input type="radio" name="correct" checked={correctAnswer === index} onChange={() => setCorrectAnswer(index)} className="focus:outline-none border rounded-xl w-[30px] h-full my-3 p-2 " />
                                                <span>{options[index]}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    {!isMultipleChoice && (
                        <div className="mt-4 flex gap-2">
                            <label className="pt-1 mx-3">Correct answer:</label>
                            <input
                                type="text"
                                className="border p-2 rounded-xl w-[425px] focus:outline-none"
                                value={options[0]}
                                onChange={e => setOptions([e.target.value])}
                            />
                        </div>
                    )}

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
