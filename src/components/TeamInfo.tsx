import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const teamMembers = [
  { name: "Jane Doe", role: "Founder & CEO", avatar: "/placeholder.svg?height=96&width=96" },
  { name: "John Smith", role: "CTO", avatar: "/placeholder.svg?height=96&width=96" },
  { name: "Alice Johnson", role: "Head of Operations", avatar: "/placeholder.svg?height=96&width=96" },
]

export function TeamInfo() {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-2">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

