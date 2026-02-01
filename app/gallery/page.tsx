import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

const PER_PAGE = 8;

type Props = { searchParams: Promise<{ page?: string; category?: string }> };

function buildQuery(category: number | null, page: number) {
  const sp = new URLSearchParams();
  if (category != null) sp.set("category", String(category));
  if (page > 1) sp.set("page", String(page));
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export default async function Gallery({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const categoryParam = params.category;
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
      where: categoryId ? { collectionId: categoryId } : undefined,
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip,
    }),
    prisma.painting.count({
      where: categoryId ? { collectionId: categoryId } : undefined,
    }),
  ]);
console.log(total);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="gallery-page-wrap">
      <div className="gallery-page-container">
        {/* Category filter */}
        <div className="gallery-filters">
          <span className="gallery-filters__label">კატეგორია:</span>
          <div className="gallery-filters__buttons">
            <Link
              href="/gallery"
              className={`gallery-filter-btn ${categoryId === null ? "gallery-filter-btn--active" : ""}`}
            >
              ყველა
            </Link>
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/gallery?category=${c.id}`}
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
              ნახატები ჯერ არ არის.
            </p>
          ) : (
            paintings.map((item) => (
              <div key={item.id} className="gallery-item-card">
                <Link href={`/products/${item.id}`} className="gallery-item-card__link">
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
                <Link href={`/products/${item.id}`} className="gallery-item-card__title">
                  <h3>{item.name}</h3>
                </Link>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <nav
            className="gallery-pagination"
            aria-label="გალერეის გვერდები"
          >
            {hasPrev && (
              <Link
                href={`/gallery${buildQuery(categoryId, page - 1)}`}
                className="gallery-pagination-btn gallery-pagination-btn--prev"
              >
                ← წინა
              </Link>
            )}
            <span className="gallery-pagination-info">
              გვერდი {page} / {totalPages}
            </span>
            {hasNext && (
              <Link
                href={`/gallery${buildQuery(categoryId, page + 1)}`}
                className="gallery-pagination-btn gallery-pagination-btn--next"
              >
                შემდეგი →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
