"use server"

import { revalidatePath } from "next/cache"

// Define interfaces for news data
export interface NewsItem {
  id: string
  title: string
  source: string
  category: "Alert" | "Update" | "Event"
  summary?: string
  date?: string
  url?: string
  distance?: string
  urgency?: "Low" | "Medium" | "High"
}

export interface EmergencyBroadcast {
  id: string
  title: string
  message: string
  isLive: boolean
  urgency: "Low" | "Medium" | "High"
  source: string
  timestamp: string
}

export interface NewsData {
  news: NewsItem[]
  broadcasts: EmergencyBroadcast[]
  isSampleData?: boolean
}

// Update the getSampleNewsData function to make it clearer these are sample data
// and to not show fake emergency broadcasts by default

function getSampleNewsData(latitude: number, longitude: number): NewsData {
  // Create more realistic sample data based on the coordinates
  const cityName = getCityNameFromCoordinates(latitude, longitude)
  const currentDate = new Date().toISOString().split("T")[0] // Today's date in YYYY-MM-DD format

  return {
    news: [
      {
        id: "1",
        title: `[SAMPLE] Weather Update for ${cityName}`,
        source: "City Weather Service",
        category: "Update",
        summary: `This is sample data. In a real application, you would see actual weather updates for ${cityName} here.`,
        date: currentDate,
        distance: "12.3 km",
      },
      {
        id: "2",
        title: `[SAMPLE] Community Notice for ${cityName}`,
        source: "Local Government",
        category: "Update",
        summary: "This is sample data. In a real application, you would see actual community notices here.",
        date: currentDate,
        distance: "8.7 km",
      },
      {
        id: "3",
        title: "[SAMPLE] Community Preparedness Workshop",
        source: "SAVIOUR Organization",
        category: "Event",
        summary: "This is sample data. In a real application, you would see actual community events here.",
        date: currentDate,
        distance: "15.2 km",
      },
    ],
    broadcasts: [], // No emergency broadcasts by default in sample data
    isSampleData: true,
  }
}

// Helper function to get a city name from coordinates
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

export async function fetchNewsData(
  latitude: number,
  longitude: number,
): Promise<{ success: boolean; data: NewsData; error?: string }> {
  try {
    console.log(`Starting news data fetch for coordinates: ${latitude}, ${longitude}`)

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.log("No Gemini API key found, using sample data")
      return {
        success: true,
        data: getSampleNewsData(latitude, longitude),
      }
    }

    // For debugging - log a safe version of the key
    const keyPreview =
      process.env.GEMINI_API_KEY.substring(0, 4) +
      "..." +
      process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)
    console.log(`Using Gemini API key starting with: ${keyPreview}`)

    // Detailed prompt for news data
    const prompt = `
      Create a JSON object with ACCURATE local news and emergency broadcast data for the area within 50km of these coordinates:
      Latitude: ${latitude}
      Longitude: ${longitude}

      IMPORTANT: 
      - All data MUST be factually accurate for this specific location
      - All news items MUST be within 50km of the coordinates
      - If there is limited news for this location, provide fewer but more accurate items
      - Base your response on real geographical features of this location

      The JSON object should have these properties:
      
      1. news: Array of news items with:
         - id: string
         - title: string
         - source: string
         - category: string (must be one of: "Alert", "Update", "Event")
         - summary: string
         - date: string (YYYY-MM-DD format)
         - distance: string (distance from the coordinates in km, must be less than 50km)
      
      2. broadcasts: Array of emergency broadcasts with:
         - id: string
         - title: string
         - message: string
         - isLive: boolean
         - urgency: string (must be one of: "Low", "Medium", "High")
         - source: string
         - timestamp: string (ISO format)
      
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
        let jsonData: NewsData | null = null

        // Approach 1: Try to parse the entire response as JSON
        try {
          jsonData = JSON.parse(text) as NewsData
          console.log("Successfully parsed entire response as JSON")
        } catch (parseError) {
          console.log("Could not parse entire response as JSON, trying to extract JSON object:", parseError)
        }

        // Approach 2: Try to extract JSON using regex if approach 1 failed
        if (!jsonData) {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
              jsonData = JSON.parse(jsonMatch[0]) as NewsData
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
              jsonData = JSON.parse(codeBlockMatch[1]) as NewsData
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
          if (!jsonData.news) jsonData.news = []
          if (!jsonData.broadcasts) jsonData.broadcasts = []

          // Filter out any news items that are beyond 50km if distance is provided
          if (jsonData.news && Array.isArray(jsonData.news)) {
            jsonData.news = jsonData.news.filter((item) => {
              if (!item.distance) return true

              // Extract the numeric part of the distance string (e.g., "32.5 km" -> 32.5)
              const distanceMatch = item.distance.match(/(\d+(\.\d+)?)/)
              if (!distanceMatch) return true

              const distance = Number.parseFloat(distanceMatch[0])
              return distance <= 50
            })
          }

          // Mark this as real data (not sample)
          jsonData.isSampleData = false

          revalidatePath("/dashboard/news")
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
    const sampleData = getSampleNewsData(latitude, longitude)
    return {
      success: true,
      data: sampleData,
      error: "Could not retrieve real data, showing sample data instead",
    }
  } catch (error) {
    console.error("Error fetching news data:", error)

    // Return sample data with a flag
    const sampleData = getSampleNewsData(latitude, longitude)
    return {
      success: true,
      data: sampleData,
      error: "Error occurred, showing sample data instead",
    }
  }
}

