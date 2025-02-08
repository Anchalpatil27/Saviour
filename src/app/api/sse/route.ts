import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 })
  }

  const client = await clientPromise
  const db = client.db("test")
  const user = await db.collection("users").findOne({ email: session.user.email })

  if (!user || !user.city) {
    return new Response("City not set", { status: 400 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const sendCount = async () => {
        const count = await db.collection("messages").countDocuments({ city: user.city })
        controller.enqueue(`data: ${JSON.stringify({ count })}\n\n`)
      }

      // Send initial count
      await sendCount()

      // Set up change stream
      const changeStream = db.collection("messages").watch([{ $match: { "fullDocument.city": user.city } }])

      changeStream.on("change", async () => {
        await sendCount()
      })

      // Keep the connection alive
      const interval = setInterval(() => {
        controller.enqueue(": keepalive\n\n")
      }, 30000)

      // Clean up on close
      req.signal.addEventListener("abort", () => {
        clearInterval(interval)
        changeStream.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

