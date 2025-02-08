import { MongoClient } from "mongodb"

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {
  // Add these options to handle MongoDB connection in Next.js environment
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

// Export a module-scoped MongoClient promise
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  const client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a wrapped function to handle MongoDB operations
export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("test")
    return { client, db }
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw new Error("Unable to connect to database")
  }
}

// Export the promisified connection for direct usage
export default clientPromise

