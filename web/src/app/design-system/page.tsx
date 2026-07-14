import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { SiteFooter } from "@/components/site-footer";
import { DesignSystem } from "@/components/design-system";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "The Pryes Brewing design system: brand color, typography, and touch-friendly components built on shadcn/ui.",
  robots: { index: false, follow: true }, // internal reference, keep out of search
};

const sections = [
  { label: "Color", href: "#color" },
  { label: "Type", href: "#type" },
  { label: "Buttons", href: "#buttons" },
  { label: "Tags", href: "#tags" },
  { label: "Forms", href: "#forms" },
  { label: "Cards", href: "#cards" },
  { label: "Tabs", href: "#tabs" },
  { label: "Accordion", href: "#accordion" },
];

export default function DesignSystemPage() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" aria-label="Pryes Brewing Company home">
            <BrandMark className="h-6 w-auto md:h-7" />
          </Link>
          <Button asChild size="sm" variant="outline" className="eyebrow tracking-[0.14em]">
            <Link href="/">View the site</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* page hero */}
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <p className="eyebrow text-xs text-muted-foreground md:text-sm">
              Pryes Brewing · 2026
            </p>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              The design system
            </h1>
            <p className="mt-5 max-w-xl text-lg text-foreground/70">
              The brand&apos;s color, type, and components in one place, built on
              shadcn/ui and tuned for touch. This is the kit every Pryes screen is
              assembled from.
            </p>
            <nav className="mt-8 flex flex-wrap gap-2">
              {sections.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="eyebrow rounded-full border border-border bg-background px-4 py-2 text-[0.7rem] text-foreground/80 transition-colors hover:bg-muted"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <DesignSystem />
      </main>

      <SiteFooter />
    </>
  );
}
