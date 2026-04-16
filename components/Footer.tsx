"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";

const contactPhoneDisplay = "+995599790831";
const contactEmail = "irinedzamashvili@gmail.com";


type FooterProps = {
  /** Facebook profile or page URL */
  facebookUrl?: string;
  /** WhatsApp number with country code, no + (e.g. "995555123456") */
  whatsappNumber?: string;
};

export default function Footer({
  facebookUrl = "https://www.facebook.com/profile.php?id=100063680016876",
  whatsappNumber = "9955599273228",
}: FooterProps) {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
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
        <div
          className="siteFooter__contactsWrap"
          role="group"
          aria-label={tf("contactAria")}
        >
          <div className="siteFooter__contactDetails flex flex-col items-center justify-center">
            <a
              href={`tel:${contactPhoneDisplay.replace(/\s/g, "")}`}
              className="siteFooter__contactLine"
            >
              {tf("phoneLabel")}{" "}
              <span className="siteFooter__contactValue">{contactPhoneDisplay}</span>
            </a>
            <a href={`mailto:${contactEmail}`} className="siteFooter__contactLine">
              {tf("emailLabel")}{" "}
              <span className="siteFooter__contactValue">{contactEmail}</span>
            </a>
          </div>
          <div className="siteFooter__contacts">
            <Link
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="siteFooter__icon siteFooter__icon--facebook"
              aria-label={tf("facebookAria")}
            >
              <FaFacebook aria-hidden />
            </Link>
            <Link
              href={`https://wa.me/${String(whatsappNumber).replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="siteFooter__icon siteFooter__icon--whatsapp"
              aria-label={tf("whatsappAria")}
            >
              <FaWhatsapp aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
