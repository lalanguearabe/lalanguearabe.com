import type { Metadata } from 'next';

export const getMetadata = async ({locale}: {locale: string}): Promise<Metadata> => {
  const messages = (await import(`../public/locales/${locale}.json`)).default;
  return {
    title: messages.META.TITLE,
    description: messages.META.DESCRIPTION,
    icons: [
      { rel: 'icon', url: '/favicon.ico' }
    ]
  };
}; 