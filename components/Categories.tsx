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

// Specific categories to display in order
const DISPLAY_CATEGORIES = ["african beauty", "geisha", "venice carnival", "portrait"];

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
          // Filter collections to only include the 4 specific categories
          const filtered = DISPLAY_CATEGORIES.map((catName) => {
            return cols.find((c: Collection) => 
              c.name.toLowerCase() === catName.toLowerCase()
            );
          }).filter(Boolean) as Collection[];
          
          setCollections(filtered);
          
          // Set initial selected category to "venice carnaval" if available, otherwise first available
          const venice = filtered.find((c) => 
            c.name.toLowerCase() === "venice carnaval"
          );
          if (venice) {
            setSelectedCategory(venice.name);
          } else if (filtered.length > 0) {
            setSelectedCategory(filtered[0].name);
          }
        }
        if (Array.isArray(arts)) setPaintings(arts);
      })
      .catch(() => {});
  }, []);

  // Display only the 4 specific categories in order
  const categoryButtons = collections
    .filter((c) => 
      DISPLAY_CATEGORIES.some((catName) => 
        c.name.toLowerCase() === catName.toLowerCase()
      )
    )
    .sort((a, b) => {
      const indexA = DISPLAY_CATEGORIES.findIndex((cat) => 
        cat.toLowerCase() === a.name.toLowerCase()
      );
      const indexB = DISPLAY_CATEGORIES.findIndex((cat) => 
        cat.toLowerCase() === b.name.toLowerCase()
      );
      return indexA - indexB;
    })
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
                <div className="category-art-info !text-white">
                  <h3 className="!text-white">{artwork.name}</h3>
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
