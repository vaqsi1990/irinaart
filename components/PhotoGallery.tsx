"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import type { GalleryItem } from "@/data/galleryItems";

type PhotoGalleryProps = {
  items: GalleryItem[];
  /** Optional: custom class for the wrapper */
  className?: string;
};

/**
 * Interactive photo gallery inspired by Inside Kristallnacht (Awwwards):
 * - Staggered entrance animations (GSAP)
 * - Hover: scale, overlay with title & price
 * - Click: link to product page
 */
export default function PhotoGallery({ items, className = "" }: PhotoGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const els = itemRefs.current.filter(Boolean);
    if (!container || els.length === 0) return;

    gsap.set(els, { opacity: 0, y: 24, scale: 0.98 });
    gsap.to(els, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.06,
      ease: "power3.out",
      overwrite: true,
    });
  }, [items.length]);

  return (
    <div className={`photo-gallery ${className}`} ref={containerRef}>
      <div className="photo-gallery__grid">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="photo-gallery__item"
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            data-size={index % 5 === 0 ? "wide" : index % 5 === 2 ? "tall" : "default"}
          >
            <Link
              href={`/products/${item.id}`}
              className="photo-gallery__link"
              aria-label={`View ${item.name}`}
            >
              <div className="photo-gallery__image-wrap">
                <Image
                  src={item.image}
                  alt={item.alt || item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="photo-gallery__image"
                />
                <div className="photo-gallery__overlay" aria-hidden />
                <div className="photo-gallery__caption">
                  <span className="photo-gallery__title">{item.name}</span>
                  <span className="photo-gallery__price">{item.price}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
