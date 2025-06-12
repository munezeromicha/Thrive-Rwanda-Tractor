import mongoose from 'mongoose';

export const runtime = 'nodejs';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(() => {
        console.log('Connected to MongoDB');
        return cached;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Failed to establish MongoDB connection:', e);
    throw e;
  }

  // Handle connection errors
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    cached.conn = null;
    cached.promise = null;
  });

  // Handle disconnection
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    cached.conn = null;
    cached.promise = null;
  });

  return cached.conn;
}

// Fix issue with Next.js hot reloading by ensuring mongoose variable
// is properly declared on the global object
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  }
}

export default dbConnect;