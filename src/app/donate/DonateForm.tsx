'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DonateForm() {
  const [oneTimeAmount, setOneTimeAmount] = useState('')
  const [monthlyAmount, setMonthlyAmount] = useState('')

  const handleOneTimeAmountClick = (amount: string) => {
    setOneTimeAmount(amount)
  }

  const handleMonthlyAmountClick = (amount: string) => {
    setMonthlyAmount(amount)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>One-Time Donation</CardTitle>
          <CardDescription>Make a single contribution to our cause</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {['10', '25', '50', '100'].map((amount) => (
              <Button 
                key={amount} 
                variant={oneTimeAmount === amount ? "default" : "outline"}
                onClick={() => handleOneTimeAmountClick(amount)}
              >
                ${amount}
              </Button>
            ))}
          </div>
          <div>
            <Label htmlFor="custom-amount">Custom Amount</Label>
            <Input 
              id="custom-amount" 
              placeholder="Enter amount" 
              type="number" 
              min="1" 
              step="1"
              value={oneTimeAmount}
              onChange={(e) => setOneTimeAmount(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Donate Now</Button>
        </CardFooter>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Monthly Donation</CardTitle>
          <CardDescription>Become a regular supporter</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {['5', '10', '20', '50'].map((amount) => (
              <Button 
                key={amount} 
                variant={monthlyAmount === amount ? "default" : "outline"}
                onClick={() => handleMonthlyAmountClick(amount)}
              >
                ${amount}/mo
              </Button>
            ))}
          </div>
          <div>
            <Label htmlFor="custom-monthly">Custom Monthly Amount</Label>
            <Input 
              id="custom-monthly" 
              placeholder="Enter amount" 
              type="number" 
              min="1" 
              step="1"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Start Monthly Donation</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

