import { asset } from "@/lib/site";

type Colorway = "BURGUNDY" | "BEERFOAM";

const files = {
  wordmark: (c: Colorway) => `/brand/logos/${c}/PRYES-WORDMARK-${c}.svg`,
  coin: (c: Colorway) => `/brand/logos/${c}/PRYES-CREST-CIRCLE01-${c}.svg`,
  mn: (c: Colorway) => `/brand/logos/${c}/PRYES-MN-ICON-${c}.svg`,
};

type MarkProps = {
  mark?: keyof typeof files;
  colorway?: Colorway;
  className?: string;
  alt?: string;
};

/** Renders a brand logo SVG from /public with the correct base path. */
export function BrandMark({
  mark = "wordmark",
  colorway = "BURGUNDY",
  className,
  alt = "Pryes Brewing Company",
}: MarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset(files[mark](colorway))} alt={alt} className={className} />
  );
}
