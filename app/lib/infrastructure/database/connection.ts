import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/altum-legal';

let client: MongoClient | null = null;

export async function connectToDatabase() {
  try {
    // For Mongoose operations
    if (mongoose.connection.readyState >= 1) {
      // Also ensure MongoDB client is connected
      if (!client) {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
      }
      
      const db = client.db();
      return { connection: mongoose.connection, db, client };
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: true,
    };

    // Connect both Mongoose and MongoDB client
    await mongoose.connect(MONGODB_URI, options);
    
    if (!client) {
      client = new MongoClient(MONGODB_URI);
      await client.connect();
    }
    
    const db = client.db();
    
    console.log('✅ Successfully connected to MongoDB');
    return { connection: mongoose.connection, db, client };
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    if (client) {
      await client.close();
      client = null;
    }
    console.log('✅ Successfully disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
    throw error;
  }
}