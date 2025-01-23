'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function OfflineCommunication() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, message])
      setMessage('')
      // In a real implementation, this would use a mesh network or decentralized communication method
    }
  }

  return (
    <div className="space-y-4">
      <div className="h-[300px] overflow-y-auto border rounded p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">{msg}</div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  )
}

