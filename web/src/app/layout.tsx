import type { Metadata } from "next";
import { Source_Serif_4, Poppins, Barlow_Condensed } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Web substitutes sanctioned by the brand guide:
//   Superclarendon -> Source Serif 4 (display/headings)
//   Gotham         -> Poppins (body/UI)
//   Alternate Gothic No.2 D -> Barlow Condensed (all-caps labels/eyebrows)
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: `${site.statement} Brewed in Minneapolis. Find your favorite at our North Loop taproom.`,
  applicationName: site.name,
  keywords: [
    "Pryes Brewing",
    "Minneapolis brewery",
    "Minnesota craft beer",
    "North Loop taproom",
    "Miraculum IPA",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.statement,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.statement,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${poppins.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
