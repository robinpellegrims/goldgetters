'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { LoginDialog } from '@/components/login-dialog';

interface User {
  id: string;
  email: string;
  name?: string;
}

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch current user
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error);
      });
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to logout:', error);
      setIsLoggingOut(false);
    }
  };

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

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/50 text-sm">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors disabled:opacity-50"
                title="Uitloggen"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isLoggingOut ? 'Uitloggen...' : 'Uitloggen'}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginDialogOpen(true)}
              className="ml-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors opacity-70 hover:opacity-100"
              title="Inloggen"
            >
              <LogIn className="h-4 w-4" />
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>

      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </header>
  );
}
