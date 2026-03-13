import Link from "next/link";

export const metadata = {
  title: "Contact",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-base-300 bg-base-100 p-8 shadow-sm">
      <div className="space-y-4 text-center">
        <span className="badge badge-primary badge-outline">Contact</span>
        <h1 className="text-4xl font-bold">Let’s talk about HeroKidz</h1>
        <p className="text-base-content/70">
          This page is kept intentionally simple for a polished portfolio demo. You can easily wire it to a real contact form later.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-base-200 p-5">
          <h2 className="font-semibold">Email</h2>
          <p className="mt-2 text-sm text-base-content/70">hello@herokidz.demo</p>
        </div>
        <div className="rounded-2xl bg-base-200 p-5">
          <h2 className="font-semibold">Location</h2>
          <p className="mt-2 text-sm text-base-content/70">Bangladesh</p>
        </div>
        <div className="rounded-2xl bg-base-200 p-5">
          <h2 className="font-semibold">Explore</h2>
          <Link href="/products" className="mt-2 inline-block text-sm text-primary underline">Browse products</Link>
        </div>
      </div>
    </div>
  );
}
