export type OpportunityType = 'WEATHER' | 'EVENT' | 'TRANSPORT' | 'HOLIDAY'
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Opportunity {
  id: string
  type: OpportunityType
  title: string
  severity: Severity
  score: number
  confidence: number
  reasons: string[]
  suggestedCampaign: string
  potentialReach: number
  location?: string | null
  startDate?: string | null
  expiresAt: string
  createdAt: string
  dismissed: boolean
}

export interface Event {
  id: string
  name: string
  venue: string
  zone: string
  category: string
  startDate: string
  attendanceEst: number
  opportunityScore: number
  source: string
  createdAt: string
}

export interface WeatherDay {
  id: string
  date: string
  condition: string
  high: number
  low: number
  rainProb: number
  elNinoConfidence: number
  demandUplift: number
  createdAt: string
}

export interface WeatherSummary {
  today: WeatherDay | null
  forecast: WeatherDay[]
  elNinoConfidence: number
}

export interface TransportAlert {
  id: string
  type: string
  severity: Severity
  affectedLine?: string | null
  affectedRoad?: string | null
  description: string
  demandUplift: number
  startTime: string
  endTime?: string | null
  source: string
  createdAt: string
}

export interface AIRecommendation {
  id: string
  title: string
  reason: string
  campaignType: string
  opportunityId?: string | null
  createdAt: string
}

export interface CommandCentreSummary {
  opportunityScore: number
  activeOpportunities: Opportunity[]
  highestImpact: Opportunity | null
  upcomingEvents: Event[]
  weatherSummary: WeatherSummary | null
  transportAlerts: TransportAlert[]
  aiRecommendations: AIRecommendation[]
  lastUpdated: string
}
