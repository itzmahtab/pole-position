import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { ScrollProvider } from "@/components/providers/scroll-provider";
import { CursorGlow } from "@/components/shared/cursor-glow";
import { appBaseUrl } from "@/lib/app-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(appBaseUrl()),
  title: {
    default: "Pole Position — the ultimate Formula 1 companion",
    template: "%s | Pole Position",
  },
  description:
    "Live standings, race weekend timeline, session countdowns and the full F1 calendar — instantly converted to your local timezone.",
  keywords: [
    "Formula 1",
    "F1 live",
    "F1 standings",
    "race calendar",
    "race weekend",
    "session countdown",
    "F1 weather",
  ],
  authors: [{ name: "Pole Position" }],
  creator: "Pole Position",
  alternates: {
    canonical: appBaseUrl(),
  },
  openGraph: {
    title: "Pole Position — the ultimate Formula 1 companion",
    description:
      "Live standings, race weekend timeline, session countdowns and the full F1 calendar — instantly converted to your local timezone.",
    type: "website",
    url: appBaseUrl(),
    siteName: "Pole Position",
    locale: "en_US",
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
          <QueryProvider>
            <ScrollProvider>
              <TooltipProvider delay={300}>
                {children}
                <CursorGlow />
              </TooltipProvider>
            </ScrollProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
