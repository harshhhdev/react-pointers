import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { CursorProvider } from "qursor";
import "qursor/styles.css";
import { CustomCursor } from "../components/cursor-variants";

const geistSans = localFont({
  src: "./fonts/geist.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/geist-mono.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qursor.harshsingh.me"),
  title: "Qursor",
  creator: "Harsh Singh",
  publisher: "Harsh Singh",
  description: "Plug n' play custom cursors for React. ",
  keywords: [
    "custom cursors",
    "cursor library",
    "React cursors",
    "interactive cursors",
    "cursor animations",
    "cursor effects",
    "cursor customization",
    "cursor design",
    "cursor variants",
    "cursor styles",
    "cursor components",
    "cursor UI",
    "cursor plugins",
    "cursor tools",
    "cursor development",
    "cursor integration",
    "cursor enhancements",
    "cursor interactions",
    "cursor UX",
    "cursor for react",
  ],
  authors: [{ name: "Harsh Singh", url: "https://harshsingh.me" }],
  openGraph: {
    title: "Qursor",
    description: "Plug n' play custom cursors for React. ",
    url: "https://qursor.harshsingh.me",
    siteName: "Harsh Singh",
    images: [
      { url: "https://qursor.harshsingh.me/og.png", width: 1200, height: 630 },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qursor",
    description: "Plug n' play custom cursors for React. ",
    siteId: "Qursor",
    creator: "@haaarshsingh",
    creatorId: "haaarshsingh",
    images: {
      url: "https://qursor.harshsingh.me/og.png",
      alt: "Qursor",
    },
  },
  verification: {
    google: "VWhTtgTikPqvWIY4n2rlUj6Fe9YgkfFMEET3TM7Rce0",
    yandex: "cfc27cbb03eb0a9c",
    yahoo: "yahoo",
    other: { me: ["h@harshsingh.me"] },
  },
  alternates: { canonical: "https://qursor.harshsingh.me" },
  category: "technology",
};

const cursorVariants = {
  default: CustomCursor,
  hover: CustomCursor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CursorProvider variants={cursorVariants} config={{ trailing: 0.12 }}>
          {children}
        </CursorProvider>
        <Script
          defer
          src="https://admin.harshsingh.me/script.js"
          data-website-id="f8b3eb26-9ddb-4172-bbe6-94104bdedc88"
        />
      </body>
    </html>
  );
}
