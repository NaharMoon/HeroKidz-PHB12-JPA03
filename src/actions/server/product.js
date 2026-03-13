"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { collections, dbConnect, ensureDatabaseIndexes } from "@/lib/dbConnect";
import { buildProductFilters, enrichProductMetrics, normalizeProductPayload, PRODUCT_CATEGORIES, validateProductPayload } from "@/lib/products";
import { requireAdmin } from "@/lib/auth";

const serializeProduct = (product) =>
  enrichProductMetrics({
    ...product,
    _id: product._id.toString(),
  });

export const getProductCategories = async () => {
  try {
    await ensureDatabaseIndexes();
    const productsCollection = await dbConnect(collections.PRODUCTS);
    const categories = await productsCollection.distinct("category");
    return [...new Set([...PRODUCT_CATEGORIES, ...categories.filter(Boolean)])];
  } catch {
    return PRODUCT_CATEGORIES;
  }
};

export const getProducts = async ({ featuredOnly = false } = {}) => {
  try {
    await ensureDatabaseIndexes();
    const productsCollection = await dbConnect(collections.PRODUCTS);
    const query = featuredOnly ? { featured: true } : {};
    const products = await productsCollection.find(query).sort({ createdAt: -1 }).toArray();
    return products.map(serializeProduct);
  } catch (error) {
    console.log("Product fetch failed:", error.message);
    return [];
  }
};

export const getProductsCatalog = async ({
  query = "",
  category = "",
  minPrice = "",
  maxPrice = "",
  sort = "newest",
  page = 1,
  limit = 9,
} = {}) => {
  try {
    await ensureDatabaseIndexes();
    const productsCollection = await dbConnect(collections.PRODUCTS);
    const { mongoQuery, sortBy } = buildProductFilters({ query, category, minPrice, maxPrice, sort });
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.max(Number(limit) || 9, 1);

    const [total, products] = await Promise.all([
      productsCollection.countDocuments(mongoQuery),
      productsCollection.find(mongoQuery).sort(sortBy).skip((safePage - 1) * safeLimit).limit(safeLimit).toArray(),
    ]);

    return {
      products: products.map(serializeProduct),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1),
    };
  } catch (error) {
    console.log("Catalog fetch failed:", error.message);
    return { products: [], total: 0, page: 1, limit, totalPages: 1 };
  }
};

export const getSingleProduct = async (id) => {
  try {
    await ensureDatabaseIndexes();
    if (!ObjectId.isValid(id)) return null;
    const products = await dbConnect(collections.PRODUCTS);
    const reviews = await dbConnect(collections.REVIEWS);
    const product = await products.findOne({ _id: new ObjectId(id) });
    if (!product) return null;

    const reviewList = await reviews.find({ productId: id }).sort({ createdAt: -1 }).limit(8).toArray();
    const reviewStats = await reviews
      .aggregate([
        { $match: { productId: id } },
        { $group: { _id: "$productId", averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
      ])
      .toArray();

    const stats = reviewStats[0];
    return serializeProduct({
      ...product,
      ratings: stats?.averageRating ? Number(stats.averageRating.toFixed(1)) : product.ratings || 4.5,
      reviews: stats?.totalReviews || product.reviews || 0,
      reviewList: reviewList.map((item) => ({ ...item, _id: item._id.toString() })),
    });
  } catch (error) {
    console.log("Single product fetch failed:", error.message);
    return null;
  }
};

export const getRelatedProducts = async (product, limit = 4) => {
  try {
    if (!product?._id) return [];
    const products = await dbConnect(collections.PRODUCTS);
    const result = await products
      .find({ category: product.category, _id: { $ne: new ObjectId(product._id) } })
      .sort({ sold: -1, ratings: -1 })
      .limit(limit)
      .toArray();
    return result.map(serializeProduct);
  } catch {
    return [];
  }
};

export const getSearchSuggestions = async (query) => {
  if (!query?.trim()) return [];
  const products = await dbConnect(collections.PRODUCTS);
  const result = await products
    .find({ title: { $regex: query.trim(), $options: "i" } })
    .project({ title: 1, category: 1 })
    .limit(5)
    .toArray();
  return result.map((item) => ({ id: item._id.toString(), title: item.title, category: item.category }));
};

export const createProduct = async (payload) => {
  await requireAdmin();
  await ensureDatabaseIndexes();
  const products = await dbConnect(collections.PRODUCTS);
  const normalized = normalizeProductPayload(payload);
  const error = validateProductPayload(normalized);
  if (error) return { success: false, message: error };

  const result = await products.insertOne({
    ...normalized,
    featured: payload?.featured === true || payload?.featured === "on",
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/dashboard/products");

  return { success: result.acknowledged, insertedId: result.insertedId?.toString() };
};

export const updateProduct = async (id, payload) => {
  await requireAdmin();
  if (!ObjectId.isValid(id)) return { success: false, message: "Invalid product id." };

  const normalized = normalizeProductPayload(payload);
  const error = validateProductPayload(normalized);
  if (error) return { success: false, message: error };

  const products = await dbConnect(collections.PRODUCTS);
  const result = await products.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...normalized,
        featured: payload?.featured === true || payload?.featured === "on",
      },
    }
  );

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/dashboard/products");

  return { success: Boolean(result.matchedCount) };
};

export const deleteProduct = async (id) => {
  await requireAdmin();
  if (!ObjectId.isValid(id)) return { success: false, message: "Invalid product id." };
  const products = await dbConnect(collections.PRODUCTS);
  const result = await products.deleteOne({ _id: new ObjectId(id) });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/dashboard/products");

  return { success: Boolean(result.deletedCount) };
};
