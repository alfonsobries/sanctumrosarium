import { repository, route, stores, type Language } from '../i18n/routes';

/** schema.org nodes, joined into one @graph per page by the layout. */
export type SchemaNode = Record<string, unknown>;

export const siteUrl = 'https://sanctumrosarium.app';

const organizationId = `${siteUrl}/#organization`;
const websiteId = (language: Language) => `${absolute(route('home', language))}#website`;
const appId = `${siteUrl}/#app`;

export function absolute(path: string): string {
  return new URL(path, siteUrl).href;
}

const inLanguage = (language: Language): string => language;

/** The full organization only on the home page; elsewhere a reference to it. */
export function organization(language: Language): SchemaNode {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: 'Sanctum Rosarium',
    url: siteUrl,
    logo: absolute('/icon.png'),
    sameAs: [stores.appStore, repository],
    description:
      language === 'es'
        ? 'App católica, gratuita y sin anuncios para rezar el Santo Rosario.'
        : 'A free Catholic app with no ads to pray the Holy Rosary.',
  };
}

export function website(language: Language, description: string): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId(language),
    url: absolute(route('home', language)),
    name: 'Sanctum Rosarium',
    description,
    inLanguage: inLanguage(language),
    publisher: { '@id': organizationId },
  };
}

export function mobileApplication(language: Language, description: string): SchemaNode {
  return {
    '@type': 'MobileApplication',
    '@id': appId,
    name: 'Sanctum Rosarium',
    description,
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: language === 'es' ? 'Oración católica' : 'Catholic prayer',
    operatingSystem: 'iOS, watchOS, Android',
    inLanguage: ['en-US', 'es-MX', 'es-ES', 'la'],
    downloadUrl: stores.appStore,
    installUrl: stores.appStore,
    image: absolute('/icon.png'),
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': organizationId },
  };
}

export function webPage(options: {
  language: Language;
  url: string;
  title: string;
  description: string;
  image: string;
  type?: string;
}): SchemaNode {
  return {
    '@type': options.type ?? 'WebPage',
    '@id': `${options.url}#webpage`,
    url: options.url,
    name: options.title,
    description: options.description,
    inLanguage: inLanguage(options.language),
    isPartOf: { '@id': websiteId(options.language) },
    primaryImageOfPage: { '@type': 'ImageObject', url: options.image },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '[data-speakable]'] },
  };
}

export function breadcrumbs(items: { name: string; url: string }[]): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.url),
    })),
  };
}

export function faq(entries: { question: string; answer: string }[]): SchemaNode {
  return {
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

export function howTo(options: { name: string; description: string; steps: { name: string; url?: string }[] }): SchemaNode {
  return {
    '@type': 'HowTo',
    name: options.name,
    description: options.description,
    step: options.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.name,
      ...(step.url === undefined ? {} : { url: absolute(step.url) }),
    })),
  };
}

export function itemList(name: string, items: { name: string; url: string; image?: string }[]): SchemaNode {
  return {
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absolute(item.url),
      ...(item.image === undefined ? {} : { image: item.image }),
    })),
  };
}

/** A prayer as a creative work, crediting the published text it reproduces. */
export function prayerWork(options: {
  name: string;
  text: string;
  language: Language;
  source: { publisher: string; title: string; url: string };
}): SchemaNode {
  return {
    '@type': 'CreativeWork',
    name: options.name,
    text: options.text,
    inLanguage: inLanguage(options.language),
    genre: options.language === 'es' ? 'Oración' : 'Prayer',
    citation: {
      '@type': 'CreativeWork',
      name: options.source.title,
      url: options.source.url,
      publisher: { '@type': 'Organization', name: options.source.publisher },
    },
  };
}
