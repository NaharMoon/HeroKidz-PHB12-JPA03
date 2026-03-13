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

const IconBadge = ({ value, children, href, label, primary = false }) => (
  <Link href={href} className={`btn ${primary ? "btn-primary" : "btn-ghost"} btn-circle relative`} aria-label={label}>
    {children}
    {value > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-content">{value}</span> : null}
  </Link>
);

const Navbar = async () => {
  const user = await getCurrentUser();
  const [cartItems, wishlistItems] = user ? await Promise.all([getCart(), getWishlist()]) : [[], []];

  const nav = (
    <>
      <li><NavLink href="/">Home</NavLink></li>
      <li><NavLink href="/products">Products</NavLink></li>
      <li><NavLink href="/wishlist">Wishlist</NavLink></li>
      <li><NavLink href="/orders">Orders</NavLink></li>
      <li><NavLink href="/profile">Profile</NavLink></li>
      {user?.role === "admin" ? (
        <li><NavLink href="/dashboard">Dashboard</NavLink></li>
      ) : null}
    </>
  );

  return (
    <div className="navbar rounded-2xl border border-base-300/70 bg-base-100/95 px-3 shadow-sm backdrop-blur md:px-5">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content z-[1] mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
            {nav}
          </ul>
        </div>
        <Logo />
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">{nav}</ul>
      </div>

      <div className="navbar-end gap-2">
        {user?.role === "admin" ? (
          <Link href="/dashboard" className="btn btn-ghost btn-circle" aria-label="Dashboard">
            <MdDashboard size={20} />
          </Link>
        ) : null}
        <IconBadge href="/wishlist" value={wishlistItems.length} label="Wishlist">
          <FiHeart size={18} />
        </IconBadge>
        <IconBadge href="/cart" value={cartItems.reduce((sum, item) => sum + item.quantity, 0)} label="Cart" primary>
          <FiShoppingCart size={18} />
        </IconBadge>
        {user ? (
          <Link href="/profile" className="btn btn-ghost btn-circle" aria-label="Profile">
            <FiUser size={18} />
          </Link>
        ) : null}
        <AuthButtons />
      </div>
    </div>
  );
};

export default Navbar;
