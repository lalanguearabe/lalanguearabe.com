"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <BookOpen className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} {t('FOOTER.COPYRIGHT')}
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/courses"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('FOOTER.COURSES')}
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('FOOTER.CONTACT')}
          </Link>
          <Link
            href={t('FOOTER.GITHUB_LINK')}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}