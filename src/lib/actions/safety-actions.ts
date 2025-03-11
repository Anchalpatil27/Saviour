"use server"

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

// Hardcoded real data for different disaster types
const DISASTER_DATA: Record<string, DisasterSafetyData> = {
  Flood: {
    beforeDisaster: {
      title: "Before a Flood",
      tips: [
        "Know your evacuation routes",
        "Prepare emergency kit with essentials",
        "Install check valves in plumbing",
        "Consider flood insurance",
        "Elevate electrical systems",
        "Waterproof your basement",
        "Create a family communication plan",
      ],
    },
    duringDisaster: {
      title: "During a Flood",
      tips: [
        "Listen to emergency broadcasts",
        "Evacuate immediately if ordered",
        "Never walk through floodwaters",
        "Stay off bridges over fast water",
        "Disconnect utilities if instructed",
        "Move to higher ground",
        "Keep children away from floodwater",
      ],
    },
    afterDisaster: {
      title: "After a Flood",
      tips: [
        "Return only when authorities say it's safe",
        "Document damage with photos",
        "Clean and disinfect everything wet",
        "Wear protective clothing during cleanup",
        "Watch for contaminated water",
        "Avoid electrical hazards",
        "Check for structural damage",
      ],
    },
    firstAid: {
      title: "Flood-Related First Aid",
      tips: [
        "Clean wounds with clean water and soap",
        "Treat hypothermia with dry blankets",
        "Immobilize injuries, seek medical help",
        "Rehydrate with clean water",
        "Don't touch electrical injury victims until power is off",
        "Clean animal bites thoroughly",
        "Rinse chemical exposure with clean water",
      ],
    },
  },
  Earthquake: {
    beforeDisaster: {
      title: "Before an Earthquake",
      tips: [
        "Secure heavy furniture and appliances",
        "Create a disaster plan",
        "Identify safe spots in each room",
        "Store emergency supplies",
        "Learn to shut off utilities",
        "Strengthen your home's structure",
        "Keep important documents secure",
      ],
    },
    duringDisaster: {
      title: "During an Earthquake",
      tips: [
        "Drop, cover, and hold on",
        "Stay away from windows and exterior walls",
        "If outdoors, move to open areas",
        "If driving, pull over safely",
        "If in bed, protect head with pillow",
        "Don't use elevators",
        "Be prepared for aftershocks",
      ],
    },
    afterDisaster: {
      title: "After an Earthquake",
      tips: [
        "Check for injuries",
        "Inspect for structural damage",
        "Watch for gas leaks",
        "Clean up spilled hazardous materials",
        "Listen to emergency broadcasts",
        "Prepare for aftershocks",
        "Help neighbors in need",
      ],
    },
    firstAid: {
      title: "Earthquake-Related First Aid",
      tips: [
        "Control bleeding with direct pressure",
        "Immobilize broken bones",
        "Monitor head injuries closely",
        "Clean wounds with soap and water",
        "Treat shock by keeping person warm",
        "Move to fresh air if dust inhalation",
        "Provide emotional support",
      ],
    },
  },
  Wildfire: {
    beforeDisaster: {
      title: "Before a Wildfire",
      tips: [
        "Clear vegetation around home",
        "Use fire-resistant building materials",
        "Prepare a 'go bag' for evacuation",
        "Plan multiple evacuation routes",
        "Sign up for emergency alerts",
        "Keep roofs and gutters clean",
        "Store flammables away from house",
      ],
    },
    duringDisaster: {
      title: "During a Wildfire",
      tips: [
        "Evacuate immediately if ordered",
        "Wear protective clothing and masks",
        "Close all windows and doors",
        "Turn off gas and AC",
        "Leave lights on for visibility",
        "Monitor emergency broadcasts",
        "Call 911 if trapped",
      ],
    },
    afterDisaster: {
      title: "After a Wildfire",
      tips: [
        "Return only when declared safe",
        "Watch for hot spots",
        "Be cautious of hazards in burned areas",
        "Document damage for insurance",
        "Check for embers in hidden areas",
        "Watch for falling trees and ash pits",
        "Monitor air quality",
      ],
    },
    firstAid: {
      title: "Wildfire-Related First Aid",
      tips: [
        "Cool burns with clean water",
        "Move to fresh air if smoke inhalation",
        "Rinse irritated eyes with water",
        "Treat heat exhaustion with cooling",
        "Seek help for carbon monoxide exposure",
        "Help with breathing difficulties",
        "Offer emotional support",
      ],
    },
  },
  Hurricane: {
    beforeDisaster: {
      title: "Before a Hurricane",
      tips: [
        "Know your evacuation zone",
        "Prepare 3-day emergency supplies",
        "Secure outdoor items",
        "Install storm shutters",
        "Trim trees for wind resistance",
        "Clear gutters and drains",
        "Document home contents",
      ],
    },
    duringDisaster: {
      title: "During a Hurricane",
      tips: [
        "Stay in small interior room",
        "Keep away from windows",
        "Lie on floor under table if winds increase",
        "Don't go out during the eye",
        "Listen to battery-powered radio",
        "Keep refrigerator closed",
        "Use flashlights, not candles",
      ],
    },
    afterDisaster: {
      title: "After a Hurricane",
      tips: [
        "Stay informed about safe areas",
        "Watch for downed power lines",
        "Avoid floodwaters",
        "Document damage with photos",
        "Wear protective clothing",
        "Watch for wildlife",
        "Use generators safely outdoors",
      ],
    },
    firstAid: {
      title: "Hurricane-Related First Aid",
      tips: [
        "Clean wounds with soap and water",
        "Immobilize broken bones",
        "Remove wet clothing if hypothermic",
        "Rehydrate with clean water",
        "Clean puncture wounds thoroughly",
        "Treat animal bites immediately",
        "Provide emotional support",
      ],
    },
  },
  Tornado: {
    beforeDisaster: {
      title: "Before a Tornado",
      tips: [
        "Know tornado warning signs",
        "Create a family emergency plan",
        "Prepare emergency supplies",
        "Practice tornado drills",
        "Strengthen your home",
        "Remove hazardous trees",
        "Sign up for emergency alerts",
      ],
    },
    duringDisaster: {
      title: "During a Tornado",
      tips: [
        "Go to basement or interior room",
        "Stay away from windows",
        "Cover head and neck",
        "Leave mobile homes immediately",
        "If outside, lie in a ditch",
        "Don't try to outrun a tornado",
        "Don't shelter under overpasses",
      ],
    },
    afterDisaster: {
      title: "After a Tornado",
      tips: [
        "Check for injuries",
        "Watch for broken glass and debris",
        "Stay clear of damaged buildings",
        "Use flashlights, not candles",
        "Listen to emergency information",
        "Document damage with photos",
        "Help neighbors in need",
      ],
    },
    firstAid: {
      title: "Tornado-Related First Aid",
      tips: [
        "Clean and cover puncture wounds",
        "Immobilize broken bones",
        "Monitor head injuries closely",
        "Free trapped victims if safe",
        "Apply pressure to stop bleeding",
        "Treat for shock if needed",
        "Provide emotional support",
      ],
    },
  },
}

// List of available disaster types
const AVAILABLE_DISASTER_TYPES = ["Flood", "Earthquake", "Wildfire", "Hurricane", "Tornado"]

export async function fetchSafetyData(
  latitude: number,
  longitude: number,
  disasterType = "Flood",
): Promise<{ success: boolean; data: SafetyData; error?: string }> {
  try {
    console.log(`Fetching safety data for disaster type: ${disasterType}`)

    // First check if we have a Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      console.log("No Gemini API key found, using hardcoded data")
      // Use the hardcoded data without trying the API
      const disasterData = DISASTER_DATA[disasterType] || DISASTER_DATA["Flood"]
      const safetyData = convertToSafetyDataFormat(disasterData, disasterType)

      return {
        success: true,
        data: safetyData,
      }
    }

    // We have an API key, so try using the Gemini API first
    try {
      console.log("Attempting to fetch data from Gemini API")

      // IMPORTANT: Always use hardcoded data in production for now
      // This is a temporary fix until we resolve the API issues
      if (process.env.NODE_ENV === "production") {
        console.log("Using hardcoded data in production environment")
        const disasterData = DISASTER_DATA[disasterType] || DISASTER_DATA["Flood"]
        const safetyData = convertToSafetyDataFormat(disasterData, disasterType)

        return {
          success: true,
          data: safetyData,
          error: "Using reliable local data in production environment",
        }
      }

      // Only try the API in development
      const apiResult = await fetchSafetyDataFromAPI(latitude, longitude, disasterType)

      // If successful, return the API data
      return apiResult
    } catch (apiError) {
      console.error("Gemini API error, falling back to hardcoded data:", apiError)

      // API call failed, fallback to hardcoded data
      const disasterData = DISASTER_DATA[disasterType] || DISASTER_DATA["Flood"]
      const safetyData = convertToSafetyDataFormat(disasterData, disasterType)

      return {
        success: true,
        data: safetyData,
        error: "API call failed, using reliable fallback data",
      }
    }
  } catch (error) {
    console.error("Error fetching safety data:", error)

    // In case of any errors, always fall back to hardcoded data
    const disasterData = DISASTER_DATA[disasterType] || DISASTER_DATA["Flood"]
    const safetyData = convertToSafetyDataFormat(disasterData, disasterType)

    return {
      success: true,
      data: safetyData,
      error: "Error occurred, using fallback data",
    }
  }
}

// Helper function to convert DisasterSafetyData to SafetyData format
function convertToSafetyDataFormat(disasterData: DisasterSafetyData, disasterType: string): SafetyData {
  return {
    disasterPreparedness: [
      {
        id: "1",
        title: disasterData.beforeDisaster.title,
        content: disasterData.beforeDisaster.tips.join(" • "),
        disasterType,
        priority: "high",
      },
      {
        id: "2",
        title: disasterData.duringDisaster.title,
        content: disasterData.duringDisaster.tips.join(" • "),
        disasterType,
        priority: "high",
      },
      {
        id: "3",
        title: disasterData.afterDisaster.title,
        content: disasterData.afterDisaster.tips.join(" • "),
        disasterType,
        priority: "medium",
      },
    ],
    firstAidGuide: disasterData.firstAid.tips.map((tip, index) => ({
      id: (index + 1).toString(),
      title: tip.split(":")[0] || `Tip ${index + 1}`,
      description: tip.split(":")[1] || tip,
    })),
    availableDisasterTypes: AVAILABLE_DISASTER_TYPES,
    isSampleData: false,
  }
}

// New function to attempt fetching from the Gemini API
async function fetchSafetyDataFromAPI(
  latitude: number,
  longitude: number,
  disasterType: string,
): Promise<{ success: boolean; data: SafetyData; error?: string }> {
  // Prepare the prompt for Gemini API
  const prompt = `
   Create a JSON object with detailed safety guidelines for ${disasterType} disasters in the area near coordinates:
   Latitude: ${latitude}
   Longitude: ${longitude}
   
   The JSON object must follow this exact format:
   {
     "beforeDisaster": {
       "title": "Before a ${disasterType}",
       "tips": ["Tip 1", "Tip 2", ...etc] // 7 tips
     },
     "duringDisaster": {
       "title": "During a ${disasterType}",
       "tips": ["Tip 1", "Tip 2", ...etc] // 7 tips
     },
     "afterDisaster": {
       "title": "After a ${disasterType}",
       "tips": ["Tip 1", "Tip 2", ...etc] // 7 tips
     },
     "firstAid": {
       "title": "${disasterType}-Related First Aid",
       "tips": ["Tip 1", "Tip 2", ...etc] // 7 tips
     }
   }
   
   Return ONLY the JSON object with no additional text.
 `

  // Clean the API key - remove any whitespace, quotes, etc.
  const cleanedApiKey = process.env.GEMINI_API_KEY?.trim().replace(/["']/g, "") || ""

  // Define endpoints to try
  const endpoints = [
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  ]

  // Try each endpoint until one works
  for (const endpoint of endpoints) {
    try {
      console.log(`Trying Gemini API endpoint: ${endpoint}`)

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
            maxOutputTokens: 2048,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API error: ${response.status} ${response.statusText}. Response: ${errorText}`)
        continue // Try the next endpoint
      }

      const data = await response.json()

      // Extract text from Gemini response
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (!text) {
        console.error("Empty text in Gemini API response")
        continue
      }

      // Try to parse the JSON response
      let jsonData: DisasterSafetyData | null = null

      // Try direct parsing
      try {
        jsonData = JSON.parse(text) as DisasterSafetyData
      } catch {
        console.log("Could not parse entire response as JSON, trying to extract JSON object")

        // Try regex extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            jsonData = JSON.parse(jsonMatch[0]) as DisasterSafetyData
          } catch {
            console.error("Error parsing extracted JSON")
          }
        }

        // Try code block extraction
        if (!jsonData) {
          const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
          if (codeBlockMatch && codeBlockMatch[1]) {
            try {
              jsonData = JSON.parse(codeBlockMatch[1]) as DisasterSafetyData
              console.log("Successfully parsed JSON from code block")
            } catch {
              console.error("Error parsing JSON from code block")
            }
          }
        }
      }

      // If we have valid JSON data, convert and return it
      if (jsonData) {
        const safetyData = convertToSafetyDataFormat(jsonData, disasterType)
        return {
          success: true,
          data: safetyData,
        }
      }
    } catch (endpointError) {
      console.error(`Error with endpoint ${endpoint}:`, endpointError)
      // Continue to the next endpoint
    }
  }

  // If all endpoints fail, throw an error to trigger fallback
  throw new Error("All Gemini API endpoints failed")
}

export async function fetchDisasterSafetyData(
  disasterType: string,
): Promise<{ success: boolean; data: DisasterSafetyData; error?: string }> {
  try {
    console.log(`Fetching disaster safety data for: ${disasterType}`)

    // Return the hardcoded data for the requested disaster type
    const data = DISASTER_DATA[disasterType] || DISASTER_DATA["Flood"]

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error fetching disaster safety data:", error)

    // Return a default data structure even in case of error
    return {
      success: false,
      data: DISASTER_DATA["Flood"],
      error: "Failed to fetch safety data, showing default information",
    }
  }
}