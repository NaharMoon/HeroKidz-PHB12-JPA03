"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        isActive ? "bg-primary text-primary-content" : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
