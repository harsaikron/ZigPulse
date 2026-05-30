import { getWeatherData } from '@/lib/mock/weather'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        try { controller.enqueue(`data: ${JSON.stringify(getWeatherData())}\n\n`) } catch {}
      }
      send()
      const id = setInterval(send, 600000)
      setTimeout(() => { clearInterval(id); try { controller.close() } catch {} }, 3600000)
    }
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
  })
}
