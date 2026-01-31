import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createPaintingSchema } from "@/lib/validations";
import { apiJson, apiError, zodErrorResponse } from "@/lib/api";
import { ZodError } from "zod";

export async function GET() {
  try {
    const paintings = await prisma.painting.findMany({
      orderBy: { createdAt: "desc" },
      include: { collection: { select: { id: true, name: true } } },
    });
    return apiJson(paintings);
  } catch (e) {
    console.error(e);
    return apiError("Failed to fetch paintings", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createPaintingSchema.parse(body);
    const painting = await prisma.painting.create({
      data: {
        image: data.image,
        alt: data.alt,
        name: data.name,
        collectionId: data.collectionId,
      },
      include: { collection: { select: { id: true, name: true } } },
    });
    return apiJson(painting, 201);
  } catch (e) {
    if (e instanceof ZodError) return zodErrorResponse(e);
    console.error(e);
    return apiError("Failed to create painting", 500);
  }
}
