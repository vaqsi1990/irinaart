"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Painting = {
  id: number;
  image: string;
  alt: string;
  name: string;
  collectionId: number;
  collection: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
};

export default function AdminPaintingsPage() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchPaintings = async () => {
    try {
      const res = await fetch("/api/paintings");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPaintings(data);
    } catch {
      setPaintings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaintings();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`დარწმუნებული ხართ, რომ გსურთ ნახატის „${name}" წაშლა?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/paintings/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "წაშლა ვერ მოხერხდა");
      }
      setPaintings((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page__title">ნახატები</h1>
        <Link href="/admin/paintings/new" className="siteNav__link">
          ნახატის დამატება
        </Link>
      </div>

      {loading ? (
        <p className="admin-empty__text">იტვირთება...</p>
      ) : paintings.length === 0 ? (
        <div className="admin-empty">
          <p className="admin-empty__text">ნახატები ჯერ არ არის. დაამატე პირველი ნახატი.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-table__th admin-table__th--img">სურათი</th>
                <th className="admin-table__th">სახელი</th>
                <th className="admin-table__th">Alt</th>
                <th className="admin-table__th">კოლექცია</th>
                <th className="admin-table__th admin-table__th--actions">მოქმედებები</th>
              </tr>
            </thead>
            <tbody>
              {paintings.map((p) => (
                <tr key={p.id} className="admin-table__row">
                  <td className="admin-table__td admin-table__td--img">
                    <span className="admin-table__img-wrap">
                      <Image
                        src={p.image}
                        alt={p.alt}
                        width={64}
                        height={64}
                        className="admin-table__img"
                      />
                    </span>
                  </td>
                  <td className="admin-table__td">
                    <span className="admin-table__title">{p.name}</span>
                  </td>
                  <td className="admin-table__td">{p.alt}</td>
                  <td className="admin-table__td">{p.collection?.name ?? "—"}</td>
                  <td className="admin-table__td admin-table__td--actions">
                    <Link
                      href={`/admin/paintings/${p.id}/edit`}
                      className="admin-table__btn admin-table__btn--edit"
                    >
                      რედაქტირება
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deletingId === p.id}
                      className="admin-table__btn admin-table__btn--delete"
                    >
                      {deletingId === p.id ? "..." : "წაშლა"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
