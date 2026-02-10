import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";

/** Always fetch fresh data on Vercel (no static cache at build) */
export const dynamic = "force-dynamic";

const PER_PAGE = 12;

type Props = { 
  searchParams: Promise<{ page?: string; category?: string }>;
  params: Promise<{ locale: string }>;
};

function buildQuery(category: number | null, page: number, locale: string) {
  const sp = new URLSearchParams();
  if (category != null) sp.set("category", String(category));
  if (page > 1) sp.set("page", String(page));
  const q = sp.toString();
  return q ? `/${locale}/sale?${q}` : `/${locale}/sale`;
}

export default async function Sale({ searchParams, params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("gallery");
  const paramsData = await searchParams;
  const page = Math.max(1, parseInt(paramsData.page ?? "1", 10) || 1);
  const categoryParam = paramsData.category;
  const rawId =
    categoryParam != null && categoryParam !== ""
      ? parseInt(categoryParam, 10)
      : NaN;
  const categoryId =
    Number.isInteger(rawId) && rawId > 0 ? rawId : null;
  const skip = (page - 1) * PER_PAGE;

  const [collections, paintings, total] = await Promise.all([
    prisma.collection.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
    prisma.painting.findMany({
      where: {
        forsale: true,
        ...(categoryId ? { collectionId: categoryId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip,
    }),
    prisma.painting.count({
      where: {
        forsale: true,
        ...(categoryId ? { collectionId: categoryId } : {}),
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="gallery-page-wrap">
      <div className="gallery-page-container">
        {/* Category filter */}
        <div className="gallery-filters">
        
          <div className="gallery-filters__buttons">
            <Link
              href={`/${locale}/sale`}
              className={`gallery-filter-btn ${categoryId === null ? "gallery-filter-btn--active" : ""}`}
            >
              {t("all")}
            </Link>
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/${locale}/sale?category=${c.id}`}
                className={`gallery-filter-btn ${categoryId === c.id ? "gallery-filter-btn--active" : ""}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="gallery-grid-responsive">
          {paintings.length === 0 ? (
            <p className="gallery-empty-msg">
              {t("noPaintings")}
            </p>
          ) : (
            paintings.map((item) => (
              <div key={item.id} className="gallery-item-card">
                <Link href={`/${locale}/products/${item.id}`} className="gallery-item-card__link">
                  <div className="gallery-item-card__img-wrap">
                    <Image
                      src={item.image}
                      alt={item.alt || item.name}
                      fill
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </Link>
                <Link href={`/${locale}/products/${item.id}`} className="gallery-item-card__title">
                  <h3>{item.name}</h3>
                </Link>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <nav
            className="gallery-pagination"
            aria-label={t("paginationLabel")}
          >
            {hasPrev && (
              <Link
                href={buildQuery(categoryId, page - 1, locale)}
                className="gallery-pagination-btn gallery-pagination-btn--prev"
              >
                ← {t("prev")}
              </Link>
            )}
            <span className="gallery-pagination-info">
              {t("page", { current: page, total: totalPages })}
            </span>
            {hasNext && (
              <Link
                href={buildQuery(categoryId, page + 1, locale)}
                className="gallery-pagination-btn gallery-pagination-btn--next"
              >
                {t("next")} →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}

