import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import NextAuthProvider from "@/provider/NextAuthProvider";
import { defaultMetadata } from "@/lib/metadata";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const fontBangla = localFont({ src: "./../fonts/mayaboti-normal.ttf" });
export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${poppins.className} bg-base-100 text-base-content antialiased`}>
        <NextAuthProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_22%)]">
            <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/85 backdrop-blur">
              <div className="mx-auto w-11/12 py-3">
                <Navbar />
              </div>
            </header>
            <main className="mx-auto min-h-[calc(100vh-280px)] w-11/12 py-8">{children}</main>
            <Footer />
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
