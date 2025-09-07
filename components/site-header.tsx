'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

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
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="text-base font-semibold whitespace-nowrap shrink-0">
          ZVC Goldgetters
        </div>
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
      </div>
    </header>
  );
}
