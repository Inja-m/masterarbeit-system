import type { Workshop } from "./Workshop"
import type { User } from "./User"

export interface Message {
	id: number
	documentId: string
	workshop: Workshop
	author: User
	message: string
	createdAt: string
	updatedAt: string
	publishedAt: string
}