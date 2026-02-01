"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ImageUploadForProduct from "@/components/productimage";

export default function EditExhibitionPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
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
        const res = await fetch(`/api/exhibitions/${id}`);
        if (!res.ok) throw new Error("ვერ ჩაიტვირთა");
        const data = await res.json();
        if (cancelled) return;
        setImage(data.image ?? "");
        setTitle(data.title ?? "");
        setDate(data.date ?? "");
        setLocation(data.location ?? "");
        setDescription(data.description ?? "");
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
    setLoading(true);
    try {
      const res = await fetch(`/api/exhibitions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: image.trim(),
          title: title.trim(),
          date: date.trim(),
          location: location.trim(),
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "შეცდომა");
      router.push("/admin/exhibitions");
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

  if (error && !title && !image) {
    return (
      <div className="admin-page">
        <p className="admin-form__error" role="alert">
          {error}
        </p>
        <Link href="/admin/exhibitions" className="siteNav__link">
          უკან გამოფენების სიაში
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page__title">გამოფენის რედაქტირება</h1>
        <Link href="/admin/exhibitions" className="siteNav__link">
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
          <label htmlFor="title" className="admin-form__label">
            სათაური
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className="admin-form__input"
            placeholder="გამოფენის სათაური"
          />
        </div>

        <div className="admin-form__group">
          <label htmlFor="date" className="admin-form__label">
            თარიღი
          </label>
          <input
            id="date"
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            maxLength={100}
            className="admin-form__input"
            placeholder="მაგ. 2024, ან 15 მარტი – 20 აპრილი 2024"
          />
        </div>

        <div className="admin-form__group">
          <label htmlFor="location" className="admin-form__label">
            მისამართი / ადგილი
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            maxLength={200}
            className="admin-form__input"
            placeholder="ადგილმდებარეობა"
          />
        </div>

        <div className="admin-form__group">
          <label htmlFor="description" className="admin-form__label">
            აღწერა
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="admin-form__textarea"
            placeholder="გამოფენის აღწერა"
          />
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
          <Link href="/admin/exhibitions" className="admin-back-link">
            გაუქმება
          </Link>
        </div>
      </form>
    </div>
  );
}
