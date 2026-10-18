import React from 'react';
import { SupportedLanguage, LanguageInfo } from '../types';
import { Gem, Diamond, Plus, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface TopBarProps {
  rubies: number;
  diamonds: number;
  onOpenWallet: () => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const LANGUAGES: LanguageInfo[] = [
  { id: 'Urdu', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', sampleGreeting: 'السلام علیکم' },
  { id: 'Punjabi', name: 'Punjabi', nativeName: 'پنجابی (شاہ مکھی)', flag: '🌾', sampleGreeting: 'باؤ جی ویکھو' },
  { id: 'Saraiki', name: 'Saraiki', nativeName: 'سرائیکی', flag: '🌸', sampleGreeting: 'اسلام وعلیکم سئیں' },
  { id: 'Pashto', name: 'Pashto', nativeName: 'پښتو', flag: '⛰️', sampleGreeting: 'سلامونه او احترامات' },
  { id: 'English', name: 'English', nativeName: 'English', flag: '🌐', sampleGreeting: 'Super Dhamaka' },
];

export const TopBar: React.FC<TopBarProps> = ({
  rubies,
  diamonds,
  onOpenWallet,
  selectedLanguage,
  onSelectLanguage,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/60 shadow-lg px-3 py-2.5">
      {/* Top Android Status / Wallet Header */}
      <div className="flex items-center justify-between gap-2 max-w-4xl mx-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-900/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg font-urdu leading-none">د</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white tracking-tight">دکان اے آئی</h1>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-emerald-400/90 font-medium">Mashhoori Studio Pakistan</p>
          </div>
        </div>

        {/* Currency Tracker: Ruby & Diamond */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/60"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Ruby Balance Badge */}
          <div
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-950/80 to-slate-900 border border-rose-500/40 rounded-full px-2.5 py-1 cursor-pointer hover:border-rose-400 transition-all shadow-sm group"
          >
            <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Gem className="w-3.5 h-3.5 fill-rose-500 text-rose-300" />
            </div>
            <span className="text-xs font-bold text-rose-200">Ruby: {rubies}</span>
            <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center ml-0.5">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          {/* Diamond Balance Badge */}
          <div
            onClick={onOpenWallet}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 rounded-full px-2.5 py-1 cursor-pointer hover:border-cyan-400 transition-all shadow-sm"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Diamond className="w-3.5 h-3.5 fill-cyan-400 text-cyan-300" />
            </div>
            <span className="text-xs font-bold text-cyan-200">Diamond: {diamonds}</span>
          </div>
        </div>
      </div>

      {/* Language Selector Row of Chips */}
      <div className="max-w-4xl mx-auto mt-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <div className="text-[11px] font-medium text-slate-400 whitespace-nowrap px-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>آواز و متن زبان:</span>
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => onSelectLanguage(lang.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap shrink-0 text-xs ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold shadow-md shadow-emerald-900/50 border border-emerald-400/50 scale-[1.02]'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="font-urdu text-[13px]">{lang.nativeName}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
