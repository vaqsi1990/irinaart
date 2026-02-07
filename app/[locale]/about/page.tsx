import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");

  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <article className="about-page">
      <div className="about-page__container">
        <header className="about-page__header">
          <h1 className="about-page__title">{t("title")}</h1>
        </header>

        <div className="about-page__content">
          <div className="about-page__image-wrap">
            <Image
              src="/me.jpg"
              alt={t("title")}
              width={480}
              height={640}
              className="about-page__image"
              priority
            />
          </div>

          <div className="about-page__text">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="about-page__p">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

