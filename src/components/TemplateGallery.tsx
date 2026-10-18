import React, { useState } from 'react';
import { AdTemplate } from '../types';
import { ALL_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates';
import { Search, Sparkles, Flame, Check, ArrowRight } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (template: AdTemplate) => void;
  onBack: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTemplates = ALL_TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'all' || tpl.categoryId === selectedCategory;
    const matchesSearch =
      tpl.titleUrdu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.badgeUrdu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-28 pt-2 px-3 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700 font-urdu"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>واپس ہوم</span>
        </button>

        <div className="text-right">
          <h2 className="text-sm font-bold text-white font-urdu">پاکستانی ٹیمپلیٹ گیلری</h2>
          <p className="text-[10px] text-emerald-400 font-urdu">100+ ریڈی میڈ عید و سیل فارمیٹس</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ٹیمپلیٹ، شہر یا آفر تلاش کریں (مثلاً: عید، 50%، آزادی)..."
          className="w-full pl-3 pr-9 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs font-urdu focus:border-emerald-500 focus:outline-none"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
      </div>

      {/* Category Horizontal Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {TEMPLATE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-urdu font-bold whitespace-nowrap text-xs transition-all shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50 border border-emerald-400/50'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <span>{cat.nameUrdu}</span>
              <span className="text-[10px] opacity-70 ml-1">({cat.count})</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid (100+ templates) */}
      <div className="grid grid-cols-2 gap-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`p-3.5 rounded-3xl bg-gradient-to-br ${template.bgGradient} border border-white/15 hover:border-emerald-400 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex flex-col justify-between h-48 relative overflow-hidden group`}
          >
            {/* Top Badges */}
            <div className="flex items-start justify-between">
              <span className="text-[9px] font-bold bg-black/50 backdrop-blur-md text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-urdu">
                {template.badgeUrdu}
              </span>
              <span className="text-[10px] text-white/80 font-mono bg-white/10 px-1.5 py-0.5 rounded">
                9:16
              </span>
            </div>

            {/* Center Content Placeholder */}
            <div className="my-auto py-2">
              <h4 className="text-sm font-bold font-urdu text-white leading-snug line-clamp-2">
                {template.titleUrdu}
              </h4>
              <p className="text-[11px] text-emerald-200 font-urdu mt-1 line-clamp-1 opacity-90">
                {template.defaultTaglineUrdu}
              </p>
            </div>

            {/* Bottom Footer */}
            <div className="pt-2 border-t border-white/15 flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-300 font-urdu">
                {template.defaultPriceUrdu}
              </span>
              <button className="text-[10px] font-bold font-urdu bg-white text-slate-900 px-2.5 py-1 rounded-full group-hover:bg-emerald-400 group-hover:text-white transition-colors">
                استعمال کریں
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
