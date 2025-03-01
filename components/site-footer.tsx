import Link from "next/link";
import { BookOpen } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <BookOpen className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()}  lalanguearabe.com. Tous droits réservés.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/courses"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cours
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            À propos
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}