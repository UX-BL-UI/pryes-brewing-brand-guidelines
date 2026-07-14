"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/* ---------- data ---------- */

const coreColors = [
  { name: "Beer Foam", hex: "#FFF1E4", role: "Primary light background", ink: "#3E0F23" },
  { name: "Beige", hex: "#EBCFB8", role: "Tonal layering", ink: "#3E0F23" },
  { name: "Regal Burgundy", hex: "#3E0F23", role: "Primary dark bg / text", ink: "#FFF1E4" },
  { name: "Miraculum Green", hex: "#213B1E", role: "Secondary", ink: "#FFF1E4" },
  { name: "Miraculum Off-Black", hex: "#121A12", role: "Tonal / packaging", ink: "#FFF1E4" },
  { name: "Burgundy Off-Black", hex: "#101019", role: "Text on dark", ink: "#FFF1E4" },
];

const accentColors = [
  { name: "Haze-steria Orange", hex: "#E3884D", role: "Hazy styles", ink: "#3E0F23" },
  { name: "Pragmatic Blue", hex: "#328ACA", role: "Lagers & pils", ink: "#3E0F23" },
  { name: "Citrus Yellow", hex: "#E8BC20", role: "Sours & radlers", ink: "#3E0F23" },
];

const tagStyles = {
  green: "bg-brand-green/12 text-brand-green border-brand-green/35",
  orange: "bg-tag-orange/15 text-tag-orange-ink border-tag-orange/45",
  blue: "bg-tag-blue/15 text-tag-blue-ink border-tag-blue/45",
  yellow: "bg-tag-yellow/20 text-tag-yellow-ink border-tag-yellow/55",
} as const;

/* ---------- layout helpers ---------- */

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <p className="eyebrow text-xs text-muted-foreground md:text-sm">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-3 max-w-2xl text-foreground/70">{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Swatch({ name, hex, role }: { name: string; hex: string; role: string }) {
  // Hex sits in the caption (on card), not on the color block, so its own
  // contrast never depends on the swatch color.
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="h-24" style={{ backgroundColor: hex }} />
      <div className="bg-card p-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-serif text-lg font-semibold leading-tight">{name}</p>
          <span className="eyebrow text-[0.7rem] text-muted-foreground">{hex}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

/* ---------- page ---------- */

export function DesignSystem() {
  return (
    <div className="pb-8">
      {/* Colors */}
      <Section
        id="color"
        eyebrow="Foundations"
        title="Color"
        intro="Every hex is labeled with its name and role, so the system reads without relying on color perception. Backgrounds stay to Beer Foam, Beige, or Regal Burgundy; accents are reserved for beer-style tags."
      >
        <p className="eyebrow mb-3 text-xs text-muted-foreground">Core</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreColors.map((c) => (
            <Swatch key={c.name} {...c} />
          ))}
        </div>
        <p className="eyebrow mt-10 mb-3 text-xs text-muted-foreground">
          Packaging accents
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accentColors.map((c) => (
            <Swatch key={c.name} {...c} />
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section
        id="type"
        eyebrow="Foundations"
        title="Typography"
        intro="Matching the brand-guidelines site: Bitter (standing in for Superclarendon) carries both headings and body copy. Barlow Condensed (Alternate Gothic) sets subheads and small labels. Poppins (Gotham) is reserved for callouts, links, and UI controls."
      >
        <div className="flex flex-col divide-y divide-border">
          <div className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-8">
            <span className="eyebrow w-40 shrink-0 text-[0.7rem] text-muted-foreground">
              Display · Serif
            </span>
            <span className="font-serif text-5xl font-semibold tracking-tight">
              Trust Your Taste
            </span>
          </div>
          <div className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-8">
            <span className="eyebrow w-40 shrink-0 text-[0.7rem] text-muted-foreground">
              Heading · Serif
            </span>
            <span className="font-serif text-3xl font-semibold">A beer for everyone</span>
          </div>
          <div className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-8">
            <span className="eyebrow w-40 shrink-0 text-[0.7rem] text-muted-foreground">
              Subhead · Condensed
            </span>
            <span className="eyebrow text-lg tracking-[0.05em]">
              On tap &amp; in the fridge
            </span>
          </div>
          <div className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-8">
            <span className="eyebrow w-40 shrink-0 text-[0.7rem] text-muted-foreground">
              Body · Serif
            </span>
            <p className="max-w-xl font-serif text-base leading-relaxed text-foreground/80">
              No gatekeeping, no gambles. Whether you live for hops or just want
              something cold and easy, there is a Pryes pour with your name on it.
            </p>
          </div>
          <div className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-8">
            <span className="eyebrow w-40 shrink-0 text-[0.7rem] text-muted-foreground">
              Callout & Links · Poppins
            </span>
            <span className="font-sans text-xs font-medium tracking-[0.15em] text-foreground/80 uppercase">
              Trust Your Taste · Find our beer
            </span>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section
        id="buttons"
        eyebrow="Components"
        title="Buttons"
        intro="Tuned for touch: a 44px tap target for primary actions and generous horizontal padding, so buttons read a little wider than they are tall. Small and extra-small sizes (36 and 32px) are for dense or secondary UI. Every variant keeps a visible, offset focus ring."
      >
        <div className="flex flex-col gap-8">
          <div>
            <p className="eyebrow mb-4 text-xs text-muted-foreground">Variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Find your favorite</Button>
              <Button variant="secondary">On the menu</Button>
              <Button variant="outline">Get directions</Button>
              <Button variant="ghost">Learn more</Button>
              <Button variant="destructive">Remove</Button>
              <Button variant="link">Read the story</Button>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4 text-xs text-muted-foreground">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4 text-xs text-muted-foreground">
              Full-width CTA
            </p>
            <Button size="lg" className="w-full sm:max-w-sm">
              See what&apos;s on tap
            </Button>
          </div>
        </div>
      </Section>

      {/* Tags & badges */}
      <Section
        id="tags"
        eyebrow="Components"
        title="Tags &amp; badges"
        intro="Beer-style tags pair a tint with dark ink and always spell out the style, so the color is decoration and the label is the signal."
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-3">
            {(
              [
                ["green", "Midwest IPA"],
                ["orange", "Hazy IPA"],
                ["blue", "Pilsner"],
                ["yellow", "Kettle Sour"],
              ] as const
            ).map(([tag, label]) => (
              <span
                key={label}
                className={`eyebrow inline-flex rounded-full border px-4 py-1.5 text-xs ${tagStyles[tag]}`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>New</Badge>
            <Badge variant="secondary">Seasonal</Badge>
            <Badge variant="outline">Limited</Badge>
            <Badge variant="destructive">Sold out</Badge>
          </div>
        </div>
      </Section>

      {/* Form controls */}
      <Section
        id="forms"
        eyebrow="Components"
        title="Form controls"
        intro="Inputs and toggles share the larger tap target. Labels wrap their controls so the whole row is clickable."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <Field label="Email">
            <Input type="email" placeholder="you@example.com" />
          </Field>
          <Field label="Favorite style">
            <Select>
              <SelectTrigger aria-label="Favorite style" className="h-11 w-full px-4">
                <SelectValue placeholder="Pick a pour" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ipa">Midwest IPA</SelectItem>
                <SelectItem value="hazy">Hazy IPA</SelectItem>
                <SelectItem value="pilsner">Pilsner</SelectItem>
                <SelectItem value="sour">Kettle Sour</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <span>
              <span className="block font-medium">Join the mailing list</span>
              <span className="block text-sm text-muted-foreground">
                First to know what is fresh on the line.
              </span>
            </span>
            <Switch className="scale-125" defaultChecked />
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4">
            <Checkbox className="mt-0.5 size-5" defaultChecked />
            <span>
              <span className="block font-medium">I am 21 or older</span>
              <span className="block text-sm text-muted-foreground">
                Required to browse the taproom menu.
              </span>
            </span>
          </label>
        </div>
      </Section>

      {/* Cards */}
      <Section
        id="cards"
        eyebrow="Components"
        title="Cards"
        intro="The lineup card: a colored top rule for rhythm, a labeled style tag, name, ABV, and tasting note."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="relative gap-0 overflow-hidden rounded-lg border-border bg-card p-6 pt-7">
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand-green" />
            <span
              className={`eyebrow inline-flex w-fit rounded-full border px-3 py-1 text-[0.65rem] ${tagStyles.green}`}
            >
              Midwest IPA
            </span>
            <h3 className="mt-5 font-serif text-2xl font-semibold">Miraculum</h3>
            <p className="eyebrow mt-1 text-[0.7rem] text-muted-foreground">6.9% ABV</p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/70">
              Our toast to Midwest culture, and the beer that built the brewery.
            </p>
          </Card>

          <Card className="gap-0 rounded-lg border-border bg-card pt-7">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Taproom hours</CardTitle>
              <CardDescription>A content card with header and footer.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-foreground/70">
              Open Tuesday through Sunday on the banks of the Mississippi.
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Plan a visit
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-center gap-3 rounded-lg border-dashed border-border bg-transparent p-6 pt-7 text-center">
            <p className="eyebrow text-[0.7rem] text-muted-foreground">Empty state</p>
            <p className="text-sm text-foreground/70">
              Nothing on tap in this style right now.
            </p>
            <Button variant="ghost" size="sm" className="mx-auto">
              Browse all beer
            </Button>
          </Card>
        </div>
      </Section>

      {/* Tabs */}
      <Section
        id="tabs"
        eyebrow="Components"
        title="Tabs"
        intro="Larger triggers for confident tapping between views."
      >
        <Tabs defaultValue="ipas" className="w-full">
          <TabsList className="h-12">
            <TabsTrigger value="ipas" className="px-5 text-sm">
              IPAs
            </TabsTrigger>
            <TabsTrigger value="lagers" className="px-5 text-sm">
              Lagers
            </TabsTrigger>
            <TabsTrigger value="sours" className="px-5 text-sm">
              Sours
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ipas" className="pt-5 text-foreground/75">
            Miraculum and Haze-steria lead the hop-forward side of the lineup.
          </TabsContent>
          <TabsContent value="lagers" className="pt-5 text-foreground/75">
            Pragmatic is the crisp, clean anytime pour.
          </TabsContent>
          <TabsContent value="sours" className="pt-5 text-foreground/75">
            Tart Side brings the bright, tart end of the range.
          </TabsContent>
        </Tabs>
      </Section>

      {/* Accordion */}
      <Section
        id="accordion"
        eyebrow="Components"
        title="Accordion"
        intro="A tall, tappable disclosure for FAQs and details."
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="a">
            <AccordionTrigger className="py-5 text-base">
              Are you dog friendly?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/75">
              Absolutely. Well-behaved dogs are welcome on the patio.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger className="py-5 text-base">
              Do you serve food?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/75">
              Rotating food trucks post up most nights. Check the calendar for who
              is parked.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger className="py-5 text-base">
              Can I buy beer to go?
            </AccordionTrigger>
            <AccordionContent className="text-foreground/75">
              Yes. Crowlers and four-packs of the current lineup are available at
              the bar.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
    </div>
  );
}
