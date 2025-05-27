import { marked } from 'marked'

export function parseMarkdown(input: string): string {
  return marked.parse(input || '')
}