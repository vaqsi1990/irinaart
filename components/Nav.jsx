"use client";

import { useState } from "react";
import { Link as TransitionLink } from "next-transition-router";
import Image from "next/image";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="siteNav" aria-label="Primary">
      <div className="siteNav__inner max-w-8xl">
        <div className="siteNav__brand">
          <TransitionLink className="" href="/">
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
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="siteNav__burger-bar" />
          <span className="siteNav__burger-bar" />
          <span className="siteNav__burger-bar" />
        </button>

        <div
          className={`siteNav__links ${menuOpen ? "siteNav__links--open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <TransitionLink className="siteNav__link" href="/" onClick={closeMenu}>
            მთავარი
          </TransitionLink>
          <TransitionLink className="siteNav__link" href="/gallery" onClick={closeMenu}>
            გალერეა
          </TransitionLink>
          <TransitionLink className="siteNav__link" href="/about" onClick={closeMenu}>
            ჩემს შესახებ
          </TransitionLink>
        </div>
      </div>

      <button
        type="button"
        className={`siteNav__backdrop ${menuOpen ? "siteNav__backdrop--open" : ""}`}
        onClick={closeMenu}
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
      />
    </nav>
  );
}
