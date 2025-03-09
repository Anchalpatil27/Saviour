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

    try {
      // Direct fetch to Gemini API with proper error handling
      console.log(`Fetching historical data for coordinates: ${latitude}, ${longitude}`)

      const apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent"
      console.log(`Using API URL: ${apiUrl}`)

      const response = await fetch(apiUrl, {
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

      console.log(`Gemini API response status: ${response.status}`)

      if (!response.ok) {
        let errorText = ""
        try {
          const errorData = await response.json()
          errorText = JSON.stringify(errorData)
          console.error("API error response:", errorData)
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
          errorText = await response.text().catch(() => "Could not read error response")
        }

        console.error(`API error: ${response.status} ${response.statusText}. Response: ${errorText}`)

        return {
          success: false,
          data: getSampleHistoricalData(latitude, longitude),
          error: `API error: ${response.status} ${response.statusText}. Please check your API key and network.`,
        }
      }

      const data = await response.json()
      console.log("Received response from Gemini API")

      // Check if the response has the expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        console.error("Unexpected API response structure:", JSON.stringify(data).substring(0, 200) + "...")
        return {
          success: false,
          data: getSampleHistoricalData(latitude, longitude),
          error: "Unexpected API response structure",
        }
      }

      // Extract text from Gemini response
      const text = data.candidates[0].content.parts[0].text || ""

      if (!text) {
        console.error("Empty text in Gemini API response")
        return {
          success: false,
          data: getSampleHistoricalData(latitude, longitude),
          error: "Empty response from Gemini API",
        }
      }

      console.log("Raw Gemini response length:", text.length)
      console.log("Response preview:", text.substring(0, 100) + "...")

      // Try multiple approaches to extract JSON
      let jsonData: HistoricalData | null = null

      // Approach 1: Try to parse the entire response as JSON
      try {
        jsonData = JSON.parse(text) as HistoricalData
        console.log("Successfully parsed entire response as JSON")
      } catch (parseError) {
        console.log("Could not parse entire response as JSON, trying to extract JSON object:", parseError)
      }

      // Approach 2: Try to extract JSON using regex if approach 1 failed
      if (!jsonData) {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            jsonData = JSON.parse(jsonMatch[0]) as HistoricalData
            console.log("Successfully parsed JSON using regex extraction")
          } catch (parseError) {
            console.error("Error parsing extracted JSON:", parseError)
          }
        } else {
          console.log("No JSON object found in response using regex")
        }
      }

      // Approach 3: Try to find JSON between markdown code blocks
      if (!jsonData) {
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (codeBlockMatch && codeBlockMatch[1]) {
          try {
            jsonData = JSON.parse(codeBlockMatch[1]) as HistoricalData
            console.log("Successfully parsed JSON from code block")
          } catch (parseError) {
            console.error("Error parsing JSON from code block:", parseError)
          }
        } else {
          console.log("No code block found in response")
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
          console.error("JSON data missing required properties:", Object.keys(jsonData))
          return {
            success: false,
            data: getSampleHistoricalData(latitude, longitude),
            error: "Invalid data structure from API",
          }
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

      // If all parsing attempts failed, return sample data
      console.error("Failed to parse JSON from Gemini API response")
      return {
        success: false,
        data: getSampleHistoricalData(latitude, longitude),
        error: "Failed to parse response from Gemini API",
      }
    } catch (apiError) {
      console.error("API error occurred:", apiError)
      return {
        success: false,
        data: getSampleHistoricalData(latitude, longitude),
        error: "Unknown API error. Please check your Gemini API key and network connection.",
      }
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

