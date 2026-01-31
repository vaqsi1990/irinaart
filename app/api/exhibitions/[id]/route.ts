import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { updateExhibitionSchema } from "@/lib/validations";
import { apiJson, apiError, apiNotFound, zodErrorResponse } from "@/lib/api";
import { ZodError } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid ID", 400);
  try {
    const exhibition = await prisma.exhibition.findUnique({
      where: { id },
    });
    if (!exhibition) return apiNotFound("Exhibition not found");
    return apiJson(exhibition);
  } catch (e) {
    console.error(e);
    return apiError("Failed to fetch exhibition", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid ID", 400);
  try {
    const body = await request.json();
    const data = updateExhibitionSchema.parse(body);
    const exhibition = await prisma.exhibition.update({
      where: { id },
      data: {
        ...(data.image != null && { image: data.image }),
        ...(data.title != null && { title: data.title }),
        ...(data.date != null && { date: data.date }),
        ...(data.location != null && { location: data.location }),
        ...(data.description != null && { description: data.description }),
      },
    });
    return apiJson(exhibition);
  } catch (e) {
    if (e instanceof ZodError) return zodErrorResponse(e);
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return apiNotFound("Exhibition not found");
    console.error(e);
    return apiError("Failed to update exhibition", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) return apiError("Invalid ID", 400);
  try {
    await prisma.exhibition.delete({ where: { id } });
    return apiJson({ success: true });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025")
      return apiNotFound("Exhibition not found");
    console.error(e);
    return apiError("Failed to delete exhibition", 500);
  }
}
