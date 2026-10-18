import { AdTemplate, TemplateCategory } from '../types';

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'all', nameUrdu: 'تمام ٹیمپلیٹس', nameEn: 'All Templates', icon: 'Sparkles', count: 104 },
  { id: 'eid', nameUrdu: 'عید کلیکشن', nameEn: 'Eid Specials', icon: 'Moon', count: 16 },
  { id: 'ramzan', nameUrdu: 'رمضان المبارک', nameEn: 'Ramzan Offers', icon: 'Sun', count: 12 },
  { id: 'azadi', nameUrdu: '14 اگست یوم آزادی', nameEn: '14 August Azadi', icon: 'Flag', count: 12 },
  { id: 'sale_50', nameUrdu: '50% رعایت سیل', nameEn: '50% OFF Mega Sale', icon: 'Flame', count: 18 },
  { id: 'jummah', nameUrdu: 'جمعہ مبارک آفر', nameEn: 'Jummah Mubarak', icon: 'Star', count: 10 },
  { id: 'new_arrivals', nameUrdu: 'نیا اسٹاک پہنچ گیا', nameEn: 'New Arrivals', icon: 'PackageCheck', count: 14 },
  { id: 'shadi_season', nameUrdu: 'شادی و برائیڈل سیزن', nameEn: 'Wedding Collection', icon: 'Heart', count: 12 },
  { id: 'electronics', nameUrdu: 'موبائل و الیکٹرانکس', nameEn: 'Mobile & Tech', icon: 'Smartphone', count: 10 },
];

// Rich set of Pakistani base patterns
const BASE_TEMPLATES_DATA: Partial<AdTemplate>[] = [
  // EID SPECIALS
  {
    id: 'eid_royal_1',
    categoryId: 'eid',
    titleUrdu: 'عید الفطر شاہی کلیکشن',
    titleEn: 'Eid Royal Fest Collection',
    badgeUrdu: 'چاند رات دھماکہ آفر',
    bgGradient: 'from-emerald-900 via-teal-800 to-green-950',
    accentColor: '#10b981',
    defaultTaglineUrdu: 'عید پر سب سے الگ اور منفرد نظر آئیں',
    defaultPriceUrdu: 'روپے 2,999 (محدود اسٹاک)',
    defaultScriptUrdu: 'السلام علیکم! عید کے پرمسرت موقع پر ہماری دکان لے کر آئی ہے دلکش ورائٹی۔ ابھی بک کریں اور چاند رات پر گھر بیٹھے ڈلیوری پائیں!',
    musicMood: 'festive_eid',
    isPopular: true,
  },
  {
    id: 'eid_lawn_delight',
    categoryId: 'eid',
    titleUrdu: 'عید الٹرا لگژری لان',
    titleEn: 'Eid Luxury Lawn Suits',
    badgeUrdu: 'فری ڈوپٹہ و ٹراؤزر',
    bgGradient: 'from-amber-900 via-emerald-900 to-slate-900',
    accentColor: '#f59e0b',
    defaultTaglineUrdu: 'اصل امپورٹڈ کوالٹی گارنٹی کے ساتھ',
    defaultPriceUrdu: 'روپے 3,450',
    defaultScriptUrdu: 'باجی عید کی تیاری ابھی سے مکمل کریں! بہترین رنگ اور پائیدار کڑھائی کے ساتھ عید کا شاندار تحفہ۔',
    musicMood: 'festive_eid',
    isPopular: true,
  },
  {
    id: 'eid_kurta_pajama',
    categoryId: 'eid',
    titleUrdu: 'مردانہ عید کرتا شلوار',
    titleEn: 'Men Eid Kurta Shalwar',
    badgeUrdu: '100% خالص کاٹن',
    bgGradient: 'from-green-950 via-emerald-800 to-stone-900',
    accentColor: '#059669',
    defaultTaglineUrdu: 'عید نماز کا روایتی خوبصورت انداز',
    defaultPriceUrdu: 'روپے 1,999',
    defaultScriptUrdu: 'بھائی جان عید نماز کے لیے شاندار کاٹن سوٹ حاضر ہیں، آرام دہ کپڑا اور خوبصورت اسٹیچنگ۔',
    musicMood: 'celebration_dhol',
    isPopular: true,
  },
  {
    id: 'eid_kids_joy',
    categoryId: 'eid',
    titleUrdu: 'ننھے بچوں کے عیدی کپڑے',
    titleEn: 'Kids Eid Festive Wear',
    badgeUrdu: 'ایک کے ساتھ ایک فری',
    bgGradient: 'from-pink-900 via-purple-900 to-slate-900',
    accentColor: '#ec4899',
    defaultTaglineUrdu: 'بچوں کے چہروں پر عید کی خوشیاں سجائیں',
    defaultPriceUrdu: 'روپے 1,299',
    defaultScriptUrdu: 'عید پر بچوں کے لیے خاص دیدہ زیب سوٹ، نرم کپڑا اور دلکش ڈیزائن۔',
    musicMood: 'festive_eid',
  },
  // RAMZAN SPECIALS
  {
    id: 'ramzan_rehmat_1',
    categoryId: 'ramzan',
    titleUrdu: 'رمضان رحمت خصوصی پیکیج',
    titleEn: 'Ramzan Blessings Combo',
    badgeUrdu: 'ثواب بھی اور بچت بھی',
    bgGradient: 'from-teal-950 via-emerald-950 to-stone-950',
    accentColor: '#14b8a6',
    defaultTaglineUrdu: 'ماہ صیام میں بے مثال سستے دام',
    defaultPriceUrdu: 'ہول سیل ریٹ پر دستیاب',
    defaultScriptUrdu: 'رمضان المبارک کے مقدس مہینے میں خصوصی رعایت! ہر مسلمان بھائی اور بہن کے لیے باکفایت خریداری۔',
    musicMood: 'festive_eid',
    isPopular: true,
  },
  {
    id: 'ramzan_sehri_iftar',
    categoryId: 'ramzan',
    titleUrdu: 'سحری و افطاری راشن ڈسکاؤنٹ',
    titleEn: 'Sehri & Iftar Ration Deal',
    badgeUrdu: 'کیش آن ڈیلیوری',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    accentColor: '#eab308',
    defaultTaglineUrdu: 'اعلیٰ کوالٹی اور منافع بالکل کم',
    defaultPriceUrdu: 'پیکیج صرف 4,999',
    defaultScriptUrdu: 'ماشاءاللہ! رمضان کا سستا بازار اب آپ کے دروازے پر۔ خالص اشیاء انتہائی کم ریٹ پر۔',
    musicMood: 'energetic_bazaar',
  },
  // 14 AUGUST AZADI SALE
  {
    id: 'azadi_green_white_1',
    categoryId: 'azadi',
    titleUrdu: '14 اگست جشن آزادی دھماکہ سیل',
    titleEn: '14 August Azadi Mega Sale',
    badgeUrdu: 'سبز و سفید پرچم کلیکشن',
    bgGradient: 'from-emerald-900 via-green-800 to-slate-950',
    accentColor: '#22c55e',
    defaultTaglineUrdu: 'آزادی کا جشن، پاکستان کی سب سے بڑی رعایت کے ساتھ',
    defaultPriceUrdu: 'فلیٹ 14 اگست ڈسکاؤنٹ',
    defaultScriptUrdu: 'پاکستان زندہ باد! 14 اگست کے پرمسرت دن پر ہم لائے ہیں شاندار آزادی آفر۔ قومی جذبے کے ساتھ گرینڈ بچت کا موقع نہ گنوائیں!',
    musicMood: 'celebration_dhol',
    isPopular: true,
  },
  {
    id: 'azadi_tshirts_flags',
    categoryId: 'azadi',
    titleUrdu: 'آزادی بیجز، کرتہ اور جھنڈیاں',
    titleEn: 'Azadi Badges & Shirts',
    badgeUrdu: 'پاکستان زندہ باد',
    bgGradient: 'from-emerald-950 via-teal-900 to-green-900',
    accentColor: '#4ade80',
    defaultTaglineUrdu: 'دل دل پاکستان، جان جان پاکستان',
    defaultPriceUrdu: 'صرف 850 روپے سے شروع',
    defaultScriptUrdu: 'اپنے وطن سے محبت کا اظہار کریں خوبصورت آزادی کرتوں اور بیجز کے ساتھ۔ ہول سیل ریٹس پر منگوائیں۔',
    musicMood: 'celebration_dhol',
  },
  // 50% OFF MEGA SALE
  {
    id: 'sale_50_dhamaka_1',
    categoryId: 'sale_50',
    titleUrdu: '50% فلیٹ رعایت - دھماکہ سیل',
    titleEn: 'Flat 50% OFF Dhamaka Sale',
    badgeUrdu: 'آدھی قیمت پر سب کچھ',
    bgGradient: 'from-red-950 via-orange-950 to-slate-950',
    accentColor: '#ef4444',
    defaultTaglineUrdu: 'پہلے آئیں، پہلے پائیں • اسٹاک محدود ہے',
    defaultPriceUrdu: 'اب آدھے دام پر!',
    defaultScriptUrdu: 'خبردار ہو جائیں! سال کی سب سے بڑی سیل شروع ہو چکی ہے۔ پورے 50 فیصد کی بچت۔ آج ہی واٹس ایپ پر اپنا آرڈر بک کروائیں!',
    musicMood: 'modern_hype',
    isPopular: true,
  },
  {
    id: 'sale_clearance_bazaar',
    categoryId: 'sale_50',
    titleUrdu: 'گودام خالی کرو سیل',
    titleEn: 'Warehouse Clearance Sale',
    badgeUrdu: 'خریدیں 1 اور پائیں 1 مفت',
    bgGradient: 'from-rose-950 via-amber-950 to-neutral-900',
    accentColor: '#f43f5e',
    defaultTaglineUrdu: 'سارا پرانا و نیا اسٹاک آدھے ریٹ پر',
    defaultPriceUrdu: 'شروع صرف 999 روپے',
    defaultScriptUrdu: 'سستا سودا اور زبردست مال! دکان کا سارا مال فیکٹری ریٹ پر حاصل کریں۔ جلدی کریں اس سے پہلے کہ اسٹاک ختم ہو جائے!',
    musicMood: 'energetic_bazaar',
    isPopular: true,
  },
  // JUMMAH MUBARAK SPECIAL
  {
    id: 'jummah_mubarak_1',
    categoryId: 'jummah',
    titleUrdu: 'جمعہ مبارک خصوصی رعایت',
    titleEn: 'Jummah Mubarak Blessed Deal',
    badgeUrdu: 'صرف آج کے دن کے لیے',
    bgGradient: 'from-emerald-950 via-teal-900 to-green-950',
    accentColor: '#10b981',
    defaultTaglineUrdu: 'جمعہ کی برکتیں اور لاجواب بچت',
    defaultPriceUrdu: 'خصوصی جمعہ ریٹ',
    defaultScriptUrdu: 'تمام اہل وطن کو جمعہ مبارک! آج کے بابرکت دن پر خصوصی ڈسکاؤنٹ کوڈ کے ساتھ تمام مصنوعات پر بھاری رعایت۔',
    musicMood: 'festive_eid',
    isPopular: true,
  },
  // NEW ARRIVALS
  {
    id: 'new_arrivals_fresh',
    categoryId: 'new_arrivals',
    titleUrdu: 'نیا برانڈڈ اسٹاک آ گیا ہے!',
    titleEn: 'Fresh Stock Unboxing Reel',
    badgeUrdu: 'تازہ ترین فیشن ڈیزائن 2026',
    bgGradient: 'from-slate-950 via-emerald-950 to-teal-950',
    accentColor: '#06b6d4',
    defaultTaglineUrdu: 'مارکیٹ سے پہلے سب سے اعلیٰ کوالٹی',
    defaultPriceUrdu: 'مناسب ترین ہول سیل ریٹ',
    defaultScriptUrdu: 'باؤ جی سنیں! کنٹینر سے تازہ مال اتر چکا ہے۔ ایسی نفاست اور ایسی چمک آپ نے پہلے کبھی نہیں دیکھی ہوگی۔',
    musicMood: 'energetic_bazaar',
    isPopular: true,
  },
  // SHADI SEASON
  {
    id: 'shadi_bridal_1',
    categoryId: 'shadi_season',
    titleUrdu: 'شادی و برائیڈل سوٹ کلیکشن',
    titleEn: 'Royal Wedding & Bridal Wear',
    badgeUrdu: 'دلہن و باراتی اسپیشل',
    bgGradient: 'from-purple-950 via-rose-950 to-amber-950',
    accentColor: '#ec4899',
    defaultTaglineUrdu: 'شادی کا ہر لمحہ یادگار اور حسین بنائیں',
    defaultPriceUrdu: 'پیکیج پر 40% رعایت',
    defaultScriptUrdu: 'شادی سیزن کے لیے خالص زری اور کڑھائی والے سوٹ۔ دلہن اور فیملی کے لیے شاہانہ جوڑے۔',
    musicMood: 'celebration_dhol',
    isPopular: true,
  },
  // ELECTRONICS
  {
    id: 'tech_mobile_deal',
    categoryId: 'electronics',
    titleUrdu: 'موبائل و گیجٹس میگا آفر',
    titleEn: 'Smartphones & Accessories Deal',
    badgeUrdu: '1 سال پی ٹی اے اپرووڈ وارنٹی',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    accentColor: '#3b82f6',
    defaultTaglineUrdu: 'اصل گیجٹ، اصلی وارنٹی کے ساتھ',
    defaultPriceUrdu: 'وارنٹی کے ساتھ سستے دام',
    defaultScriptUrdu: 'پی ٹی اے اپرووڈ موبائل اور پریمیم ایئر بڈز اب انتہائی آسان اقساط اور ڈسکاؤنٹ پر۔ آن لائن آرڈر کریں۔',
    musicMood: 'modern_hype',
    isPopular: true,
  },
];

// Helper to expand into 100+ fully-fleshed Pakistani templates
export const ALL_TEMPLATES: AdTemplate[] = (() => {
  const list: AdTemplate[] = [];

  // Add the hand-crafted hero templates
  BASE_TEMPLATES_DATA.forEach((b) => {
    list.push(b as AdTemplate);
  });

  // Cities, shopping districts and festival modifiers in Pakistan
  const cities = ['لاہور انارکلی', 'کراچی طارق روڈ', 'فیصل آباد کچہری بازار', 'پشاور قصہ خوانی', 'راولپنڈی راجہ بازار', 'ملتان کینٹ', 'سیالکوٹ'];
  const categoriesList = ['eid', 'ramzan', 'azadi', 'sale_50', 'jummah', 'new_arrivals', 'shadi_season', 'electronics'];

  let counter = list.length + 1;

  for (const catId of categoriesList) {
    const cat = TEMPLATE_CATEGORIES.find((c) => c.id === catId);
    const catNameUrdu = cat ? cat.nameUrdu : 'سیل';

    for (let i = 1; i <= 12; i++) {
      const city = cities[i % cities.length];
      const templateId = `${catId}_auto_${i}_${counter}`;

      const gradients = [
        'from-emerald-900 via-teal-900 to-slate-950',
        'from-green-950 via-emerald-800 to-black',
        'from-amber-950 via-yellow-950 to-slate-950',
        'from-red-950 via-stone-900 to-emerald-950',
        'from-purple-950 via-slate-950 to-green-950',
      ];

      const accents = ['#10b981', '#059669', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4'];

      list.push({
        id: templateId,
        categoryId: catId,
        titleUrdu: `${catNameUrdu} - اسپیشل ایڈیشن #${i} (${city})`,
        titleEn: `${cat?.nameEn || 'Promo'} Edition #${i}`,
        badgeUrdu: i % 2 === 0 ? 'مفت ہوم ڈیلیوری' : 'فری گفٹ ساتھ پائیں',
        bgGradient: gradients[i % gradients.length],
        accentColor: accents[i % accents.length],
        defaultTaglineUrdu: `${city} مارکیٹ کی سب سے مقبول ترین ڈیل`,
        defaultPriceUrdu: `صرف روپے ${1000 + i * 250}`,
        defaultScriptUrdu: `السلام علیکم! ${city} کے معزز خریداروں کے لیے ${catNameUrdu} کا بے مثال پیکیج حاضر ہے۔ ابھی رابطہ کریں اور فائدہ اٹھائیں۔`,
        musicMood: (i % 4 === 0 ? 'celebration_dhol' : i % 3 === 0 ? 'modern_hype' : 'energetic_bazaar'),
      });
      counter++;
    }
  }

  return list;
})();
