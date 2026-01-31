import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createExhibitionSchema } from "@/lib/validations";
import { apiJson, apiError, zodErrorResponse } from "@/lib/api";
import { ZodError } from "zod";

export async function GET() {
  try {
    const exhibitions = await prisma.exhibition.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apiJson(exhibitions);
  } catch (e) {
    console.error(e);
    return apiError("Failed to fetch exhibitions", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createExhibitionSchema.parse(body);
    const exhibition = await prisma.exhibition.create({
      data: {
        image: data.image,
        title: data.title,
        date: data.date,
        location: data.location,
        description: data.description,
      },
    });
    return apiJson(exhibition, 201);
  } catch (e) {
    if (e instanceof ZodError) return zodErrorResponse(e);
    console.error(e);
    return apiError("Failed to create exhibition", 500);
  }
}
