"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, Bell, Radio, RefreshCw, MapPin, Info, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchNewsData, type NewsItem, type EmergencyBroadcast } from "@/lib/actions/news-actions"

export function LocationBasedNews() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [newsData, setNewsData] = useState<{ news: NewsItem[]; broadcasts: EmergencyBroadcast[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSampleData, setIsSampleData] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const getLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log(`Got coordinates: ${latitude}, ${longitude}`)
          setCoordinates({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Use a default location if geolocation fails
          console.log("Using default coordinates")
          setCoordinates({ lat: 40.7128, lng: -74.006 }) // New York City coordinates
          setError(`Using default location. Original error: ${error.message}`)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      console.error("Geolocation not supported")
      // Use a default location if geolocation is not supported
      setCoordinates({ lat: 40.7128, lng: -74.006 }) // New York City coordinates
      setError("Geolocation is not supported by your browser. Using default location.")
    }
  }

  const loadNewsData = async () => {
    if (!coordinates) return

    try {
      setRefreshing(true)

      console.log(`Fetching news data for coordinates: ${coordinates.lat}, ${coordinates.lng}`)
      const result = await fetchNewsData(coordinates.lat, coordinates.lng)

      if (result.success) {
        // Sort news by date (most recent first)
        const sortedNews = [...result.data.news].sort((a, b) => {
          if (!a.date) return 1
          if (!b.date) return -1
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

        // Sort broadcasts by timestamp (most recent first)
        const sortedBroadcasts = [...result.data.broadcasts].sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })

        setNewsData({
          news: sortedNews,
          broadcasts: sortedBroadcasts,
        })
        setIsSampleData(!!result.data.isSampleData)
        console.log("Successfully loaded news data")

        if (result.error) {
          setError(result.error)
        } else {
          setError(null)
        }
      } else {
        console.error("Error from news data action:", result.error)
        setError(result.error || "Failed to fetch news data")
      }
    } catch (err) {
      console.error("Error loading news data:", err)
      setError("An unexpected error occurred while fetching news data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadNewsData()
  }

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    if (coordinates) {
      loadNewsData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates])

  if (loading) {
    return <NewsDataSkeleton />
  }

  // Filter broadcasts to only show those from the past 24 hours
  const filteredBroadcasts =
    newsData?.broadcasts?.filter((broadcast) => {
      const broadcastDate = new Date(broadcast.timestamp)
      const now = new Date()
      const timeDifference = now.getTime() - broadcastDate.getTime()
      const hoursDifference = timeDifference / (1000 * 60 * 60)
      return hoursDifference >= 0 && hoursDifference <= 24
    }) || []

  // Check if there are any active emergency broadcasts
  const hasActiveEmergencies = filteredBroadcasts.some((broadcast) => broadcast.isLive)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Local News & Updates</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Show sample data warning if applicable */}
      {isSampleData && (
        <Alert>
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>Showing sample data. This is not real news data for your location.</AlertDescription>
        </Alert>
      )}

      {/* Show error message if there is one, but we still have data */}
      {error && newsData && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add a note about the 50km radius */}
      <Alert>
        <AlertDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Showing news and updates within 50km of your current location
        </AlertDescription>
      </Alert>

      {/* Emergency Broadcasts Section - Show at the top when there are active emergencies */}
      {hasActiveEmergencies && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center text-red-700 dark:text-red-400">
              <Radio className="mr-2 h-5 w-5 text-red-500 animate-pulse" />
              Active Emergency Broadcasts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBroadcasts.length > 0 ? (
              <>
                {filteredBroadcasts
                  .filter((broadcast) => broadcast.isLive)
                  .map((broadcast) => (
                    <div
                      key={broadcast.id}
                      className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg mb-4 border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Radio className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 animate-pulse mr-2" />
                          <p className="text-xs sm:text-sm font-semibold">LIVE: {broadcast.title}</p>
                        </div>
                        <Badge
                          variant={
                            broadcast.urgency === "High"
                              ? "destructive"
                              : broadcast.urgency === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {broadcast.urgency}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm mt-2">{broadcast.message}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>Source: {broadcast.source}</span>
                        <span>{new Date(broadcast.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <div className="text-center py-6">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No emergency broadcasts in the last 24 hours</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The area is currently clear of emergency situations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* News Items Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {newsData?.news.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Newspaper className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {item.title}
                </span>
                <Badge
                  variant={
                    item.category === "Alert" ? "destructive" : item.category === "Update" ? "default" : "secondary"
                  }
                >
                  {item.category}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Source: {item.source}</p>
                {item.summary && <p className="text-sm mb-2">{item.summary}</p>}
                {item.date && <p className="text-xs text-gray-500 mb-2">Date: {item.date}</p>}
                {item.distance && (
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Distance: {item.distance}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {(!newsData?.news || newsData.news.length === 0) && (
          <div className="md:col-span-2">
            <Card className="p-6">
              <div className="text-center">
                <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No News Available</h3>
                <p className="text-muted-foreground">No recent news items found within 50km of your location.</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* All Emergency Broadcasts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Emergency Broadcasts</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBroadcasts.length > 0 ? (
            <>
              {filteredBroadcasts.map((broadcast) => (
                <div key={broadcast.id} className="bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {broadcast.isLive ? (
                        <Radio className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 animate-pulse mr-2" />
                      ) : (
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      )}
                      <p className="text-xs sm:text-sm font-semibold">
                        {broadcast.isLive ? "LIVE: " : ""}
                        {broadcast.title}
                      </p>
                    </div>
                    <Badge
                      variant={
                        broadcast.urgency === "High"
                          ? "destructive"
                          : broadcast.urgency === "Medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {broadcast.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm mt-2">{broadcast.message}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>Source: {broadcast.source}</span>
                    <span>{new Date(broadcast.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-6">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No emergency broadcasts in the last 24 hours</p>
              <p className="text-xs text-muted-foreground mt-1">The area is currently clear of emergency situations.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function NewsDataSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Local News & Updates</h2>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

