import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Nieuws" },
  { href: "/ploeg", label: "Ploeg" },
  { href: "/wedstrijden", label: "Wedstrijden" },
  { href: "/fotos", label: "Foto's" },
  { href: "/statistieken", label: "Statistieken" },
  { href: "/contact", label: "Contact" }
];

export function NavBar() {
  return (
    <nav className="flex gap-2 flex-wrap justify-center py-4">
      {links.map((l) => (
        <Button key={l.href} asChild variant="outline">
          <Link href={l.href}>{l.label}</Link>
        </Button>
      ))}
    </nav>
  );
}
