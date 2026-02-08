"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

/** Shape from Prisma painting with include: { collection: true } */
type PaintingWithCollection = {
  id: number;
  image: string;
  alt: string;
  name: string;
  collection: { name: string };
};

type ProductDetailProps = {
  painting: PaintingWithCollection;
};

export default function ProductDetail({ painting }: ProductDetailProps) {
  const t = useTranslations("product");
  const locale = useLocale();
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
  }, [painting.id]);

  return (
    <div ref={pageRef} className="product-details-section">
        <div className="product-details-container">
          <Link href={`/${locale}/gallery`} className="back-link !text-white">
            <Image src="/back.png" alt="arrow-left" width={20} height={20} /> {t("backToGallery")}
          </Link>

          <div className="product-details-grid">
            <div className="product-image-wrapper">
              <div className="frame-outer">
                <div className="frame-inner">
                  <img
                    src={painting.image}
                    alt={painting.alt ?? painting.name}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-title">{painting.name}</h1>

              {painting.collection && (
                <p className="product-collection">
                  <strong>კოლექცია:</strong> {painting.collection.name}
                </p>
              )}

              <div className="product-description">
                <p>
                 {/* Painting has no description field in schema; add to Prisma if needed */}
                </p>
              </div>

              
            </div>
          </div>
        </div>
    </div>
  );
}
