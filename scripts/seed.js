const bcrypt = require('bcryptjs');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const toys = require('../src/data/toys.json');

const MONGODB_URI = process.env.MONGODB_URI;
const DBNAME = process.env.DBNAME || 'HeroKidz_DB';

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Please set env vars before running the seed script.');
  process.exit(1);
}

const validImages = [
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
];

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async () => {
  try {
    await client.connect();
    const db = client.db(DBNAME);

    const users = db.collection('users');
    const products = db.collection('products');
    const cart = db.collection('cart');
    const orders = db.collection('orders');
    const reviews = db.collection('reviews');
    const wishlist = db.collection('wishlist');

    await Promise.all([
      users.deleteMany({}),
      products.deleteMany({}),
      cart.deleteMany({}),
      orders.deleteMany({}),
      reviews.deleteMany({}),
      wishlist.deleteMany({}),
    ]);

    // await Promise.all([
    //   users.createIndex({ email: 1 }, { unique: true }),
    //   products.createIndex({ title: 'text', category: 'text', description: 'text' }),
    //   cart.createIndex({ email: 1, productId: 1 }, { unique: true }),
    //   orders.createIndex({ userEmail: 1, createdAt: -1 }),
    //   reviews.createIndex({ productId: 1, email: 1 }, { unique: true }),
    //   wishlist.createIndex({ email: 1, productId: 1 }, { unique: true }),
    // ]);

    await Promise.all([
      users.createIndex({ email: 1 }, { unique: true }),
      products.createIndex({ category: 1 }),
      products.createIndex({ price: 1 }),
      products.createIndex({ createdAt: -1 }),
      cart.createIndex({ email: 1, productId: 1 }, { unique: true }),
      orders.createIndex({ userEmail: 1, createdAt: -1 }),
      reviews.createIndex({ productId: 1, email: 1 }, { unique: true }),
      wishlist.createIndex({ email: 1, productId: 1 }, { unique: true }),
    ]);

    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const userPassword = await bcrypt.hash('User1234!', 12);

    const seededUsers = [
      {
        name: 'HeroKidz Admin',
        email: 'admin@herokidz.demo',
        password: adminPassword,
        provider: 'credentials',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        name: 'Portfolio User',
        email: 'user@herokidz.demo',
        password: userPassword,
        provider: 'credentials',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await users.insertMany(seededUsers);

    const seededProducts = toys.map((toy, index) => ({
      ...toy,
      image: validImages[index % validImages.length],
      gallery: [validImages[index % validImages.length], validImages[(index + 1) % validImages.length], validImages[(index + 2) % validImages.length]],
      category: ['STEM Toys', 'Creative Play', 'Montessori', 'Puzzles'][index % 4],
      ageRange: index % 2 === 0 ? '3-6 years' : '4-8 years',
      brand: index % 2 === 0 ? 'HeroKidz Lab' : 'BrightNest',
      stock: 8 + index * 2,
      badge: index < 3 ? 'Featured' : 'Popular',
      featured: index < 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const productInsert = await products.insertMany(seededProducts);
    const insertedIds = Object.values(productInsert.insertedIds);

    const cartItems = [
      {
        productId: insertedIds[0],
        email: 'user@herokidz.demo',
        title: seededProducts[0].title,
        image: seededProducts[0].image,
        quantity: 2,
        unitPrice: seededProducts[0].price,
        price: seededProducts[0].price - (seededProducts[0].price * seededProducts[0].discount) / 100,
        username: 'Portfolio User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        productId: insertedIds[1],
        email: 'user@herokidz.demo',
        title: seededProducts[1].title,
        image: seededProducts[1].image,
        quantity: 1,
        unitPrice: seededProducts[1].price,
        price: seededProducts[1].price - (seededProducts[1].price * seededProducts[1].discount) / 100,
        username: 'Portfolio User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await cart.insertMany(cartItems);

    const orderId = new ObjectId();
    await orders.insertOne({
      _id: orderId,
      name: 'Portfolio User',
      email: 'user@herokidz.demo',
      userEmail: 'user@herokidz.demo',
      contact: '01700000000',
      address: 'Khulna, Bangladesh',
      instruction: 'Please call before delivery.',
      items: cartItems.map((item) => ({
        ...item,
        _id: new ObjectId().toString(),
        productId: item.productId.toString(),
      })),
      totalItems: 3,
      totalPrice: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'processing',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await reviews.insertMany([
      {
        productId: insertedIds[0].toString(),
        email: 'user@herokidz.demo',
        userName: 'Portfolio User',
        rating: 5,
        title: 'Great build quality',
        message: 'The toy feels durable and the child engagement level is excellent.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        productId: insertedIds[1].toString(),
        email: 'admin@herokidz.demo',
        userName: 'HeroKidz Admin',
        rating: 4,
        title: 'Strong educational value',
        message: 'Nice design, clear instructions, and good replay value for kids.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    await wishlist.insertOne({
      email: 'user@herokidz.demo',
      productId: insertedIds[2],
      title: seededProducts[2].title,
      image: seededProducts[2].image,
      category: seededProducts[2].category,
      price: seededProducts[2].price,
      discount: seededProducts[2].discount,
      createdAt: new Date().toISOString(),
    });

    await products.updateOne({ _id: insertedIds[0] }, { $set: { ratings: 5, reviews: 1 } });
    await products.updateOne({ _id: insertedIds[1] }, { $set: { ratings: 4, reviews: 1 } });

    console.log('Seed completed successfully.');
    console.log('Admin login: admin@herokidz.demo / Admin123!');
    console.log('User login: user@herokidz.demo / User1234!');
    console.log(`Demo order id: ${orderId.toString()}`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
})();
