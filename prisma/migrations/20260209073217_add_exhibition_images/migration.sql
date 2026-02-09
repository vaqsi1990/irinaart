-- CreateTable
CREATE TABLE "ExhibitionImage" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT,
    "exhibitionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExhibitionImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExhibitionImage" ADD CONSTRAINT "ExhibitionImage_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
