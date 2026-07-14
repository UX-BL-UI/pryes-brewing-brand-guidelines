import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { asset } from "@/lib/site";

const strip = [
  "A beer for everyone",
  "Minnesota born, Minnesota raised",
  "Never a gamble",
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-background">
      {/* faint laurel texture, tonal and quiet */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url(${asset(
            "/brand/patterns/PRYES-PATTERN-LAURELS-BEIGE.svg",
          )})`,
          backgroundSize: "440px",
        }}
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 pb-16 text-center md:pt-28 md:pb-24">
        <BrandMark
          mark="coin"
          className="h-24 w-auto md:h-28"
          alt="Pryes crest"
        />
        <p className="eyebrow mt-8 text-xs text-muted-foreground md:text-sm">
          Minneapolis · Minnesota
        </p>
        <h1 className="mt-5 font-serif text-6xl font-medium leading-[0.95] tracking-tight text-foreground md:text-8xl">
          Trust Your Taste
        </h1>
        <p className="mt-7 max-w-xl text-lg text-foreground/75 md:text-xl">
          Pryes is a Minnesota craft brewery with a beer for everyone. Pull up a
          stool and come find your favorite.
        </p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="eyebrow tracking-[0.14em]">
            <a href="#beer">See what&apos;s on tap</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="eyebrow border-foreground/25 tracking-[0.14em]"
          >
            <a href="#visit">Visit the taproom</a>
          </Button>
        </div>
      </div>

      {/* signature: condensed-caps positioning strip on burgundy */}
      <div className="relative bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-4 md:gap-x-10">
          {strip.map((phrase, i) => (
            <span key={phrase} className="flex items-center gap-6 md:gap-10">
              {i > 0 && (
                <BrandMark
                  mark="mn"
                  colorway="BEERFOAM"
                  alt=""
                  className="hidden h-3.5 w-auto opacity-80 sm:block"
                />
              )}
              <span className="eyebrow text-[0.7rem] md:text-xs">{phrase}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
