export interface Score {
    id: number
    category: string
    score: number
    total_questions: number
    created_at: string
} 

export const SCORE_API = "http://localhost:3001/api/scores"