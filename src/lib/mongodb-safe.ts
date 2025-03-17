// This file provides a safe way to use MongoDB in server components

// Import types only to avoid bundling issues
import type { Db, MongoClient, Document, Filter, FindOptions, UpdateFilter, OptionalUnlessRequiredId } from "mongodb"

// Define a type for the result of connectToMongoDB
interface MongoDBConnection {
  db: Db
  client: MongoClient
}

// Create a function that dynamically imports MongoDB only on the server
export async function safeConnectToMongoDB(): Promise<MongoDBConnection> {
  // Dynamic import to ensure MongoDB is only loaded on the server
  const { connectToMongoDB } = await import("./mongodb")
  return connectToMongoDB()
}

// Helper functions for common operations
export async function findOne<T extends Document>(
  collection: string,
  query: Filter<T>,
  projection?: Document,
): Promise<T | null> {
  const { db } = await safeConnectToMongoDB()
  // Use type assertion to fix the WithId<T> issue
  return db.collection<T>(collection).findOne(query, { projection }) as Promise<T | null>
}

export async function find<T extends Document>(
  collection: string,
  query: Filter<T>,
  options?: FindOptions<T>,
): Promise<T[]> {
  const { db } = await safeConnectToMongoDB()
  const cursor = db.collection<T>(collection).find(query, options)
  // Use type assertion to fix the WithId<T>[] issue
  return cursor.toArray() as Promise<T[]>
}

export async function countDocuments<T extends Document>(collection: string, query: Filter<T>): Promise<number> {
  const { db } = await safeConnectToMongoDB()
  return db.collection<T>(collection).countDocuments(query)
}

export async function insertOne<T extends Document>(
  collection: string,
  document: OptionalUnlessRequiredId<T>,
): Promise<any> {
  const { db } = await safeConnectToMongoDB()
  return db.collection<T>(collection).insertOne(document)
}

export async function updateOne<T extends Document>(
  collection: string,
  filter: Filter<T>,
  update: UpdateFilter<T>,
): Promise<any> {
  const { db } = await safeConnectToMongoDB()
  return db.collection<T>(collection).updateOne(filter, update)
}

export async function deleteOne<T extends Document>(collection: string, filter: Filter<T>): Promise<any> {
  const { db } = await safeConnectToMongoDB()
  return db.collection<T>(collection).deleteOne(filter)
}

