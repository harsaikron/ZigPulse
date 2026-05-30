import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PLATFORM_PROMPTS = {
  instagram: (e) => `You are a social media expert for ComfortDelGro's Zig taxi app in Singapore. Write an Instagram caption promoting Zig taxi rides for: "${e.name}" at ${e.venue} on ${e.date}. Expected ${(e.attendance || 0).toLocaleString()} attendees. Zone: ${e.zone}. Demand surge: +${e.demandSurge || 0}%.

Include:
1. A strong hook line (first sentence, make it exciting)
2. Body copy (3-4 sentences, practical + exciting)
3. Call-to-action to book via Zig app
4. 15-20 relevant Singapore hashtags
5. Best posting time recommendation
6. Estimated reach: 8,000–15,000 impressions

Format with clear sections. Make it vibrant and Singapore-local.`,

  tiktok: (e) => `You are a TikTok content creator for ComfortDelGro's Zig taxi app in Singapore. Write a 15-second TikTok video script for: "${e.name}" in ${e.zone}.

Include:
1. Opening hook line (first 3 seconds - must grab attention)
2. Middle content (2 bullet points to say on camera)
3. CTA (last 3 seconds)
4. Trending audio suggestion
5. 8-10 hashtags
6. Estimated reach: 15,000–40,000 views

Make it Gen-Z friendly, energetic, and Singapore-relevant.`,

  twitter: (e) => `You are a social media manager for ComfortDelGro's Zig taxi app in Singapore. Write a Twitter/X thread of exactly 3 tweets promoting Zig taxi rides for: "${e.name}" on ${e.date} in ${e.zone}.

Tweet 1: Hook/announcement (max 280 chars)
Tweet 2: Practical details - demand surge +${e.demandSurge || 0}%, book early message (max 280 chars)
Tweet 3: CTA with [ZIG APP LINK] placeholder (max 280 chars)

Add 3-5 relevant hashtags per tweet. Include estimated impressions per tweet (2,000–8,000).`,

  facebook: (e) => `You are a community manager for ComfortDelGro's Zig taxi app in Singapore. Write a Facebook post for the Zig community page promoting rides to: "${e.name}" at ${e.venue} on ${e.date}.

Include:
1. Friendly community-tone opening
2. Event details and why Zig is the best way to get there
3. Crowd size info (~${(e.attendance || 0).toLocaleString()} attendees) and tip to book early
4. Booking CTA
5. 5-8 relevant hashtags
6. Estimated organic reach: 12,000–25,000 people

Keep it warm, helpful, and Singapore-community focused.`,
}

export async function POST(req) {
  const { event, platform } = await req.json()

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      `data: ${JSON.stringify({ text: '⚠️ ANTHROPIC_API_KEY not configured. Add your key to .env.local to enable AI generation.\n\nExample post for ' + event?.name + ':\n\n🚕 Heading to ' + event?.name + '? Book your Zig taxi now!\n\n#Zig #ComfortDelGro #Singapore' })}\n\ndata: [DONE]\n\n`,
      { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } }
    )
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const promptFn = PLATFORM_PROMPTS[platform] ?? PLATFORM_PROMPTS.instagram
  const prompt = promptFn(event)

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        })
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`))
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: `Error: ${err.message}` })}\n\n`))
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    }
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
  })
}
