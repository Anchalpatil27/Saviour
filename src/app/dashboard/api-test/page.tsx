"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

export default function ApiTestPage() {
  const [loading, setLoading] = useState(false)
  const [keyInfo, setKeyInfo] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkApiKey = async () => {
    setLoading(true)
    setError(null)

    try {
      // First check the key info
      const keyResponse = await fetch("/api/debug/gemini-key")
      const keyData = await keyResponse.json()
      setKeyInfo(keyData)

      // Then test the API
      const testResponse = await fetch("/api/test-gemini")
      const testData = await testResponse.json()
      setTestResult(testData)
    } catch (err) {
      console.error("API test failed:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gemini API Key Test</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={checkApiKey}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Testing..." : "Test API Key"}
        </Button>
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
            <CardTitle>API Key Information</CardTitle>
          </CardHeader>
          <CardContent>
            {keyInfo ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Key Exists:</span>
                  <span>{keyInfo.keyExists ? "✅ Yes" : "❌ No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Key Length:</span>
                  <span>{keyInfo.keyLength} characters</span>
                </div>
                <div className="flex justify-between">
                  <span>Key Preview:</span>
                  <span>
                    {keyInfo.keyFirstFour}...{keyInfo.keyLastFour}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Has Whitespace:</span>
                  <span>{keyInfo.hasWhitespace ? "⚠️ Yes" : "✅ No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Has Quotes:</span>
                  <span>{keyInfo.hasQuotes ? "⚠️ Yes" : "✅ No"}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Click "Test API Key" to check your Gemini API key.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Test Result</CardTitle>
          </CardHeader>
          <CardContent>
            {testResult ? (
              <div className="space-y-4">
                <Alert variant={testResult.success ? "default" : "destructive"} className="bg-opacity-20">
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  <AlertDescription>
                    {testResult.success ? "API key is working correctly!" : "API key test failed."}
                  </AlertDescription>
                </Alert>

                <div className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-40">
                  <pre>{JSON.stringify(testResult, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No test results yet. Click "Test API Key" to test the Gemini API.
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
                  <strong>Whitespace or quotes:</strong> Make sure your API key doesn't have any extra spaces, tabs, or
                  quotes around it.
                </li>
                <li>
                  <strong>Incorrect key:</strong> Verify you're using the correct API key from Google AI Studio.
                </li>
                <li>
                  <strong>Key not active:</strong> Ensure your API key is active and hasn't been revoked.
                </li>
                <li>
                  <strong>API access:</strong> Make sure your Google Cloud project has the Gemini API enabled.
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
                  Go to{" "}
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google AI Studio
                  </a>{" "}
                  and create a new API key
                </li>
                <li>Copy the key directly without adding any spaces or quotes</li>
                <li>In your Vercel project, go to Settings → Environment Variables</li>
                <li>Update the GEMINI_API_KEY value with the new key</li>
                <li>Redeploy your application</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

