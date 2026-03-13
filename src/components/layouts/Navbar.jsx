export const dynamic = "force-dynamic";

import Link from "next/link";
import { FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import Logo from "./Logo";
import NavLink from "../buttons/NavLink";
import AuthButtons from "../buttons/AuthButtons";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/actions/server/cart";
import { getWishlist } from "@/actions/server/wishlist";

const IconBadge = ({ value, children, href, label, primary = false, className = "" }) => (
  <Link
    href={href}
    className={`btn ${primary ? "btn-primary" : "btn-ghost"} btn-circle relative ${className}`}
    aria-label={label}
  >
    {children}
    {value > 0 ? (
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-content">
        {value}
      </span>
    ) : null}
  </Link>
);

const Navbar = async () => {
  const user = await getCurrentUser();
  const [cartItems, wishlistItems] = user
    ? await Promise.all([getCart(), getWishlist()])
    : [[], []];

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const nav = (
    <>
      <li>
        <NavLink href="/">Home</NavLink>
      </li>
      <li>
        <NavLink href="/products">Products</NavLink>
      </li>
      <li>
        <NavLink href="/wishlist">Wishlist</NavLink>
      </li>
      <li>
        <NavLink href="/orders">Orders</NavLink>
      </li>
      <li>
        <NavLink href="/profile">Profile</NavLink>
      </li>
      {user?.role === "admin" ? (
        <li>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </li>
      ) : null}
    </>
  );

  return (
    <div className="navbar min-h-[72px] rounded-2xl border border-base-300/70 bg-base-100/95 px-2 shadow-sm backdrop-blur sm:px-3 md:px-5">
      <div className="navbar-start min-w-0 gap-2">
        <div className="dropdown lg:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle btn-sm sm:btn-md"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content z-[100] mt-3 w-72 max-w-[85vw] rounded-box border border-base-300 bg-base-100 p-3 shadow-xl"
          >
            {nav}

            <div className="my-2 h-px bg-base-300" />

            <li>
              <Link href="/cart" className="flex items-center justify-between">
                <span>Cart</span>
                {cartCount > 0 ? (
                  <span className="badge badge-primary badge-sm">{cartCount}</span>
                ) : null}
              </Link>
            </li>

            {user ? (
              <li>
                <Link href="/wishlist" className="flex items-center justify-between">
                  <span>Wishlist</span>
                  {wishlistCount > 0 ? (
                    <span className="badge badge-secondary badge-sm">{wishlistCount}</span>
                  ) : null}
                </Link>
              </li>
            ) : null}

            <div className="mt-3">
              <AuthButtons />
            </div>
          </ul>
        </div>

        <div className="min-w-0 shrink">
          <Logo />
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">{nav}</ul>
      </div>

      <div className="navbar-end min-w-0 gap-1 sm:gap-2">
        {user?.role === "admin" ? (
          <Link
            href="/dashboard"
            className="btn btn-ghost btn-circle hidden sm:inline-flex"
            aria-label="Dashboard"
          >
            <MdDashboard size={20} />
          </Link>
        ) : null}

        {user ? (
          <IconBadge
            href="/wishlist"
            value={wishlistCount}
            label="Wishlist"
            className="hidden sm:inline-flex"
          >
            <FiHeart size={18} />
          </IconBadge>
        ) : null}

        <IconBadge
          href="/cart"
          value={cartCount}
          label="Cart"
          primary
          className="btn-sm sm:btn-md"
        >
          <FiShoppingCart size={18} />
        </IconBadge>

        {user ? (
          <Link
            href="/profile"
            className="btn btn-ghost btn-circle hidden sm:inline-flex"
            aria-label="Profile"
          >
            <FiUser size={18} />
          </Link>
        ) : null}

        <div className="hidden sm:block">
          <AuthButtons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;