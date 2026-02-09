"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { StorySlide } from "@/data/storySlides";

type StoryGalleryProps = {
  slides: StorySlide[];
  /** Center button label (e.g. "W.") */
  centerButtonLabel?: string;
  className?: string;
};

/**
 * Layered photo + yellow info card + navigation (Inside Kristallnacht style).
 * Left: stacked photos with torn white borders. Right: yellow card with title + text.
 * Bottom: prev/next arrows, slide counter, optional center button.
 */
export default function StoryGallery({
  slides,
  centerButtonLabel = "W",
  className = "",
}: StoryGalleryProps) {
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const slide = slides[current];

  const goPrev = useCallback(() => {
    setCurrent((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setCurrent((i) => (i + 1) % total);
  }, [total]);

  if (!slide || total === 0) return null;

  return (
    <section className={`story-gallery ${className}`} aria-label="Story gallery">
      <div className="story-gallery__frame">
        <div className="story-gallery__layout">
          {/* Left: stacked photos with torn edges */}
          <div className="story-gallery__photos">
            <div className="story-gallery__stack">
              {/* Back layers (slightly offset and rotated) */}
              <div className="story-gallery__layer story-gallery__layer--back-3" aria-hidden />
              <div className="story-gallery__layer story-gallery__layer--back-2" aria-hidden />
              <div className="story-gallery__layer story-gallery__layer--back-1" aria-hidden />
              {/* Front: main image with torn border */}
              <div className="story-gallery__photo-wrap">
                <div className="story-gallery__photo story-gallery__photo--torn">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 55vw"
                    className="story-gallery__image"
                    priority={current === 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: yellow info card — title, date, location, paragraphs */}
          <div className="story-gallery__card-wrap">
            {slide.id ? (
              <Link href={`/${locale}/exhibitions/${slide.id}`} className="story-gallery__card-link">
                <div className="story-gallery__card">
                  <h2 className="story-gallery__card-title">
                    {slide.titlePrefix && (
                      <span className="story-gallery__card-title-prefix">{slide.titlePrefix}</span>
                    )}
                    {slide.title}
                  </h2>
                  <div className="story-gallery__card-meta">
                    {slide.date && <span className="story-gallery__card-date">{slide.date}</span>}
                    {slide.location && (
                      <span className="story-gallery__card-location">{slide.location}</span>
                    )}
                  </div>
                  <div className="story-gallery__card-body">
                    {slide.paragraphs.map((p, i) => (
                      <p key={i} className="story-gallery__card-p">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="story-gallery__card">
                <h2 className="story-gallery__card-title">
                  {slide.titlePrefix && (
                    <span className="story-gallery__card-title-prefix">{slide.titlePrefix}</span>
                  )}
                  {slide.title}
                </h2>
                <div className="story-gallery__card-meta">
                  {slide.date && <span className="story-gallery__card-date">{slide.date}</span>}
                  {slide.location && (
                    <span className="story-gallery__card-location">{slide.location}</span>
                  )}
                </div>
                <div className="story-gallery__card-body">
                  {slide.paragraphs.map((p, i) => (
                    <p key={i} className="story-gallery__card-p">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <nav className="story-gallery__nav" aria-label="Gallery navigation">
              <button
                type="button"
                className="story-gallery__nav-btn"
                onClick={goPrev}
                aria-label="Previous slide"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="story-gallery__nav-btn"
                onClick={goNext}
                aria-label="Next slide"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
