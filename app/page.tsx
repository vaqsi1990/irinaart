import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import StoryGallery from "@/components/StoryGallery";
import { storySlides } from "@/data/storySlides";
import prisma from "@/lib/prisma";
import type { StorySlide } from "@/data/storySlides";

function exhibitionsToSlides(
  exhibitions: { id: number; image: string; title: string; date: string; location: string; description: string }[]
): StorySlide[] {
  return exhibitions.map((e) => ({
    id: e.id,
    image: e.image,
    alt: e.title,
    title: e.title,
    date: e.date,
    location: e.location,
    paragraphs: e.description
      ? e.description
          .split(/\n\n+/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [],
  }));
}

export default async function Home() {
  let slides: StorySlide[] = storySlides;
  try {
    const exhibitions = await prisma.exhibition.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (exhibitions.length > 0) {
      slides = exhibitionsToSlides(exhibitions);
    }
  } catch {
    // keep static storySlides on error
  }

  return (
    <>
      <Hero />
      <Categories />
      <StoryGallery slides={slides} centerButtonLabel="W" />
    </>
  );
}
