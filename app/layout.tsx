import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
