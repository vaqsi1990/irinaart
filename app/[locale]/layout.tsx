import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/routing';
import ConditionalTransitionProvider from "@/providers/ConditionalTransitionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ConditionalTransitionProvider>
        <div className="layoutWrapper">
          <Header />
          <main className="appMain">{children}</main>
          <Footer />
        </div>
      </ConditionalTransitionProvider>
    </NextIntlClientProvider>
  );
}

