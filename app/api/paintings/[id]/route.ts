import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { updatePaintingSchema } from "@/lib/validations";
import { apiJson, apiError, apiNotFound, zodErrorResponse } from "@/lib/api";
import { ZodError } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid ID", 400);
  try {
    const painting = await prisma.painting.findUnique({
      where: { id },
      include: { collection: { select: { id: true, name: true } } },
    });
    if (!painting) return apiNotFound("Painting not found");
    return apiJson(painting);
  } catch (e) {
    console.error(e);
    return apiError("Failed to fetch painting", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid ID", 400);
  try {
    const body = await request.json();
    const data = updatePaintingSchema.parse(body);
    const painting = await prisma.painting.update({
      where: { id },
      data: {
        ...(data.image != null && { image: data.image }),
        ...(data.alt != null && { alt: data.alt }),
        ...(data.name != null && { name: data.name }),
        ...(data.forsale != null && { forsale: data.forsale }),
        ...(data.collectionId != null && { collectionId: data.collectionId }),
      },
      include: { collection: { select: { id: true, name: true } } },
    });
    return apiJson(painting);
  } catch (e) {
    if (e instanceof ZodError) return zodErrorResponse(e);
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return apiNotFound("Painting not found");
    console.error(e);
    return apiError("Failed to update painting", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid ID", 400);
  try {
    await prisma.painting.delete({ where: { id } });
    return apiJson({ success: true });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return apiNotFound("Painting not found");
    console.error(e);
    return apiError("Failed to delete painting", 500);
  }
}
