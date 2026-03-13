"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const AuthButtons = () => {
  const { status, data } = useSession();

  if (status === "loading") {
    return <button className="btn btn-ghost" disabled>Loading...</button>;
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-base-content/70 md:inline">{data?.user?.name}</span>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-outline btn-primary">
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="btn btn-outline btn-primary">
      Login
    </Link>
  );
};

export default AuthButtons;
