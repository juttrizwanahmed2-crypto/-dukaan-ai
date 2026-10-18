import React from 'react';
import { Home, LayoutGrid, Wand2, Film, Wallet } from 'lucide-react';

export type TabType = 'home' | 'templates' | 'studio' | 'my_ads' | 'wallet';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', labelUrdu: 'ہوم', labelEn: 'Home', icon: Home },
    { id: 'templates', labelUrdu: 'ٹیمپلیٹس', labelEn: 'Templates', icon: LayoutGrid, count: '100+' },
    { id: 'studio', labelUrdu: 'مشہوری بنائیں', labelEn: 'Studio', icon: Wand2, highlight: true },
    { id: 'my_ads', labelUrdu: 'میری مشہوری', labelEn: 'My Ads', icon: Film },
    { id: 'wallet', labelUrdu: 'والٹ و روبی', labelEn: 'Wallet', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-emerald-900/40 shadow-2xl safe-area-bottom">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1.5">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as TabType)}
                className="flex flex-col items-center justify-center -mt-4 group relative"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-tr from-emerald-500 to-green-400 text-white shadow-emerald-600/50 ring-2 ring-emerald-300'
                      : 'bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white shadow-emerald-900/60'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 font-urdu mt-1">
                  {tab.labelUrdu}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as TabType)}
              className={`flex flex-col items-center justify-center py-1 transition-all rounded-xl relative ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.count && (
                  <span className="absolute -top-1.5 -right-3 text-[8px] font-black bg-emerald-600 text-white rounded-full px-1 py-0.2 border border-slate-900">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-urdu tracking-tight mt-0.5">
                {tab.labelUrdu}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
