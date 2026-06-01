import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { brief, brand, platforms } = await req.json()

  if (!brief || !brand) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const prompt = `Generate 3 ad copy variants for a ${brand} campaign.
Brief: ${brief}
Platforms: ${Array.isArray(platforms) ? platforms.join(', ') : platforms}

Return ONLY valid JSON with no extra text:
{
  "variants": [
    {
      "tone": "Professional",
      "headline": "Short punchy headline (max 10 words)",
      "body": "2-3 sentence body copy",
      "cta": "Call-to-action text (max 5 words)",
      "hashtags": ["#tag1", "#tag2", "#tag3"]
    },
    {
      "tone": "Casual",
      "headline": "...",
      "body": "...",
      "cta": "...",
      "hashtags": ["..."]
    },
    {
      "tone": "Urgent",
      "headline": "...",
      "body": "...",
      "cta": "...",
      "hashtags": ["..."]
    }
  ]
}`

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')
    const data = JSON.parse(jsonMatch[0])
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Generation failed', detail: String(err) }, { status: 500 })
  }
}
