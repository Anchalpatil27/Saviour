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
  isSampleData?: boolean // Flag to indicate if this is sample data
}

// Sample data for testing purposes
// Using underscore prefix to indicate these parameters are intentionally unused
const getSampleHistoricalData = (latitude: number, longitude: number): HistoricalData => {
  // Create more realistic sample data based on the coordinates
  const cityName = getCityNameFromCoordinates(latitude, longitude)

  return {
    events: [
      {
        id: "1",
        date: "2023-05-15",
        type: "Flood",
        severity: "Moderate",
        affected: 500,
        description: `Heavy rainfall caused flooding in low-lying areas near ${cityName}.`,
        location: cityName,
        distance: "2.3 km",
      },
      {
        id: "2",
        date: "2022-11-01",
        type: "Wildfire",
        severity: "Severe",
        affected: 200,
        description: `Dry conditions led to a wildfire in the outskirts of ${cityName}.`,
        location: `${cityName} Outskirts`,
        distance: "4.1 km",
      },
    ],
    trends: [
      { year: "2023", count: 5, primaryType: "Flood" },
      { year: "2022", count: 3, primaryType: "Wildfire" },
      { year: "2021", count: 4, primaryType: "Storm" },
    ],
    reports: [
      {
        id: "1",
        title: `${cityName} Flood Analysis Report`,
        date: "2023-06-01",
        type: "Analysis",
        summary: `Detailed analysis of the recent flooding event in ${cityName}.`,
        fileSize: "1.2 MB",
      },
      {
        id: "2",
        title: `${cityName} Emergency Response Review`,
        date: "2022-12-15",
        type: "Review",
        summary: "Evaluation of emergency response effectiveness during recent disasters.",
        fileSize: "2.4 MB",
      },
    ],
    frequencyData: [
      { type: "Flood", count: 3 },
      { type: "Wildfire", count: 2 },
      { type: "Storm", count: 4 },
      { type: "Landslide", count: 1 },
    ],
    severityData: [
      { severity: "Minor", count: 3 },
      { severity: "Moderate", count: 4 },
      { severity: "Severe", count: 2 },
      { severity: "Catastrophic", count: 1 },
    ],
    isSampleData: true, // Flag to indicate this is sample data
  }
}

// Helper function to get a city name from coordinates
// This is a simple approximation for sample data
function getCityNameFromCoordinates(latitude: number, longitude: number): string {
  // Default city name
  let cityName = "Cityville"

  // Very rough approximation of some major cities
  if (latitude > 40 && latitude < 41 && longitude > -74.5 && longitude < -73.5) {
    cityName = "New York Area"
  } else if (latitude > 33.5 && latitude < 34.5 && longitude > -118.5 && longitude < -117.5) {
    cityName = "Los Angeles Area"
  } else if (latitude > 41 && latitude < 42.5 && longitude > -88 && longitude < -87) {
    cityName = "Chicago Area"
  } else if (latitude > 29 && latitude < 30.5 && longitude > -95.5 && longitude < -94.5) {
    cityName = "Houston Area"
  } else if (latitude > 37 && latitude < 38 && longitude > -122.5 && longitude < -121.5) {
    cityName = "San Francisco Area"
  }

  return cityName
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

    // More detailed prompt with emphasis on accuracy and relevance
    const prompt = `
      Create a JSON object with ACCURATE historical disaster data for the area within 5km of these coordinates:
      Latitude: ${latitude}
      Longitude: ${longitude}

      IMPORTANT: 
      - All data MUST be factually accurate for this specific location
      - All events MUST be within 5km of the coordinates
      - If there is limited disaster history for this location, provide fewer but more accurate events
      - Base your response on real geographical features of this location

      The JSON object should have these properties:
      
      1. events: Array of disaster events with:
         - id: string
         - date: YYYY-MM-DD format
         - type: string (Flood, Earthquake, etc.)
         - severity: string (Minor, Moderate, Severe, Catastrophic)
         - affected: number
         - description: string
         - location: string
         - distance: string (must be less than 5km)
      
      2. trends: Array of yearly trends with:
         - year: string
         - count: number
         - primaryType: string
      
      3. reports: Array of reports with:
         - id: string
         - title: string
         - date: string
         - type: string
         - summary: string
         - fileSize: string
      
      4. frequencyData: Array of objects with:
         - type: string
         - count: number
      
      5. severityData: Array of objects with:
         - severity: string
         - count: number
      
      Return ONLY the JSON object with no additional text.
    `

    // Try both endpoints that might work
    const endpoints = [
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
    ]

    for (const apiUrl of endpoints) {
      try {
        console.log(`Trying API URL: ${apiUrl}`)

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
          continue // Try the next endpoint
        }

        const data = await response.json()
        console.log("Received response from Gemini API")

        // Check if the response has the expected structure
        if (
          !data.candidates ||
          !data.candidates[0] ||
          !data.candidates[0].content ||
          !data.candidates[0].content.parts
        ) {
          console.error("Unexpected API response structure:", JSON.stringify(data).substring(0, 200) + "...")
          continue // Try the next endpoint
        }

        // Extract text from Gemini response
        const text = data.candidates[0].content.parts[0].text || ""

        if (!text) {
          console.error("Empty text in Gemini API response")
          continue // Try the next endpoint
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

        // If we have valid JSON data, validate and return it
        if (jsonData) {
          // Check if all required properties exist, if not, create them
          if (!jsonData.events) jsonData.events = []
          if (!jsonData.trends) jsonData.trends = []
          if (!jsonData.reports) jsonData.reports = []
          if (!jsonData.frequencyData) jsonData.frequencyData = []
          if (!jsonData.severityData) jsonData.severityData = []

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

          // Mark this as real data (not sample)
          jsonData.isSampleData = false

          revalidatePath("/dashboard/historical")
          return {
            success: true,
            data: jsonData,
          }
        }
      } catch (apiError) {
        console.error(`API error occurred with endpoint ${apiUrl}:`, apiError)
        // Continue to the next endpoint
      }
    }

    // If all endpoints failed, return sample data with a flag
    console.error("All Gemini API endpoints failed, using sample data")
    const sampleData = getSampleHistoricalData(latitude, longitude)
    return {
      success: true,
      data: sampleData,
      error: "Could not retrieve real data, showing sample data instead",
    }
  } catch (error) {
    console.error("Error fetching historical data:", error)

    // Return sample data with a flag
    const sampleData = getSampleHistoricalData(latitude, longitude)
    return {
      success: true,
      data: sampleData,
      error: "Error occurred, showing sample data instead",
    }
  }
}

