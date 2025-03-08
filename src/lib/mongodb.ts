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
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache
  // eslint-disable-next-line no-var
  var mongoClientCache: MongoClientCache
  // eslint-disable-next-line no-var
  var mongoDb: Db | null
}

// Initialize cache variables
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null }
}

if (!global.mongoClientCache) {
  global.mongoClientCache = { conn: null, promise: null }
}

if (global.mongoDb === undefined) {
  global.mongoDb = null
}

// Connect to MongoDB using Mongoose (for models)
export async function connectToDatabase() {
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn
  }

  if (!global.mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    }

    global.mongooseCache.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise
  } catch (e) {
    global.mongooseCache.promise = null
    throw e
  }

  return global.mongooseCache.conn
}

// Connect to MongoDB using native driver (for direct collection access)
export async function connectToMongoDB() {
  if (global.mongoClientCache.conn && global.mongoDb) {
    return { client: global.mongoClientCache.conn, db: global.mongoDb }
  }

  if (!global.mongoClientCache.promise) {
    const client = new MongoClient(MONGODB_URI!)
    global.mongoClientCache.promise = client.connect().then((client) => {
      const db = client.db()
      return { client, db }
    })
  }

  try {
    const { client, db } = await global.mongoClientCache.promise
    global.mongoClientCache.conn = client
    global.mongoDb = db
    return { client, db }
  } catch (e) {
    global.mongoClientCache.promise = null
    throw e
  }
}

