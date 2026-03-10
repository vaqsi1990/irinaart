"use client";

import React, { useState, useCallback, useEffect } from "react";

import { useTranslations } from "next-intl";

const CERTIFICATE_IMAGES = [
  { src: "/certificates/1.jpg", alt: "Certificate 1" },
  { src: "/certificates/2.jpg", alt: "Certificate 2" },
  { src: "/certificates/3.jpg", alt: "Certificate 3" },
  { src: "/certificates/4.jpg", alt: "Certificate 4" },
  { src: "/certificates/5.jpg", alt: "Certificate 5" },
  { src: "/certificates/6.jpg", alt: "Certificate 6" },
  { src: "/certificates/7.jpg", alt: "Certificate 7" },
  { src: "/certificates/8.jpg", alt: "Certificate 8" },
  { src: "/certificates/9.jpg", alt: "Certificate 9" },
  { src: "/certificates/10.jpg", alt: "Certificate 10" },
  { src: "/certificates/11.jpeg", alt: "Certificate 11" },
  { src: "/certificates/12.jpeg", alt: "Certificate 12" },
  { src: "/certificates/13.jpeg", alt: "Certificate 13" },
  { src: "/certificates/14.jpeg", alt: "Certificate 14" },
  { src: "/certificates/15.jpeg", alt: "Certificate 15" },
  { src: "/certificates/16.jpeg", alt: "Certificate 16" },
  { src: "/certificates/17.jpeg", alt: "Certificate 17" },
  { src: "/certificates/18.jpeg", alt: "Certificate 18" },
  { src: "/certificates/19.jpeg", alt: "Certificate 19" },
  { src: "/certificates/20.jpeg", alt: "Certificate 20" },
  { src: "/certificates/21.jpeg", alt: "Certificate 21" },
  { src: "/certificates/22.jpeg", alt: "Certificate 22" },
  { src: "/certificates/23.jpeg", alt: "Certificate 23" },
 
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
                  className="relative aspect-[3/4] overflow-hidden rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
                  style={{
                    width: `${100 / itemsPerView}%`,
                  }}
                  onClick={() => setSelected({ src, alt })}
                >
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {totalItems > itemsPerView && (
            <>
              {/* Desktop: Buttons below items when itemsPerView is 3 (large screens) */}
              {itemsPerView === 3 && (
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="story-gallery__nav-btn"
                    aria-label="Previous certificates"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="story-gallery__nav-btn"
                    aria-label="Next certificates"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Mobile: Buttons below items - only show when itemsPerView is 1 (small screens) */}
              {itemsPerView === 1 && (
                <div className="flex justify-center gap-4 mt-14">
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

      {selected && (() => {
        const modalIndex = CERTIFICATE_IMAGES.findIndex((c) => c.src === selected.src);
        const goToPrev = () => {
          const prevIndex = modalIndex <= 0 ? CERTIFICATE_IMAGES.length - 1 : modalIndex - 1;
          setSelected(CERTIFICATE_IMAGES[prevIndex]);
        };
        const goToNext = () => {
          const nextIndex = modalIndex >= CERTIFICATE_IMAGES.length - 1 ? 0 : modalIndex + 1;
          setSelected(CERTIFICATE_IMAGES[nextIndex]);
        };
        return (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4 sm:p-6"
            onClick={() => setSelected(null)}
          >
            {/* Close button - always top right */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelected(null); }}
              className="absolute right-2 top-[140px] z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white border border-white/40 shadow-lg transition-colors"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div
              className="relative mt sm:mt-14 max-w-2xl flex items-around justify-around"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous (desktop / tablet - keep on sides) */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="hidden sm:flex absolute -left-24 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/30 shadow-lg transition-colors"
                aria-label="Previous certificate"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              <img
                src={selected.src}
                alt={selected.alt}
                className="w-auto h-[350px] object-contain rounded-lg shadow-2xl"
              />

              {/* Next (desktop / tablet - keep on sides) */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="hidden sm:flex absolute -right-24 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/30 shadow-lg transition-colors"
                aria-label="Next certificate"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Mobile: buttons below image */}
            <div className="flex sm:hidden justify-center gap-6 mt-[100px] md:mt-4" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="w-10 h-10 flex items-center mt-10 md:mt-4 justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/30 shadow-lg transition-colors"
                aria-label="Previous certificate"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="w-10 h-10 flex mt-10 md:mt-4 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/30 shadow-lg transition-colors"
                aria-label="Next certificate"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        );
      })()}
    </>
  );
}
