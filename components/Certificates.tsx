"use client";

import React, { useState } from "react";
import Image from "next/image";

const CERTIFICATE_IMAGES = [
  { src: "/certificates/1.jpg", alt: "Certificate 1" },
  { src: "/certificates/2.jpg", alt: "Certificate 2" },
  { src: "/certificates/3.jpg", alt: "Certificate 3" },
  { src: "/certificates/4.jpg", alt: "Certificate 4" },
  { src: "/certificates/5.jpg", alt: "Certificate 5" },
  { src: "/certificates/6.jpg", alt: "Certificate 6" },
];

type CertificatesProps = {
  /** Optional section title */
  title?: string;
  /** Optional wrapper class */
  className?: string;
};

export default function Certificates({ title = "Certificates", className = "" }: CertificatesProps) {
  const [selected, setSelected] = useState<{ src: string; alt: string } | null>(null);

  return (
   <>
    <h2 className="certificates-title text-[30px] text-[24px]">სერტიფიკატები</h2>
   <div className="mt-14 certificates-section flex justify-center px-4" style={{ marginBottom: "2rem" }}>
      <div className="certificates-container grid grid-cols-2 sm:grid-cols-3 gap-4">
        {CERTIFICATE_IMAGES.map(({ src, alt }) => (
          <div
            key={src}
            className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-200 transition-all duration-300 hover:scale-[1.02]"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
   </div>
   
   </>
  );
}
