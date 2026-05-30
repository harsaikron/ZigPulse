import { getUpcomingEvents } from '@/lib/mock/events'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        try { controller.enqueue(`data: ${JSON.stringify(getUpcomingEvents())}\n\n`) } catch {}
      }
      send()
      const id = setInterval(send, 300000)
      setTimeout(() => { clearInterval(id); try { controller.close() } catch {} }, 1800000)
    }
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
  })
}
