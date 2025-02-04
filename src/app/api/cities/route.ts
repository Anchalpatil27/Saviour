import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import City from "@/models/City"

export async function GET() {
  await dbConnect()
  const cities = await City.find({}).sort("name")
  return NextResponse.json(cities)
}

