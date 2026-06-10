import type { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { ObjectId } from "mongodb";
import GoogleProvider from "next-auth/providers/google";

import { getMongoClientPromise } from "@/lib/mongodb";

const hasMongoDb = Boolean(process.env.MONGODB_URI);

export const authOptions: NextAuthOptions = {
  adapter: hasMongoDb ? MongoDBAdapter(getMongoClientPromise()) : undefined,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: hasMongoDb ? "database" : "jwt",
  },
  callbacks: {
    async session({ session, user, token }) {
      const role = hasMongoDb ? user?.role : token?.role;

      if (session.user) {
        session.user.role = role ?? "user";
      }

      return session;
    },
    async jwt({ token }) {
      token.role ??= "user";

      return token;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (!hasMongoDb || !user?.id || !ObjectId.isValid(user.id)) {
        return;
      }

      const client = await getMongoClientPromise();
      const now = new Date();

      await client
        .db()
        .collection("users")
        .updateOne(
          { _id: new ObjectId(user.id) },
          {
            $set: {
              name: user.name ?? null,
              email: user.email ?? null,
              image: user.image ?? null,
              emailVerified: (user as any).emailVerified ?? null,
              role: "user",
              authMeta: {
                provider: account?.provider ?? "google",
                providerAccountId: account?.providerAccountId ?? null,
              },
              lastSignInAt: now,
              updatedAt: now,
            },
            $setOnInsert: {
              createdAt: now,
            },
          },
        );
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};