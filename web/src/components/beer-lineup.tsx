import { Card } from "@/components/ui/card";
import { beers, type Beer } from "@/lib/beers";

// Tinted ground + dark "ink" text + border for each style tag. Kept high
// contrast and always paired with the style word + ABV, so the hue is never
// the only signal (readable for colorblind viewers).
const tagStyles: Record<Beer["tag"], string> = {
  green: "bg-brand-green/12 text-brand-green border-brand-green/35",
  orange: "bg-tag-orange/15 text-tag-orange-ink border-tag-orange/45",
  blue: "bg-tag-blue/15 text-tag-blue-ink border-tag-blue/45",
  yellow: "bg-tag-yellow/20 text-tag-yellow-ink border-tag-yellow/55",
};

// Per-beer top accent rule -- adds rhythm to the lineup. Decorative only;
// every card still names its style and ABV, so color is never the signal.
const barStyles: Record<Beer["tag"], string> = {
  green: "bg-brand-green",
  orange: "bg-tag-orange",
  blue: "bg-tag-blue",
  yellow: "bg-tag-yellow",
};

export function BeerLineup() {
  return (
    <section id="beer" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="eyebrow text-xs text-muted-foreground md:text-sm">
            On tap &amp; in the fridge
          </p>
          <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight md:text-5xl">
            A beer for everyone
          </h2>
          <p className="mt-5 text-lg text-foreground/70">
            No gatekeeping, no gambles. Whether you live for hops or just want
            something cold and easy, there is a Pryes pour with your name on it.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {beers.map((beer) => (
            <Card
              key={beer.name}
              className="relative flex flex-col gap-0 overflow-hidden rounded-lg border-border bg-card p-6 pt-7 shadow-none transition-shadow hover:shadow-md"
            >
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 ${barStyles[beer.tag]}`}
              />
              <div className="flex items-center gap-2">
                <span
                  className={`eyebrow inline-flex rounded-full border px-3 py-1 text-[0.65rem] ${tagStyles[beer.tag]}`}
                >
                  {beer.style}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-2xl font-medium">
                {beer.name}
              </h3>
              <p className="eyebrow mt-1 text-[0.7rem] text-muted-foreground">
                {beer.abv}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                {beer.note}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
