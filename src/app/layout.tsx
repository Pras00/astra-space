import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#060608",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "ASTRA — Cislunar & Deep-Space Flight Systems",
  description:
    "ASTRA designs heavy-lift orbital logistics, nuclear thermal transit vehicles, and autonomous planetary infrastructure across Moon, Mars, and outer-system corridors.",
  keywords: [
    "ASTRA",
    "cislunar logistics",
    "nuclear thermal propulsion",
    "mars transit",
    "aerospace systems",
    "deep space",
    "spacecraft architecture",
  ],
  authors: [{ name: "ASTRA Flight Systems" }],
  creator: "ASTRA",
  publisher: "ASTRA Flight Systems",
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
    title: "ASTRA — Cislunar & Deep-Space Flight Systems",
    description:
      "Heavy orbital freighters, nuclear thermal interplanetary cruisers, and autonomous cryo-ocean probes.",
    siteName: "ASTRA Flight Systems",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASTRA — Cislunar & Deep-Space Flight Systems",
    description:
      "Heavy orbital freighters, nuclear thermal interplanetary cruisers, and autonomous cryo-ocean probes.",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-obsidian text-bone font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-signal text-bone font-mono text-xs uppercase tracking-widest outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
