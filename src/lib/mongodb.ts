// This file remains unchanged - it's your core MongoDB connection logic
import mongoose from "mongoose"
import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Define types for global cache
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

interface MongoClientCache {
  conn: MongoClient | null
  promise: Promise<{ client: MongoClient; db: Db }> | null
}

// Properly augment the NodeJS global namespace
// Use a different approach to avoid duplicate declarations
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined
  // eslint-disable-next-line no-var
  var _mongoClientCache: MongoClientCache | undefined
  // eslint-disable-next-line no-var
  var _mongoDb: Db | null | undefined
}

// Initialize cache variables with different names to avoid conflicts
if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null }
}

if (!global._mongoClientCache) {
  global._mongoClientCache = { conn: null, promise: null }
}

if (global._mongoDb === undefined) {
  global._mongoDb = null
}

// Connect to MongoDB using Mongoose (for models)
export async function connectToDatabase() {
  if (global._mongooseCache?.conn) {
    return global._mongooseCache.conn
  }

  if (!global._mongooseCache?.promise) {
    const opts = {
      bufferCommands: false,
    }

    global._mongooseCache!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    global._mongooseCache!.conn = await global._mongooseCache!.promise
  } catch (e) {
    global._mongooseCache!.promise = null
    throw e
  }

  return global._mongooseCache!.conn
}

// Connect to MongoDB using native driver (for direct collection access)
export async function connectToMongoDB() {
  if (global._mongoClientCache?.conn && global._mongoDb) {
    return { client: global._mongoClientCache.conn, db: global._mongoDb }
  }

  if (!global._mongoClientCache?.promise) {
    const client = new MongoClient(MONGODB_URI!)
    global._mongoClientCache!.promise = client.connect().then((client) => {
      const db = client.db()
      return { client, db }
    })
  }

  try {
    const { client, db } = await global._mongoClientCache!.promise!
    global._mongoClientCache!.conn = client
    global._mongoDb = db
    return { client, db }
  } catch (e) {
    global._mongoClientCache!.promise = null
    throw e
  }
}

