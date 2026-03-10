import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "irinadzart.ge",
  description: "Irina Dzamashvili - Artist Portfolio",
  icons: {
    icon: "/logo.jpg",
  },
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
