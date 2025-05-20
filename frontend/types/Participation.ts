import type { WorkshopGroup } from "./WorkshopGroup"
import type { User } from "./User"
export type NotificationPreference = 'all' | 'relevant' | 'off'
export interface Participation {
  id: number
  documentId: string
	workshop_group: WorkshopGroup
	user: User
	notification: NotificationPreference
  createdAt: string
  updatedAt: string
  publishedAt: string
}