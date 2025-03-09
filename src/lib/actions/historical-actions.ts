"use server"

import { revalidatePath } from "next/cache"

export interface DisasterEvent {
  id: string
  date: string
  type: string
  severity: "Minor" | "Moderate" | "Severe" | "Catastrophic"
  affected: number
  description: string
  location: string
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

export async function fetchHistoricalData(
  latitude: number,
  longitude: number,
): Promise<{ success: boolean; data: HistoricalData; error?: string }> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log("No Gemini API key found, using sample data")
      return {
        success: true,
        data: getSampleHistoricalData(latitude, longitude),
      }
    }

    const prompt = `
      I need historical disaster data for the area around these coordinates:
      Latitude: ${latitude}
      Longitude: ${longitude}

      Please provide the following information in JSON format:
      
      1. Recent disaster events (last 5 years) with:
         - id (string)
         - date (YYYY-MM-DD format)
         - type (Flood, Earthquake, Wildfire, Hurricane, etc.)
         - severity (Minor, Moderate, Severe, or Catastrophic)
         - affected (number of people affected)
         - description (brief description)
         - location (name of the area)
      
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
    `

    try {
      // Direct fetch to Gemini API
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
              temperature: 0.1, // Lower temperature for more deterministic output
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        },
      )

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`)
        return {
          success: false,
          data: getSampleHistoricalData(latitude, longitude),
          error: `API error: ${response.status} ${response.statusText}`,
        }
      }

      const data = await response.json()

      // Extract text from Gemini response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      if (!text) {
        console.error("Empty response from Gemini API")
        return {
          success: false,
          data: getSampleHistoricalData(latitude, longitude),
          error: "Empty response from Gemini API",
        }
      }

      console.log("Raw Gemini response:", text.substring(0, 200) + "...") // Log the beginning of the response for debugging

      // Try multiple approaches to extract JSON
      let jsonData: HistoricalData | null = null

      // Approach 1: Try to parse the entire response as JSON
      try {
        jsonData = JSON.parse(text) as HistoricalData
        console.log("Successfully parsed entire response as JSON")
      } catch {
        // Don't use the error parameter at all
        console.log("Could not parse entire response as JSON, trying to extract JSON object")
      }

      // Approach 2: Try to extract JSON using regex if approach 1 failed
      if (!jsonData) {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            jsonData = JSON.parse(jsonMatch[0]) as HistoricalData
            console.log("Successfully parsed JSON using regex extraction")
          } catch {
            console.error("Error parsing extracted JSON")
          }
        }
      }

      // Approach 3: Try to find JSON between markdown code blocks
      if (!jsonData) {
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (codeBlockMatch && codeBlockMatch[1]) {
          try {
            jsonData = JSON.parse(codeBlockMatch[1]) as HistoricalData
            console.log("Successfully parsed JSON from code block")
          } catch {
            console.error("Error parsing JSON from code block")
          }
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
          console.error("JSON data missing required properties")
          return {
            success: false,
            data: getSampleHistoricalData(latitude, longitude),
            error: "Invalid data structure from API",
          }
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
    } catch {
      console.error("API error occurred")
      return {
        success: false,
        data: getSampleHistoricalData(latitude, longitude),
        error: "Unknown API error",
      }
    }
  } catch {
    console.error("Error fetching historical data")
    return {
      success: false,
      data: getSampleHistoricalData(latitude, longitude),
      error: "Unknown error",
    }
  }
}

// Helper function to get sample historical data
function getSampleHistoricalData(latitude: number, longitude: number): HistoricalData {
  // Determine region type based on coordinates (very simplified)
  const isCoastal = Math.abs(longitude) > 120 || Math.abs(latitude) < 30
  const isMountainous = Math.abs(latitude) > 35 && Math.abs(longitude) < 100
  const isNearFaultLine =
    (Math.abs(latitude) > 30 && Math.abs(latitude) < 40) || (Math.abs(longitude) > 115 && Math.abs(longitude) < 125)

  return {
    events: [
      {
        id: "evt-001",
        date: "2023-05-15",
        type: isCoastal ? "Flood" : isMountainous ? "Landslide" : "Wildfire",
        severity: "Moderate",
        affected: 5000,
        description: `A ${isCoastal ? "significant flooding event" : isMountainous ? "major landslide" : "wildfire"} affected several communities in the region.`,
        location: `${isCoastal ? "Coastal" : isMountainous ? "Mountain" : "Rural"} Communities`,
      },
      {
        id: "evt-002",
        date: "2023-03-22",
        type: isNearFaultLine ? "Earthquake" : isCoastal ? "Hurricane" : "Wildfire",
        severity: "Severe",
        affected: 10000,
        description: `A ${isNearFaultLine ? "magnitude 5.8 earthquake" : isCoastal ? "Category 3 hurricane" : "severe wildfire"} caused significant damage to infrastructure.`,
        location: "Regional District",
      },
      {
        id: "evt-003",
        date: "2022-11-10",
        type: isNearFaultLine ? "Earthquake" : isMountainous ? "Avalanche" : "Drought",
        severity: "Minor",
        affected: 2000,
        description: `A ${isNearFaultLine ? "minor earthquake" : isMountainous ? "small avalanche" : "period of drought"} affected local resources and communities.`,
        location: "Local Area",
      },
      {
        id: "evt-004",
        date: "2022-07-18",
        type: isCoastal ? "Tsunami" : "Severe Storm",
        severity: "Catastrophic",
        affected: 15000,
        description: `A ${isCoastal ? "tsunami following an offshore earthquake" : "severe storm with high winds"} caused widespread destruction.`,
        location: "Regional Coast",
      },
      {
        id: "evt-005",
        date: "2021-09-03",
        type: "Flood",
        severity: "Moderate",
        affected: 3500,
        description: "Heavy rainfall led to flooding in low-lying areas.",
        location: "River Basin",
      },
    ],
    trends: [
      { year: "2023", count: 4, primaryType: isCoastal ? "Flood" : isMountainous ? "Landslide" : "Wildfire" },
      { year: "2022", count: 6, primaryType: isNearFaultLine ? "Earthquake" : "Severe Storm" },
      { year: "2021", count: 5, primaryType: "Flood" },
      { year: "2020", count: 3, primaryType: isCoastal ? "Hurricane" : "Wildfire" },
      { year: "2019", count: 2, primaryType: "Drought" },
      { year: "2018", count: 4, primaryType: isNearFaultLine ? "Earthquake" : "Flood" },
      { year: "2017", count: 7, primaryType: isCoastal ? "Hurricane" : "Severe Storm" },
      { year: "2016", count: 3, primaryType: "Wildfire" },
      { year: "2015", count: 2, primaryType: "Drought" },
      { year: "2014", count: 1, primaryType: isNearFaultLine ? "Earthquake" : "Flood" },
    ],
    reports: [
      {
        id: "rep-001",
        title: `Annual Disaster Summary ${new Date().getFullYear() - 1}`,
        date: `${new Date().getFullYear() - 1}-12-31`,
        type: "Annual Report",
        summary: `Comprehensive overview of all disasters in ${new Date().getFullYear() - 1} with impact assessments and response evaluations.`,
        fileSize: "3.2 MB",
      },
      {
        id: "rep-002",
        title: isCoastal
          ? "Flood Impact Analysis"
          : isMountainous
            ? "Landslide Risk Assessment"
            : "Wildfire Damage Report",
        date: "2023-06-30",
        type: "Impact Analysis",
        summary: `Detailed analysis of the ${isCoastal ? "flood" : isMountainous ? "landslide" : "wildfire"} impact on communities, infrastructure, and the environment.`,
        fileSize: "2.4 MB",
      },
      {
        id: "rep-003",
        title: isNearFaultLine ? "Earthquake Preparedness Report" : "Disaster Resilience Framework",
        date: "2022-09-15",
        type: "Preparedness Guide",
        summary: "Comprehensive guide for community preparedness and resilience building strategies.",
        fileSize: "5.1 MB",
      },
      {
        id: "rep-004",
        title: "Climate Change and Disaster Trends",
        date: "2022-03-22",
        type: "Research Study",
        summary: "Analysis of how climate change is affecting disaster frequency and severity in the region.",
        fileSize: "4.7 MB",
      },
      {
        id: "rep-005",
        title: "Economic Impact of Recent Disasters",
        date: "2021-11-10",
        type: "Economic Analysis",
        summary: "Assessment of the economic costs and long-term financial implications of recent disaster events.",
        fileSize: "1.8 MB",
      },
    ],
    frequencyData: [
      { type: "Flood", count: isCoastal ? 12 : 8 },
      { type: "Wildfire", count: isMountainous ? 5 : 10 },
      { type: "Earthquake", count: isNearFaultLine ? 9 : 2 },
      { type: "Severe Storm", count: 7 },
      { type: "Drought", count: 4 },
      { type: isCoastal ? "Hurricane" : "Landslide", count: isCoastal ? 6 : isMountainous ? 8 : 3 },
    ],
    severityData: [
      { severity: "Minor", count: 12 },
      { severity: "Moderate", count: 15 },
      { severity: "Severe", count: 8 },
      { severity: "Catastrophic", count: 3 },
    ],
  }
}

