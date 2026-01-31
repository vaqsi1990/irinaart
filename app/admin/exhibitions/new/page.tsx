"use client";

import { useState } from "react";
import Link from "next/link";
import ImageUploadForProduct from "@/components/productimage";

export default function NewExhibitionPage() {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!image.trim()) {
      setError("სურათი აუცილებელია");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/exhibitions", {
        method: "POST",
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
      window.location.href = "/admin/exhibitions";
    } catch (err) {
      setError(err instanceof Error ? err.message : "შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page__title">ახალი გამოფენა</h1>
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
