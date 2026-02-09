import type { Metadata } from "next";
import { Didact_Gothic } from "next/font/google";
import "./globals.css";

const didactGothic = Didact_Gothic({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-didact-gothic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Irina Dzamashvili - Artist",
  description: "Irina Dzamashvili - Artist Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${didactGothic.variable} antialiased`}
        style={{ fontFamily: "var(--font-didact-gothic), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
