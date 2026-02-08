"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations, useLocale } from "next-intl";

type Collection = { id: number; name: string; order?: number };
type Painting = {
  id: number;
  image: string;
  alt: string;
  name: string;
  collectionId: number;
  collection: { id: number; name: string };
};

const CATEGORIES_LIMIT = 4;

const Categories = () => {
  const t = useTranslations("categories");
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  const paintRef = useRef<HTMLDivElement>(null);
  const [paintAnimated, setPaintAnimated] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("venice carnaval");

  useEffect(() => {
    if (!paintRef.current) return;
    const el = paintRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPaintAnimated(true);
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/collections").then((r) => r.json()),
      fetch("/api/paintings").then((r) => r.json()),
    ])
      .then(([cols, arts]) => {
        if (Array.isArray(cols)) {
          setCollections(cols);
          const firstFour = cols.slice(0, CATEGORIES_LIMIT);
          const hasVenice = firstFour.some(
            (c: Collection) => c.name.toLowerCase() === "venice carnaval"
          );
          if (!hasVenice && firstFour.length > 0) {
            setSelectedCategory((prev) =>
              prev === "venice carnaval" ? firstFour[0].name : prev
            );
          }
        }
        if (Array.isArray(arts)) setPaintings(arts);
      })
      .catch(() => {});
  }, []);

  // Only first 4 categories from API (no "all")
  const categoryButtons = collections
    .slice(0, CATEGORIES_LIMIT)
    .map((c) => ({ name: c.name, value: c.name }));

  const filteredArtworks = paintings
    .filter((p) => p.collection?.name === selectedCategory)
    .slice(0, CATEGORIES_LIMIT);

  useGSAP(() => {
    if (!sectionRef.current) return

    const items = sectionRef.current.querySelectorAll('.category-item')
    if (items.length === 0) return

    gsap.set(items, { opacity: 0, y: 24, scale: 0.98 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out',
      delay: 0.05
    })
  }, { scope: sectionRef, dependencies: [selectedCategory] })

  return (
    <div ref={sectionRef} className="categories-section">
      <div
        ref={paintRef}
        data-dt-animation="paint"
        className={`dt-scroll-animation ${paintAnimated ? 'animated' : ''}`}
        aria-hidden
      />
      <div className="categories-container">

        {/* Category Buttons */}
        <div className="category-buttons">
          {categoryButtons.map((button) => {
            const isActive = selectedCategory === button.value
            
            return (
              <button
                key={button.value}
                onClick={() => setSelectedCategory(button.value)}
                className={`category-button text-black ${isActive ? 'active' : ''}`}
              >
                {button.name}
              </button>
            )
          })}
        </div>
        
        <div className="categories-grid filtered" key={selectedCategory}>
          {filteredArtworks.length === 0 ? (
            <p className="categories-empty">{t("noPaintings")}</p>
          ) : (
            filteredArtworks.map((artwork, index) => (
              <div key={artwork.id} className="category-item">
                <div className="category-frame-outer">
                  <div className="category-frame-inner">
                    <Link href={`/${locale}/products/${artwork.id}`}>
                      <img
                        src={artwork.image}
                        alt={artwork.alt || artwork.name}
                        loading={index < 6 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </Link>
                  </div>
                </div>
                <div className="category-art-info">
                  <h3>{artwork.name}</h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Categories
