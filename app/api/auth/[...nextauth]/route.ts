import { prisma } from "@/app/services/prismaClient";
import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/app/helperFunctions/mailer";

export const options: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile) {

        const existingUser = await prisma.user.findFirst({
          where: { email: profile.email },
        });

        if (!existingUser) {
          
  
          const newUser = await prisma.user.create({
            data: {
              name: profile.name || "",
              email: profile.email || "",
              image: profile.picture || null,
              isVerified:true
            },
          });
         

          const jwtToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: '1d' });
          
          return {
            id: newUser.id.toString(),
            name: newUser.name,
            email: newUser.email,
            image: newUser.image,
            accessToken: jwtToken, 
          };
        }

        const jwtToken = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: '1d' });

        return {
          id: existingUser.id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image,
          accessToken: jwtToken, 
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignup: { label: "Is Signup", type: "boolean" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { name, email, password, isSignup } = credentials;

        if (isSignup) {
          const existingUser = await prisma.user.findFirst({
            where: { email },
          });

          if (existingUser) {
            throw new Error("User already exists");
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          
          const newUser = await prisma.user.create({
            data: {
              name: name || "",
              email: email || "",
              password: hashedPassword,
            },
          });
          //@ts-expect-error
          sendEmail({ email: newUser.email, emailType: "VERIFY", userId: Number(newUser.id) });
   
          const jwtToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: '1d' });

          return {
            id: newUser.id.toString(),
            name: newUser.name,
            email: newUser.email,
            accessToken: jwtToken, // Generate and send the JWT token in accessToken
          };
        } else {
          const user = await prisma.user.findFirst({
            where: { email },
          });

          if (!user) {
            throw new Error("User not found");
          }

          const isValidPassword = await bcrypt.compare(password, user.password || "");

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // Generate a JWT token after successful login
          const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "yourSecretKey", { expiresIn: '1d' });

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            accessToken: jwtToken, // Include the JWT token in accessToken
          };
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.image = user.image; // Store the JWT token in the token object
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          accessToken: token.accessToken as string,
          image: token.image as string, // Add JWT token to session
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
              name: user.name || "",
              email: user.email || "",
              image: user.image || null,
            },
          });
        }
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
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