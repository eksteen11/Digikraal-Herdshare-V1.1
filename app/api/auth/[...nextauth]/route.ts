import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

const { handlers } = NextAuth(authOptions);

export const GET = (req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) => {
  return handlers.GET(req as any);
};

export const POST = (req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) => {
  return handlers.POST(req as any);
};

