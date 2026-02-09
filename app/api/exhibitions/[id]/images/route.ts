import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createExhibitionImageSchema } from "@/lib/validations";
import { apiJson, apiError, apiNotFound, zodErrorResponse } from "@/lib/api";
import { ZodError } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const exhibitionId = Number((await params).id);
  if (Number.isNaN(exhibitionId)) return apiError("Invalid exhibition ID", 400);
  try {
    const exhibition = await prisma.exhibition.findUnique({
      where: { id: exhibitionId },
    });
    if (!exhibition) return apiNotFound("Exhibition not found");

    const images = await prisma.exhibitionImage.findMany({
      where: { exhibitionId },
      orderBy: { createdAt: "asc" },
    });
    return apiJson(images);
  } catch (e) {
    console.error(e);
    return apiError("Failed to fetch exhibition images", 500);
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  const exhibitionId = Number((await params).id);
  if (Number.isNaN(exhibitionId)) return apiError("Invalid exhibition ID", 400);
  try {
    const body = await request.json();
    
    // Prepare data for validation - handle undefined alt
    const dataToValidate: any = {
      image: body.image,
      exhibitionId,
    };
    if (body.alt !== undefined && body.alt !== null && body.alt !== "") {
      dataToValidate.alt = body.alt;
    }
    
    const data = createExhibitionImageSchema.parse(dataToValidate);

    // Verify exhibition exists
    const exhibition = await prisma.exhibition.findUnique({
      where: { id: exhibitionId },
    });
    if (!exhibition) return apiNotFound("Exhibition not found");

    const image = await prisma.exhibitionImage.create({
      data: {
        image: data.image,
        alt: data.alt || null,
        exhibitionId: data.exhibitionId,
      },
    });
    return apiJson(image);
  } catch (e) {
    if (e instanceof ZodError) {
      console.error("Validation error:", e.errors);
      return zodErrorResponse(e);
    }
    console.error("Error creating exhibition image:", e);
    return apiError("Failed to create exhibition image", 500);
  }
}
