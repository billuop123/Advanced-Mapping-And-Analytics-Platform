import { prisma } from "@/app/services/prismaClient";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface ExtendedUser {
  name: string;
  email: string;
  image: string | null;
}

async function saveUserToDatabase(user: ExtendedUser) {
  await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      image: user.image,
    },
  });
}

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: ExtendedUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
        };
      }
      return session;
    },

    async signIn({ user, account }: { user: ExtendedUser; account: any }) {
      if (account.provider === "google") {
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email },
        });

        if (!existingUser) {
          await saveUserToDatabase({
            name: user.name,
            email: user.email,
            image: user.image || null,
          });
        }
      }
      return true;
    },
  },
  pages: {
    callbackUrl: "/",
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
