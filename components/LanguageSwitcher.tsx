"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { routing } from "@/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    // Add new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="language-switcher">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`language-switcher__btn ${locale === loc ? "language-switcher__btn--active" : ""}`}
          aria-label={`Switch to ${loc === "ka" ? "Georgian" : "English"}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

