import mongoose from "mongoose"

// Check for the environment variable, but don't throw an error immediately
const MONGODB_URI: string = process.env.MONGODB_URI || ""

// Define types for global cache
interface MongooseCache {
  conn: mongoose.Connection | null
  promise: Promise<mongoose.Mongoose> | null
}

// Properly augment the NodeJS global namespace
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache
}

// Initialize cache variables
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null }
}

async function dbConnect() {
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn.db
  }

  // Check for MONGODB_URI here, after the cached connection check
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
  }

  if (!global.mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    }

    global.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("Connected to MongoDB")
      return mongooseInstance
    })
  }

  try {
    const instance = await global.mongooseCache.promise
    global.mongooseCache.conn = instance.connection
    return instance.connection.db
  } catch (e) {
    global.mongooseCache.promise = null
    console.error("Error connecting to MongoDB:", e)
    throw e
  }
}

export default dbConnect

