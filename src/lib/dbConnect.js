import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbname = process.env.DBNAME || "HeroKidz_DB";

export const collections = {
  PRODUCTS: "products",
  USERS: "users",
  CART: "cart",
  ORDERS: "orders",
  REVIEWS: "reviews",
  WISHLIST: "wishlist",
};

if (!uri) {
  console.warn("MONGODB_URI is not defined. Database features will be unavailable until env vars are set.");
}

const globalForMongo = globalThis;
let client = globalForMongo.__heroKidzMongoClient;
let indexesReady = globalForMongo.__heroKidzIndexesReady || false;

if (!client && uri) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  globalForMongo.__heroKidzMongoClient = client;
}

export const getDb = async () => {
  if (!client) {
    throw new Error("MongoDB client is not configured. Please set MONGODB_URI.");
  }

  await client.connect();
  return client.db(dbname);
};

export const dbConnect = async (cname) => {
  const db = await getDb();
  return db.collection(cname);
};

export const ensureDatabaseIndexes = async () => {
  if (indexesReady) return;
  const db = await getDb();

  // await Promise.all([
  //   db.collection(collections.USERS).createIndex({ email: 1 }, { unique: true }),
  //   db.collection(collections.PRODUCTS).createIndex({ title: "text", category: "text", description: "text" }),
  //   db.collection(collections.PRODUCTS).createIndex({ category: 1, createdAt: -1 }),
  //   db.collection(collections.CART).createIndex({ email: 1, productId: 1 }, { unique: true }),
  //   db.collection(collections.ORDERS).createIndex({ userEmail: 1, createdAt: -1 }),
  //   db.collection(collections.ORDERS).createIndex({ status: 1, createdAt: -1 }),
  //   db.collection(collections.REVIEWS).createIndex({ productId: 1, createdAt: -1 }),
  //   db.collection(collections.REVIEWS).createIndex({ productId: 1, email: 1 }, { unique: true }),
  //   db.collection(collections.WISHLIST).createIndex({ email: 1, productId: 1 }, { unique: true }),
  // ]);

  await Promise.all([
    db.collection(collections.USERS).createIndex({ email: 1 }, { unique: true }),

    db.collection(collections.PRODUCTS).createIndex({ category: 1 }),
    db.collection(collections.PRODUCTS).createIndex({ price: 1 }),
    db.collection(collections.PRODUCTS).createIndex({ createdAt: -1 }),
    db.collection(collections.PRODUCTS).createIndex({ category: 1, createdAt: -1 }),

    db.collection(collections.CART).createIndex({ email: 1, productId: 1 }, { unique: true }),

    db.collection(collections.ORDERS).createIndex({ userEmail: 1, createdAt: -1 }),
    db.collection(collections.ORDERS).createIndex({ status: 1, createdAt: -1 }),

    db.collection(collections.REVIEWS).createIndex({ productId: 1, createdAt: -1 }),
    db.collection(collections.REVIEWS).createIndex({ productId: 1, email: 1 }, { unique: true }),

    db.collection(collections.WISHLIST).createIndex({ email: 1, productId: 1 }, { unique: true }),
  ]);

  indexesReady = true;
  globalForMongo.__heroKidzIndexesReady = true;
};
