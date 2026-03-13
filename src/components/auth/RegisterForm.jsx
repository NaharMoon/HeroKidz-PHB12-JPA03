"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";
import { postUser } from "@/actions/server/auth";
import { SocialButtons } from "./SocialButton";

export const RegisterForm = ({ googleEnabled = false }) => {
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password.length < 6) {
      setLoading(false);
      Swal.fire("Weak password", "Password must be at least 6 characters.", "error");
      return;
    }

    const result = await postUser(form);

    if (!result.success) {
      setLoading(false);
      Swal.fire("Registration failed", result.message || "Please try again.", "error");
      return;
    }

    const loginResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (loginResult?.ok) {
      Swal.fire("Account created", "Registration completed successfully.", "success");
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center py-10">
      <div className="card w-full border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="text-sm text-base-content/60">Register with email and password to start shopping.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Full Name" className="input input-bordered w-full" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Minimum 6 characters" className="input input-bordered w-full" onChange={handleChange} required />
            <button disabled={loading} type="submit" className="btn btn-primary w-full">
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="divider">or</div>
          <SocialButtons googleEnabled={googleEnabled} />

          <p className="text-center text-sm">
            Already have an account? <Link href={`/login?callbackUrl=${callbackUrl}`} className="link link-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
