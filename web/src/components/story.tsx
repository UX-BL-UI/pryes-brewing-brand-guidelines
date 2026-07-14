import { BrandMark } from "@/components/brand-mark";
import { asset } from "@/lib/site";

export function Story() {
  return (
    <section
      id="story"
      className="relative overflow-hidden bg-brand-burgundy text-brand-foam"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url(${asset(
            "/brand/patterns/PRYES-PATTERN-LAURELS-BURG-OFFBLACK.svg",
          )})`,
          backgroundSize: "440px",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
        <div>
          <BrandMark
            mark="coin"
            colorway="BEERFOAM"
            alt="Pryes crest"
            className="h-16 w-auto"
          />
          <p className="eyebrow mt-8 text-xs text-brand-foam/70 md:text-sm">
            Our story
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
            Minnesota born.
            <br />
            Minnesota raised.
          </h2>
        </div>
        <div className="flex flex-col justify-center gap-6 text-lg leading-relaxed text-brand-foam/85">
          <p>
            We started Pryes on the banks of the Mississippi with one stubborn
            idea: great beer should not ask you to prove anything first. No
            snobbery, no secret handshake, just honest brewing for the people who
            call this place home.
          </p>
          <p>
            From our flagship Miraculum to whatever is fresh on the line, every
            pour is built to be enjoyed anywhere, by anyone. That is the whole
            job, and we take it seriously.
          </p>
          <p className="eyebrow pt-2 text-sm text-brand-beige">
            Trust Your Taste
          </p>
        </div>
      </div>
    </section>
  );
}
