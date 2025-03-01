import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <BookOpen className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
             lalanguearabe.com
          </span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Accueil
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Tous les cours
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}