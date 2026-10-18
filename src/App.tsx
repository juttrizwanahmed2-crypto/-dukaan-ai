/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  SupportedLanguage,
  GenerationMode,
  AdTemplate,
  ShopkeeperDetails,
  GeneratedAdResult,
} from './types';
import { ALL_TEMPLATES } from './data/templates';
import { PRESET_AVATARS, PRESET_PRODUCTS } from './data/presets';
import { TopBar } from './components/TopBar';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { UploadStudio } from './components/UploadStudio';
import { TemplateGallery } from './components/TemplateGallery';
import { ReelCanvas } from './components/ReelCanvas';
import { ExportModal } from './components/ExportModal';
import { WalletModal } from './components/WalletModal';
import { MyAdsScreen } from './components/MyAdsScreen';
import { soundEngine } from './utils/audio';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';

export default function App() {
  // 1. Core State: Top bar Ruby & Diamond balances as specified in prompt
  const [rubies, setRubies] = useState<number>(() => {
    const saved = localStorage.getItem('dukaan_rubies');
    return saved ? parseInt(saved, 10) : 50; // default 50
  });

  const [diamonds, setDiamonds] = useState<number>(() => {
    const saved = localStorage.getItem('dukaan_diamonds');
    return saved ? parseInt(saved, 10) : 10; // default 10
  });

  // Save balances
  useEffect(() => {
    localStorage.setItem('dukaan_rubies', rubies.toString());
  }, [rubies]);

  useEffect(() => {
    localStorage.setItem('dukaan_diamonds', diamonds.toString());
  }, [diamonds]);

  // 2. Language State (Urdu, Punjabi, Saraiki, Pashto, English)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('Urdu');

  // 3. Navigation & Screen Flow
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('avatar');
  const [selectedTemplate, setSelectedTemplate] = useState<AdTemplate>(ALL_TEMPLATES[0]);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // 4. Generation & Media Engine
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAdResult, setActiveAdResult] = useState<GeneratedAdResult | null>(null);
  const [savedAds, setSavedAds] = useState<GeneratedAdResult[]>(() => {
    const saved = localStorage.getItem('dukaan_saved_ads');
    return saved ? JSON.parse(saved) : [];
  });

  // Audio & Animation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [visemeRatio, setVisemeRatio] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync saved ads to localStorage
  useEffect(() => {
    localStorage.setItem('dukaan_saved_ads', JSON.stringify(savedAds));
  }, [savedAds]);

  // Audio Playback Manager for Active Ad
  const playAdAudio = (ad: GeneratedAdResult) => {
    if (isMuted) return;

    soundEngine.init();
    setIsPlaying(true);

    // Start background beat
    soundEngine.startBackgroundMusic(ad.template.musicMood, 0.22);

    const onAudioEnd = () => {
      setIsPlaying(false);
      setVisemeRatio(0);
      soundEngine.stopBackgroundMusic();
    };

    const onVisemeUpdate = (ratio: number) => {
      setVisemeRatio(ratio);
    };

    if (ad.audioBase64) {
      soundEngine.playBase64Audio(ad.audioBase64, onAudioEnd, onVisemeUpdate);
    } else {
      soundEngine.speakText(ad.voiceoverScript, ad.language, onAudioEnd, onVisemeUpdate);
    }
  };

  const stopAdAudio = () => {
    setIsPlaying(false);
    setVisemeRatio(0);
    soundEngine.stopAll();
  };

  const togglePlay = () => {
    if (!activeAdResult) return;
    if (isPlaying) {
      stopAdAudio();
    } else {
      playAdAudio(activeAdResult);
    }
  };

  const restartAd = () => {
    if (!activeAdResult) return;
    stopAdAudio();
    setTimeout(() => {
      playAdAudio(activeAdResult);
    }, 150);
  };

  // Toggle global sound mute
  const handleToggleMute = () => {
    if (!isMuted) {
      stopAdAudio();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      if (activeAdResult) {
        playAdAudio(activeAdResult);
      }
    }
  };

  // Wallet Actions
  const handleAddRubies = (amount: number) => {
    setRubies((prev) => prev + amount);
  };

  const handleDeductRubies = (amount: number): boolean => {
    if (rubies >= amount) {
      setRubies((prev) => prev - amount);
      return true;
    }
    return false;
  };

  // Handle Mode Selection from Home Screen
  const handleSelectMode = (mode: GenerationMode) => {
    setGenerationMode(mode);
    setCurrentTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Template Selection
  const handleSelectTemplate = (template: AdTemplate) => {
    setSelectedTemplate(template);
    setCurrentTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // MAIN GENERATION DISPATCHER (Script + Voice + Viral Captions)
  const handleGenerateAd = async (details: ShopkeeperDetails, mode: GenerationMode) => {
    setIsGenerating(true);
    stopAdAudio();

    try {
      // 1. Request Script & Viral Captions from Server
      const scriptRes = await fetch('/api/ai/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName: details.shopName,
          productTitle: details.productTitle,
          price: details.price,
          offerTag: details.offerTag,
          city: details.city,
          language: selectedLanguage,
          mode,
        }),
      });

      const scriptData = await scriptRes.json();
      const script = scriptData.script || {};

      const voiceoverScript =
        script.voiceoverScript ||
        `السلام علیکم! ${details.shopName} پر ${details.productTitle} کا شاندار نیا اسٹاک پہنچ چکا ہے۔ ${details.offerTag} کے ساتھ قیمت صرف ${details.price}۔ کیش آن ڈیلیوری دستیاب ہے۔`;

      // 2. Request Gemini TTS Voiceover Audio
      let audioBase64: string | undefined = undefined;
      try {
        const voiceRes = await fetch('/api/ai/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: voiceoverScript,
            language: selectedLanguage,
            voiceStyle: 'friendly energetic Pakistani merchant',
          }),
        });
        const voiceData = await voiceRes.json();
        if (voiceData.success && voiceData.audioBase64) {
          audioBase64 = voiceData.audioBase64;
        }
      } catch (err) {
        console.warn('Voice API skipped, will use browser speech synthesis:', err);
      }

      // 3. Assemble Ad Result
      const newAdResult: GeneratedAdResult = {
        id: `ad_${Date.now()}`,
        headline: script.headline || `${details.shopName} - دھماکہ آفر!`,
        voiceoverScript,
        tagline: script.tagline || details.offerTag,
        bulletPoints: script.bulletPoints || ['100% اصل کوالٹی', 'ہول سیل ریٹ', 'کیش آن ڈیلیوری'],
        viralCaptions: script.viralCaptions || [
          {
            caption: `🔥 لو جی آ گیا دھماکہ! ${details.shopName} پر ${details.productTitle}۔ کیش آن ڈیلیوری پورے پاکستان میں دستیاب ہے! 📦`,
            hashtags: '#DukaanAI #PakistaniBrands #TrendingReels #LahoreShopping #KarachiFashion',
          },
          {
            caption: `✨ ماشاءاللہ! ${details.productTitle} صرف ${details.price} میں۔ محدود اسٹاک ہے، ابھی واٹس ایپ پر رابطہ کریں!`,
            hashtags: '#SalePakistan #WholesaleMarket #DesiShopkeeper #ViralPakistan',
          },
          {
            caption: `⚡ کیا آپ نے کبھی ایسی زبردست کوالٹی اتنے سستے دام میں دیکھی ہے؟ ابھی آرڈر کریں!`,
            hashtags: '#BazaarDeals #CashOnDelivery #ViralReel #ShopLocal',
          },
        ],
        audioBase64,
        mode,
        language: selectedLanguage,
        shopDetails: details,
        template: selectedTemplate,
        createdAt: Date.now(),
      };

      setActiveAdResult(newAdResult);
      setSavedAds((prev) => [newAdResult, ...prev]);

      // Automatically start reel preview with sound!
      setTimeout(() => {
        playAdAudio(newAdResult);
      }, 500);
    } catch (e) {
      console.error('Generation failure:', e);
      alert('نیٹ ورک کی سست روی کی وجہ سے براہ راست موڈ فعال کر دیا گیا ہے۔');
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-open an ad from history
  const handleSelectSavedAd = (ad: GeneratedAdResult) => {
    setActiveAdResult(ad);
    setSelectedLanguage(ad.language);
    setGenerationMode(ad.mode);
    setSelectedTemplate(ad.template);
    setCurrentTab('studio');
    setTimeout(() => {
      playAdAudio(ad);
    }, 400);
  };

  const handleDeleteSavedAd = (id: string) => {
    setSavedAds((prev) => prev.filter((a) => a.id !== id));
    if (activeAdResult?.id === id) {
      setActiveAdResult(null);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopAll();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Bar with Ruby: 50 | Diamond: 10 & Language chips */}
      <TopBar
        rubies={rubies}
        diamonds={diamonds}
        onOpenWallet={() => setWalletModalOpen(true)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => {
          setSelectedLanguage(lang);
          // If playing, update voiceover dynamically
          if (activeAdResult) {
            setActiveAdResult({ ...activeAdResult, language: lang });
          }
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-md mx-auto w-full">
        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <HomeScreen
            selectedLanguage={selectedLanguage}
            onSelectMode={handleSelectMode}
            onSelectTemplate={(tplId) => {
              const tpl = ALL_TEMPLATES.find((t) => t.id === tplId);
              if (tpl) handleSelectTemplate(tpl);
            }}
            onOpenTemplates={() => setCurrentTab('templates')}
            onOpenWallet={() => setWalletModalOpen(true)}
          />
        )}

        {/* TAB 2: TEMPLATES (100+ Pakistani templates) */}
        {currentTab === 'templates' && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {/* TAB 3: STUDIO (Generation & 9:16 Canvas / Export) */}
        {currentTab === 'studio' && (
          <div className="space-y-4">
            {!activeAdResult ? (
              <UploadStudio
                mode={generationMode}
                selectedLanguage={selectedLanguage}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                onGenerate={handleGenerateAd}
                isGenerating={isGenerating}
                onBack={() => setCurrentTab('home')}
              />
            ) : (
              /* Export & Live Preview Screen */
              <div className="pb-28 pt-2 px-3 space-y-4 animate-in fade-in duration-300">
                {/* Back to Edit Button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      stopAdAudio();
                      setActiveAdResult(null);
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 font-urdu"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>نئی ترمیم کریں</span>
                  </button>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-urdu">
                      {activeAdResult.headline}
                    </span>
                  </div>
                </div>

                {/* 9:16 Canva/Reel Canvas with Talking Avatar Mouth & Zoom */}
                <ReelCanvas
                  adResult={activeAdResult}
                  isPlaying={isPlaying}
                  onTogglePlay={togglePlay}
                  onRestart={restartAd}
                  visemeRatio={visemeRatio}
                  canvasRef={canvasRef}
                />

                {/* Export Controls, HD Download (5 Ruby), WhatsApp Share & 3 Viral Captions */}
                <ExportModal
                  adResult={activeAdResult}
                  rubies={rubies}
                  onDeductRubies={handleDeductRubies}
                  onOpenAdModal={() => setWalletModalOpen(true)}
                  canvasRef={canvasRef}
                  onClose={() => setActiveAdResult(null)}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY ADS */}
        {currentTab === 'my_ads' && (
          <MyAdsScreen
            ads={savedAds}
            onSelectAd={handleSelectSavedAd}
            onDeleteAd={handleDeleteSavedAd}
            onNewAd={() => {
              setActiveAdResult(null);
              setCurrentTab('studio');
            }}
          />
        )}

        {/* TAB 5: WALLET */}
        {currentTab === 'wallet' && (
          <div className="p-3">
            <WalletModal
              rubies={rubies}
              diamonds={diamonds}
              onAddRubies={handleAddRubies}
              onClose={() => setCurrentTab('home')}
            />
          </div>
        )}
      </main>

      {/* Wallet / Ad Watch Reward Modal (Overlay) */}
      {walletModalOpen && (
        <WalletModal
          rubies={rubies}
          diamonds={diamonds}
          onAddRubies={handleAddRubies}
          onClose={() => setWalletModalOpen(false)}
        />
      )}

      {/* Android Play Store Style Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
}
