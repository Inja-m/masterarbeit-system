import type { Workshop } from "./Workshop"
import type { EvaluationStep } from "./EvaluationStep"
import type { User } from "./User"
export type EvaluationStatus = 'to do' | 'in progress' | 'done'

export interface WorkshopResult {
  id: number
  evaluator: User

  evaluationStatus: EvaluationStatus

  evaluation_step: EvaluationStep

  Result: Array<{
    __component: 'media.totality'
    // ...Felder der Komponente media.totality
  }>
  workshop: Workshop
}