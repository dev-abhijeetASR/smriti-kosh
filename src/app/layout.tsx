import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "स्मृति कोष • Smriti Kosh — The Sacred Treasury of Family Moments",
  description: "जीवन के पावन उत्सव और अमूल्य क्षणों का संचय | A sacred, high-performance photo & video gallery for family occasions and milestones.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'स्मृति कोष',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-amber-500/20 selection:text-amber-800 dark:selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
