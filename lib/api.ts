import type { CommandCentreSummary, Opportunity } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  getCommandCentreSummary: () => get<CommandCentreSummary>('/command-centre/summary'),
  getOpportunities: (page = 1) => get<{ data: Opportunity[]; total: number }>(`/opportunities?page=${page}`),
  getOpportunity: (id: string) => get<Opportunity>(`/opportunities/${id}`),
}
