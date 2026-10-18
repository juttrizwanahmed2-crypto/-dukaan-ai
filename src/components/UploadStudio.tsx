import React, { useState, useRef } from 'react';
import { GenerationMode, SupportedLanguage, ShopkeeperDetails, AdTemplate } from '../types';
import { PRESET_AVATARS, PRESET_PRODUCTS, PRESET_BACKGROUNDS } from '../data/presets';
import { ALL_TEMPLATES } from '../data/templates';
import {
  Upload,
  User,
  ShoppingBag,
  Sparkles,
  Camera,
  Layers,
  Phone,
  Tag,
  MapPin,
  Check,
  ChevronRight,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface UploadStudioProps {
  mode: GenerationMode;
  selectedLanguage: SupportedLanguage;
  selectedTemplate: AdTemplate;
  onSelectTemplate: (t: AdTemplate) => void;
  onGenerate: (details: ShopkeeperDetails, mode: GenerationMode) => Promise<void>;
  isGenerating: boolean;
  onBack: () => void;
}

export const UploadStudio: React.FC<UploadStudioProps> = ({
  mode,
  selectedLanguage,
  selectedTemplate,
  onSelectTemplate,
  onGenerate,
  isGenerating,
  onBack,
}) => {
  const [shopName, setShopName] = useState('الکرم کلوتھ ہاؤس');
  const [productTitle, setProductTitle] = useState('عید اسپیشل 3-پیس لان سوٹ');
  const [price, setPrice] = useState('روپے 2,450 (50% رعایت)');
  const [offerTag, setOfferTag] = useState('کیش آن ڈیلیوری');
  const [city, setCity] = useState('لاہور انارکلی');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('0300-1234567');
  const [backgroundStyle, setBackgroundStyle] = useState<any>('lahore_bazaar');

  const [avatarImage, setAvatarImage] = useState<string | null>(
    mode === 'avatar' ? PRESET_AVATARS[0].imageUrl : null
  );
  const [productImage, setProductImage] = useState<string | null>(PRESET_PRODUCTS[0].imageUrl);

  const faceFileInputRef = useRef<HTMLInputElement>(null);
  const prodFileInputRef = useRef<HTMLInputElement>(null);

  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setAvatarImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setProductImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(
      {
        shopName,
        productTitle,
        price,
        offerTag,
        city,
        phoneWhatsApp,
        avatarImage,
        productImage,
        backgroundStyle,
      },
      mode
    );
  };

  return (
    <div className="pb-28 pt-2 px-3 max-w-md mx-auto space-y-4">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700 font-urdu"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>واپس ہوم</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            {mode === 'avatar' ? 'بولنے والا اوتار اسٹوڈیو' : '9:16 وائرل پروڈکٹ ریل'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Photos Upload Section */}
        <div className="bg-slate-900 rounded-3xl p-4 border border-emerald-900/60 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 font-urdu">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>مرحلہ 1: تصویر اپلوڈ کریں</span>
            </span>
            <span className="text-[10px] text-slate-400">اپنا یا نمونہ منتخب کریں</span>
          </div>

          {/* If Mode is Avatar: Face Photo Upload */}
          {mode === 'avatar' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 font-urdu">
                  1. دکاندار / ماڈل کا چہرہ (Face Photo)
                </label>
                <button
                  type="button"
                  onClick={() => faceFileInputRef.current?.click()}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-urdu font-medium flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>گیلری سے اپلوڈ</span>
                </button>
              </div>

              <input
                ref={faceFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFaceUpload}
              />

              {/* Face preview + preset quick picker */}
              <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
                <div
                  onClick={() => faceFileInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border-2 border-emerald-500/50 relative cursor-pointer group shrink-0"
                >
                  {avatarImage ? (
                    <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <User className="w-6 h-6" />
                      <span className="text-[8px] font-urdu">تصویر لگائیں</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 overflow-x-auto no-scrollbar">
                  <div className="text-[10px] text-slate-400 font-urdu mb-1">
                    یا دکاندار کا اوتار منتخب کریں:
                  </div>
                  <div className="flex items-center gap-1.5">
                    {PRESET_AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av.id}
                        onClick={() => setAvatarImage(av.imageUrl)}
                        className={`w-11 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all relative ${
                          avatarImage === av.imageUrl
                            ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-500/30 ring-1 ring-emerald-300'
                            : 'border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                        title={av.nameUrdu}
                      >
                        <img src={av.imageUrl} alt={av.nameUrdu} className="w-full h-full object-cover" />
                        {avatarImage === av.imageUrl && (
                          <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-tl p-0.5 text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Photo Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 font-urdu">
                {mode === 'avatar' ? '2. پراڈکٹ کی تصویر (کپڑے، جوتے، موبائل وغیرہ)' : 'پراڈکٹ کی تصویر (Product Photo)'}
              </label>
              <button
                type="button"
                onClick={() => prodFileInputRef.current?.click()}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-urdu font-medium flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>گیلری سے اپلوڈ</span>
              </button>
            </div>

            <input
              ref={prodFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProductUpload}
            />

            <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
              <div
                onClick={() => prodFileInputRef.current?.click()}
                className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border-2 border-emerald-500/50 relative cursor-pointer group shrink-0"
              >
                {productImage ? (
                  <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBag className="w-6 h-6" />
                    <span className="text-[8px] font-urdu">پراڈکٹ لگائیں</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 overflow-x-auto no-scrollbar">
                <div className="text-[10px] text-slate-400 font-urdu mb-1">
                  یا پاکستانی پراڈکٹ منتخب کریں:
                </div>
                <div className="flex items-center gap-1.5">
                  {PRESET_PRODUCTS.map((prod) => (
                    <button
                      type="button"
                      key={prod.id}
                      onClick={() => {
                        setProductImage(prod.imageUrl);
                        setProductTitle(prod.nameUrdu);
                        setPrice(prod.defaultPrice);
                      }}
                      className={`w-11 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all relative ${
                        productImage === prod.imageUrl
                          ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-500/30 ring-1 ring-emerald-300'
                          : 'border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                      title={prod.nameUrdu}
                    >
                      <img src={prod.imageUrl} alt={prod.nameUrdu} className="w-full h-full object-cover" />
                      {productImage === prod.imageUrl && (
                        <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-tl p-0.5 text-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Shopkeeper & Pricing Information */}
        <div className="bg-slate-900 rounded-3xl p-4 border border-emerald-900/60 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 font-urdu">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>مرحلہ 2: دکان و رعایت کی معلومات</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-urdu">اردو ٹیکسٹ سپورٹ</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 font-urdu mb-1">
                دکان کا نام (Shop Name)
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-urdu focus:border-emerald-500 focus:outline-none"
                placeholder="مثال: حاجی کلوتھ ہاؤس"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 font-urdu mb-1">
                شہر / مارکیٹ (City)
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-urdu focus:border-emerald-500 focus:outline-none"
                placeholder="مثال: لاہور، انارکلی"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 font-urdu mb-1">
              پراڈکٹ کا عنوان (Product Name)
            </label>
            <input
              type="text"
              required
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-urdu focus:border-emerald-500 focus:outline-none"
              placeholder="مثال: عید فینسی کڑھائی والا سوٹ"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 font-urdu mb-1">
                قیمت / ڈسکاؤنٹ (Price)
              </label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-urdu focus:border-emerald-500 focus:outline-none"
                placeholder="مثال: روپے 1,999 (50% آف)"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 font-urdu mb-1">
                آفر ٹیگ (Offer Badge)
              </label>
              <input
                type="text"
                required
                value={offerTag}
                onChange={(e) => setOfferTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-urdu focus:border-emerald-500 focus:outline-none"
                placeholder="کیش آن ڈیلیوری / 50% رعایت"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 font-urdu mb-1">
              واٹس ایپ آرڈر نمبر (WhatsApp CTA)
            </label>
            <div className="relative">
              <input
                type="text"
                value={phoneWhatsApp}
                onChange={(e) => setPhoneWhatsApp(e.target.value)}
                className="w-full pr-8 pl-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                placeholder="0300-1234567"
              />
              <Phone className="w-3.5 h-3.5 text-emerald-400 absolute right-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Step 3: Background & Theme */}
        <div className="bg-slate-900 rounded-3xl p-4 border border-emerald-900/60 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 font-urdu">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>مرحلہ 3: ویڈیو کا بیک گراؤنڈ تھیم</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PRESET_BACKGROUNDS.map((bg) => (
              <button
                type="button"
                key={bg.id}
                onClick={() => setBackgroundStyle(bg.id)}
                className={`p-2.5 rounded-2xl text-right transition-all border ${
                  backgroundStyle === bg.id
                    ? 'border-emerald-400 bg-emerald-950/60 ring-1 ring-emerald-300'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className={`h-8 rounded-xl bg-gradient-to-r ${bg.color} mb-1.5 border border-white/10`} />
                <div className="text-xs font-bold text-white font-urdu">{bg.nameUrdu}</div>
                <div className="text-[10px] text-slate-400">{bg.nameEn}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white font-bold font-urdu text-base shadow-xl shadow-emerald-900/50 flex items-center justify-center gap-2 border border-emerald-300/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI وائرل ریل بنائی جا رہی ہے...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>
                {mode === 'avatar' ? 'بولنے والی اوتار مشہوری بنائیں' : '9:16 وائرل پروڈکٹ ریل بنائیں'}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
