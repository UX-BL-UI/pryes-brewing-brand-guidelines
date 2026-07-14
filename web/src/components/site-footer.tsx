import { BrandMark } from "@/components/brand-mark";
import { site, nav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-brand-burgundy text-brand-foam">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <BrandMark
              colorway="BEERFOAM"
              className="h-7 w-auto"
              alt="Pryes Brewing Company"
            />
            <p className="mt-5 text-sm leading-relaxed text-brand-foam/70">
              {site.statement} Brewed on the Mississippi in Minneapolis,
              Minnesota.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="eyebrow text-xs text-brand-beige">Explore</p>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-brand-foam/80 transition-colors hover:text-brand-foam"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="eyebrow text-xs text-brand-beige">Taproom</p>
            <address className="text-sm not-italic leading-relaxed text-brand-foam/80">
              {site.streetAddress}
              <br />
              {site.addressLocality}, {site.addressRegion} {site.postalCode}
              <br />
              <a href={`tel:${site.telephone}`} className="hover:text-brand-foam">
                (612) 787-7937
              </a>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-brand-foam/15 pt-6 text-xs text-brand-foam/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {2026} {site.name}. Please drink responsibly.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="../pryes-brand-guidelines.html"
              className="eyebrow tracking-[0.14em] hover:text-brand-foam"
            >
              Brand guidelines
            </a>
            <span className="eyebrow tracking-[0.14em] text-brand-foam/40">
              Built on the Pryes 2026 design system
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
