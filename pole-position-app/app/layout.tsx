import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pole Position — the ultimate Formula 1 companion",
  description:
    "Live standings, race weekend timeline, session countdowns and the full F1 calendar — instantly converted to your local timezone.",
  authors: [{ name: "Pole Position" }],
  metadataBase: new URL("https://pole-position.vercel.app"),
  openGraph: {
    title: "Pole Position — the ultimate Formula 1 companion",
    description:
      "Live standings, race weekend timeline, session countdowns and the full F1 calendar — instantly converted to your local timezone.",
    type: "website",
    siteName: "Pole Position",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pole Position — the ultimate Formula 1 companion",
    description:
      "Live standings, race weekend timeline, session countdowns and the full F1 calendar — instantly converted to your local timezone.",
  },
  other: {
    "theme-color": "#05070A",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delay={300}>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
