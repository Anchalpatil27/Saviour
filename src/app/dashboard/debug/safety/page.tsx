"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

export default function SafetyApiTestPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testSafetyApi = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/safety-api")

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error("Safety API test failed:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testSafetyApi()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Safety API Test</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={testSafetyApi}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Testing..." : "Test Safety API"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>API Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-muted-foreground">Testing Safety API...</p>
              </div>
            </div>
          ) : results ? (
            <div className="space-y-4">
              <Alert variant={results.success ? "default" : "destructive"} className="bg-opacity-20">
                {results.success ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                <AlertDescription>
                  {results.success ? "API key test completed" : "API key test failed"}
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">API Key Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>API Key Length:</span>
                      <span>{results.apiKeyLength || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Key Preview:</span>
                      <span>{results.apiKeyPreview || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Test Message</h3>
                  <p className="text-sm">{results.message || "No message"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Endpoint Results</h3>
                {results.results?.map((result: any, index: number) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{result.endpoint.split("/").pop()}</span>
                      <Badge variant={result.success ? "success" : "destructive"}>{result.status}</Badge>
                    </div>
                    <div className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-40">
                      <pre>{result.response || result.error || "No response"}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No test results yet. Click "Test Safety API" to test the Gemini API for safety features.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Simple Badge component since we're not importing it
function Badge({ children, variant }: { children: React.ReactNode; variant: "success" | "destructive" }) {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        variant === "success"
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {children}
    </span>
  )
}

