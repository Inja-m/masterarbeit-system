import type { Workshop } from "./Workshop"
import type { EvaluationStep } from "./EvaluationStep"
import type { Project } from "./Project"
export interface WorkshopSerie {
  id: number
  documentId: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
	workshops: Workshop[]
	evaluation_steps: EvaluationStep[]
	project: Project[]
}