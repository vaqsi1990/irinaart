"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ImageUploadForProduct from "@/components/productimage";

type Collection = { id: number; name: string };

export default function EditPaintingPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [image, setImage] = useState("");
  const [alt, setAlt] = useState("");
  const [name, setName] = useState("");
  const [collectionId, setCollectionId] = useState<number | "">("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCollections(data);
      })
      .catch(() => setCollections([]));
  }, []);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setFetching(false);
      setError("არასწორი იდენტიფიკატორი");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/paintings/${id}`);
        if (!res.ok) throw new Error("ვერ ჩაიტვირთა");
        const data = await res.json();
        if (cancelled) return;
        setImage(data.image ?? "");
        setAlt(data.alt ?? "");
        setName(data.name ?? "");
        setCollectionId(data.collectionId ?? "");
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
    if (!image.trim()) {
      setError("სურათი აუცილებელია");
      return;
    }
    if (collectionId === "") {
      setError("აირჩიეთ კოლექცია");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/paintings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: image.trim(),
          alt: alt.trim(),
          name: name.trim(),
          collectionId: Number(collectionId),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "შეცდომა");
      router.push("/admin/paintings");
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

  if (error && !name && !image) {
    return (
      <div className="admin-page">
        <p className="admin-form__error" role="alert">
          {error}
        </p>
        <Link href="/admin/paintings" className="siteNav__link">
          უკან ნახატების სიაში
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page__title">ნახატის რედაქტირება</h1>
        <Link href="/admin/paintings" className="siteNav__link">
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
            placeholder="ნახატის სახელი"
          />
        </div>

        <div className="admin-form__group">
          <label htmlFor="alt" className="admin-form__label">
            Alt (აღწერა სურათისთვის)
          </label>
          <input
            id="alt"
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            required
            maxLength={500}
            className="admin-form__input"
            placeholder="სურათის აღწერა"
          />
        </div>

        <div className="admin-form__group">
          <label htmlFor="collectionId" className="admin-form__label">
            კოლექცია
          </label>
          <select
            id="collectionId"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value === "" ? "" : Number(e.target.value))}
            required
            className="admin-form__select"
          >
            <option value="">აირჩიეთ კოლექცია</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">სურათი</label>
          <ImageUploadForProduct
            value={image ? [image] : []}
            onChange={(urls) => setImage(urls[0] ?? "")}
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
          <Link href="/admin/paintings" className="admin-back-link">
            გაუქმება
          </Link>
        </div>
      </form>
    </div>
  );
}
