import React from 'react';
import { GeneratedAdResult } from '../types';
import { Film, Play, Share2, Download, Trash2, Calendar, ShoppingBag } from 'lucide-react';

interface MyAdsScreenProps {
  ads: GeneratedAdResult[];
  onSelectAd: (ad: GeneratedAdResult) => void;
  onDeleteAd: (id: string) => void;
  onNewAd: () => void;
}

export const MyAdsScreen: React.FC<MyAdsScreenProps> = ({
  ads,
  onSelectAd,
  onDeleteAd,
  onNewAd,
}) => {
  return (
    <div className="pb-28 pt-2 px-3 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNewAd}
          className="text-xs font-bold font-urdu bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-md hover:bg-emerald-500"
        >
          + نئی ویڈیو بنائیں
        </button>

        <div className="text-right">
          <h2 className="text-sm font-bold text-white font-urdu">میری بنائی گئی مشہوری ویڈیوز</h2>
          <p className="text-[10px] text-emerald-400 font-urdu">{ads.length} ویڈیوز محفوظ ہیں</p>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
            <Film className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-white font-urdu">ابھی تک کوئی ویڈیو نہیں بنی</h4>
          <p className="text-xs text-slate-400 font-urdu max-w-xs mx-auto">
            اپنی دکان کی پہلی وائرل ویڈیو ریل بنائیں اور فیس بک، واٹس ایپ پر کسٹمرز کو راغب کریں۔
          </p>
          <button
            onClick={onNewAd}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs font-urdu shadow-lg hover:bg-emerald-500"
          >
            پہلی مشہوری بنائیں
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectAd(ad)}
                  className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition-colors shrink-0"
                  title="چلائیں اور ایکسپورٹ کریں"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
                <button
                  onClick={() => onDeleteAd(ad.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  title="ڈیلیٹ کریں"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right flex-1 min-w-0" onClick={() => onSelectAd(ad)}>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {ad.mode === 'avatar' ? 'بولنے والا اوتار' : '9:16 ریل'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-urdu">{ad.language}</span>
                </div>
                <h4 className="text-xs font-bold text-white font-urdu truncate mt-1">
                  {ad.shopDetails.shopName} - {ad.shopDetails.productTitle}
                </h4>
                <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 mt-1 font-urdu">
                  <span>قیمت: {ad.shopDetails.price}</span>
                  <span>•</span>
                  <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
