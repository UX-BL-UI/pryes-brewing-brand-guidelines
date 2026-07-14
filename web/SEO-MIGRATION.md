# SEO migration plan (SquareSpace → new site)

The goal when we cut over from PryesBrewing.com on SquareSpace is that Google
sees a **moved** site, not a **new** one, so rankings and the local listing
carry over. This site is already built for that.

## What is already in place

- **Stable, human URLs.** `trailingSlash: true` emits `/visit/` style paths, so
  slugs stay identical across platforms.
- **Per-page metadata** (title, description, canonical, Open Graph) via the
  Next `Metadata` API in `src/app/layout.tsx` and each page.
- **`Brewery` / LocalBusiness JSON-LD** (`src/components/structured-data.tsx`)
  carrying name, address, geo, phone, and hours — this is what protects the
  local/Maps presence, independent of host.
- **`sitemap.xml` and `robots.txt`** generated at build (`src/app/sitemap.ts`,
  `src/app/robots.ts`).
- **One-line domain switch.** Set `BASE_PATH=""` and point DNS; every URL
  collapses from the Pages subpath to the real domain with no code changes.

## Cutover checklist

1. Freeze the SquareSpace URL list (Pages panel + `/sitemap.xml`).
2. Map each old URL to its new slug in the table below. Keep slugs identical
   wherever possible — the fewer redirects, the better.
3. Set up **301 redirects** for every URL that changes. On the new host (or a
   proxy/CDN in front of it), not on SquareSpace.
4. Update `site.url` in `src/lib/site.ts` to the production domain.
5. Deploy, then in Google Search Console: submit the new `sitemap.xml`, use the
   Change of Address tool if the domain changes, and watch Coverage for 404s.
6. Keep the SquareSpace site reachable only long enough for redirects to be
   crawled, then retire it.

## Redirect map (fill in with real SquareSpace paths)

| Old (SquareSpace)     | New            | Status |
| --------------------- | -------------- | ------ |
| `/`                   | `/`            | 200    |
| `/beer` or `/our-beer`| `/#beer`       | 301    |
| `/visit` / `/taproom` | `/#visit`      | 301    |
| `/about` / `/story`   | `/#story`      | 301    |
| `/contact`            | `/#visit`      | 301    |

> As the playground grows into real routes (e.g. `/beer/miraculum`), add them to
> `sitemap.ts` and this table so nothing drops out of the index.
