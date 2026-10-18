import React, { useRef, useEffect, useState } from 'react';
import { GeneratedAdResult } from '../types';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Download } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ReelCanvasProps {
  adResult: GeneratedAdResult;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  visemeRatio: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const ReelCanvas: React.FC<ReelCanvasProps> = ({
  adResult,
  isPlaying,
  onTogglePlay,
  onRestart,
  visemeRatio,
  canvasRef,
}) => {
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '4:5'>('9:16');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const avatarImgRef = useRef<HTMLImageElement | null>(null);
  const productImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Preload images into memory
  useEffect(() => {
    if (adResult.shopDetails.avatarImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = adResult.shopDetails.avatarImage;
      img.onload = () => {
        avatarImgRef.current = img;
      };
    }

    if (adResult.shopDetails.productImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = adResult.shopDetails.productImage;
      img.onload = () => {
        productImgRef.current = img;
      };
    }
  }, [adResult]);

  // Main Canvas Render Loop (720 x 1280 standard 9:16)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.035;

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // 1. Draw High-Fidelity Pakistani Gradient & Store Background
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      if (adResult.template.categoryId === 'sale_50') {
        bgGrad.addColorStop(0, '#450a0a'); // deep crimson
        bgGrad.addColorStop(0.5, '#1e1b4b');
        bgGrad.addColorStop(1, '#022c22'); // emerald
      } else if (adResult.template.categoryId === 'azadi') {
        bgGrad.addColorStop(0, '#064e3b'); // Pakistan green
        bgGrad.addColorStop(0.5, '#022c22');
        bgGrad.addColorStop(1, '#0f172a');
      } else if (adResult.template.categoryId === 'ramzan' || adResult.template.categoryId === 'eid') {
        bgGrad.addColorStop(0, '#14532d'); // Islamic green
        bgGrad.addColorStop(0.5, '#78350f'); // Golden bronze
        bgGrad.addColorStop(1, '#064e3b');
      } else {
        bgGrad.addColorStop(0, '#064e3b');
        bgGrad.addColorStop(0.6, '#0f172a');
        bgGrad.addColorStop(1, '#022c22');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Ambient Bokeh / Sparkle Particles in background
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time * 0.5 + i * 2) * 0.5 + 0.5) * W;
        const y = (Math.cos(time * 0.4 + i * 3) * 0.5 + 0.5) * H;
        const radius = (Math.sin(time + i) * 0.5 + 0.5) * 8 + 4;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(16, 185, 129, 0.15)';
        ctx.fill();
      }

      // 2. RENDERING MODE A: Talking Avatar Mode (Face + Product)
      if (adResult.mode === 'avatar') {
        const avatarImg = avatarImgRef.current;
        const productImg = productImgRef.current;

        // Micro head bobbing while speaking
        const bob = isPlaying ? Math.sin(time * 3) * 6 : 0;
        const sway = isPlaying ? Math.cos(time * 1.5) * 4 : 0;

        // Draw Avatar Portrait Frame
        const avatarSize = 340;
        const avatarX = W * 0.5 + sway;
        const avatarY = H * 0.46 + bob;

        ctx.save();
        // Golden glowing circle border behind avatar
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize * 0.5 + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#eab308';
        ctx.stroke();

        // Clip circular portrait
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarSize * 0.5, 0, Math.PI * 2);
        ctx.clip();

        if (avatarImg && avatarImg.complete) {
          ctx.drawImage(
            avatarImg,
            avatarX - avatarSize * 0.5,
            avatarY - avatarSize * 0.5,
            avatarSize,
            avatarSize
          );
        } else {
          // Placeholder merchant illustration
          ctx.fillStyle = '#065f46';
          ctx.fillRect(avatarX - avatarSize * 0.5, avatarY - avatarSize * 0.5, avatarSize, avatarSize);
        }
        ctx.restore();

        // Dynamic Talking Avatar Mouth Animation (Lip Sync overlay)
        if (isPlaying && visemeRatio > 0.05) {
          const mouthY = avatarY + 54 + bob;
          const mouthX = avatarX;
          const openH = Math.max(3, visemeRatio * 20);
          const mouthW = 28 + visemeRatio * 10;

          ctx.save();
          // Inner mouth opening
          ctx.beginPath();
          ctx.ellipse(mouthX, mouthY, mouthW * 0.5, openH * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#450a0a';
          ctx.fill();

          // Teeth / white gleam
          if (visemeRatio > 0.3) {
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(mouthX - mouthW * 0.25, mouthY - openH * 0.3, mouthW * 0.5, openH * 0.25);
          }

          // Lips outline
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#991b1b';
          ctx.stroke();
          ctx.restore();
        }

        // Shopkeeper Holding the Product (Right Hand Presentation Container)
        const prodW = 220;
        const prodH = 220;
        const prodFloat = Math.sin(time * 2.5) * 8;
        const prodX = W * 0.65;
        const prodY = H * 0.52 + prodFloat;

        // Shadow under product
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(prodX + prodW * 0.5, prodY + prodH + 10, prodW * 0.45, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fill();
        ctx.restore();

        // Product Box with rounded card & golden ring
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffffff';
        roundedRect(ctx, prodX, prodY, prodW, prodH, 24);
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#10b981';
        ctx.stroke();
        ctx.restore();

        // Product Image inside card
        if (productImg && productImg.complete) {
          ctx.save();
          roundedRect(ctx, prodX + 6, prodY + 6, prodW - 12, prodH - 12, 18);
          ctx.clip();
          ctx.drawImage(productImg, prodX + 6, prodY + 6, prodW - 12, prodH - 12);
          ctx.restore();
        }

        // Realistic hand illustration holding the product corner
        ctx.save();
        ctx.fillStyle = '#fbb78b';
        ctx.strokeStyle = '#c27d53';
        ctx.lineWidth = 3;
        // Finger thumbs over the product edge
        ctx.beginPath();
        ctx.ellipse(prodX + 30, prodY + prodH - 10, 24, 14, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(prodX + 65, prodY + prodH - 8, 20, 12, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // "Original Stock" Mini Stamp on product
        ctx.save();
        ctx.fillStyle = '#eab308';
        roundedRect(ctx, prodX + 10, prodY + 12, 90, 26, 8);
        ctx.fill();
        ctx.fillStyle = '#1e1b4b';
        ctx.font = 'bold 13px "Noto Nastaliq Urdu", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('100% اصل مال', prodX + 55, prodY + 29);
        ctx.restore();
      }

      // 3. RENDERING MODE B: Product Reel Mode (9:16 Viral Zoom & Hand presentation)
      if (adResult.mode === 'product_reel') {
        const productImg = productImgRef.current;

        // Dynamic 9:16 Ken Burns Zoom Effect
        const zoom = 1 + (Math.sin(time * 1.2) * 0.5 + 0.5) * 0.12;
        const rot = Math.sin(time * 0.8) * 0.03;

        const pBoxSize = 440;
        const pCenterX = W * 0.5;
        const pCenterY = H * 0.44;

        ctx.save();
        ctx.translate(pCenterX, pCenterY);
        ctx.rotate(rot);
        ctx.scale(zoom, zoom);

        // Circular luxury showcase pedestal
        ctx.beginPath();
        ctx.ellipse(0, pBoxSize * 0.48, pBoxSize * 0.42, 28, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
        ctx.fill();

        // Product Main Card
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#ffffff';
        roundedRect(ctx, -pBoxSize * 0.5, -pBoxSize * 0.5, pBoxSize, pBoxSize, 36);
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#10b981';
        ctx.stroke();

        if (productImg && productImg.complete) {
          ctx.save();
          roundedRect(ctx, -pBoxSize * 0.5 + 8, -pBoxSize * 0.5 + 8, pBoxSize - 16, pBoxSize - 16, 28);
          ctx.clip();
          ctx.drawImage(productImg, -pBoxSize * 0.5 + 8, -pBoxSize * 0.5 + 8, pBoxSize - 16, pBoxSize - 16);
          ctx.restore();
        }
        ctx.restore();

        // Presentation Hands Holding Bottom Corners
        ctx.save();
        ctx.fillStyle = '#fbb78b';
        ctx.strokeStyle = '#c27d53';
        ctx.lineWidth = 3;
        // Left hand
        ctx.beginPath();
        ctx.ellipse(W * 0.22, H * 0.58, 32, 20, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Right hand
        ctx.beginPath();
        ctx.ellipse(W * 0.78, H * 0.58, 32, 20, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Floating Flash Discount Starburst
        const starX = W * 0.82;
        const starY = H * 0.28;
        const starPulse = 1 + Math.sin(time * 4) * 0.08;

        ctx.save();
        ctx.translate(starX, starY);
        ctx.scale(starPulse, starPulse);
        ctx.beginPath();
        ctx.arc(0, 0, 52, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fef08a';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 22px "Noto Sans Arabic", sans-serif';
        ctx.fillText('50%', 0, -2);
        ctx.font = 'bold 15px "Noto Nastaliq Urdu", sans-serif';
        ctx.fillText('رعایت', 0, 22);
        ctx.restore();
      }

      // 4. TOP SOCIAL OVERLAY: Shop Name & Verified Badge
      ctx.save();
      // Top Dark Scrim
      const topGrad = ctx.createLinearGradient(0, 0, 0, 160);
      topGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, 160);

      // Shop Profile Pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      roundedRect(ctx, 30, 35, W - 60, 68, 20);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();

      // Verified Pakistani Shop Avatar Icon
      ctx.beginPath();
      ctx.arc(70, 69, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Noto Nastaliq Urdu", serif';
      ctx.textAlign = 'center';
      ctx.fillText('د', 70, 77);

      // Shop Title & City
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Noto Nastaliq Urdu", "Noto Sans Arabic", sans-serif';
      ctx.fillText(`${adResult.shopDetails.shopName} ✔️`, W - 50, 62);

      ctx.fillStyle = '#fef08a';
      ctx.font = '15px "Noto Nastaliq Urdu", sans-serif';
      ctx.fillText(
        `${adResult.shopDetails.city} • ${adResult.template.badgeUrdu}`,
        W - 50,
        88
      );
      ctx.restore();

      // 5. LOWER THIRD GRAPHICS & VIRAL OFFER TAGS
      const bottomY = H * 0.72;

      // Bottom Dark Scrim for Urdu Readability
      ctx.save();
      const botGrad = ctx.createLinearGradient(0, bottomY - 60, 0, H);
      botGrad.addColorStop(0, 'rgba(0,0,0,0)');
      botGrad.addColorStop(0.3, 'rgba(2, 44, 34, 0.88)');
      botGrad.addColorStop(1, 'rgba(15, 23, 42, 0.98)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, bottomY - 60, W, H - bottomY + 60);

      // Floating Offer Tag Ribbon
      ctx.save();
      ctx.fillStyle = '#eab308';
      roundedRect(ctx, 30, bottomY - 20, 220, 40, 12);
      ctx.fill();
      ctx.fillStyle = '#14532d';
      ctx.font = 'bold 18px "Noto Nastaliq Urdu", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`⚡ ${adResult.shopDetails.offerTag}`, 140, bottomY + 7);
      ctx.restore();

      // Product Title Heading
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.font = 'bold 28px "Noto Nastaliq Urdu", sans-serif';
      ctx.fillText(adResult.shopDetails.productTitle, W - 35, bottomY + 36);

      // Price Tag Pill
      ctx.fillStyle = '#22c55e';
      roundedRect(ctx, W - 280, bottomY + 54, 245, 46, 14);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Noto Sans Arabic", "Noto Nastaliq Urdu", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`قیمت: ${adResult.shopDetails.price}`, W - 158, bottomY + 85);
      ctx.restore();

      // Dynamic Subtitle Ticker (Urdu script from voiceover)
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      roundedRect(ctx, 30, H - 150, W - 60, 48, 12);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = '16px "Noto Nastaliq Urdu", sans-serif';
      ctx.textAlign = 'center';
      // Spoken snippet
      const shortSnippet = adResult.voiceoverScript.slice(0, 52) + '...';
      ctx.fillText(`🎙️ "${shortSnippet}"`, W * 0.5, H - 118);
      ctx.restore();

      // WhatsApp Order Button
      ctx.save();
      const waY = H - 85;
      const waGrad = ctx.createLinearGradient(30, waY, W - 30, waY);
      waGrad.addColorStop(0, '#25D366');
      waGrad.addColorStop(1, '#128C7E');
      ctx.fillStyle = waGrad;
      roundedRect(ctx, 30, waY, W - 60, 54, 16);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 20px "Noto Nastaliq Urdu", sans-serif';
      ctx.fillText(
        `💬 واٹس ایپ پر ابھی آرڈر کریں: ${adResult.shopDetails.phoneWhatsApp || '0300-1234567'}`,
        W * 0.5,
        waY + 34
      );
      ctx.restore();

      // Audio Waveform Equalizer when playing
      if (isPlaying) {
        ctx.save();
        const eqX = 40;
        const eqY = 120;
        for (let b = 0; b < 6; b++) {
          const h = (Math.sin(time * 5 + b) * 0.5 + 0.5) * 22 + 6;
          ctx.fillStyle = '#10b981';
          ctx.fillRect(eqX + b * 7, eqY - h, 4, h);
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [adResult, isPlaying, visemeRatio]);

  // Helper for rounded rectangles on canvas
  function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Aspect Ratio Switcher */}
      <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setAspectRatio('9:16')}
          className={`px-3 py-1 rounded-lg font-bold transition-all ${
            aspectRatio === '9:16'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📱 9:16 ریل (Reel / TikTok)
        </button>
        <button
          onClick={() => setAspectRatio('1:1')}
          className={`px-3 py-1 rounded-lg font-bold transition-all ${
            aspectRatio === '1:1'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🔲 1:1 انسٹا پوسٹ
        </button>
        <button
          onClick={() => setAspectRatio('4:5')}
          className={`px-3 py-1 rounded-lg font-bold transition-all ${
            aspectRatio === '4:5'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📐 4:5 فیڈ
        </button>
      </div>

      {/* Reel Canvas Display Container */}
      <div
        className={`relative overflow-hidden rounded-3xl border-4 border-slate-800 shadow-2xl bg-black transition-all ${
          aspectRatio === '9:16'
            ? 'w-[280px] h-[498px] sm:w-[320px] sm:h-[568px]'
            : aspectRatio === '1:1'
            ? 'w-[320px] h-[320px]'
            : 'w-[300px] h-[375px]'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={720}
          height={1280}
          className="w-full h-full object-contain"
        />

        {/* Play / Pause Floating Overlay Pill */}
        <button
          onClick={onTogglePlay}
          className="absolute bottom-4 left-4 z-20 w-11 h-11 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-lg hover:scale-110 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
        </button>

        {/* Replay Button */}
        <button
          onClick={onRestart}
          className="absolute bottom-4 left-16 z-20 w-11 h-11 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-lg hover:scale-110 active:scale-95 transition-all"
          title="Restart"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Mode & Live Indicator */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-white">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-urdu font-bold">
            {adResult.mode === 'avatar' ? 'بولنے والا اوتار' : '9:16 ریل'}
          </span>
        </div>
      </div>
    </div>
  );
};
