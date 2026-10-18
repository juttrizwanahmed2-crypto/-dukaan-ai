import React from 'react';
import { GenerationMode, SupportedLanguage } from '../types';
import { ALL_TEMPLATES } from '../data/templates';
import { UserCheck, Sparkles, Video, Flame, Star, Zap, CheckCircle2, ShoppingBag } from 'lucide-react';

interface HomeScreenProps {
  selectedLanguage: SupportedLanguage;
  onSelectMode: (mode: GenerationMode) => void;
  onSelectTemplate: (templateId: string) => void;
  onOpenTemplates: () => void;
  onOpenWallet: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  selectedLanguage,
  onSelectMode,
  onSelectTemplate,
  onOpenTemplates,
  onOpenWallet,
}) => {
  const featuredTemplates = ALL_TEMPLATES.filter((t) => t.isPopular).slice(0, 6);

  // Dynamic language greeting banner
  const greetings: Record<SupportedLanguage, { heading: string; sub: string }> = {
    Urdu: {
      heading: 'دکان کی مشہوری اب صرف ایک کلک پر!',
      sub: 'نہ کسی ڈیزائنر کی ضرورت، نہ ویڈیو ایڈیٹر کا خرچہ۔ اپنی تصویر یا پراڈکٹ سے وائرل ریل بنائیں۔',
    },
    Punjabi: {
      heading: 'باؤ جی! ہن دکان دی مشہوری منٹاں وچ تیار!',
      sub: 'نویں ورائٹی دی دھماکہ دار ریل بناؤ تے گاہکاں دی لائن لگاؤ۔ ایناں سوکھا کہ کوئی وی بنا لوے۔',
    },
    Saraiki: {
      heading: 'سئیں! اپݨی دوکان دی مشہوری خود بݨاؤ!',
      sub: 'سوہنی ویڈیو ریل، اپݨی تصویر نال یا صرف مال دی تصویر نال، ڈھیر سارے آرڈر پاؤ۔',
    },
    Pashto: {
      heading: 'درنو تاجرانو! د خپل دوکان مشهوری په څو دقیقو کښې جوړه کړئ!',
      sub: 'د فیسبوک، ټیک ټاک او واټس اپ لپاره تر ټولو غوره ویډیوګانې په اسانۍ سره جوړې کړئ.',
    },
    English: {
      heading: 'Create Viral Ads for your Shop in 60 Seconds!',
      sub: 'Professional Canva-grade 9:16 video reels with Urdu AI voiceovers, tailored for Pakistani businesses.',
    },
  };

  const currentGreeting = greetings[selectedLanguage] || greetings['Urdu'];

  return (
    <div className="pb-24 pt-3 px-3 max-w-md mx-auto space-y-4">
      {/* Hero Welcome Card with Pakistani Green Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 p-4 border border-emerald-500/30 shadow-xl shadow-emerald-950/60 text-white">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-sm">
              <Flame className="w-3 h-3 fill-amber-950" />
              <span>نمبر 1 پاکستانی بزنس ایپ</span>
            </span>
            <span className="text-[10px] text-emerald-200 bg-emerald-700/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
              9:16 ریلس و پوسٹرز
            </span>
          </div>

          <h2 className="text-xl font-bold font-urdu leading-relaxed text-white">
            {currentGreeting.heading}
          </h2>
          <p className="text-xs text-emerald-100/90 font-urdu mt-1 leading-relaxed">
            {currentGreeting.sub}
          </p>

          {/* Quick Shopkeeper Trust Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-700/50 text-center">
            <div className="bg-emerald-950/60 rounded-xl p-1.5 border border-emerald-600/20">
              <div className="text-sm font-black text-amber-300">50K+</div>
              <div className="text-[9px] text-emerald-200 font-urdu">مطمئن دکاندار</div>
            </div>
            <div className="bg-emerald-950/60 rounded-xl p-1.5 border border-emerald-600/20">
              <div className="text-sm font-black text-white">100+</div>
              <div className="text-[9px] text-emerald-200 font-urdu">عید و سیل ٹیمپلیٹس</div>
            </div>
            <div className="bg-emerald-950/60 rounded-xl p-1.5 border border-emerald-600/20">
              <div className="text-sm font-black text-emerald-300">3X</div>
              <div className="text-[9px] text-emerald-200 font-urdu">فروخت میں اضافہ</div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE ACTION: The Two Big Mandatory Flow Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>مشہوری بنانے کا طریقہ منتخب کریں</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-urdu">پلے اسٹور ریڈی فارمیٹ</span>
        </div>

        {/* BUTTON 1: [ اپنی تصویر سے مشہوری بناؤ ] */}
        <button
          onClick={() => onSelectMode('avatar')}
          className="w-full text-right p-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-800 text-white shadow-xl shadow-emerald-900/40 hover:from-emerald-500 hover:to-emerald-700 transition-all border-2 border-emerald-400/40 hover:border-emerald-300 group relative overflow-hidden active:scale-[0.98]"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 text-white group-hover:rotate-6 transition-transform shadow-inner">
              <UserCheck className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  سب سے زیادہ وائرل 🔥
                </span>
              </div>
              <h3 className="text-lg font-bold font-urdu text-white tracking-wide mt-1">
                اپنی تصویر سے مشہوری بناؤ
              </h3>
              <p className="text-xs text-emerald-100 font-urdu mt-0.5">
                بولنے والا اوتار، منہ کی حرکت، ہاتھ میں پراڈکٹ اور مقامی آواز
              </p>
            </div>
          </div>
        </button>

        {/* BUTTON 2: [ صرف پروڈکٹ سے مشہوری بناؤ ] */}
        <button
          onClick={() => onSelectMode('product_reel')}
          className="w-full text-right p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl shadow-slate-950/60 hover:from-slate-800 hover:to-slate-900 transition-all border-2 border-slate-700 hover:border-emerald-500/60 group relative overflow-hidden active:scale-[0.98]"
        >
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-emerald-500/40 text-emerald-400 group-hover:-rotate-6 transition-transform">
              <Video className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  بغیر چہرے کے 9:16 ریل
                </span>
              </div>
              <h3 className="text-lg font-bold font-urdu text-white tracking-wide mt-1">
                صرف پروڈکٹ سے مشہوری بناؤ
              </h3>
              <p className="text-xs text-slate-300 font-urdu mt-0.5">
                پراڈکٹ کا وائرل زوم، ہاتھ کا ڈسپلے، بیک گراؤنڈ میوزک اور وائس اوور
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Featured Pakistani Templates Carousel */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white font-urdu">مقبول ترین پاکستانی ٹیمپلیٹس</h4>
          </div>
          <button
            onClick={onOpenTemplates}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-urdu font-medium"
          >
            سب دیکھیں (100+) &larr;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {featuredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`p-3 rounded-2xl bg-gradient-to-br ${template.bgGradient} border border-white/10 hover:border-emerald-400/60 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md relative overflow-hidden group flex flex-col justify-between h-36`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-bold bg-black/40 backdrop-blur-md text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full font-urdu">
                  {template.badgeUrdu}
                </span>
                <span className="text-[10px] text-white/70">9:16</span>
              </div>

              <div>
                <h5 className="text-xs font-bold font-urdu text-white leading-snug line-clamp-2">
                  {template.titleUrdu}
                </h5>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10">
                  <span className="text-[10px] text-emerald-200 font-urdu truncate">
                    {template.defaultPriceUrdu}
                  </span>
                  <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-urdu">
                    استعمال کریں
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pakistani Shopkeeper Advantage Box */}
      <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-white">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <h5 className="text-xs font-bold font-urdu">دکاندار کے لیے کیا خاص ہے؟</h5>
        </div>
        <ul className="text-xs space-y-1.5 text-slate-300 font-urdu pr-1">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>اردو، پنجابی، سرائیکی اور پشتو میں اصلی دکانداری لہجہ</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>واٹس ایپ آرڈر بٹن اور کیش آن ڈیلیوری کے وائرل بیجز</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>کوئی واٹر مارک نہیں — 100% پلے اسٹور ریڈی ایچ ڈی کوالٹی</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
