// Add this new server action file to fetch safety guidelines

"use server"

import { revalidatePath } from "next/cache"

export interface SafetyGuidelineItem {
  id: string
  title: string
  content: string
  disasterType: string
  priority: "high" | "medium" | "low"
}

export interface FirstAidStep {
  id: string
  title: string
  description: string
  imageUrl?: string
}

export interface SafetyData {
  disasterPreparedness: SafetyGuidelineItem[]
  firstAidGuide: FirstAidStep[]
  availableDisasterTypes: string[]
  isSampleData: boolean
}

export interface DisasterSafetyData {
  beforeDisaster: {
    title: string
    tips: string[]
  }
  duringDisaster: {
    title: string
    tips: string[]
  }
  afterDisaster: {
    title: string
    tips: string[]
  }
  firstAid: {
    title: string
    tips: string[]
  }
}

function getSampleSafetyData(disasterType: string): SafetyData {
  const defaultDisasterTypes = ["Flood", "Earthquake", "Wildfire", "Hurricane", "Tornado"]

  // Create sample data based on the selected disaster type
  return {
    disasterPreparedness: [
      {
        id: "1",
        title: `Before a ${disasterType}`,
        content: `Learn about ${disasterType} risks in your area. Prepare an emergency kit with food, water, medications, and important documents. Create an evacuation plan and share it with family members.`,
        disasterType,
        priority: "high",
      },
      {
        id: "2",
        title: `During a ${disasterType}`,
        content: `Stay informed through official channels. Follow evacuation orders immediately. Avoid flooded areas and downed power lines. Keep your emergency kit accessible.`,
        disasterType,
        priority: "high",
      },
      {
        id: "3",
        title: `After a ${disasterType}`,
        content: `Return home only when authorities say it's safe. Document damage for insurance. Be aware of hazards like contaminated water, damaged structures, or downed power lines.`,
        disasterType,
        priority: "medium",
      },
    ],
    firstAidGuide: [
      {
        id: "1",
        title: "Treating Minor Cuts and Wounds",
        description:
          "Clean the wound with soap and water. Apply antibiotic ointment and cover with a sterile bandage. Change bandage daily or when dirty.",
      },
      {
        id: "2",
        title: "CPR Basics",
        description:
          "Check for responsiveness. Call emergency services. Begin chest compressions at 100-120 per minute. Push hard and fast in the center of the chest.",
      },
      {
        id: "3",
        title: "Treating Shock",
        description:
          "Lay person flat, elevate legs if no spinal injury suspected. Keep them warm with blankets. Do not give food or drink. Seek immediate medical help.",
      },
    ],
    availableDisasterTypes: defaultDisasterTypes,
    isSampleData: true,
  }
}

export async function fetchSafetyData(
  latitude: number,
  longitude: number,
  disasterType = "Flood",
): Promise<{ success: boolean; data: SafetyData; error?: string }> {
  try {
    console.log(
      `Starting safety data fetch for coordinates: ${latitude}, ${longitude} and disaster type: ${disasterType}`,
    )

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.log("No Gemini API key found, using sample data")
      return {
        success: true,
        data: getSampleSafetyData(disasterType),
      }
    }

    const prompt = `
      Create a comprehensive safety guide for ${disasterType} disasters near these coordinates:
      Latitude: ${latitude}
      Longitude: ${longitude}

      IMPORTANT: 
      - All information MUST be factually accurate and follow best-practice safety guidelines for ${disasterType} disasters
      - Provide specific, actionable information for this location
      - Consider the geographic features of this area in your response

      Return a JSON object with these properties:
      
      1. disasterPreparedness: Array of guidelines with:
         - id: string
         - title: string (e.g., "Before a ${disasterType}", "During a ${disasterType}")
         - content: string (detailed safety instructions)
         - disasterType: string (matching the requested disaster type)
         - priority: string (must be one of: "high", "medium", "low")
      
      2. firstAidGuide: Array of first aid steps with:
         - id: string
         - title: string
         - description: string (clear, step-by-step instructions)
         - imageUrl: string (leave blank, will be filled later)
      
      3. availableDisasterTypes: Array of strings with disaster types common in this area
      
      Return ONLY the JSON object with no additional text.
    `

    // Try multiple endpoints
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
        let jsonData: SafetyData | null = null

        // Approach 1: Try to parse the entire response as JSON
        try {
          jsonData = JSON.parse(text) as SafetyData
          console.log("Successfully parsed entire response as JSON")
        } catch (parseError) {
          console.log("Could not parse entire response as JSON, trying to extract JSON object:", parseError)
        }

        // Approach 2: Try to extract JSON using regex if approach 1 failed
        if (!jsonData) {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
              jsonData = JSON.parse(jsonMatch[0]) as SafetyData
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
              jsonData = JSON.parse(codeBlockMatch[1]) as SafetyData
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
          if (!jsonData.disasterPreparedness) jsonData.disasterPreparedness = []
          if (!jsonData.firstAidGuide) jsonData.firstAidGuide = []
          if (!jsonData.availableDisasterTypes) {
            jsonData.availableDisasterTypes = ["Flood", "Earthquake", "Wildfire", "Hurricane", "Tornado"]
          }

          // Mark this as real data (not sample)
          jsonData.isSampleData = false

          revalidatePath("/dashboard/safety")
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
    const sampleData = getSampleSafetyData(disasterType)
    return {
      success: true,
      data: sampleData,
      error: "Could not retrieve real data, showing sample data instead",
    }
  } catch (error) {
    console.error("Error fetching safety data:", error)

    // Return sample data with a flag
    const sampleData = getSampleSafetyData(disasterType)
    return {
      success: true,
      data: sampleData,
      error: "Error occurred, showing sample data instead",
    }
  }
}

export async function fetchDisasterSafetyData(
  disasterType: string,
): Promise<{ success: boolean; data: DisasterSafetyData; error?: string }> {
  try {
    // In a real implementation, this would fetch from Gemini API
    // For now, we'll return sample data
    const sampleData: DisasterSafetyData = {
      beforeDisaster: {
        title: `Before a ${disasterType}`,
        tips: [
          `Stay informed about ${disasterType} risks in your area.`,
          "Create an emergency plan and share it with your family.",
          "Prepare an emergency kit with essential supplies.",
          "Know evacuation routes and meeting points.",
          "Secure important documents in waterproof containers.",
        ],
      },
      duringDisaster: {
        title: `During a ${disasterType}`,
        tips: [
          "Stay calm and follow your emergency plan.",
          "Listen to official instructions and emergency broadcasts.",
          "Evacuate immediately if ordered to do so.",
          "Avoid hazardous areas and downed power lines.",
          "Help others if it's safe to do so.",
        ],
      },
      afterDisaster: {
        title: `After a ${disasterType}`,
        tips: [
          "Return home only when authorities say it's safe.",
          "Document damage with photos for insurance purposes.",
          "Be cautious of structural damage to buildings.",
          "Check on neighbors, especially elderly or disabled individuals.",
          "Begin cleanup and recovery following safety guidelines.",
        ],
      },
      firstAid: {
        title: "Emergency First Aid",
        tips: [
          "For severe bleeding: Apply direct pressure with a clean cloth.",
          "For burns: Cool with running water, don't use ice.",
          "For broken bones: Immobilize the area, don't try to straighten.",
          "For shock: Lay person flat, elevate legs, keep warm.",
          "For CPR: Push hard and fast in center of chest, 100-120 compressions per minute.",
        ],
      },
    }

    return {
      success: true,
      data: sampleData,
    }
  } catch (error) {
    console.error("Error fetching disaster safety data:", error)
    return {
      success: false,
      data: {
        beforeDisaster: { title: "", tips: [] },
        duringDisaster: { title: "", tips: [] },
        afterDisaster: { title: "", tips: [] },
        firstAid: { title: "", tips: [] },
      },
      error: "Failed to fetch safety data",
    }
  }
}

