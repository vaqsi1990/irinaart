"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { galleryItems } from "@/data/galleryItems";
import { useTranslations, useLocale } from "next-intl";

const Hero = () => {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [entering, setEntering] = useState(true); // start true so initial load animates
  const primaryFrameRef = useRef<HTMLDivElement>(null);
  const secondaryFrameRef = useRef<HTMLDivElement>(null);

  const total = galleryItems.length;
  const leftItem = galleryItems[currentIndex % total];
  const rightItem = galleryItems[(currentIndex + 1) % total];

  const goNext = useCallback(() => {
    setEntering(true);
    setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setEntering(true);
    setCurrentIndex((i) => (i - 1 + total) % total);
  }, [total]);

  // GSAP: smooth entrance animations with stagger
  useEffect(() => {
    if (!entering) return;
    const primary = primaryFrameRef.current;
    const secondary = secondaryFrameRef.current;

    const tl = gsap.timeline({ defaults: { overwrite: true } });

    // Primary frame: from up to down, soft scale
    if (primary) {
      tl.fromTo(
        primary,
        { yPercent: -100, opacity: 0, scale: 0.96 },
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        0
      );
    }

    // Secondary frame: from down to up, soft scale, slight delay for stagger
    if (secondary) {
      tl.fromTo(
        secondary,
        { yPercent: 100, opacity: 0, scale: 0.96 },
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.2,
        },
        0
      );
    }
  }, [entering, currentIndex]);

  // Run entrance animation on mount and when slide changes
  useEffect(() => {
    if (!entering) return;
    const t = setTimeout(() => setEntering(false), 1200);
    return () => clearTimeout(t);
  }, [entering, currentIndex]);

  return (
    <div className="hero-home">
      <div className="hero-home__bg">
        <div className="hero-home__bg-solid" />
        <div
          className="hero-home__bg-image"
          style={{ backgroundImage: "url(/bg_1.jpg)" }}
          aria-hidden
        />
        <div className="hero-home__bg-texture" aria-hidden />
      </div>

      <div className="hero-home__inner">
        <div className="hero-home__paintings">
          <div
            ref={primaryFrameRef}
            className="hero-home__frame hero-home__frame--primary"
          >
            <Image
              src={leftItem.image}
              alt={leftItem.alt}
              width={380}
              height={480}
              className="hero-home__frame-img"
            />
          </div>
          <div
            ref={secondaryFrameRef}
            className="hero-home__frame hero-home__frame--secondary"
          >
            <Image
              src={rightItem.image}
              alt={rightItem.alt}
              width={280}
              height={360}
              className="hero-home__frame-img"
            />
          </div>
        </div>

        <div className="hero-home__content">
          <h1 className="hero-home__heading">
            {t("heading").split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < t("heading").split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          
          <Link href={`/${locale}/gallery`} className="siteNav__link">
            {t("cta")}
          </Link>
          <div className="hero-home__arrows">
            <button
              type="button"
              className="hero-home__arrow"
              aria-label="Previous slide"
              onClick={goPrev}
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
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="hero-home__arrow"
              aria-label="Next slide"
              onClick={goNext}
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
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
