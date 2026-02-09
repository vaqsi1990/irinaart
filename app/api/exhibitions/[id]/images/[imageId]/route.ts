import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { updateExhibitionImageSchema } from "@/lib/validations";
import { apiJson, apiError, apiNotFound, zodErrorResponse } from "@/lib/api";
import { ZodError } from "zod";

type Params = { params: Promise<{ id: string; imageId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const imageId = Number((await params).imageId);
  if (Number.isNaN(imageId)) return apiError("Invalid image ID", 400);
  try {
    const image = await prisma.exhibitionImage.findUnique({
      where: { id: imageId },
      include: { exhibition: true },
    });
    if (!image) return apiNotFound("Exhibition image not found");
    return apiJson(image);
  } catch (e) {
    console.error(e);
    return apiError("Failed to fetch exhibition image", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const imageId = Number((await params).imageId);
  if (Number.isNaN(imageId)) return apiError("Invalid image ID", 400);
  try {
    const body = await request.json();
    const data = updateExhibitionImageSchema.parse(body);

    const image = await prisma.exhibitionImage.update({
      where: { id: imageId },
      data: {
        ...(data.image != null && { image: data.image }),
        ...(data.alt != null && { alt: data.alt }),
      },
    });
    return apiJson(image);
  } catch (e) {
    if (e instanceof ZodError) return zodErrorResponse(e);
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return apiNotFound("Exhibition image not found");
    console.error(e);
    return apiError("Failed to update exhibition image", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const imageId = Number((await params).imageId);
  if (Number.isNaN(imageId)) return apiError("Invalid image ID", 400);
  try {
    await prisma.exhibitionImage.delete({ where: { id: imageId } });
    return apiJson({ success: true });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return apiNotFound("Exhibition image not found");
    console.error(e);
    return apiError("Failed to delete exhibition image", 500);
  }
}
