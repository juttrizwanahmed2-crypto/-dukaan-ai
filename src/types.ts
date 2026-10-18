export type SupportedLanguage = 'Urdu' | 'Punjabi' | 'Saraiki' | 'Pashto' | 'English';

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  sampleGreeting: string;
}

export type GenerationMode = 'avatar' | 'product_reel';

export interface TemplateCategory {
  id: string;
  nameUrdu: string;
  nameEn: string;
  icon: string;
  count: number;
}

export interface AdTemplate {
  id: string;
  categoryId: string;
  titleUrdu: string;
  titleEn: string;
  badgeUrdu: string;
  bgGradient: string;
  accentColor: string;
  defaultTaglineUrdu: string;
  defaultPriceUrdu: string;
  defaultScriptUrdu: string;
  musicMood: 'energetic_bazaar' | 'celebration_dhol' | 'modern_hype' | 'festive_eid';
  isPopular?: boolean;
}

export interface ViralCaption {
  id: string;
  title: string;
  caption: string;
  hashtags: string;
}

export interface ShopkeeperDetails {
  shopName: string;
  productTitle: string;
  price: string;
  offerTag: string;
  city: string;
  phoneWhatsApp: string;
  avatarImage: string | null;
  productImage: string | null;
  backgroundStyle: 'lahore_bazaar' | 'modern_boutique' | 'electronics_hub' | 'clean_studio' | 'eid_festive';
}

export interface GeneratedAdResult {
  id: string;
  headline: string;
  voiceoverScript: string;
  tagline: string;
  bulletPoints: string[];
  viralCaptions: { caption: string; hashtags: string }[];
  audioBase64?: string;
  audioUrl?: string;
  mode: GenerationMode;
  language: SupportedLanguage;
  shopDetails: ShopkeeperDetails;
  template: AdTemplate;
  createdAt: number;
}
