'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ThemeToggle } from '@/components/theme-toggle';

export function SiteHeader() {
  const items = [
    { href: '/nieuws', label: 'nieuws' },
    { href: '/ploeg', label: 'ploeg' },
    { href: '/wedstrijden', label: 'wedstrijden' },
    { href: '/fotos', label: "foto's" },
    { href: '/statistieken', label: 'statistieken' },
    { href: '/contact', label: 'contact' },
  ];

  return (
    <header className="w-full border-b border-black/[.08] dark:border-white/[.12] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-goldgetters.png"
            alt="Goldgetters logo"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl font-semibold whitespace-nowrap shrink-0 text-gold">
            ZVC Goldgetters
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              {items.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
