"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { routing } from "@/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="language-switcher" ref={ref} data-open={open}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="language-switcher__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span>{locale.toUpperCase()}</span>
        <svg className="language-switcher__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          className="language-switcher__dropdown"
          role="listbox"
          aria-label="Language options"
        >
          {routing.locales.map((loc) => (
            <li key={loc} role="option" aria-selected={locale === loc}>
              <button
                type="button"
                onClick={() => switchLocale(loc)}
                className={`language-switcher__option ${locale === loc ? "language-switcher__option--active" : ""}`}
                aria-label={`Switch to ${loc === "ka" ? "Georgian" : "English"}`}
              >
                {loc.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

