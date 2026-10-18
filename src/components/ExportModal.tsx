import React, { useState } from 'react';
import { GeneratedAdResult } from '../types';
import {
  Download,
  Share2,
  Copy,
  Check,
  Gem,
  Tv,
  MessageCircle,
  Instagram,
  Facebook,
  Sparkles,
  ShieldCheck,
  FileVideo,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

interface ExportModalProps {
  adResult: GeneratedAdResult;
  rubies: number;
  onDeductRubies: (amount: number) => boolean;
  onOpenAdModal: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  adResult,
  rubies,
  onDeductRubies,
  onOpenAdModal,
  canvasRef,
  onClose,
}) => {
  const [copiedCaptionIndex, setCopiedCaptionIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'poster' | 'video'>('poster');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const DOWNLOAD_COST = 5;

  const handleCopyCaption = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCaptionIndex(index);
    setTimeout(() => setCopiedCaptionIndex(null), 2500);
  };

  const handleDownload = async () => {
    setErrorMessage(null);

    // Check ruby monetization
    if (rubies < DOWNLOAD_COST) {
      setErrorMessage(`ڈاؤن لوڈ کے لیے ${DOWNLOAD_COST} روبی درکار ہیں۔ ابھی ایک چھوٹا سا ایڈ دیکھیں اور +10 روبی مفت پائیں!`);
      return;
    }

    const deducted = onDeductRubies(DOWNLOAD_COST);
    if (!deducted) {
      setErrorMessage(`روبی ناکافی ہیں۔ ایڈ دیکھ کر مزید روبی حاصل کریں۔`);
      return;
    }

    setIsExporting(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas not found');
      }

      if (exportType === 'poster') {
        // High Resolution PNG Poster Export
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `Mashhoori_${adResult.shopDetails.shopName.replace(/\s+/g, '_')}_HD.png`;
        link.href = dataUrl;
        link.click();
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } else {
        // Real Video Export via Canvas Stream & MediaRecorder
        const stream = canvas.captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : 'video/webm',
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `Mashhoori_${adResult.shopDetails.shopName.replace(/\s+/g, '_')}_Reel.webm`;
          link.href = url;
          link.click();
          setIsExporting(false);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 4000);
        };

        mediaRecorder.start();
        // Record 5 seconds of the active canvas animation
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }, 5000);
        return; // handle async inside onstop
      }
    } catch (e: any) {
      console.error('Export failed:', e);
      setErrorMessage('ڈاؤن لوڈ کے دوران خرابی پیش آئی۔ براہ کرم دوبارہ کوشش کریں۔');
    } finally {
      if (exportType === 'poster') {
        setIsExporting(false);
      }
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🔥 *${adResult.shopDetails.shopName}*\n\n` +
      `✨ *${adResult.shopDetails.productTitle}*\n` +
      `💰 *قیمت:* ${adResult.shopDetails.price}\n` +
      `⚡ *آفر:* ${adResult.shopDetails.offerTag}\n\n` +
      `📢 "${adResult.voiceoverScript}"\n\n` +
      `آرڈر اور تفصیلات کے لیے رابطہ کریں: ${adResult.shopDetails.phoneWhatsApp || ''}\n\n` +
      `#DukaanAI #PakistaniShopping`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 pt-2 pb-6 px-1">
      {/* Monetization & Download Bar */}
      <div className="bg-slate-900 rounded-3xl p-4 border border-emerald-900/60 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white font-urdu">
              100% پلے اسٹور ریڈی • بغیر کسی واٹر مارک کے
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/30">
            <Gem className="w-3 h-3 fill-rose-400" />
            <span>خرچ: {DOWNLOAD_COST} روبی</span>
          </div>
        </div>

        {/* Format Selector: Poster or Video */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setExportType('poster')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all font-urdu ${
              exportType === 'poster'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>ایچ ڈی پوسٹر (PNG)</span>
          </button>
          <button
            onClick={() => setExportType('video')}
            className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all font-urdu ${
              exportType === 'video'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileVideo className="w-4 h-4" />
            <span>9:16 وائرل ریل (Video)</span>
          </button>
        </div>

        {/* Error message / insufficient rubies alert */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-xs text-rose-200 font-urdu text-right flex items-center justify-between gap-2">
            <span>{errorMessage}</span>
            <button
              onClick={onOpenAdModal}
              className="shrink-0 bg-amber-400 text-amber-950 px-2.5 py-1 rounded-xl font-bold text-[11px] flex items-center gap-1"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>ایڈ دیکھیں (+10)</span>
            </button>
          </div>
        )}

        {/* Success message */}
        {downloadSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-xs text-emerald-200 font-urdu text-right flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>فائل کامیابی سے ڈاؤن لوڈ ہو چکی ہے!</span>
          </div>
        )}

        {/* MAIN BUTTON 1: [ Download HD ] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold font-urdu text-sm shadow-xl shadow-emerald-900/50 flex items-center justify-center gap-2 border border-emerald-400/40 active:scale-95 transition-all disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {exportType === 'video' ? 'ریل ریکارڈ ہو رہی ہے (5s)...' : 'ڈاؤن لوڈ ہو رہا ہے...'}
                </span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>ڈاؤن لوڈ ایچ ڈی ({exportType === 'poster' ? 'پوسٹر' : 'ویڈیو'})</span>
              </>
            )}
          </button>

          {/* Earn Ruby by watching Ad button */}
          <button
            onClick={onOpenAdModal}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-bold font-urdu text-sm shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 border border-amber-300 active:scale-95 transition-all"
          >
            <Tv className="w-4 h-4" />
            <span>ایڈ دیکھ کر مفت روبی پائیں (+10)</span>
          </button>
        </div>

        {/* MAIN BUTTON 2: [ Share Now to WhatsApp / Facebook / Instagram ] */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 font-urdu">
              سوشل میڈیا پر فوری شیئر کریں
            </span>
            <span className="text-[10px] text-emerald-400 font-urdu">براہِ راست آرڈرز حاصل کریں</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 font-urdu transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>واٹس ایپ</span>
            </button>

            {/* Instagram */}
            <button
              onClick={() => {
                handleCopyCaption(adResult.viralCaptions[0]?.caption || '', 0);
                alert('کیپشن کاپی ہو گیا ہے! اب انسٹاگرام پر ریل اپلوڈ کریں۔');
              }}
              className="py-2.5 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 font-bold text-xs flex items-center justify-center gap-1.5 font-urdu transition-all active:scale-95"
            >
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <span>انسٹاگرام</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => {
                handleCopyCaption(adResult.viralCaptions[0]?.caption || '', 0);
                alert('کیپشن کاپی ہو گیا ہے! اب فیس بک پر شیئر کریں۔');
              }}
              className="py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 font-urdu transition-all active:scale-95"
            >
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span>فیس بک</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIRAL FEATURE: 3 Auto-Generated Viral Captions with Hashtags */}
      <div className="bg-slate-900 rounded-3xl p-4 border border-emerald-900/60 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h4 className="text-xs font-bold text-white font-urdu">
              3 وائرل کیپشنز اور ہیش ٹیگز ({adResult.language})
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-urdu">1-کلک کاپی کریں</span>
        </div>

        <div className="space-y-2.5">
          {adResult.viralCaptions.map((item, index) => {
            const isCopied = copiedCaptionIndex === index;
            const fullText = `${item.caption}\n\n${item.hashtags}`;

            return (
              <div
                key={index}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all text-right space-y-2"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleCopyCaption(fullText, index)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold font-urdu transition-all ${
                      isCopied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>کاپی ہو گیا!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کاپی کریں</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] font-bold text-amber-400 font-urdu">
                    آپشن #{index + 1}
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-urdu leading-relaxed whitespace-pre-wrap">
                  {item.caption}
                </p>

                <p className="text-[11px] text-emerald-400 font-sans tracking-wide dir-ltr text-left">
                  {item.hashtags}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
