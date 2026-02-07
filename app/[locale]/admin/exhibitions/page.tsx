"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Exhibition = {
  id: number;
  image: string;
  title: string;
  date: string;
  location: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchExhibitions = async () => {
    try {
      const res = await fetch("/api/exhibitions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setExhibitions(data);
    } catch {
      setExhibitions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`დარწმუნებული ხართ, რომ გსურთ გამოფენის „${title}" წაშლა?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/exhibitions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "წაშლა ვერ მოხერხდა");
      }
      setExhibitions((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page__title">გამოფენები</h1>
        <Link href="/admin/exhibitions/new" className="siteNav__link">
          გამოფენის დამატება
        </Link>
      </div>

      {loading ? (
        <p className="admin-empty__text">იტვირთება...</p>
      ) : exhibitions.length === 0 ? (
        <div className="admin-empty">
          <p className="admin-empty__text">გამოფენები ჯერ არ არის. დაამატე პირველი გამოფენა.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-table__th admin-table__th--img">სურათი</th>
                <th className="admin-table__th">სათაური</th>
                <th className="admin-table__th">თარიღი</th>
                <th className="admin-table__th">ადგილი</th>
                <th className="admin-table__th admin-table__th--actions">მოქმედებები</th>
              </tr>
            </thead>
            <tbody>
              {exhibitions.map((ex) => (
                <tr key={ex.id} className="admin-table__row">
                  <td className="admin-table__td admin-table__td--img">
                    <span className="admin-table__img-wrap">
                      <Image
                        src={ex.image}
                        alt={ex.title}
                        width={64}
                        height={64}
                        className="admin-table__img"
                      />
                    </span>
                  </td>
                  <td className="admin-table__td">
                    <span className="admin-table__title">{ex.title}</span>
                  </td>
                  <td className="admin-table__td">{ex.date}</td>
                  <td className="admin-table__td">{ex.location}</td>
                  <td className="admin-table__td admin-table__td--actions">
                    <Link
                      href={`/admin/exhibitions/${ex.id}/edit`}
                      className="admin-table__btn admin-table__btn--edit"
                    >
                      რედაქტირება
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(ex.id, ex.title)}
                      disabled={deletingId === ex.id}
                      className="admin-table__btn admin-table__btn--delete"
                    >
                      {deletingId === ex.id ? "..." : "წაშლა"}
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
