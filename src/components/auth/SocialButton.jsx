"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

export const SocialButtons = ({ googleEnabled = false }) => {
  const params = useSearchParams();

  if (!googleEnabled) {
    return <p className="text-center text-sm text-base-content/50">Google login is optional and currently not configured.</p>;
  }

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: params.get("callbackUrl") || "/" });
  };

  return (
    <div className="mt-4">
      <button onClick={handleSignIn} className="btn btn-outline w-full">
        <FaGoogle className="text-lg" /> Continue with Google
      </button>
    </div>
  );
};
