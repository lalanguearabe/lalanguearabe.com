import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: ' lalanguearabe.com - Plateforme d\'apprentissage de l\'arabe',
  description: 'Découvrez notre méthode progressive d\'apprentissage de l\'arabe',
  icons: [
    { rel: 'icon', url: '/favicon.ico' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Suppression des métadonnées liées au PWA */}
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}