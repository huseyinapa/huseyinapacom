import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = localFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export const metadata: Metadata = {
  title: {
    default: "huseyinapa.com",
    template: "%s | huseyinapa.com",
  },
  description: "Space enthusiast who loves creating and building things.",
  openGraph: {
    title: "huseyinapa.com",
    description: "Space enthusiast who loves creating and building things.",
    url: "https://www.huseyinapa.com",
    siteName: "huseyinapa.com",
    images: [
      {
        url: "https://www.huseyinapa.com/favicon.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "tr-TR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Huseyinapa",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="tr" className={[inter.variable, calSans.variable].join(" ")}>
      <body
        className={`${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        {children}
      </body>
    </html>
  );
}
