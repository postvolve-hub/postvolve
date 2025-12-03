import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: "PostVolve - Automated Authority",
  description: "Viral News Cards That Drive Real Engagement. Generate, Schedule, Post, and Analyze News Cards Automatically.",
  openGraph: {
    title: "PostVolve - Automated Authority",
    description: "Viral News Cards That Drive Real Engagement. Generate, Schedule, Post, and Analyze News Cards Automatically.",
    type: "website",
    images: ["/opengraph.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PostVolve - Automated Authority",
    description: "Viral News Cards That Drive Real Engagement. Generate, Schedule, Post, and Analyze News Cards Automatically.",
    images: ["/opengraph.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

