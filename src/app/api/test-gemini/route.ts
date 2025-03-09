import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    // Only allow authenticated users
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY environment variable is not set",
        },
        { status: 500 },
      )
    }

    // Create a simple prompt for testing
    const prompt = "Respond with a simple JSON object with a single property 'status' set to 'ok'"

    // Make a request to the Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    // Check if the request was successful
    if (!response.ok) {
      let errorText = ""
      try {
        const errorData = await response.json()
        errorText = JSON.stringify(errorData)
      } catch {
        errorText = await response.text().catch(() => "Could not read error response")
      }

      return NextResponse.json(
        {
          success: false,
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        },
        { status: 500 },
      )
    }

    // Parse the response
    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: "Gemini API key is valid",
      responsePreview: data.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 100) || "No text in response",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

