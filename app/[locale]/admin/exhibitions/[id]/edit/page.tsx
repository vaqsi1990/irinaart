"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ImageUploadForProduct from "@/components/productimage";
import { UploadButton } from "@/utils/uploadthing";
import { X } from "lucide-react";
import ImageModal from "@/components/ImageModal";

type ExhibitionImage = {
  id: number;
  image: string;
  alt: string | null;
};

export default function EditExhibitionPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [exhibitionImages, setExhibitionImages] = useState<ExhibitionImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

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
        setExhibitionImages(data.images ?? []);
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

  const handleAddImage = async (uploadedFiles: { url: string }[]) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.error("No files uploaded");
      return;
    }
    setUploadingImage(true);
    setError(null);
    try {
      const results = await Promise.all(
        uploadedFiles.map(async (file) => {
          const res = await fetch(`/api/exhibitions/${id}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image: file.url,
              alt: title?.trim() || undefined,
              exhibitionId: id,
            }),
          });
          
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(errorData.error || `HTTP ${res.status}: სურათის დამატება ვერ მოხერხდა`);
          }
          
          return await res.json();
        })
      );
      
      // Add all new images to state
      setExhibitionImages((prev) => [...prev, ...results]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "სურათის დამატება ვერ მოხერხდა";
      setError(errorMessage);
      console.error("Error adding images:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ ამ სურათის წაშლა?")) return;
    setDeletingImageId(imageId);
    try {
      const res = await fetch(`/api/exhibitions/${id}/images/${imageId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "წაშლა ვერ მოხერხდა");
      }
      setExhibitionImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა");
    } finally {
      setDeletingImageId(null);
    }
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
                onClientUploadComplete={handleAddImage}
                onUploadError={(error) => {
                  console.error("Upload error:", error);
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
                  {exhibitionImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <ImageModal
                        src={img.image}
                        alt={img.alt || title || "გამოფენის სურათი"}
                        className="rounded border border-gray-500 items-center h-[320px] object-cover w-full"
                      />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={deletingImageId === img.id}
                        className="absolute cursor-pointer top-2 right-2 bg-black hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 disabled:opacity-50"
                        type="button"
                        aria-label="სურათის წაშლა"
                      >
                        {deletingImageId === img.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <X className="w-5 h-5" />
                        )}
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
