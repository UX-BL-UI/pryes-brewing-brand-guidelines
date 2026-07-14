"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandMark } from "@/components/brand-mark";
import { nav } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" aria-label="Pryes Brewing Company home">
          <BrandMark className="h-6 w-auto md:h-7" />
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="eyebrow text-[0.8rem] text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" className="eyebrow tracking-[0.1em]">
            <a href="#beer">Find our beer</a>
          </Button>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="mt-14 flex flex-col gap-2 px-2">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="eyebrow border-b border-border/60 py-4 text-lg text-foreground"
                >
                  {item.label}
                </a>
              ))}
              <Button asChild className="eyebrow mt-6 tracking-[0.1em]">
                <a href="#beer" onClick={() => setOpen(false)}>
                  Find our beer
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
