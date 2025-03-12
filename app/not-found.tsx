"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">
        {t('NOT_FOUND.TITLE')}
      </h2>
      <p className="text-muted-foreground mt-2 mb-6">
        {t('NOT_FOUND.DESCRIPTION')}
      </p>
      <Link href="/">
        <Button>{t('NOT_FOUND.CTA')}</Button>
      </Link>
    </div>
  );
}