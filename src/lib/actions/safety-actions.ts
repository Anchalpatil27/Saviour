    "use server"

import { revalidatePath } from "next/cache"

export interface SafetyTip {
  title: string
  description: string
}

export interface FirstAidTip {
  title: string
  description: string
}

export interface DisasterSafetyData {
  disasterType: string
  beforeTips: SafetyTip[]
  duringTips: SafetyTip[]
  afterTips: SafetyTip[]
  firstAidTips: FirstAidTip[]
  isSampleData?: boolean
}

// Sample data for when Gemini API is not available
function getSampleSafetyData(disasterType: string): DisasterSafetyData {
  // Default to flood if no disaster type is specified
  const type = disasterType || "flood"

  if (type.toLowerCase() === "flood") {
    return {
      disasterType: "Flood",
      beforeTips: [
        {
          title: "Create an emergency kit",
          description:
            "Include water, non-perishable food, first aid supplies, medications, flashlights, batteries, and important documents in waterproof containers.",
        },
        {
          title: "Know evacuation routes",
          description: "Identify multiple evacuation routes from your home and workplace to higher ground.",
        },
        {
          title: "Protect important documents",
          description:
            "Store important documents like insurance policies, IDs, and medical records in waterproof containers.",
        },
      ],
      duringTips: [
        {
          title: "Move to higher ground",
          description:
            "Evacuate immediately if advised. Move to higher floors in your home if evacuation isn't possible.",
        },
        {
          title: "Avoid floodwaters",
          description:
            "Never walk, swim, or drive through floodwaters. Just 6 inches of moving water can knock you down, and 1 foot can sweep your vehicle away.",
        },
        {
          title: "Disconnect utilities",
          description: "If instructed, turn off gas, electricity, and water at the main switches or valves.",
        },
      ],
      afterTips: [
        {
          title: "Check for damage",
          description:
            "Inspect your home for damage. Take pictures for insurance purposes. Be cautious of structural damage.",
        },
        {
          title: "Clean and disinfect",
          description: "Clean and disinfect everything that got wet. Floodwaters can contain sewage and chemicals.",
        },
        {
          title: "Watch for hazards",
          description:
            "Be aware of damaged power lines, contaminated water, gas leaks, and wildlife that may have entered your home.",
        },
      ],
      firstAidTips: [
        {
          title: "Treating water-related injuries",
          description:
            "Clean wounds with clean water and soap. Apply antibiotic ointment and sterile bandages. Seek medical attention for deep wounds.",
        },
        {
          title: "Hypothermia prevention",
          description:
            "Remove wet clothing, dry the person, and wrap them in warm blankets. Provide warm, non-alcoholic beverages if the person is conscious.",
        },
        {
          title: "Waterborne illness",
          description:
            "Watch for symptoms like diarrhea, vomiting, and fever which may indicate exposure to contaminated water. Seek medical attention if symptoms occur.",
        },
      ],
      isSampleData: true,
    }
  } else if (type.toLowerCase() === "earthquake") {
    return {
      disasterType: "Earthquake",
      beforeTips: [
        {
          title: "Secure heavy furniture",
          description: "Anchor bookshelves, water heaters, and heavy furniture to walls. Secure hanging items.",
        },
        {
          title: "Create a disaster plan",
          description: "Identify safe spots in each room, such as under sturdy furniture or against interior walls.",
        },
        {
          title: "Prepare emergency supplies",
          description:
            "Stock up on water, non-perishable food, first aid supplies, and medications for at least three days.",
        },
      ],
      duringTips: [
        {
          title: "Drop, cover, and hold on",
          description: "Drop to the ground, take cover under a sturdy table, and hold on until the shaking stops.",
        },
        {
          title: "Stay indoors",
          description:
            "If you're inside, stay there. Most injuries occur when people try to move to a different location or go outside.",
        },
        {
          title: "If outdoors, find a clear spot",
          description:
            "Move away from buildings, streetlights, and utility wires. Once in the open, drop to the ground until the shaking stops.",
        },
      ],
      afterTips: [
        {
          title: "Check for injuries and damage",
          description:
            "Provide first aid for anyone who needs it. Check your home for damage, especially gas, water, and electric lines.",
        },
        {
          title: "Be prepared for aftershocks",
          description:
            "These additional quakes are usually less violent but can cause further damage to weakened structures.",
        },
        {
          title: "Listen for emergency information",
          description: "Use a battery-operated radio to listen for updates and instructions from authorities.",
        },
      ],
      firstAidTips: [
        {
          title: "Treating crush injuries",
          description:
            "If someone is trapped, provide reassurance, check for injuries, and call for help. Do not attempt to move them unless there is immediate danger.",
        },
        {
          title: "Controlling bleeding",
          description:
            "Apply direct pressure to the wound with a clean cloth. If bleeding doesn't stop, apply pressure to the appropriate pressure point.",
        },
        {
          title: "Treating shock",
          description:
            "Lay the person down with legs elevated. Keep them warm with a blanket. Monitor breathing and consciousness.",
        },
      ],
      isSampleData: true,
    }
  } else {
    // Generic disaster safety data
    return {
      disasterType: type.charAt(0).toUpperCase() + type.slice(1),
      beforeTips: [
        {
          title: "Create an emergency kit",
          description: "Include water, non-perishable food, first aid supplies, and important documents.",
        },
        {
          title: "Develop a family communication plan",
          description:
            "Ensure all family members know how to contact each other and where to meet in case of emergency.",
        },
        {
          title: "Know your evacuation routes",
          description: "Familiarize yourself with multiple evacuation routes from your home and workplace.",
        },
      ],
      duringTips: [
        {
          title: "Stay informed",
          description: "Listen to local authorities and emergency services for instructions.",
        },
        {
          title: "Follow evacuation orders",
          description: "If told to evacuate, do so immediately. Take only essential items with you.",
        },
        {
          title: "Help others if possible",
          description: "Assist neighbors, especially elderly or disabled individuals, if it is safe to do so.",
        },
      ],
      afterTips: [
        {
          title: "Check for injuries and damage",
          description: "Provide first aid for anyone who needs it. Inspect your property for damage.",
        },
        {
          title: "Document damage",
          description: "Take photos of any damage for insurance purposes.",
        },
        {
          title: "Begin recovery",
          description: "Contact your insurance company. Apply for disaster assistance if available.",
        },
      ],
      firstAidTips: [
        {
          title: "Basic wound care",
          description: "Clean wounds with clean water and soap. Apply antibiotic ointment and sterile bandages.",
        },
        {
          title: "CPR basics",
          description:
            "For adults: push hard and fast in the center of the chest at a rate of 100-120 compressions per minute.",
        },
        {
          title: "Treating shock",
          description:
            "Lay the person down with legs elevated. Keep them warm with a blanket. Monitor breathing and consciousness.",
        },
      ],
      isSampleData: true,
    }
  }
}

export async function fetchSafetyData(
  disasterType: string,
): Promise<{ success: boolean; data: DisasterSafetyData; error?: string }> {
  try {
    console.log(`Starting safety data fetch for disaster type: ${disasterType}`)

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.log("No Gemini API key found, using sample data")
      return {
        success: true,
        data: getSampleSafetyData(disasterType),
      }
    }

    // For debugging - log a safe version of the key
    const keyPreview =
      process.env.GEMINI_API_KEY.substring(0, 4) +
      "..." +
      process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)
    console.log(`Using Gemini API key starting with: ${keyPreview}`)

    // Detailed prompt for safety data
    const prompt = `
      Create a JSON object with comprehensive safety guidelines for ${disasterType} disasters.

      IMPORTANT: 
      - All information MUST be factually accurate and follow established safety protocols
      - Focus on practical, actionable advice that can save lives
      - Include specific first aid information relevant to this disaster type

      The JSON object should have these properties:
      
      1. disasterType: string (the type of disaster, e.g., "Flood")
      
      2. beforeTips: Array of objects with:
         - title: string (short, actionable title)
         - description: string (detailed explanation)
      
      3. duringTips: Array of objects with:
         - title: string (short, actionable title)
         - description: string (detailed explanation)
      
      4. afterTips: Array of objects with:
         - title: string (short, actionable title)
         - description: string (detailed explanation)
      
      5. firstAidTips: Array of objects with:
         - title: string (short, actionable title)
         - description: string (detailed explanation)
      
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
        let jsonData: DisasterSafetyData | null = null

        // Approach 1: Try to parse the entire response as JSON
        try {
          jsonData = JSON.parse(text) as DisasterSafetyData
          console.log("Successfully parsed entire response as JSON")
        } catch (parseError) {
          console.log("Could not parse entire response as JSON, trying to extract JSON object:", parseError)
        }

        // Approach 2: Try to extract JSON using regex if approach 1 failed
        if (!jsonData) {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            try {
              jsonData = JSON.parse(jsonMatch[0]) as DisasterSafetyData
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
              jsonData = JSON.parse(codeBlockMatch[1]) as DisasterSafetyData
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
          if (!jsonData.beforeTips) jsonData.beforeTips = []
          if (!jsonData.duringTips) jsonData.duringTips = []
          if (!jsonData.afterTips) jsonData.afterTips = []
          if (!jsonData.firstAidTips) jsonData.firstAidTips = []

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

