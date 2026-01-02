import {Routes, Route, Link} from 'react-router-dom'
import QuizPage from './pages/QuizPage.tsx'
import AddQuestionPage from './pages/AddQuestionPage.tsx'
export default function App() {
  return (
    <div className="w-screen h-screen">
      <nav className='flex justify-center gap-5 text-white text-2xl'>
        <Link to="/quiz" className='bg-green-400 px-3 py-2 rounded-2xl hover:bg-green-700'>Quiz</Link> 
         <Link to="/add-question" className='bg-red-400 px-3 py-2 rounded-2xl hover:bg-red-700'>Add Question</Link>
      </nav>
      <Routes>
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/add-question" element={<AddQuestionPage />} />
      </Routes>
    </div>
  )
}