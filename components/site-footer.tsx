export function SiteFooter() {
  return (
    <footer className="w-full border-t border-black/[.08] dark:border-white/[.12] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ZVC Goldgetters.
        </p>
      </div>
    </footer>
  );
}
