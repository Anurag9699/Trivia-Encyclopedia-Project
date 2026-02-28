import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Trivia Encyclopedia — 3D Movie Trivia Experience',
  description:
    'Explore hundreds of movies in a stunning 3D sphere. Click any poster to discover AI-generated trivia facts in a cinematic immersive experience.',
  keywords: ['movies', 'trivia', 'cinema', '3D', 'WebGL', 'encyclopedia'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black text-white antialiased font-sans overflow-hidden">
        {children}
      </body>
    </html>
  );
}
