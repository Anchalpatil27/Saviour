"use server"

import { revalidatePath } from "next/cache"

// Make sure all interfaces are exported
export interface DisasterEvent {
  id: string
  date: string
  type: string
  severity: "Minor" | "Moderate" | "Severe" | "Catastrophic"
  affected: number
  description: string
  location: string
  distance?: string // Add distance field
}

export interface DisasterTrend {
  year: string
  count: number
  primaryType: string
}

export interface DisasterReport {
  id: string
  title: string
  date: string
  type: string
  summary: string
  fileSize: string
}

export interface HistoricalData {
  events: DisasterEvent[]
  trends: DisasterTrend[]
  reports: DisasterReport[]
  frequencyData: { type: string; count: number }[]
  severityData: { severity: string; count: number }[]
}

// Sample data for testing purposes
// Using underscore prefix to indicate these parameters are intentionally unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSampleHistoricalData = (_latitude: number, _longitude: number): HistoricalData => {
  return {
    events: [
      {
        id: "1",
        date: "2023-05-15",
        type: "Flood",
        severity: "Moderate",
        affected: 500,
        description: "Heavy rainfall caused flooding in low-lying areas.",
        location: "Townsville",
        distance: "2.3 km",
      },
      {
        id: "2",
        date: "2022-11-01",
        type: "Wildfire",
        severity: "Severe",
        affected: 200,
        description: "Dry conditions led to a large wildfire.",
        location: "Forestville",
        distance: "4.1 km",
      },
    ],
    trends: [
      { year: "2023", count: 5, primaryType: "Flood" },
      { year: "2022", count: 3, primaryType: "Wildfire" },
    ],
    reports: [
      {
        id: "1",
        title: "Flood Analysis Report",
        date: "2023-06-01",
        type: "Analysis",
        summary: "Detailed analysis of the recent flooding event.",
        fileSize: "1.2 MB",
      },
    ],
    frequencyData: [
      { type: "Flood", count: 3 },
      { type: "Wildfire", count: 2 },
      { type: "Landslide", count: 1 },
    ],
    severityData: [
      { severity: "Minor", count: 1 },
      { severity: "Moderate", count: 3 },
      { severity: "Severe", count: 2 },
    ],
  }
}

export async function fetchHistoricalData(
  latitude: number,
  longitude: number,
): Promise<{ success: boolean; data: HistoricalData; error?: string }> {
  try {
    console.log(`Starting historical data fetch for coordinates: ${latitude}, ${longitude}`)

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.log("No Gemini API key found, using sample data")
      return {
        success: true,
        data: getSampleHistoricalData(latitude, longitude),
      }
    }

    // For debugging - log a safe version of the key
    const keyPreview =
      process.env.GEMINI_API_KEY.substring(0, 4) +
      "..." +
      process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)
    console.log(`Using Gemini API key starting with: ${keyPreview}`)

    const prompt = `
      I need historical disaster data for the area STRICTLY WITHIN 5 KILOMETERS of these coordinates:
      Latitude: ${latitude}
      Longitude: ${longitude}

      IMPORTANT: All events, locations, and data MUST be within 5km of these coordinates. Do not include anything beyond 5km.

      Please provide the following information in JSON format:
      
      1. Recent disaster events (last 5 years) with:
         - id (string)
         - date (YYYY-MM-DD format)
         - type (Flood, Earthquake, Wildfire, Hurricane, etc.)
         - severity (Minor, Moderate, Severe, or Catastrophic)
         - affected (number of people affected)
         - description (brief description)
         - location (name of the area)
         - distance (distance from the coordinates in km, MUST be less than 5km)
      
      2. Disaster trends over the last 10 years:
         - year
         - count (number of disasters that year)
         - primaryType (most common disaster type that year)
      
      3. Disaster reports:
         - id (string)
         - title (report title)
         - date (YYYY-MM-DD format)
         - type (report type)
         - summary (brief summary)
         - fileSize (e.g., "2.4 MB")
      
      4. Frequency data (for visualization):
         - type (disaster type)
         - count (number of occurrences)
      
      5. Severity distribution (for visualization):
         - severity (Minor, Moderate, Severe, Catastrophic)
         - count (number of occurrences)
      
      Format your response as a JSON object with these 5 properties: events, trends, reports, frequencyData, and severityData.
      
      Make the data realistic and relevant to the geographic location of the coordinates. If the location is coastal, include hurricanes/tsunamis. If mountainous, include landslides. If near fault lines, include earthquakes, etc.
      
      IMPORTANT: Return ONLY a valid JSON object with no additional text, markdown formatting, or code blocks.
      CRITICAL: All events MUST be within 5km of the provided coordinates.
    `

    // Define multiple API endpoints to try
    const endpoints = [
      {
        url: "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
        model: "gemini-pro",
      },
      {
        url: "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
        model: "gemini-1.5-pro",
      },
      {
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        model: "gemini-pro (beta)",
      },
    ]

    // Try each endpoint until one works
    let lastError = null

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint for ${endpoint.model}: ${endpoint.url}`)

        const response = await fetch(endpoint.url, {
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
            generationConfig: {
              temperature: 0.1,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        })

        console.log(`${endpoint.model} response status: ${response.status}`)

        if (!response.ok) {
          let errorText = ""
          try {
            const errorData = await response.json()
            errorText = JSON.stringify(errorData)
            console.error(`${endpoint.model} error response:`, errorData)
          } catch (parseError) {
            console.error(`Failed to parse ${endpoint.model} error response:`, parseError)
            errorText = await response.text().catch(() => "Could not read error response")
          }

          console.error(
            `${endpoint.model} API error: ${response.status} ${response.statusText}. Response: ${errorText}`,
          )
          lastError = `${endpoint.model} API error: ${response.status} ${response.statusText}`
          continue // Try the next endpoint
        }

        const data = await response.json()
        console.log(`Received response from ${endpoint.model}`)

        // Check if the response has the expected structure
        if (
          !data.candidates ||
          !data.candidates[0] ||
          !data.candidates[0].content ||
          !data.candidates[0].content.parts
        ) {
          console.error(
            `Unexpected ${endpoint.model} API response structure:`,
            JSON.stringify(data).substring(0, 200) + "...",
          )
          lastError = `Unexpected ${endpoint.model} API response structure`
          continue // Try the next endpoint
        }

        // Extract text from Gemini response
        const text = data.candidates[0].content.parts[0].text || ""

        if (!text) {
          console.error(`Empty text in ${endpoint.model} API response`)
          lastError = `Empty response from ${endpoint.model} API`
          continue // Try the next endpoint
        }

        console.log(`Raw ${endpoint.model} response length:`, text.length)
        console.log(`${endpoint.model} response preview:`, text.substring(0, 100) + "...")

        // Try multiple approaches to extract JSON
        let jsonData: HistoricalData | null = null

        // Approach 1: Try to parse the entire response as JSON
        try {
          jsonData = JSON.parse(text) as HistoricalData
          console.log(`Successfully parsed entire ${endpoint.model} response as JSON`)
        } catch (parseError) {
          console.log(
            `Could not parse entire ${endpoint.model} response as JSON, trying to extract JSON object:`,
            parseError,
          )
        }

        // Approach 2: Try to extract JSON using regex if approach 1 failed
        if (!jsonData) {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
              jsonData = JSON.parse(jsonMatch[0]) as HistoricalData
              console.log(`Successfully parsed JSON using regex extraction from ${endpoint.model}`)
            } catch (parseError) {
              console.error(`Error parsing extracted JSON from ${endpoint.model}:`, parseError)
            }
          } else {
            console.log(`No JSON object found in ${endpoint.model} response using regex`)
          }
        }

        // Approach 3: Try to find JSON between markdown code blocks
        if (!jsonData) {
          const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
          if (codeBlockMatch && codeBlockMatch[1]) {
            try {
              jsonData = JSON.parse(codeBlockMatch[1]) as HistoricalData
              console.log(`Successfully parsed JSON from ${endpoint.model} code block`)
            } catch (parseError) {
              console.error(`Error parsing JSON from ${endpoint.model} code block:`, parseError)
            }
          } else {
            console.log(`No code block found in ${endpoint.model} response`)
          }
        }

        // If we have valid JSON data, return it
        if (jsonData) {
          // Validate the structure to ensure it has all required properties
          if (
            !jsonData.events ||
            !jsonData.trends ||
            !jsonData.reports ||
            !jsonData.frequencyData ||
            !jsonData.severityData
          ) {
            console.error(`${endpoint.model} JSON data missing required properties:`, Object.keys(jsonData))
            lastError = `Invalid data structure from ${endpoint.model} API`
            continue // Try the next endpoint
          }

          // Filter out any events that are beyond 5km if distance is provided
          if (jsonData.events && Array.isArray(jsonData.events)) {
            jsonData.events = jsonData.events.filter((event) => {
              if (!event.distance) return true

              // Extract the numeric part of the distance string (e.g., "3.2 km" -> 3.2)
              const distanceMatch = event.distance.match(/(\d+(\.\d+)?)/)
              if (!distanceMatch) return true

              const distance = Number.parseFloat(distanceMatch[0])
              return distance <= 5
            })
          }

          revalidatePath("/dashboard/historical")
          return {
            success: true,
            data: jsonData,
          }
        }

        // If all parsing attempts failed, try the next endpoint
        console.error(`Failed to parse JSON from ${endpoint.model} API response`)
        lastError = `Failed to parse response from ${endpoint.model} API`
      } catch (apiError) {
        console.error(`${endpoint.model} API error occurred:`, apiError)
        lastError = `${endpoint.model} API error: ${apiError instanceof Error ? apiError.message : String(apiError)}`
      }
    }

    // If all endpoints failed, return sample data with the last error
    console.error("All Gemini API endpoints failed, using sample data")
    return {
      success: false,
      data: getSampleHistoricalData(latitude, longitude),
      error: lastError || "All Gemini API endpoints failed",
    }
  } catch (error) {
    console.error("Error fetching historical data:", error)
    return {
      success: false,
      data: getSampleHistoricalData(latitude, longitude),
      error: "Unknown error",
    }
  }
}

