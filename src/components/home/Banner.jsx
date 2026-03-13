import Link from "next/link";
import Image from "next/image";
import { fontBangla } from "@/app/layout";

// const highlights = ["Parent-approved picks", "Safe materials", "Fast nationwide delivery"];

const Banner = () => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-base-300 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 px-6 py-10 shadow-sm md:px-12 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_35%)]" />
      <div className="relative grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-6 text-center md:text-left">
          <span className="badge badge-primary badge-outline px-4 py-3">Premium Learning Store</span>
          <h1 className={`${fontBangla.className} text-4xl font-bold leading-tight md:text-6xl`}>
            শেখা হোক<br></br> <span className="text-primary">খেলার মতো মজার</span>
          </h1>
          <p className="max-w-xl text-base-content/70">
            Discover educational toys that build creativity, confidence, and problem-solving skills through joyful everyday play.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Link href="/products" className="btn btn-primary">Shop Collection</Link>
            <Link href="/products?featured=true" className="btn btn-outline btn-primary">Best Sellers</Link>
          </div>
          {/* <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {highlights.map((item) => <span key={item} className="badge badge-neutral badge-outline px-4 py-3">{item}</span>)}
          </div> */}
        </div>
        <div className="flex justify-center">
          <Image alt="HeroKidz hero" src="/assets/hero.png" width={600} height={450} className="w-full max-w-xl object-contain drop-shadow-2xl" priority />
        </div>
      </div>
    </div>
  );
};

export default Banner;
