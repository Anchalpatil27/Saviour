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

    // Return information about the key (safely)
    return NextResponse.json({
      success: true,
      keyExists: true,
      keyLength: apiKey.length,
      keyFirstFour: apiKey.substring(0, 4),
      keyLastFour: apiKey.substring(apiKey.length - 4),
      // Check for common issues
      hasWhitespace: /\s/.test(apiKey),
      hasQuotes: apiKey.includes('"') || apiKey.includes("'"),
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

