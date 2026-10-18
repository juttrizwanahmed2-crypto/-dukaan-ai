import React, { useState, useEffect } from 'react';
import { Gem, Diamond, Tv, X, CheckCircle, Sparkles, Gift, ArrowUpRight, Shield } from 'lucide-react';

interface WalletModalProps {
  rubies: number;
  diamonds: number;
  onAddRubies: (amount: number) => void;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  rubies,
  diamonds,
  onAddRubies,
  onClose,
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);

  // Ad simulation timer
  useEffect(() => {
    let timer: any;
    if (isWatchingAd && adCountdown > 0) {
      timer = setInterval(() => {
        setAdCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isWatchingAd && adCountdown === 0) {
      onAddRubies(10);
      setRewardClaimed(true);
      setIsWatchingAd(false);
      setAdCountdown(5);
      setTimeout(() => setRewardClaimed(false), 3500);
    }
    return () => clearInterval(timer);
  }, [isWatchingAd, adCountdown, onAddRubies]);

  const handleStartWatchAd = () => {
    setIsWatchingAd(true);
    setAdCountdown(5);
  };

  const handleClaimDaily = () => {
    if (!dailyClaimed) {
      onAddRubies(5);
      setDailyClaimed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-sm rounded-3xl p-4 shadow-2xl relative overflow-hidden space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-right pr-6">
          <h3 className="text-base font-bold text-white font-urdu">دکاندار والٹ و انعامات</h3>
          <p className="text-[11px] text-emerald-400 font-urdu">مشہوری ویڈیوز ڈاؤن لوڈ کے لیے روبی استعمال کریں</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-950/70 to-slate-950 border border-rose-500/40 text-center">
            <div className="w-8 h-8 mx-auto rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 mb-1">
              <Gem className="w-4 h-4 fill-rose-500" />
            </div>
            <div className="text-xl font-black text-rose-200">{rubies}</div>
            <div className="text-[10px] font-bold text-rose-400 font-urdu">روبی بیلنس</div>
            <div className="text-[8px] text-slate-400 mt-0.5">1 ویڈیو = 5 روبی</div>
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950/70 to-slate-950 border border-cyan-500/40 text-center">
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-1">
              <Diamond className="w-4 h-4 fill-cyan-400" />
            </div>
            <div className="text-xl font-black text-cyan-200">{diamonds}</div>
            <div className="text-[10px] font-bold text-cyan-400 font-urdu">ڈائمنڈ (پریمیم)</div>
            <div className="text-[8px] text-slate-400 mt-0.5">4K الٹرا ایچ ڈی</div>
          </div>
        </div>

        {/* Reward Claimed Notification */}
        {rewardClaimed && (
          <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-urdu text-center flex items-center justify-center gap-1.5 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>مبارک ہو! آپ کو 10 روبی مل گئے ہیں۔</span>
          </div>
        )}

        {/* AD WATCHING SIMULATION OVERLAY */}
        {isWatchingAd ? (
          <div className="bg-slate-950 border-2 border-amber-400/80 rounded-2xl p-4 text-center space-y-3 relative overflow-hidden">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1">
              <Tv className="w-3.5 h-3.5" />
              <span>سپانسرڈ بزنس اشتہار</span>
            </div>

            {/* Simulated Pakistani Merchant Ad */}
            <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/30 text-right space-y-1">
              <div className="text-xs font-bold text-white font-urdu">
                جاز کیش اور ایزی پیسہ مرچنٹ اکاؤنٹ
              </div>
              <p className="text-[10px] text-emerald-200 font-urdu">
                اپنی دکان پر کیو آر کوڈ لگائیں اور بغیر کسی فیس کے پورے پاکستان سے ادائیگیاں وصول کریں!
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center text-sm shadow-md animate-pulse">
                {adCountdown}s
              </div>
              <span className="text-xs text-slate-300 font-urdu">
                انعام وصول ہو رہا ہے، براہ کرم انتظار کریں...
              </span>
            </div>
          </div>
        ) : (
          /* CORE MONETIZATION: Watch Ad to Earn 10 Rubies */
          <div className="space-y-2">
            <button
              onClick={handleStartWatchAd}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-bold font-urdu text-sm shadow-xl shadow-amber-950/40 flex items-center justify-between border border-amber-200 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-950/20 flex items-center justify-center text-amber-950">
                  <Tv className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="text-left font-sans">
                  <div className="text-xs font-black uppercase tracking-wider">+10 FREE RUBIES</div>
                  <div className="text-[9px] opacity-80">Watch 5s Sponsored Ad</div>
                </div>
              </div>

              <span className="text-xs font-urdu font-bold">
                ایڈ دیکھیں اور روبی کمائیں
              </span>
            </button>

            {/* Daily Shopkeeper Login Reward */}
            <button
              onClick={handleClaimDaily}
              disabled={dailyClaimed}
              className={`w-full p-3 rounded-2xl border flex items-center justify-between text-xs font-urdu transition-all ${
                dailyClaimed
                  ? 'bg-slate-950/60 border-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-950/50 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-200 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>روزانہ کا تحفہ (+5 روبی)</span>
              </div>
              <span className="text-[10px] font-bold">
                {dailyClaimed ? 'حاصل کر لیا گیا ✔️' : 'ابھی کلیم کریں'}
              </span>
            </button>
          </div>
        )}

        {/* Shopkeeper Recharge Packs */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-right text-[11px] font-bold text-slate-400 font-urdu">
            یا فوری روبی پیکیج خریدیں:
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              onClick={() => {
                onAddRubies(50);
                alert('ٹیسٹ کریڈٹ: 50 روبی شامل کر دیے گئے ہیں!');
              }}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 cursor-pointer text-right transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-bold">PKR 250</span>
                <span className="text-xs font-bold text-white">50 روبی</span>
              </div>
              <div className="text-[9px] text-slate-400 font-urdu mt-0.5">10 ایچ ڈی ویڈیوز</div>
            </div>

            <div
              onClick={() => {
                onAddRubies(250);
                alert('ٹیسٹ کریڈٹ: 250 روبی شامل کر دیے گئے ہیں!');
              }}
              className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/40 hover:border-amber-400 cursor-pointer text-right transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-bold">PKR 999</span>
                <span className="text-xs font-bold text-white">250 روبی</span>
              </div>
              <div className="text-[9px] text-amber-300 font-urdu mt-0.5">50 ویڈیوز + بونس</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-urdu transition-colors"
        >
          بند کریں (Close)
        </button>
      </div>
    </div>
  );
};
