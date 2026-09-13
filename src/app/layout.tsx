import type { Metadata, Viewport } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "ASTRA — Beyond Earth. Explore What's Next.",
  description:
    "ASTRA is a next-generation space exploration organization engineering humanity's journey beyond Earth. Lunar infrastructure, Mars expeditions, and deep-space science.",
  keywords: [
    "ASTRA",
    "space exploration",
    "lunar mission",
    "mars expedition",
    "aerospace engineering",
    "deep space",
    "spacecraft",
    "interplanetary",
  ],
  authors: [{ name: "ASTRA Exploration Systems" }],
  creator: "ASTRA",
  publisher: "ASTRA Systems",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://astra.exploration",
    title: "ASTRA — Beyond Earth. Explore What's Next.",
    description:
      "We engineer the missions that take humanity beyond the known. From orbital bases to deep-space propulsion.",
    siteName: "ASTRA Exploration",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASTRA — Beyond Earth. Explore What's Next.",
    description:
      "We engineer the missions that take humanity beyond the known. Lunar bases, Mars expeditions, and deep space research.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-white antialiased">
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-sky-500 text-black font-semibold rounded outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
