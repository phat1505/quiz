import {useState, useEffect} from "react"
import { SCORE_API } from "../type/score"
import type { Score } from "../type/score"
import { Link, useNavigate } from "react-router-dom"

export default function ScorePage() {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    const navigate = useNavigate()

    const [scores, setScores] = useState<Score[]>([])
    const [loading, setLoading] = useState(true)
 
    useEffect(() => {
        if(!user) {
            navigate("/login")
            setLoading(false)
        }
}, [user])

    useEffect(() => {
        if(!user) return

        fetch (`${SCORE_API}/${user.id}`)
        .then(res => res.json())
        .then(data => {
            setScores(data)
            setLoading(false)
        })
    }, [user])

    if(loading) {
        return <p className="text-center mt-10">Loading Scores...</p>
    }
    return (
        <div className="max-w-3xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold"> My Scores</h1>
                <Link 
                    to="/quiz"
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl">
                        Back to Quiz
                    </Link>
            </div>

            {scores.length === 0 ? (
                <p className="text-center text-gray-500">You haven't completed any quizzes yet.</p>
            ) : (
                <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border py-2 px-4">Category</th>
                            <th className="border py-2 px-4">Score</th>
                            <th className="border py-2 px-4">Total</th>
                            <th className="border py-2 px-4">Date</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map(score => (
                            <tr key={score.id} className="text-center">
                                <td className="border py-2 px-4">{score.category}</td>
                                <td className="border py-2 px-4">{score.score}</td>
                                <td className="border py-2 px-4">{score.total_questions}</td>
                                <td className="border py-2 px-4">{new Date(score.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}