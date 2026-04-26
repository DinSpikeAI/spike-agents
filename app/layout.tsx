import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spike AI Agents — סוכני AI לעסקים ישראליים",
  description: "5 סוכני AI שעובדים בשבילך 24/7 ושולחים לך כל מה שחשוב — בטלגרם",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} antialiased`} style={{ fontFamily: "var(--font-heebo)" }}>
        {children}
      </body>
    </html>
  );
}
