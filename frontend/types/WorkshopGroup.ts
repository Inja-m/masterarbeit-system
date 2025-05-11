import type { Workshop } from "./Workshop"

export interface WorkshopGroup {
  id: number
  documentId: string
  name: string
  numberParticipants: number 
  workshop: Workshop
  createdAt: string
  updatedAt: string
  publishedAt: string
}