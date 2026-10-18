// Curated presets for immediate zero-friction demo and real shopkeeper workflows

export interface PresetAvatar {
  id: string;
  nameUrdu: string;
  nameEn: string;
  city: string;
  role: string;
  imageUrl: string;
}

export interface PresetProduct {
  id: string;
  nameUrdu: string;
  nameEn: string;
  category: string;
  defaultPrice: string;
  imageUrl: string;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'avatar_lahore_kapra',
    nameUrdu: 'حاجی محمد رفیق',
    nameEn: 'Haji Rafique (Cloth Merchant)',
    city: 'لاہور، انارکلی',
    role: 'کپڑے کے تاجر',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_faisalabad_tailor',
    nameUrdu: 'چوہدری اکرم',
    nameEn: 'Chaudhry Akram (Master Tailor)',
    city: 'فیصل آباد، ریل بازار',
    role: 'ماسٹر ٹیلر و ڈریس ڈیزائنر',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_karachi_mobile',
    nameUrdu: 'سلمان خان',
    nameEn: 'Salman Khan (Mobile & Tech)',
    city: 'کراچی، صدر موبائل مارکیٹ',
    role: 'اسمارٹ فون ڈیلر',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_peshawar_chappal',
    nameUrdu: 'خان لالا',
    nameEn: 'Khan Lala (Peshawari Chappal & Dry Fruits)',
    city: 'پشاور، قصہ خوانی بازار',
    role: 'روایتی چپل و میوہ جات',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar_multan_artisan',
    nameUrdu: 'بی بی فاطمہ',
    nameEn: 'Fatima Boutique',
    city: 'ملتان، گلگشت کالونی',
    role: 'کڑھائی و ہینڈی کرافٹس',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
];

export const PRESET_PRODUCTS: PresetProduct[] = [
  {
    id: 'prod_suit_lawn',
    nameUrdu: 'عید اسپیشل 3-پیس لان سوٹ',
    nameEn: 'Eid Special 3-Piece Lawn Suit',
    category: 'کپڑے / فیشن',
    defaultPrice: 'روپے 2,450',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod_peshawari_chappal',
    nameUrdu: 'اصلی چمڑے کی پشاوری چپل',
    nameEn: 'Genuine Leather Peshawari Chappal',
    category: 'جوتے / فیشن',
    defaultPrice: 'روپے 1,850',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod_kurta_men',
    nameUrdu: 'جنتلمین کاٹن کرتا شلوار',
    nameEn: 'Gentleman Cotton Kurta Shalwar',
    category: 'مردانہ ورائٹی',
    defaultPrice: 'روپے 1,999',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod_smart_watch',
    nameUrdu: 'الٹرا اسمارٹ واچ + ایئر بڈز گفٹ',
    nameEn: 'Ultra Smartwatch + Airbuds Combo',
    category: 'الیکٹرانکس',
    defaultPrice: 'روپے 3,200',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod_dry_fruit',
    nameUrdu: 'کوئٹہ مکس شاہی ڈرائی فروٹ باکس',
    nameEn: 'Quetta Shahi Dry Fruits Box 1KG',
    category: 'میوہ جات و خوراک',
    defaultPrice: 'روپے 2,800',
    imageUrl: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod_perfume_itr',
    nameUrdu: 'خالص عربی عود و مشک عطر',
    nameEn: 'Pure Arabic Oudh & Musk Attar',
    category: 'خوشبو و عطر',
    defaultPrice: 'روپے 1,499',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
  },
];

export const PRESET_BACKGROUNDS = [
  {
    id: 'lahore_bazaar',
    nameUrdu: 'روایتی پاکستانی بازار',
    nameEn: 'Pakistani Bazaar',
    color: 'from-emerald-900 via-teal-900 to-green-950',
    accent: '#059669',
  },
  {
    id: 'modern_boutique',
    nameUrdu: 'جدید برانڈڈ اسٹوڈیو',
    nameEn: 'Modern Boutique',
    color: 'from-amber-950 via-slate-900 to-stone-900',
    accent: '#f59e0b',
  },
  {
    id: 'electronics_hub',
    nameUrdu: 'نیون ٹیک مارکیٹ',
    nameEn: 'Neon Tech Hub',
    color: 'from-blue-950 via-indigo-950 to-slate-950',
    accent: '#3b82f6',
  },
  {
    id: 'clean_studio',
    nameUrdu: 'سفید و سبز شاہانہ',
    nameEn: 'White & Emerald Royal',
    color: 'from-emerald-800 via-green-900 to-teal-950',
    accent: '#10b981',
  },
  {
    id: 'eid_festive',
    nameUrdu: 'عید و رمضان گولڈن',
    nameEn: 'Eid Golden Glow',
    color: 'from-yellow-900 via-amber-950 to-emerald-950',
    accent: '#eab308',
  },
];
