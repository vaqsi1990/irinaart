"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "პანელი" },
  { href: "/admin/paintings", label: "ნახატები" },
  { href: "/admin/exhibitions", label: "გამოფენები" },
  { href: "/admin/collections", label: "კოლექციები" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="admin-menu-btn"
        aria-label="მენიუ"
        aria-expanded={open}
      >
        {open ? (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <button
          type="button"
          onClick={close}
          className="admin-overlay"
          aria-label="დახურვა"
        />
      )}

      <aside className={`admin-aside ${open ? "admin-aside--open" : ""}`}>
        <div className="admin-aside__inner">
          <div className="admin-aside__header">
            <span className="admin-aside__title">ადმინი</span>
            <button
              type="button"
              onClick={close}
              className="admin-aside__close"
              aria-label="დახურვა"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="admin-nav" aria-label="ნავიგაცია">
            <ul className="admin-nav-list">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className={`admin-nav-link ${isActive ? "admin-nav-link--active" : "admin-nav-link--inactive"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="admin-aside__footer">
            <Link href="/" className="admin-back-link">
              ← უკან საიტზე
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
