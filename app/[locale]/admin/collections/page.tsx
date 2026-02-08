"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Collection = {
  id: number;
  name: string;
  order: number;
  _count?: { paintings: number };
};

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/collections");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCollections(Array.isArray(data) ? data : []);
    } catch {
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`დარწმუნებული ხართ, რომ გსურთ კატეგორიის „${name}" წაშლა? ნახატები ამ კატეგორიაში ასევე წაიშლება.`))
      return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "წაშლა ვერ მოხერხდა");
      }
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page__title">კატეგორიები (კოლექციები)</h1>
        <Link href="/admin/collections/new" className="siteNav__link">
          კატეგორიის დამატება
        </Link>
      </div>

      {loading ? (
        <p className="admin-empty__text">იტვირთება...</p>
      ) : collections.length === 0 ? (
        <div className="admin-empty">
          <p className="admin-empty__text">კატეგორიები ჯერ არ არის. დაამატე პირველი კატეგორია.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-table__th">სახელი</th>
                <th className="admin-table__th">რიგი</th>
                <th className="admin-table__th">ნახატები</th>
                <th className="admin-table__th admin-table__th--actions">მოქმედებები</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.id} className="admin-table__row">
                  <td className="admin-table__td">
                    <span className="admin-table__title">{c.name}</span>
                  </td>
                  <td className="admin-table__td">{c.order}</td>
                  <td className="admin-table__td">{c._count?.paintings ?? 0}</td>
                  <td className="admin-table__td admin-table__td--actions">
                    <Link
                      href={`/admin/collections/${c.id}/edit`}
                      className="admin-table__btn admin-table__btn--edit"
                    >
                      რედაქტირება
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id, c.name)}
                      disabled={deletingId === c.id}
                      className="admin-table__btn admin-table__btn--delete"
                    >
                      {deletingId === c.id ? "..." : "წაშლა"}
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
