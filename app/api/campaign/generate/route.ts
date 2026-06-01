import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { opportunityTitle, opportunityType, campaignType, targetAudience, tone } = await req.json()

  const prompt = `You are a marketing copywriter for ComfortDelGro Singapore taxi service.

Generate a marketing campaign for this opportunity:
- Opportunity: ${opportunityTitle}
- Type: ${opportunityType}
- Campaign Channel: ${campaignType}
- Target Audience: ${targetAudience}
- Tone: ${tone}

Respond with ONLY valid JSON in this exact format:
{
  "headline": "Short punchy headline (max 10 words)",
  "subheadline": "Supporting line (max 20 words)",
  "bodyText": "2-3 sentence campaign body copy",
  "cta": "Call-to-action button text (max 5 words)",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "sendTime": "Best time to send this campaign (e.g. 'Friday 6pm, 2 hours before event')",
  "estimatedReach": "Estimated reach description"
}`

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')
    const campaign = JSON.parse(jsonMatch[0])
    return NextResponse.json({ campaign })
  } catch (err) {
    return NextResponse.json({ error: 'Generation failed', detail: String(err) }, { status: 500 })
  }
}
