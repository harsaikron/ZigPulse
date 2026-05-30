import { generateDemandData } from '@/lib/mock/demand'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        try {
          const data = generateDemandData()
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
        } catch {}
      }
      send()
      const id = setInterval(send, 30000)
      setTimeout(() => { clearInterval(id); try { controller.close() } catch {} }, 300000)
    }
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
