"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const CERTIFICATE_IMAGES = [
  { src: "/certificates/1.jpg", alt: "Certificate 1" },
  { src: "/certificates/2.jpg", alt: "Certificate 2" },
  { src: "/certificates/3.jpg", alt: "Certificate 3" },
  { src: "/certificates/4.jpg", alt: "Certificate 4" },
  { src: "/certificates/5.jpg", alt: "Certificate 5" },
  { src: "/certificates/6.jpg", alt: "Certificate 6" },
];

type CertificatesProps = {
  /** Optional section title */
  title?: string;
  /** Optional wrapper class */
  className?: string;
};

export default function Certificates({ title, className = "" }: CertificatesProps) {
  const t = useTranslations("certificates");
  const displayTitle = title || t("title");
  const [selected, setSelected] = useState<{ src: string; alt: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const totalItems = CERTIFICATE_IMAGES.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  return (
    <>
      <h2 className="certificates-title text-[30px] text-[24px]">{displayTitle}</h2>
      <div className="mt-14 certificates-section flex justify-center px-4" style={{ marginBottom: "2rem" }}>
        <div className="relative w-full max-w-6xl">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-4"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {CERTIFICATE_IMAGES.map(({ src, alt }) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-200 transition-all duration-300 hover:scale-[1.02] flex-shrink-0"
                  style={{
                    width: `${100 / itemsPerView}%`,
                  }}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={itemsPerView === 1 ? "100vw" : "33vw"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {totalItems > itemsPerView && (
            <>
              {/* Desktop: Side buttons - only show when itemsPerView is 3 (large screens) */}
              {itemsPerView === 3 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="story-gallery__nav-btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10"
                    aria-label="Previous certificates"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="story-gallery__nav-btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10"
                    aria-label="Next certificates"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Mobile: Buttons below items - only show when itemsPerView is 1 (small screens) */}
              {itemsPerView === 1 && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="story-gallery__nav-btn"
                    aria-label="Previous certificates"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="story-gallery__nav-btn"
                    aria-label="Next certificates"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
