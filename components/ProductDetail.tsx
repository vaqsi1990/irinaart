"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { GalleryItem } from "@/data/galleryItems";
import Image from "next/image";
type ProductDetailProps = {
  product: GalleryItem;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".product-image-wrapper", {
        opacity: 0,
        scale: 0.95,
        x: -50,
      });

      gsap.set(".product-info > *", {
        opacity: 0,
        y: 30,
      });

      gsap.to(".product-image-wrapper", {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(".product-info > *", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.4,
      });

      const img = pageRef.current?.querySelector<HTMLImageElement>(
        ".product-image-wrapper img"
      );
      if (img) {
        if (img.complete) {
          gsap.fromTo(
            img,
            { scale: 1.1, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              delay: 0.3,
            }
          );
        } else {
          img.addEventListener("load", () => {
            gsap.fromTo(
              img,
              { scale: 1.1, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
            );
          });
        }
      }
    }, pageRef);

    return () => ctx.revert();
  }, [product.id]);

  return (
    <div ref={pageRef} className="product-details-section">
        <div className="product-details-container">
          <Link href="/gallery" className="back-link">
            <Image src="/back.png" alt="arrow-left" width={20} height={20} /> გალერეაში დაბრუნება
          </Link>

          <div className="product-details-grid">
            <div className="product-image-wrapper">
              <div className="frame-outer">
                <div className="frame-inner">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>

              

              <div className="product-description">
                <p>
                  ხელოვნების ნიმუში უნიკალური დიზაინითა და ხარისხიანი
                  შესრულებით. დეტალებისთვის დაგვიკავშირდით.
                </p>
              </div>

              
            </div>
          </div>
        </div>
    </div>
  );
}
