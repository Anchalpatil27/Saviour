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
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY environment variable is not set",
        },
        { status: 500 },
      )
    }

    // Clean the API key - remove any whitespace, quotes, etc.
    const cleanedApiKey = apiKey.trim().replace(/["']/g, "")

    // Create a simple prompt for testing
    const prompt = "Respond with a simple JSON object with a single property 'status' set to 'ok'"

    // Try multiple endpoints
    const endpoints = [
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
    ]

    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`)

        // Make a request to the Gemini API
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
          }),
        })

        // Check if the request was successful
        if (response.ok) {
          // Parse the response
          const data = await response.json()

          return NextResponse.json({
            success: true,
            message: "Gemini API key is valid",
            endpoint: endpoint,
            responsePreview:
              data.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 100) || "No text in response",
          })
        }

        // If we get here, this endpoint failed but we'll try the next one
        console.log(`Endpoint ${endpoint} failed with status ${response.status}`)
      } catch (endpointError) {
        console.error(`Error with endpoint ${endpoint}:`, endpointError)
        // Continue to the next endpoint
      }
    }

    // If we get here, all endpoints failed
    return NextResponse.json(
      {
        success: false,
        error: "All Gemini API endpoints failed. Please check your API key.",
        apiKeyLength: cleanedApiKey.length,
        apiKeyPreview: cleanedApiKey.substring(0, 4) + "..." + cleanedApiKey.substring(cleanedApiKey.length - 4),
        hasWhitespace: /\s/.test(cleanedApiKey),
        hasQuotes: cleanedApiKey.includes('"') || cleanedApiKey.includes("'"),
      },
      { status: 500 },
    )
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

