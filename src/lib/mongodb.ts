import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URL || process.env.MONGO_URl;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

if (!uri) {
  throw new Error("MONGO_URL (ou MONGO_URl) est requis pour accéder à la base.");
}

export async function getDatabase(): Promise<Db> {
  if (cachedDb && cachedClient) {
    return cachedDb;
  }

  const client = new MongoClient(uri);
  await client.connect();

  const dbName = process.env.MONGO_DB_NAME || "beatmakerz";
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;
  return db;
}
