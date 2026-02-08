"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setFetching(false);
      setError("არასწორი იდენტიფიკატორი");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/collections/${id}`);
        if (!res.ok) throw new Error("ვერ ჩაიტვირთა");
        const data = await res.json();
        if (cancelled) return;
        setName(data.name ?? "");
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "შეცდომა");
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("სახელი აუცილებელია");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "შეცდომა");
      router.push("/admin/collections");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="admin-page">
        <p className="admin-empty__text">იტვირთება...</p>
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="admin-page__title">რედაქტირება</h1>
          <Link href="/admin/collections" className="siteNav__link">
            უკან
          </Link>
        </div>
        <p className="admin-form__error">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page__title">კატეგორიის რედაქტირება</h1>
        <Link href="/admin/collections" className="siteNav__link">
          უკან
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form__card admin-form">
        {error && (
          <p className="admin-form__error" role="alert">
            {error}
          </p>
        )}

        <div className="admin-form__group">
          <label htmlFor="name" className="admin-form__label">
            სახელი
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
            className="admin-form__input"
            placeholder="კატეგორიის სახელი"
          />
        </div>

        <div className="admin-form__actions">
          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary"
          >
            {loading ? "იგზავნება..." : "შენახვა"}
          </button>
          <Link href="/admin/collections" className="admin-back-link">
            გაუქმება
          </Link>
        </div>
      </form>
    </div>
  );
}
