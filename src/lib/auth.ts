import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TIERS } from "./constants";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });

        if (!existing) {
          await db.insert(users).values({
            email: user.email,
            name: user.name ?? null,
            image: user.image ?? null,
            googleId: account.providerAccountId,
            tier: "free",
            generationsUsed: 0,
            generationsLimit: TIERS.free.generationsLimit,
            namesPerGeneration: TIERS.free.namesPerGeneration,
          });
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, session.user.email),
        });
        if (dbUser) {
          (session as any).userId = dbUser.id;
          (session as any).tier = dbUser.tier;
          (session as any).generationsUsed = dbUser.generationsUsed;
          (session as any).generationsLimit = dbUser.generationsLimit;
          (session as any).namesPerGeneration = dbUser.namesPerGeneration;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
