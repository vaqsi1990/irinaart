import Image from "next/image";
import Link from "next/link";
import { galleryItems } from "@/data/galleryItems";

export default function Gallery() {
  return (
    <div className="px-6 py-16 mt flex justify-center">
      <div className="max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-4  gap-10">
  {galleryItems.map((item) => (
    <div key={item.id} className="text-center">
      <Link href={`/products/${item.id}`} className="block group">
        <div className="relative w-full aspect-square overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-[1.02]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        </div>
      </Link>
      <Link href={`/products/${item.id}`} className="mt-4 block text-[#c79b3b] text-lg font-medium hover:underline">
        <h3>{item.name}</h3>
      </Link>
      <p className="text-[#c79b3b] mt-1">{item.price}</p>
    </div>
  ))}
</div>

      </div>
    </div>

  );
}
