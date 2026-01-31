import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import StoryGallery from "@/components/StoryGallery";
import { storySlides } from "@/data/storySlides";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <StoryGallery slides={storySlides} centerButtonLabel="W" />
    </>
  );
}
