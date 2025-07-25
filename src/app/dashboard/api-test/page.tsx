"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, RefreshCw, Globe } from "lucide-react"

export default function ApiTestPage() {
  const [loading, setLoading] = useState(false)
  const [clientResult, setClientResult] = useState<any>(null)
  const [serverResult, setServerResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Client-side test
  const testClientKey = async () => {
    setLoading(true)
    setError(null)
    setClientResult(null)
    try {
      const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!key) throw new Error("NEXT_PUBLIC_GEMINI_API_KEY not found in environment variables.")
      const prompt = "Say hello from Gemini API (client test)"
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      )
      const data = await response.json()
      setClientResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Server-side test (calls your Next.js API route)
  const testServerKey = async () => {
    setLoading(true)
    setError(null)
    setServerResult(null)
    try {
      const response = await fetch("/api/test-gemini")
      const data = await response.json()
      setServerResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <h2 className="text-2xl font-bold">Gemini API Key Test</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={testClientKey}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <Globe className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Testing..." : "Test Client Key"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={testServerKey}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Testing..." : "Test Server Key"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client-Side Test Result</CardTitle>
          </CardHeader>
          <CardContent>
            {clientResult ? (
              <div className="space-y-2">
                <Alert variant={clientResult?.candidates ? "default" : "destructive"} className="bg-opacity-20">
                  {clientResult?.candidates ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  <AlertDescription>
                    {clientResult?.candidates
                      ? "Client-side Gemini API key is working!"
                      : `Client-side test failed: ${clientResult?.error?.message || JSON.stringify(clientResult)}`}
                  </AlertDescription>
                </Alert>
                <div className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-40">
                  <pre>{JSON.stringify(clientResult, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Click &quot;Test Client Key&quot; to test Gemini API from browser.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Server-Side Test Result</CardTitle>
          </CardHeader>
          <CardContent>
            {serverResult ? (
              <div className="space-y-2">
                <Alert variant={serverResult?.success ? "default" : "destructive"} className="bg-opacity-20">
                  {serverResult?.success ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  <AlertDescription>
                    {serverResult?.success
                      ? "Server-side Gemini API key is working!"
                      : `Server-side test failed: ${serverResult?.error || JSON.stringify(serverResult)}`}
                  </AlertDescription>
                </Alert>
                <div className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-40">
                  <pre>{JSON.stringify(serverResult, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Click &quot;Test Server Key&quot; to test Gemini API from backend.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Common API Key Issues</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>MakerSuite keys:</strong> Only work from browser, not server-side.
                </li>
                <li>
                  <strong>Google Cloud keys:</strong> Needed for server-side requests.
                </li>
                <li>
                  <strong>Origin restrictions:</strong> MakerSuite keys may not work from localhost or custom domains.
                </li>
                <li>
                  <strong>Whitespace or quotes:</strong> Make sure your API key doesn't have any extra spaces, tabs, or quotes.
                </li>
                <li>
                  <strong>Billing:</strong> Check if your Google Cloud billing is set up correctly.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">How to Fix</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  For <strong>client-side</strong>: Use MakerSuite key and call Gemini API directly from browser.
                </li>
                <li>
                  For <strong>server-side</strong>: Use Google Cloud key, enable Gemini API, and set up billing.
                </li>
                <li>
                  If testing locally, try deploying to Vercel/Netlify for production domain.
                </li>
                <li>
                  Always copy the key directly, no spaces or quotes.
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}