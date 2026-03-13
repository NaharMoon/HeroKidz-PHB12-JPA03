import Link from "next/link";
import { FiBookOpen, FiShield, FiTruck, FiSmile } from "react-icons/fi";
import Banner from "@/components/home/Banner";
import Products from "@/components/home/Products";

const categories = [
  { title: "STEM Discovery", copy: "Logic kits, science playsets, and hands-on puzzles for growing thinkers.", href: "/products?category=STEM%20Toys" },
  { title: "Creative Play", copy: "Drawing, building, pretend play, and imagination-led activities.", href: "/products?category=Creative%20Play" },
  { title: "Montessori Picks", copy: "Skill-building toys designed to support focus and independence.", href: "/products?category=Montessori" },
];

const trustItems = [
  { title: "Safe for everyday play", copy: "Shop parent-friendly toys selected for joyful, confidence-building learning at home.", icon: FiShield },
  { title: "Built for curious minds", copy: "From puzzles to creative kits, every collection supports problem-solving and imagination.", icon: FiBookOpen },
  { title: "Fast, reliable delivery", copy: "Smooth checkout, easy order tracking, and careful fulfilment for busy families.", icon: FiTruck },
];

const valuePoints = [
  "Age-appropriate learning picks",
  "Creative playtime inspiration",
  "Gift-ready favorites for every occasion",
  "Simple checkout with trusted delivery",
];

export default function Home() {
  return (
    <div className="space-y-16">
      <Banner />

      <section className="grid gap-6 md:grid-cols-3">
        {categories.map((item) => (
          <Link key={item.title} href={item.href} className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Category</p>
            <h2 className="mt-3 text-2xl font-bold">{item.title}</h2>
            <p className="mt-3 text-base-content/65">{item.copy}</p>
            <span className="mt-5 inline-flex text-sm font-medium text-primary">Explore →</span>
          </Link>
        ))}
      </section>

      <Products featuredOnly />

      <section className="grid gap-6 lg:grid-cols-3">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-base-content/65">{item.copy}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-8 rounded-[2rem] border border-base-300 bg-gradient-to-r from-secondary/10 via-base-100 to-primary/10 p-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Why families choose HeroKidz</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Learning toys that make every play session more meaningful</h2>
          <p className="mt-4 max-w-2xl text-base-content/70">
            HeroKidz brings together educational toys, thoughtful gifting ideas, and a smooth shopping experience so parents can choose with confidence.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {valuePoints.map((point) => (
            <div key={point} className="rounded-2xl bg-base-100/80 p-4 shadow-sm">{point}</div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-base-300 bg-base-100 p-8 md:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary"><FiSmile /> Parent confidence</p>
          <h2 className="mt-3 text-3xl font-bold">Choose toys that spark creativity, focus, and joyful screen-free time</h2>
          <p className="mt-4 text-base-content/70">Explore picks for birthdays, study breaks, family game time, and everyday learning moments.</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/products" className="btn btn-primary">Shop All Products</Link>
          <Link href="/wishlist" className="btn btn-outline btn-primary">View Wishlist</Link>
        </div>
      </section>
    </div>
  );
}
