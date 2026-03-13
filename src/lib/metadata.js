export const defaultMetadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "HeroKidz | Premium Kids Learning Store",
    template: "%s | HeroKidz",
  },
  description:
    "HeroKidz is a premium, portfolio-grade ecommerce storefront for smart learning toys built with Next.js, MongoDB, NextAuth, and TailwindCSS.",
  keywords: ["Next.js ecommerce", "MongoDB store", "NextAuth", "educational toys", "portfolio project"],
  openGraph: {
    title: "HeroKidz | Premium Kids Learning Store",
    description: "Production-style toy ecommerce platform with admin dashboard, cart, orders, reviews, and wishlist.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeroKidz | Premium Kids Learning Store",
    description: "Production-style toy ecommerce platform with admin dashboard, cart, orders, reviews, and wishlist.",
  },
};
