import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "@/lib/site";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name} ${site.streetAddress} ${site.addressLocality} ${site.addressRegion}`,
)}`;

export function Visit() {
  return (
    <section id="visit" className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow text-xs text-muted-foreground md:text-sm">
            Visit the taproom
          </p>
          <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Find us on the river
          </h2>
          <p className="mt-5 max-w-md text-lg text-foreground/70">
            Our North Loop taproom sits right on the Mississippi. Bring friends,
            bring family, bring your dog to the patio. First round is the
            hardest decision you will make all day.
          </p>

          <div className="mt-8 flex items-start gap-3">
            <MapPin className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
            <address className="text-base not-italic text-foreground/80">
              {site.streetAddress}
              <br />
              {site.addressLocality}, {site.addressRegion} {site.postalCode}
            </address>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="eyebrow tracking-[0.14em]">
              <a href={mapsHref} target="_blank" rel="noopener noreferrer">
                Get directions
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="eyebrow border-foreground/25 tracking-[0.14em]"
            >
              <a href={`tel:${site.telephone}`}>Call the taproom</a>
            </Button>
          </div>
        </div>

        <Card className="gap-0 rounded-lg border-border bg-card p-8">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-primary" aria-hidden />
            <p className="eyebrow text-sm">Taproom hours</p>
          </div>
          <ul className="mt-6 divide-y divide-border">
            {site.hours.map((h) => (
              <li
                key={h.days}
                className="flex items-baseline justify-between py-3"
              >
                <span className="eyebrow text-xs text-foreground/70">
                  {h.days}
                </span>
                <span className="text-sm text-foreground">{h.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
