import { notFound } from "next/navigation";

import ExhibitionDetail from "@/components/ExhibitionDetail";
import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function ExhibitionPage({ params }: Props) {
  const { id } = await params;
  const exhibitionId = parseInt(id, 10);

  const exhibition = await prisma.exhibition.findUnique({
    where: { id: exhibitionId },
    include: { 
      images: {
        orderBy: { createdAt: 'asc' }
      }
    },
  });

  if (!exhibition) {
    notFound();
  }

  return <ExhibitionDetail exhibition={exhibition} />;
}
