import { notFound } from "next/navigation";
import { galleryItems } from "@/data/galleryItems";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  const product = galleryItems.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
