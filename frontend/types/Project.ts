import type { Workshop } from "./Workshop"
export interface Project {
  id: number
  documentId: string
  name: string
  createdAt: string
  updatedAt: string
  publishedAt: string
	workshops: Workshop[]
}