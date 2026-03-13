import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginUser } from "@/actions/server/auth";
import { collections, dbConnect } from "./dbConnect";

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const user = await loginUser({
        email: credentials?.email,
        password: credentials?.password,
      });
      return user;
    },
  }),
];

const hasGoogleProvider =
  !!process.env.GOOGLE_CLIENT_ID &&
  !!process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== "test" &&
  process.env.GOOGLE_CLIENT_SECRET !== "test";

if (hasGoogleProvider) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      const users = await dbConnect(collections.USERS);
      const existingUser = await users.findOne({ email: user.email });

      if (!existingUser) {
        await users.insertOne({
          provider: account.provider,
          email: user.email,
          name: user.name || "Google User",
          image: user.image || "",
          role: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.email) {
        const users = await dbConnect(collections.USERS);
        const dbUser = await users.findOne({ email: user.email });
        token.role = dbUser?.role || user.role || "user";
        token.email = user.email;
        token.name = dbUser?.name || user.name;
      }

      if (account?.provider === "google" && token?.email) {
        const users = await dbConnect(collections.USERS);
        const dbUser = await users.findOne({ email: token.email });
        token.role = dbUser?.role || "user";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.role = token.role || "user";
        session.user.name = token.name || session.user.name;
      }
      return session;
    },
  },
};

export const googleAuthEnabled = hasGoogleProvider;
