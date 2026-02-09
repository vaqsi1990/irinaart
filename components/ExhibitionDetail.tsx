"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

type ExhibitionImage = {
  id: number;
  image: string;
  alt: string | null;
};

/** Shape from Prisma exhibition with include: { images: true } */
type ExhibitionWithImages = {
  id: number;
  image: string;
  title: string;
  date: string;
  location: string;
  description: string;
  images: ExhibitionImage[];
};

type ExhibitionDetailProps = {
  exhibition: ExhibitionWithImages;
};

export default function ExhibitionDetail({ exhibition }: ExhibitionDetailProps) {
  const t = useTranslations("exhibition");
  const locale = useLocale();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".exhibition-header-image", {
        opacity: 0,
        scale: 0.95,
        x: -50,
      });

      gsap.set(".exhibition-info > *", {
        opacity: 0,
        y: 30,
      });

      gsap.set(".gallery-item-card", {
        opacity: 0,
        y: 24,
        scale: 0.98,
      });

      gsap.to(".exhibition-header-image", {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(".exhibition-info > *", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.to(".gallery-item-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.6,
      });
    }, pageRef);

    return () => ctx.revert();
  }, [exhibition.id]);

  return (
    <div ref={pageRef} className="exhibition-details-section">
      <div className="exhibition-details-container">
        <Link href={`/${locale}`} className="back-link !text-white">
          <Image src="/back.png" alt="arrow-left" width={20} height={20} /> {t("backToHome") || "მთავარ გვერდზე"}
        </Link>

        <div className="exhibition-details-grid">
          {/* Header Image */}
          <div className="exhibition-header-image">
            <div className="frame-outer">
              <div className="frame-inner">
                <img
                  src={exhibition.image}
                  alt={exhibition.title}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Exhibition Info */}
          <div className="exhibition-info">
            <h1 className="exhibition-title">{exhibition.title}</h1>

            <div className="exhibition-meta">
              <p className="exhibition-date">
                <strong>{t("date") || "თარიღი:"}</strong> {exhibition.date}
              </p>
              <p className="exhibition-location">
                <strong>{t("location") || "ადგილმდებარეობა:"}</strong> {exhibition.location}
              </p>
            </div>

            <div className="exhibition-description">
              <p>{exhibition.description}</p>
            </div>
          </div>
        </div>

        {/* Gallery of Exhibition Images */}
        {exhibition.images.length > 0 && (
          <div className="exhibition-gallery-section">
            <h2 className="exhibition-gallery-title">{t("galleryTitle") || "გამოფენის სურათები"}</h2>
            <div className="gallery-grid-responsive">
              {exhibition.images.map((img) => (
                <div key={img.id} className="gallery-item-card">
                  <div className="gallery-item-card__link" style={{ cursor: "default" }}>
                    <div className="gallery-item-card__img-wrap">
                      <Image
                        src={img.image}
                        alt={img.alt || exhibition.title}
                        fill
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
