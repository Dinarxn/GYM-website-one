import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/forms/WhatsAppButton';
import GymCanvas from '@/components/canvas/GymCanvas';

export const metadata: Metadata = {
  title: 'IRONFORGE FITNESS | Elite Strength & Conditioning Sanctuary',
  description:
    'Experience an elite 3D strength and conditioning sanctuary. Featuring calibrated competition iron platforms, master CSCS coaching, and sub-zero contrast biohacking recovery suites.',
  keywords: [
    'gym',
    'strength training',
    'powerlifting',
    'bodybuilding',
    'competition iron',
    'athletic conditioning',
    'contrast therapy',
    'cold plunge',
    'personal training',
  ],
  authors: [{ name: 'IRONFORGE FITNESS' }],
  openGraph: {
    title: 'IRONFORGE FITNESS | Elite Strength & Conditioning',
    description:
      'Engineered for those who refuse compromise. Calibrated competition iron, master coaches, and biohacking recovery.',
    url: 'https://ironforgefitness.com',
    siteName: 'IRONFORGE FITNESS',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark font-sans">
      <body className="bg-black text-white min-h-screen relative overflow-x-clip selection:bg-[#7D39EB] selection:text-white">
        {/* Skip to Content Accessible Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[#C6FF33] text-black font-bold uppercase text-xs rounded-md shadow-lg"
        >
          Skip to main content
        </a>

        {/* 3D Canvas Mount Container (Persistent Industrial 3D Pipeline) */}
        <div
          id="canvas-container"
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
          {/* <GymCanvas /> */}
        </div>

        {/* Floating Glass Navbar */}
        <Navbar />

        {/* Main Content Sections */}
        <main id="main-content" className="relative z-10 w-full overflow-x-clip">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Floating Quick WhatsApp Action Button */}
        <WhatsAppButton floating />
      </body>
    </html>
  );
}
