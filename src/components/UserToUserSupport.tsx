'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function UserToUserSupport() {
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
      <Select value={supportType} onValueChange={setSupportType}>
        <SelectTrigger>
          <SelectValue placeholder="Select support type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="offer">Offer Help</SelectItem>
          <SelectItem value="request">Request Help</SelectItem>
        </SelectContent>
      </Select>
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
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}

