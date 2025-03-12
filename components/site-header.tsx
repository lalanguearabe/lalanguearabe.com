"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <BookOpen className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            {t('HEADER.SITE_NAME')}
          </span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/courses"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('HEADER.COURSES')}
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('HEADER.CONTACT')}
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}