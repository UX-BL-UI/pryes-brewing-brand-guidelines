// Single source of truth for site-wide constants: brand copy, contact/business
// details (used for the LocalBusiness/Brewery JSON-LD), and the asset() helper
// that prefixes the GitHub Pages base path. Everything the SEO layer and the
// UI read comes from here, so migrating off SquareSpace = edit this one file.

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a /public asset with the deployment base path. */
export function asset(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}

export const site = {
  name: "Pryes Brewing Company",
  shortName: "Pryes",
  tagline: "Trust Your Taste",
  statement: "A Minnesota craft brewery with a beer for everyone.",
  // Placeholder canonical for the demo; swap to https://pryesbrewing.com at launch.
  url: "https://ux-bl-ui.github.io/pryes-brewing-brand-guidelines/homepage",
  telephone: "+1-612-787-7937",
  streetAddress: "1401 West River Road N",
  addressLocality: "Minneapolis",
  addressRegion: "MN",
  postalCode: "55411",
  addressCountry: "US",
  geo: { lat: 44.99101, lng: -93.28461 },
  hours: [
    { days: "Mon", label: "Monday", value: "Closed" },
    { days: "Tue–Thu", label: "Tuesday to Thursday", value: "3:00 – 10:00 PM" },
    { days: "Fri", label: "Friday", value: "12:00 PM – 12:00 AM" },
    { days: "Sat", label: "Saturday", value: "11:00 AM – 12:00 AM" },
    { days: "Sun", label: "Sunday", value: "11:00 AM – 8:00 PM" },
  ],
} as const;

export const nav = [
  { label: "Beer", href: "#beer" },
  { label: "Visit", href: "#visit" },
  { label: "Our Story", href: "#story" },
] as const;
