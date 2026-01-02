export interface Quiz {
  id?: string
  question: string
  options: string[]
  correctAnswer: number
  isMultipleChoice: boolean
}

export const API_URL = 'https://6954c2091cd5294d2c7d6378.mockapi.io/api/quiz/questions'