import Link from "next/link";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-base-300 bg-base-200/60">
      <div className="mx-auto grid w-11/12 gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm text-base-content/70">
            HeroKidz is a polished toy store demo focused on playful learning, clean shopping flow, and portfolio-ready full-stack features.
          </p>
        </div>

        <div className="space-y-3">
          <h6 className="font-semibold">Shop</h6>
          <div className="flex flex-col gap-2 text-sm text-base-content/70">
            <Link href="/products">All Products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/orders">Order History</Link>
          </div>
        </div>

        <div className="space-y-3">
          <h6 className="font-semibold">Company</h6>
          <div className="flex flex-col gap-2 text-sm text-base-content/70">
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>

        <div className="space-y-3">
          <h6 className="font-semibold">Built With</h6>
          <p className="text-sm text-base-content/70">Next.js App Router, MongoDB, NextAuth, Tailwind CSS, DaisyUI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
