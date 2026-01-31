import { z } from "zod";

/** Image URL — use the URL returned by UploadThing after upload */
const imageUrl = z.string().url().min(1, "Image URL is required");

export const createPaintingSchema = z.object({
  image: imageUrl,
  alt: z.string().min(1, "Alt text is required").max(500),
  name: z.string().min(1, "Name is required").max(200),
  collectionId: z.number().int().positive("Collection ID is required"),
});

export const updatePaintingSchema = createPaintingSchema.partial();

export const createExhibitionSchema = z.object({
  image: imageUrl,
  title: z.string().min(1, "Title is required").max(200),
  date: z.string().min(1, "Date is required").max(100),
  location: z.string().min(1, "Location is required").max(200),
  description: z.string().min(1, "Description is required"),
});

export const updateExhibitionSchema = createExhibitionSchema.partial();

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  order: z.number().int().min(0).optional().default(0),
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  order: z.number().int().min(0).optional(),
});

export type CreatePaintingInput = z.infer<typeof createPaintingSchema>;
export type UpdatePaintingInput = z.infer<typeof updatePaintingSchema>;
export type CreateExhibitionInput = z.infer<typeof createExhibitionSchema>;
export type UpdateExhibitionInput = z.infer<typeof updateExhibitionSchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
