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

    // Clean the API key - remove any whitespace, quotes, etc.
    const cleanedApiKey = process.env.GEMINI_API_KEY.trim().replace(/["']/g, "")

    // Create a simple prompt for testing
    const prompt = `
      Create a JSON object with detailed safety guidelines for Flood disasters.
      The JSON object must follow this exact format:
      {
        "beforeDisaster": {
          "title": "Before a Flood",
          "tips": ["Tip 1", "Tip 2", "Tip 3"]
        },
        "duringDisaster": {
          "title": "During a Flood",
          "tips": ["Tip 1", "Tip 2", "Tip 3"]
        }
      }
      Return ONLY the JSON object with no additional text.
    `

    // Define endpoints to try
    const endpoints = [
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    ]

    const results = []

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint for safety: ${endpoint}`)

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": cleanedApiKey,
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
            generationConfig: {
              temperature: 0.1,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        })

        const status = response.status
        let responseText = ""

        try {
          const data = await response.json()
          responseText = JSON.stringify(data)
        } catch {
          // Just get the text without using a variable
          responseText = await response.text()
        }

        results.push({
          endpoint,
          status,
          success: response.ok,
          response: responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""),
        })
      } catch (error) {
        results.push({
          endpoint,
          status: "Error",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Safety API test completed",
      results,
      apiKeyLength: cleanedApiKey.length,
      apiKeyPreview: cleanedApiKey.substring(0, 4) + "..." + cleanedApiKey.substring(cleanedApiKey.length - 4),
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

