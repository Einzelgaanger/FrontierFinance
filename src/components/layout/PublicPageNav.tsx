import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Menu, type LucideIcon } from "lucide-react";
import { useState } from "react";

export type NavLinkItem = { to: string; label: string; icon: LucideIcon };

interface PublicPageNavProps {
  links: NavLinkItem[];
}

export function PublicPageNav({ links }: PublicPageNavProps) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const otherPageLinks = links.filter(({ to }) => to !== pathname);

  return (
    <nav className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center justify-end gap-2">
      <div className="hidden lg:flex flex-wrap items-center justify-end gap-1.5">
        {otherPageLinks.map(({ to, label, icon: Icon }) => (
          <Link key={`${to}-${label}`} to={to} className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-2.5 py-1.5 text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 rounded-full min-h-0 touch-target"
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <span>{label}</span>
              </div>
            </Button>
          </Link>
        ))}
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden touch-target w-11 h-11 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md rounded-full shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[min(320px,100vw)] safe-area-inset bg-slate-900 border-slate-700 p-0"
          aria-describedby={undefined}
        >
          <VisuallyHidden.Root>
            <SheetTitle>Navigation menu</SheetTitle>
            <SheetDescription>Site navigation links</SheetDescription>
          </VisuallyHidden.Root>
          <div className="flex flex-col h-full pt-6 pb-8">
            <div className="px-4 mb-4">
              <img
                src="/CFF%20LOGO.png"
                alt="CFF"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <ul className="flex flex-col">
              {otherPageLinks.map(({ to, label, icon: Icon }) => (
                <li key={`${to}-${label}`}>
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 min-h-[44px] text-white hover:bg-white/10 active:bg-white/15 transition-colors border-b border-white/5"
                  >
                    <Icon className="w-5 h-5 shrink-0 text-white/80" />
                    <span className="font-medium">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
