import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const SITE_URL = "https://spikeai.co.il";
const SITE_NAME = "Spike AI Agents";
const SITE_TITLE = "Spike AI Agents — סוכני AI לעסקים ישראליים";
const SITE_DESCRIPTION =
  "צוות שלם של סוכני AI שעובד בשבילך 24/7. דוחות בטלגרם, ניהול רשתות, סינון לידים, ובקרת איכות — בלי הוצאות שכר ובלי כאבי ראש.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "סוכני AI",
    "AI agents",
    "אוטומציה לעסקים",
    "סוכני AI בעברית",
    "Spike AI",
    "ניהול עסק עם AI",
    "סוכן וירטואלי",
    "אוטומציה",
    "DFY AI",
  ],
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Spike AI Agents — סוכני AI לעסקים ישראליים",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/spike-mascot.png", type: "image/png" },
    ],
    apple: [{ url: "/spike-mascot.png" }],
    shortcut: ["/favicon.ico"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#07111A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${heebo.variable} antialiased`}
        style={{ fontFamily: "var(--font-heebo)" }}
      >
        {children}
      </body>
    </html>
  );
}
