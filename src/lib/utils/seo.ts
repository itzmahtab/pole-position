import type { Metadata } from 'next';
import { DEFAULT_META, APP_URL } from './constants';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  tags?: string[];
}

export function generateSeo({
  title = DEFAULT_META.title,
  description = DEFAULT_META.description,
  image = DEFAULT_META.ogImage,
  type = 'website',
  publishedAt,
  modifiedAt,
  author,
  tags,
}: SeoProps = {}): Metadata {
  const ogImage = image.startsWith('http') ? image : `${APP_URL}${image}`;

  return {
    title,
    description,
    keywords: tags || [...DEFAULT_META.keywords],
    authors: author ? [{ name: author }] : [{ name: DEFAULT_META.author }],
    openGraph: {
      type,
      title,
      description,
      images: [{ url: ogImage }],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(modifiedAt && { modifiedTime: modifiedAt }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: '/',
    },
  };
}
