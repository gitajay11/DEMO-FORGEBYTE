import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { caseStudies } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number][] = [
    ['', 1],
    ['/work', 0.9],
    ['/services', 0.9],
    ['/contact', 0.8],
    ['/studio', 0.7],
    ['/lab', 0.5],
    ['/privacy', 0.2],
  ];
  return [
    ...pages.map(([path, priority]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...caseStudies.map((cs) => ({
      url: `${SITE_URL}/work/${cs.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
