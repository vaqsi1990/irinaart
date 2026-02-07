"use client";

import { useState } from "react";
import { Link as TransitionLink } from "next-transition-router";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="siteNav" aria-label="Primary">
      <div className="siteNav__inner max-w-8xl">
        <div className="siteNav__brand">
          <TransitionLink className="" href={`/${locale}`}>
            <div className="rounded-full overflow-hidden w-[90px] h-[90px]">
              <Image src="/logo.jpg" className="object-cover w-full h-full" alt="logo" width={90} height={90} />
            </div>
          </TransitionLink>
        </div>

        <button
          type="button"
          className="siteNav__burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? tCommon("closeMenu") : tCommon("openMenu")}
        >
          <span className="siteNav__burger-bar" />
          <span className="siteNav__burger-bar" />
          <span className="siteNav__burger-bar" />
        </button>

        <div
          className={`siteNav__links ${menuOpen ? "siteNav__links--open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <TransitionLink className="siteNav__link" href={`/${locale}`} onClick={closeMenu}>
            {t("home")}
          </TransitionLink>
          <TransitionLink className="siteNav__link" href={`/${locale}/gallery`} onClick={closeMenu}>
            {t("gallery")}
          </TransitionLink>
          <TransitionLink className="siteNav__link" href={`/${locale}/about`} onClick={closeMenu}>
            {t("about")}
          </TransitionLink>
          <div className="siteNav__lang-switcher">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`siteNav__backdrop ${menuOpen ? "siteNav__backdrop--open" : ""}`}
        onClick={closeMenu}
        aria-label={tCommon("closeMenu")}
        tabIndex={menuOpen ? 0 : -1}
      />
    </nav>
  );
}
