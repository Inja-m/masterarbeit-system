import type { WorkshopSerie } from "./WorkshopSerie"

export interface Workshop {
  id: number
  documentId: string
  date: string
  location: string
	reward: string
  createdAt: string
  updatedAt: string
  publishedAt: string
	workshop_serie: WorkshopSerie;
}