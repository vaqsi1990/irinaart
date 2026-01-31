import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createCollectionSchema } from "@/lib/validations";
import { apiJson, apiError, zodErrorResponse } from "@/lib/api";
import { ZodError } from "zod";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { paintings: true } } },
    });
    return apiJson(collections);
  } catch (e) {
    console.error(e);
    return apiError("Failed to fetch collections", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createCollectionSchema.parse(body);
    const collection = await prisma.collection.create({
      data: { name: data.name, order: data.order },
    });
    return apiJson(collection, 201);
  } catch (e) {
    if (e instanceof ZodError) return zodErrorResponse(e);
    console.error(e);
    return apiError("Failed to create collection", 500);
  }
}
