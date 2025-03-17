// This file provides a safe way to use MongoDB in server components

// Import types only to avoid bundling issues
import type { Db, MongoClient } from "mongodb"

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
export async function findOne(collection: string, query: any, projection?: any): Promise<any> {
  const { db } = await safeConnectToMongoDB()
  return db.collection(collection).findOne(query, { projection })
}

export async function find(collection: string, query: any, options?: any): Promise<any[]> {
  const { db } = await safeConnectToMongoDB()
  const cursor = db.collection(collection).find(query, options)
  return cursor.toArray()
}

export async function countDocuments(collection: string, query: any): Promise<number> {
  const { db } = await safeConnectToMongoDB()
  return db.collection(collection).countDocuments(query)
}

export async function insertOne(collection: string, document: any): Promise<any> {
  const { db } = await safeConnectToMongoDB()
  return db.collection(collection).insertOne(document)
}

export async function updateOne(collection: string, filter: any, update: any): Promise<any> {
  const { db } = await safeConnectToMongoDB()
  return db.collection(collection).updateOne(filter, update)
}

export async function deleteOne(collection: string, filter: any): Promise<any> {
  const { db } = await safeConnectToMongoDB()
  return db.collection(collection).deleteOne(filter)
}

