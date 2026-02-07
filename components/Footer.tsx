"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const phoneNumber = "+9955599273228";


type FooterProps = {
  /** Facebook profile or page URL */
  facebookUrl?: string;
  /** WhatsApp number with country code, no + (e.g. "995555123456") */
  whatsappNumber?: string;
};

export default function Footer({
  facebookUrl = "https://www.facebook.com/",
  whatsappNumber = "99599273228 ",
}: FooterProps) {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="siteFooter">
      <div className="siteFooter__inner">
        <Link href={`/${locale}`} className="siteFooter__name">
          Irina Art
        </Link>
        <nav className="siteFooter__nav" aria-label="Footer">
          <Link href={`/${locale}`} className="siteFooter__link">
            {t("home")}
          </Link>
          <Link href={`/${locale}/gallery`} className="siteFooter__link">
            {t("gallery")}
          </Link>
          <Link href={`/${locale}/about`} className="siteFooter__link">
            {t("about")}
          </Link>
        </nav>
        <div className="siteFooter__contacts" aria-label="კონტაქტი">
        <Link  target="_blank" href="https://www.facebook.com/profile.php?id=100063680016876" className="w-12 h-12 md:w-14 md:h-14 bg-[#1877F2] hover:bg-[#166FE5] rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110" aria-label="Facebook">
            <FaFacebook className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </Link>
          <Link
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open WhatsApp"
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-105 transition-transform duration-200"
          >
            <FaWhatsapp className="text-white text-[35px]  md:text-[40px]" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
