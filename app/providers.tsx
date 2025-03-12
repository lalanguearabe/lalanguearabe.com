"use client";

import { ReactNode, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Initialize i18n on the client side
  useEffect(() => {
    // This ensures i18n is only initialized once in development mode with React strict mode
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </ThemeProvider>
  );
}