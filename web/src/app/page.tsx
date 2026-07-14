import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { BeerLineup } from "@/components/beer-lineup";
import { Visit } from "@/components/visit";
import { Story } from "@/components/story";
import { SiteFooter } from "@/components/site-footer";
import { StructuredData } from "@/components/structured-data";

export default function Home() {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <BeerLineup />
        <Story />
        <Visit />
      </main>
      <SiteFooter />
    </>
  );
}
