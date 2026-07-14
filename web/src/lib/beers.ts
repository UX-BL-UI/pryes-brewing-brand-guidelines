// Flagship lineup. Copy is in Pryes voice (warm, clear, lightly witty); several
// lines are verbatim brand-approved examples. Each style carries a text label
// and ABV, never color alone -- the tag hue is decoration, not the signal.

export type Beer = {
  name: string;
  style: string;
  abv: string;
  note: string;
  /** brand accent used for the style tag */
  tag: "green" | "orange" | "blue" | "yellow";
};

export const beers: Beer[] = [
  {
    name: "Miraculum",
    style: "Midwest IPA",
    abv: "6.9% ABV",
    note: "Our toast to Midwest culture, and the beer that built the brewery. Balanced, bright, and always in the fridge.",
    tag: "green",
  },
  {
    name: "Haze-steria",
    style: "Hazy IPA",
    abv: "6.5% ABV",
    note: "Bold enough for IPA fans, smooth enough for everyone else. Soft, juicy, and easy to fall for.",
    tag: "orange",
  },
  {
    name: "Pragmatic",
    style: "Pilsner",
    abv: "4.8% ABV",
    note: "Crisp, clean, and never a gamble. The anytime Minnesota lager for whatever the day asks of it.",
    tag: "blue",
  },
  {
    name: "Tart Side",
    style: "Kettle Sour",
    abv: "5.2% ABV",
    note: "If you like sours, you'll like this. If you don't like sours? You might still like this.",
    tag: "yellow",
  },
];
