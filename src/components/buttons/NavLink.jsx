"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLink = ({ href, children }) => {
  const path = usePathname();
  return (
    <Link
      className={`${path.startsWith(href) && "text-primary"} font-medium`}
      href={href}
    >
      {children}
    </Link>
  );
};

export default NavLink;
