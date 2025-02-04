import { OpenAIStream, StreamingTextResponse } from "ai"
import { openai } from "@ai-sdk/openai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages, city, username } = await req.json()

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant in the ${city} community chat. The current user is ${username}.`,
      },
      ...messages,
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

