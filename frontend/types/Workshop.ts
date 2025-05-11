import type { WorkshopSerie } from "./WorkshopSerie"
import type { WorkshopGroup } from "./WorkshopGroup"
export interface Workshop {
  id: number
  documentId: string
  date: string
  location: string
	reward: string
  createdAt: string
  updatedAt: string
  publishedAt: string
	workshop_serie: WorkshopSerie
	workshop_groups:  WorkshopGroup[]
	identifier: string
}