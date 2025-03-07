import { prisma } from "@/app/services/prismaClient";
import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken"
const options: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" }, // Add name field for signup
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignup: { label: "Is Signup", type: "boolean" }, // Add a flag to distinguish signup
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { name, email, password, isSignup } = credentials;

        // Handle Signup
        if (isSignup) {
          // Check if the user already exists
          const existingUser = await prisma.user.findFirst({
            where: { email },
          });

          if (existingUser) {
            throw new Error("User already exists");
          }

          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Create new user
          const newUser = await prisma.user.create({
            data: {
              name: name || "", // Provide a default value if name is null or undefined
              email: email || "", // Provide a default value if email is null or undefined
              password: hashedPassword,
            },
          });

          // Return the new user object with id as a string
          return {
            id: newUser.id.toString(), // Convert id to string
            name: newUser.name,
            email: newUser.email,
          };
        }

        // Handle Signin
        else {
          // Find the user in the database
          const user = await prisma.user.findFirst({
            where: { email },
          });
          const jwtT=jwt.sign({
            userId:user?.id
          },"secret")
          if (!user) {
            throw new Error("User not found");
          }

          // Verify the password
          const isValidPassword = await bcrypt.compare(
            password,
            user.password || ""
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // Return the user object with id as a string
          return {
            id: user.id.toString(), // Convert id to string
            name: user.name,
            email: user.email,
            accessToken:jwtT
          };
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken=user.accessToken
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user = {
          ...session.user,
          //@ts-ignore
          id: token.id as string,
          accessToken:token.accessToken as string
        };
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email || "" },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || "", // Provide a default value if name is null or undefined
              email: user.email || "", // Provide a default value if email is null or undefined
              image: user.image || null,
            },
          });
        }
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to a specific page after sign-in
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin", // Custom sign-in page
    error: "/auth/error", // Custom error page
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
