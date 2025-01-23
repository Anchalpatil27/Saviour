'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CommunityForm() {
  const [supportType, setSupportType] = useState('offer')
  const [resourceType, setResourceType] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit support offer/request
    console.log({ supportType, resourceType, description })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Select value={supportType} onValueChange={setSupportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select support type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="offer">Offer Help</SelectItem>
              <SelectItem value="request">Request Help</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={resourceType} onValueChange={setResourceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select resource type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="shelter">Shelter</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="medical">Medical Supplies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="min-h-[100px]"
      />
      <Button type="submit" className="w-full sm:w-auto">Submit</Button>
    </form>
  )
}

