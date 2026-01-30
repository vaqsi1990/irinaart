import Link from "next/link";

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="siteFooter__inner">
        <Link href="/" className="siteFooter__name">Irina Art</Link>
        <nav className="siteFooter__nav" aria-label="Footer">
          <Link href="/" className="siteFooter__link">მთავარი</Link>
          <Link href="/gallery" className="siteFooter__link">გალერეა</Link>
          <Link href="/contact" className="siteFooter__link">კონტაქტი</Link>
        </nav>
      </div>
    </footer>
  );
}
