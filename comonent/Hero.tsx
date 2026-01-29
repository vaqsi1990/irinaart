"use client";
import React, { useState } from "react";

type Slide = {
  id: number;
  label: string;
  series: string;
  title: string;
  tagline: string;
  chips: string[];
  image: string;
  indicator: string;
};

const INITIAL_SLIDES: Slide[] = [
  {
    id: 0,
    label: "SERIES I",
    series: "NEON CITY",
    title: "Midnight Highways",
    tagline:
      "A cinematic journey through electric skylines, where every reflection is a parallel reality.",
    chips: ["4K Textures", "Long Exposure"],
    image: "/615870184_1493962962736357_6308310756661494169_n.jpg",
    indicator: "01 · 03",
  },
  {
    id: 1,
    label: "SERIES II",
    series: "LIGHT WAVES",
    title: "Chromatic Echoes",
    tagline:
      "Sculpted light frozen in motion, capturing the rhythm of sound, color, and speed.",
    chips: ["Studio Capture", "Long Form Series"],
    image: "/616798825_1493962852736368_4023848588397031089_n.jpg",
    indicator: "02 · 03",
  },
  {
    id: 2,
    label: "SERIES III",
    series: "FUTURE FORMS",
    title: "Glass Horizon",
    tagline:
      "Monumental silhouettes suspended in the twilight between reality and rendered fantasy.",
    chips: ["Architectural", "Concept Series"],
    image: "/619185382_1496625222470131_5424354655690149590_n.jpg",
    indicator: "03 · 03",
  },
];

const Hero: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(INITIAL_SLIDES);

  const handleNext = () => {
    setSlides((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const handlePrev = () => {
    setSlides((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      return [last, ...prev.slice(0, prev.length - 1)];
    });
  };

  return (
 <>
 
 </>
  );
};

export default Hero;