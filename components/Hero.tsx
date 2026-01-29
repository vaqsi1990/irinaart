"use client";

import Image from "next/image";
import Link from "next/link";
import { galleryItems } from "@/data/galleryItems";

const slides = [
  ...galleryItems.slice(0, 6).map(({ id, image, alt }) => ({ id, image, alt })),
  { id: 6, image: galleryItems[0].image, alt: "Accordian7" },
];

const Hero = () => {
    const animation = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        const item = target.closest('.item') as HTMLElement | null;
        if (!item) return;

        const items = document.querySelectorAll('.item');
        items.forEach((el) => el.classList.remove('animation'));
        item.classList.add('animation');
    };


    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="grid place-items-center overflow-hidden px-0 relative">
                <div className="flex w-full h-full max-w-[100vw] gap-[0.15rem] p-[0.15rem] min-w-0 relative">
                    {slides.map((slide) => (
                        <div onClick={animation} key={slide.id} className="item flex-1 min-w-0 h-[100vh] cursor-pointer overflow-hidden transition delay-700">
                            <Image src={slide.image} alt={slide.alt} width={500} height={500} className="w-[100%] h-[100%] object-cover " />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-black/50 pointer-events-none" aria-hidden />
                    <div className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2 z-10">
                        <Link
                            href="/gallery"
                            className="block md:text-[20px] text-[18px] text-4.5 bg-[#35aec2] rounded-md font-bold  text-center
             px-6 py-3  no-underline normal-case"
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            დაათვალიერე გალერეა
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Hero;
