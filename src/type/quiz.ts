export interface Quiz {
  id?: string
  question: string
  isMultipleChoice: boolean
  // trắc nghiệm
  options?: string[]
  correctAnswer?: number
  // tự luận
  correctTextAnswer?: string
}


export const API_URL = 'https://6954c2091cd5294d2c7d6378.mockapi.io/api/quiz/questions'