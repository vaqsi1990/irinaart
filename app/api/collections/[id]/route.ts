import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { updateCollectionSchema } from "@/lib/validations";
import { apiJson, apiError, apiNotFound, zodErrorResponse } from "@/lib/api";
import { ZodError } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid ID", 400);
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: { _count: { select: { paintings: true } } },
    });
    if (!collection) return apiNotFound("Collection not found");
    return apiJson(collection);
  } catch (e) {
    console.error(e);
    return apiError("Failed to fetch collection", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid ID", 400);
  try {
    const body = await request.json();
    const data = updateCollectionSchema.parse(body);
    const collection = await prisma.collection.update({
      where: { id },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.order != null && { order: data.order }),
      },
    });
    return apiJson(collection);
  } catch (e) {
    if (e instanceof ZodError) return zodErrorResponse(e);
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return apiNotFound("Collection not found");
    console.error(e);
    return apiError("Failed to update collection", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid ID", 400);
  try {
    await prisma.collection.delete({ where: { id } });
    return apiJson({ success: true });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return apiNotFound("Collection not found");
    console.error(e);
    return apiError("Failed to delete collection", 500);
  }
}
