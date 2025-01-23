import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, TrendingUp, PlusCircle, Eye, ThumbsUp } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export default async function ForumPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const recentThreads = [
    { title: "Emergency Kit Essentials", author: "Vikrant Kumar", replies: 23, views: 156, likes: 45 },
    { title: "Evacuation Plan Tips", author: "Gunti Ravi Kumar", replies: 17, views: 98, likes: 32 },
    { title: "Post-Disaster Recovery", author: "Harsh Kumar Palas", replies: 31, views: 203, likes: 67 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold">Community Forum</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Thread
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Recent Discussions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-4">
              {recentThreads.map((thread, index) => (
                <li key={index} className="flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{thread.title}</span>
                    <Badge variant="secondary" className="ml-2">{thread.replies} replies</Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Eye className="mr-1 h-3 w-3" /> {thread.views}
                    <ThumbsUp className="ml-2 mr-1 h-3 w-3" /> {thread.likes}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5" />
              Active Members
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-4">
              <li className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Vikrant Kumar" />
                  <AvatarFallback>VK</AvatarFallback>
                </Avatar>
                <span className="text-sm">Vikrant Kumar</span>
              </li>
              <li className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Gunti Ravi Kumar" />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <span className="text-sm">Gunti Ravi Kumar</span>
              </li>
              <li className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Harsh Kumar Palas" />
                  <AvatarFallback>HP</AvatarFallback>
                </Avatar>
                <span className="text-sm">Harsh Kumar Palas</span>
              </li>
              <li className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Anchal Siddharth Patil" />
                  <AvatarFallback>AP</AvatarFallback>
                </Avatar>
                <span className="text-sm">Anchal Siddharth Patil</span>
              </li>
              <li className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Himshri Vinod Sahare" />
                  <AvatarFallback>HS</AvatarFallback>
                </Avatar>
                <span className="text-sm">Himshri Vinod Sahare</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-5 w-5" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Badge variant="secondary" className="mr-2">#PreparednessTips</Badge>
                <span className="text-xs text-muted-foreground">1.2k posts</span>
              </li>
              <li className="flex items-center">
                <Badge variant="secondary" className="mr-2">#CommunityResilience</Badge>
                <span className="text-xs text-muted-foreground">876 posts</span>
              </li>
              <li className="flex items-center">
                <Badge variant="secondary" className="mr-2">#DisasterTech</Badge>
                <span className="text-xs text-muted-foreground">543 posts</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forum Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Be respectful and supportive of other community members.</li>
            <li>Share accurate information from reliable sources.</li>
            <li>Do not share personal information in public threads.</li>
            <li>Report any inappropriate content to moderators.</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Forum</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex space-x-2">
            <Input type="search" placeholder="Search topics or keywords" className="flex-grow" />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

