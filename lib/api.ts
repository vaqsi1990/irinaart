import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiJson<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiNotFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function zodErrorResponse(error: ZodError) {
  const messages = error.flatten().fieldErrors;
  const first = Object.values(messages).flat()[0];
  return NextResponse.json(
    { error: first ?? "Validation failed", details: messages },
    { status: 400 }
  );
}
