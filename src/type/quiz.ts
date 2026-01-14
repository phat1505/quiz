export interface Quiz {
  id: number
  question: string
  isMultipleChoice: boolean
  // trắc nghiệm
  options?: string[]
  correctAnswer?: number
  // tự luận
  correctTextAnswer?: string

  category: string
}


export const API_URL = 'http://localhost:3001/api/quizzes'