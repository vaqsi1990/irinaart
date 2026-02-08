import { notFound } from "next/navigation";

import ProductDetail from "@/components/ProductDetail";
import prisma from "@/lib/prisma";
import type { GalleryItem } from "@/data/galleryItems";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  const painting = await prisma.painting.findUnique({
    where: { id: productId },
    include: { collection: true },
  });

  if (!painting) {
    notFound();
  }

  const product: GalleryItem = {
    id: painting.id,
    image: painting.image,
    alt: painting.alt,
    name: painting.name,
    description: "",
    collection: painting.collection.name,
    price: "",
  };

  return <ProductDetail product={product} />;
}

