"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { SocialButtons } from "./SocialButton";

const LoginForm = ({ googleEnabled = false }) => {
  const params = useSearchParams();
  const router = useRouter();
  const callback = params.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    const result = await signIn("credentials", {
      email: form.email.value,
      password: form.password.value,
      redirect: false,
      callbackUrl: callback,
    });

    setLoading(false);

    if (!result?.ok) {
      Swal.fire("Login failed", "Email or password did not match.", "error");
      return;
    }

    Swal.fire("Welcome back", "You have successfully logged in.", "success");
    router.push(callback);
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center py-10">
      <div className="card w-full border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Login to HeroKidz</h2>
            <p className="text-sm text-base-content/60">Access your cart, checkout, and order history.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" required />
            <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" required />
            <button disabled={loading} type="submit" className="btn btn-primary w-full">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="divider">or</div>
          <SocialButtons googleEnabled={googleEnabled} />

          <p className="text-center text-sm">
            Don’t have an account? <Link href={`/register?callbackUrl=${callback}`} className="link link-primary">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
