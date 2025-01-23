'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DetailedResourceManagement() {
  const [resources, setResources] = useState([
    { id: 1, name: 'Water', quantity: 1000, unit: 'liters' },
    { id: 2, name: 'Food', quantity: 500, unit: 'kg' },
    { id: 3, name: 'Medical Supplies', quantity: 100, unit: 'kits' },
  ])

  const [newResource, setNewResource] = useState<{ name: string; quantity: number; unit: string }>({ name: '', quantity: 0, unit: '' })

  const addResource = () => {
    if (newResource.name && newResource.quantity && newResource.unit) {
      setResources([...resources, { id: Date.now(), ...newResource }])
      setNewResource({ name: '', quantity: 0, unit: '' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Resource Management</CardTitle>
        <CardDescription>Track and manage available resources</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.name}</TableCell>
                <TableCell>{resource.quantity}</TableCell>
                <TableCell>{resource.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 space-y-2">
          <Label htmlFor="resource-name">Add New Resource</Label>
          <Input
            id="resource-name"
            placeholder="Resource Name"
            value={newResource.name}
            onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newResource.quantity}
            onChange={(e) => setNewResource({ ...newResource, quantity: Number(e.target.value) })}
          />
          <Input
            placeholder="Unit"
            value={newResource.unit}
            onChange={(e) => setNewResource({ ...newResource, unit: e.target.value })}
          />
          <Button onClick={addResource}>Add Resource</Button>
        </div>
      </CardContent>
    </Card>
  )
}

