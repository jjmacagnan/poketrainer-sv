export interface GuideItem {
  name: string;
  detail: string;
  note?: string;
}

export interface GuideSection {
  id: string;
  heading: string;
  body: string;
  items?: GuideItem[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface GuideCTA {
  label: string;
  href: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface GuideLocale {
  title: string;
  description: string;
  intro: string;
  sections: GuideSection[];
  faq: FAQ[];
  cta: GuideCTA;
  relatedLinks: RelatedLink[];
}

export interface GuideContent {
  pt: GuideLocale;
  en: GuideLocale;
}
