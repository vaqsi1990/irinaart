import { notFound } from "next/navigation";

import ProductDetail from "@/components/ProductDetail";
import prisma from "@/lib/prisma";


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

  return <ProductDetail painting={painting} />;
}

