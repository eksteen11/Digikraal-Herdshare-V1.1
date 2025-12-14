import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "./airtable";
import type { UserRole } from "@/types/airtable";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in Airtable
          const email = credentials.email as string;
          const user = await getUserByEmail(email);

          if (!user || !user.fields["User Password"]) {
            return null;
          }

          // Verify password
          const password = credentials.password as string;
          const isValid = await bcrypt.compare(
            password,
            user.fields["User Password"] || ""
          );

          if (!isValid) {
            return null;
          }

          // Return user object for session
          return {
            id: user.id,
            email: user.fields["User Email"] || "",
            name: user.fields["User Name"] || "",
            role: (user.fields["Role"] as UserRole) || "Investor",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Register a new user
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole = "Investor"
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Airtable
    // Note: "Total Investment Amount" is a computed field and cannot be set directly
    await createUser({
      "User Name": name,
      "User Email": email,
      "User Password": hashedPassword,
      Role: role,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);
    // Return more specific error message
    const errorMessage = error?.message || "Failed to create user";
    return { success: false, error: errorMessage };
  }
}

/**
 * Get server session from token (NextAuth v5 compatible)
 * Use this in API routes with the request object
 */
export async function getServerSessionFromRequest(req: Request) {
  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return null;

  return {
    user: {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: token.role as UserRole,
    },
  };
}

/**
 * Get server session in server components (NextAuth v5 compatible)
 * Use this in server components - it reads from cookies via headers()
 */
export async function getServerSession() {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  
  // Create a mock request-like object from headers
  const req = {
    headers: Object.fromEntries(headersList.entries()),
  } as any;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return null;

  return {
    user: {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: token.role as UserRole,
    },
  };
}

