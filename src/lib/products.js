import { getDiscountedPrice } from "./format";

export const PRODUCT_CATEGORIES = [
  "STEM Toys",
  "Creative Play",
  "Puzzles",
  "Montessori",
  "Pretend Play",
  "Outdoor Fun",
];

export const normalizeProductPayload = (payload = {}) => {
  const title = String(payload.title || "").trim();
  const image = String(payload.image || "").trim();
  const gallery = Array.isArray(payload.gallery)
    ? payload.gallery.filter(Boolean)
    : String(payload.gallery || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
  const category = String(payload.category || "Educational Toys").trim();
  const ageRange = String(payload.ageRange || "3-6 years").trim();
  const description = String(payload.description || "").trim();
  const badge = String(payload.badge || "Featured").trim();
  const brand = String(payload.brand || "HeroKidz").trim();
  const stock = Number(payload.stock ?? 0);
  const price = Number(payload.price ?? 0);
  const discount = Number(payload.discount ?? 0);
  const ratings = Number(payload.ratings ?? 4.5);
  const reviews = Number(payload.reviews ?? 0);
  const sold = Number(payload.sold ?? 0);

  const info = Array.isArray(payload.info)
    ? payload.info.filter(Boolean)
    : String(payload.info || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

  const qna = Array.isArray(payload.qna)
    ? payload.qna.filter((item) => item?.question && item?.answer)
    : [];

  return {
    title,
    image,
    gallery: [image, ...gallery.filter((item) => item !== image)].slice(0, 6),
    category,
    ageRange,
    brand,
    description,
    badge,
    stock,
    price,
    discount,
    ratings,
    reviews,
    sold,
    info,
    qna,
    updatedAt: new Date().toISOString(),
  };
};

export const validateProductPayload = (payload) => {
  if (!payload.title) return "Product title is required.";
  if (!payload.image) return "Product image URL is required.";
  if (!payload.description) return "Product description is required.";
  if (Number.isNaN(payload.price) || payload.price <= 0) {
    return "Price must be greater than 0.";
  }
  if (Number.isNaN(payload.stock) || payload.stock < 0) {
    return "Stock cannot be negative.";
  }
  return null;
};

export const buildProductFilters = ({ query = "", category = "", minPrice = "", maxPrice = "", sort = "newest" } = {}) => {
  const mongoQuery = {};

  if (query?.trim()) {
    mongoQuery.$or = [
      { title: { $regex: query.trim(), $options: "i" } },
      { category: { $regex: query.trim(), $options: "i" } },
      { description: { $regex: query.trim(), $options: "i" } },
      { badge: { $regex: query.trim(), $options: "i" } },
    ];
  }

  if (category) mongoQuery.category = category;

  if (minPrice || maxPrice) {
    mongoQuery.price = {};
    if (minPrice) mongoQuery.price.$gte = Number(minPrice) || 0;
    if (maxPrice) mongoQuery.price.$lte = Number(maxPrice) || 0;
  }

  let sortBy = { createdAt: -1 };
  if (sort === "price-asc") sortBy = { price: 1 };
  if (sort === "price-desc") sortBy = { price: -1 };
  if (sort === "popular") sortBy = { sold: -1, ratings: -1 };
  if (sort === "rating") sortBy = { ratings: -1, reviews: -1 };

  return { mongoQuery, sortBy };
};

export const enrichProductMetrics = (product) => ({
  ...product,
  finalPrice: getDiscountedPrice(product.price, product.discount),
});
