"use client";

import { useState } from "react";
import Link from "next/link";
import ImageUploadForProduct from "@/components/productimage";
import { UploadButton } from "@/utils/uploadthing";
import { X } from "lucide-react";
import ImageModal from "@/components/ImageModal";

export default function NewExhibitionPage() {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [exhibitionImages, setExhibitionImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddImage = (uploadedFiles: { url: string }[]) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    setUploadingImage(false);
    const newUrls = uploadedFiles.map((file) => file.url);
    setExhibitionImages((prev) => [...prev, ...newUrls]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setExhibitionImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!image.trim()) {
      setError("სურათი აუცილებელია");
      return;
    }
    setLoading(true);
    try {
      // First, create the exhibition
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

      const exhibitionId = data.id;

      // Then, add all exhibition images
      if (exhibitionImages.length > 0) {
        try {
          await Promise.all(
            exhibitionImages.map(async (imgUrl) => {
              const imgRes = await fetch(`/api/exhibitions/${exhibitionId}/images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  image: imgUrl,
                  alt: title?.trim() || undefined,
                  exhibitionId: exhibitionId,
                }),
              });
              if (!imgRes.ok) {
                const errorData = await imgRes.json().catch(() => ({ error: "Unknown error" }));
                throw new Error(errorData.error || "სურათის დამატება ვერ მოხერხდა");
              }
            })
          );
        } catch (imgErr) {
          console.error("Error adding images:", imgErr);
          // Don't fail the whole operation if images fail, just show a warning
          setError(`გამოფენა შეიქმნა, მაგრამ სურათების დამატება ვერ მოხერხდა: ${imgErr instanceof Error ? imgErr.message : "უცნობი შეცდომა"}`);
          setTimeout(() => {
            window.location.href = "/admin/exhibitions";
          }, 2000);
          return;
        }
      }

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
          <label className="admin-form__label">მთავარი სურათი</label>
          <ImageUploadForProduct
            value={image ? [image] : []}
            onChange={(urls) => setImage(urls[0] ?? "")}
          />
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">გამოფენის სურათები</label>
          {error && error.includes("სურათ") && (
            <p className="admin-form__error" role="alert" style={{ marginBottom: "1rem" }}>
              {error}
            </p>
          )}
          <div className="exhibition-images-section">
            <div className="upload-thing-image-upload">
              <UploadButton
                endpoint="imageUploader"
                onUploadBegin={() => setUploadingImage(true)}
                onClientUploadComplete={handleAddImage}
                onUploadError={(error) => {
                  console.error("Upload error:", error);
                  setUploadingImage(false);
                  setError(`ატვირთვის შეცდომა: ${error.message || "უცნობი შეცდომა"}`);
                }}
                content={{
                  button: uploadingImage ? "იტვირთება..." : "სურათების ატვირთვა",
                  allowedContent: "ყველა ტიპის სურათი (PNG, JPG, GIF, WebP) - შეგიძლიათ რამდენიმე ატვირთოთ",
                }}
                appearance={{
                  button: "ut-upload-btn",
                  allowedContent: "ut-allowed-content",
                }}
              />
            </div>

            {exhibitionImages.length > 0 ? (
              <div className="mt-4 space-y-2">
                <h2 className="text-sm font-semibold text-black">ატვირთული სურათები ({exhibitionImages.length})</h2>
                <div className="grid md:grid-cols-3 grid-cols-2 gap-3">
                  {exhibitionImages.map((imgUrl, index) => (
                    <div key={`${imgUrl}-${index}`} className="relative group">
                      <ImageModal
                        src={imgUrl}
                        alt={title || "გამოფენის სურათი"}
                        className="rounded border border-gray-500 items-center h-[320px] object-cover w-full"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute cursor-pointer top-2 right-2 bg-black hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                        type="button"
                        aria-label="სურათის წაშლა"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-1 text-white text-sm text-center">სურათები ჯერ არ არის ატვირთული. შეგიძლიათ რამდენიმე სურათი ერთდროულად ატვირთოთ (Ctrl+Click ან Shift+Click).</p>
            )}
          </div>
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
