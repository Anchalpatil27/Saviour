"use server"

import { revalidatePath } from "next/cache"

export interface HighAltitudePlace {
  id: string
  name: string
  elevation: string
  coordinates: {
    lat: number
    lng: number
  }
  description: string
  risk: "Low" | "Medium" | "High"
  status: "Accessible" | "Caution" | "Dangerous"
  distanceFromUser: string
}

export async function findHighAltitudePlaces(
  latitude: number,
  longitude: number,
): Promise<{ success: boolean; places: HighAltitudePlace[]; error?: string }> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log("No Gemini API key found, using sample data")
      return {
        success: true,
        places: getSamplePlaces(latitude, longitude),
      }
    }

    const prompt = `
      I need to find high altitude places (hills, mountains, viewpoints, etc.) within a 5km radius of the following coordinates:
      Latitude: ${latitude}
      Longitude: ${longitude}

      Please provide exactly 3 locations with the following information for each:
      1. Name of the place
      2. Approximate elevation (in feet)
      3. Coordinates (latitude and longitude)
      4. Brief description (1-2 sentences)
      5. Risk level (Low, Medium, or High)
      6. Status (Accessible, Caution, or Dangerous)
      7. Approximate distance from the user's location

      Format your response as a JSON array with objects containing these fields:
      [
        {
          "id": "1",
          "name": "Name of place",
          "elevation": "Elevation in feet",
          "coordinates": {
            "lat": latitude,
            "lng": longitude
          },
          "description": "Brief description",
          "risk": "Risk level",
          "status": "Status",
          "distanceFromUser": "Distance in km"
        },
        ...
      ]
      
      Only return the JSON array, nothing else.
    `

    try {
      // Direct fetch to Gemini API to avoid TypeScript issues
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
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
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        },
      )

      const data = await response.json()

      // Extract text from Gemini response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      // Extract JSON from the response using a regex that's safe for ES2015+
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        console.log("Failed to parse response from Gemini API")
        return {
          success: false,
          places: getSamplePlaces(latitude, longitude),
          error: "Failed to parse response from Gemini API",
        }
      }

      try {
        const places = JSON.parse(jsonMatch[0]) as HighAltitudePlace[]

        revalidatePath("/dashboard/navigation")

        return {
          success: true,
          places,
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError)
        return {
          success: true,
          places: getSamplePlaces(latitude, longitude),
        }
      }
    } catch (apiError) {
      console.error("API error:", apiError)
      return {
        success: true,
        places: getSamplePlaces(latitude, longitude),
      }
    }
  } catch (error) {
    console.error("Error finding high altitude places:", error)
    return {
      success: true,
      places: getSamplePlaces(latitude, longitude),
    }
  }
}

// Helper function to get sample places
function getSamplePlaces(latitude: number, longitude: number): HighAltitudePlace[] {
  return [
    {
      id: "1",
      name: "Mount Ridge",
      elevation: "1,250 ft",
      status: "Accessible",
      risk: "Low",
      coordinates: { lat: latitude + 0.01, lng: longitude + 0.01 },
      description: "A gentle hill with panoramic views of the surrounding area.",
      distanceFromUser: "1.2 km",
    },
    {
      id: "2",
      name: "Eagle Peak",
      elevation: "2,340 ft",
      status: "Caution",
      risk: "Medium",
      coordinates: { lat: latitude + 0.02, lng: longitude - 0.01 },
      description: "A moderate climb with rocky terrain and beautiful vistas.",
      distanceFromUser: "2.8 km",
    },
    {
      id: "3",
      name: "Summit Point",
      elevation: "3,120 ft",
      status: "Dangerous",
      risk: "High",
      coordinates: { lat: latitude - 0.01, lng: longitude + 0.02 },
      description: "A challenging ascent with steep cliffs and difficult terrain.",
      distanceFromUser: "3.5 km",
    },
  ]
}

