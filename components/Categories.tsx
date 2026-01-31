"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { galleryItems } from '@/data/galleryItems'
import { collections } from '@/data/collections'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

const Categories = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const paintRef = useRef<HTMLDivElement>(null)
  const [paintAnimated, setPaintAnimated] = useState(false)

  useEffect(() => {
    if (!paintRef.current) return
    const el = paintRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPaintAnimated(true)
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Category buttons from collections
  const categoryButtons = [
    { name: 'ყველა', value: 'all' },
    ...collections.map((c) => ({ name: c.name, value: c.name }))
  ]

  // Artworks filtered by selected collection (collection name matches galleryItem.name)
  const getFilteredArtworks = (): typeof galleryItems => {
    if (selectedCategory === 'all') return galleryItems
    return galleryItems.filter((a) => a.name === selectedCategory)
  }
  const filteredArtworks = getFilteredArtworks()

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
          {filteredArtworks.map((artwork, index) => (
            <div key={artwork.id} className="category-item">
              <div className="category-frame-outer">
                <div className="category-frame-inner">
                  <Link href={`/products/${artwork.id}`}>
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categories
