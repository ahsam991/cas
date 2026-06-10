import { MongoClient, ServerApiVersion } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

if (mongoUri) {
  const client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  clientPromise = global._mongoClientPromise ?? client.connect();

  if (process.env.NODE_ENV !== "production") {
    global._mongoClientPromise = clientPromise;
  }
}

export function getMongoClientPromise() {
  if (!clientPromise) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  return clientPromise;
}