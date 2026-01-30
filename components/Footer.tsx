import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return ( 
    <footer className="siteFooter bg-[#e3d7c1]">
      <div className="siteFooter__inner max-w-8xl">
        <div className="siteFooter__top">
          <Link href="/" className="siteFooter__brand">
          
            <span className="siteFooter__name">Irina Art</span>
          </Link>

          <nav className="siteFooter__nav" aria-label="Footer">
            <Link href="/" className="siteFooter__link">
              მთავარი
            </Link>
            <Link href="/gallery" className="siteFooter__link">
              გალერეა
            </Link>
            <Link href="/contact" className="siteFooter__link">
              კონტაქტი
            </Link>
          </nav>
        </div>

       
      </div>
    </footer>
  );
}