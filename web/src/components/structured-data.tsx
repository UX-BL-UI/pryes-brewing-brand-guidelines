import { asset, site } from "@/lib/site";

// Brewery is a schema.org subtype of LocalBusiness/FoodEstablishment. This block
// is what carries the taproom's name, address, geo, hours, and phone into search
// results -- and it moves with the site to any platform, protecting the local
// SEO that lives on SquareSpace today.
export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Brewery",
    name: site.name,
    slogan: site.tagline,
    description: site.statement,
    url: site.url,
    telephone: site.telephone,
    // asset() is an absolute (leading-slash) path, so resolving it against
    // site.url yields origin + basePath once (no path doubling).
    image: new URL(
      asset("/brand/logos/BURGUNDY/PRYES-CREST-CIRCLE01-BURGUNDY.svg"),
      site.url,
    ).toString(),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: site.addressLocality,
      addressRegion: site.addressRegion,
      postalCode: site.postalCode,
      addressCountry: site.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    openingHoursSpecification: [
      { days: ["Tuesday", "Wednesday", "Thursday"], opens: "15:00", closes: "22:00" },
      { days: ["Friday"], opens: "12:00", closes: "23:59" },
      { days: ["Saturday"], opens: "11:00", closes: "23:59" },
      { days: ["Sunday"], opens: "11:00", closes: "20:00" },
    ].map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: s.days,
      opens: s.opens,
      closes: s.closes,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
