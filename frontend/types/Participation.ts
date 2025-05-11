import type { WorkshopGroup } from "./WorkshopGroup"
import type { User } from "./User"

export interface Participation {
  id: number
  documentId: string
	workshop_group: WorkshopGroup
	user: User
  createdAt: string
  updatedAt: string
  publishedAt: string
}