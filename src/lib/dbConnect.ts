import mongoose from "mongoose"

// Check for the environment variable, but don't throw an error immediately
const MONGODB_URI: string = process.env.MONGODB_URI || ""

// Define types for global cache - use a different name to avoid conflicts
interface DbConnectCache {
  conn: mongoose.Connection | null
  promise: Promise<mongoose.Mongoose> | null
}

// Properly augment the NodeJS global namespace
declare global {
  // eslint-disable-next-line no-var
  var _dbConnectCache: DbConnectCache | undefined
}

// Initialize cache variables
if (!global._dbConnectCache) {
  global._dbConnectCache = { conn: null, promise: null }
}

async function dbConnect() {
  if (global._dbConnectCache?.conn) {
    return global._dbConnectCache.conn.db
  }

  // Check for MONGODB_URI here, after the cached connection check
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
  }

  if (!global._dbConnectCache?.promise) {
    const opts = {
      bufferCommands: false,
    }

    global._dbConnectCache!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("Connected to MongoDB")
      return mongooseInstance
    })
  }

  try {
    const instance = await global._dbConnectCache!.promise
    global._dbConnectCache!.conn = instance.connection
    return instance.connection.db
  } catch (e) {
    global._dbConnectCache!.promise = null
    console.error("Error connecting to MongoDB:", e)
    throw e
  }
}

export default dbConnect

