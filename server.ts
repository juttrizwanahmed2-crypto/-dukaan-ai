import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API: Health & Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    app: 'Dukaan AI - Mashhoori Studio',
  });
});

// API: Generate Shopkeeper Script & Viral Captions
app.post('/api/ai/script', async (req, res) => {
  try {
    const {
      shopName = 'دکان',
      productTitle = 'کپڑے / ورائٹی',
      price = 'مناسب ریٹ',
      offerTag = '50% رعایت',
      city = 'لاہور',
      language = 'Urdu',
      mode = 'avatar', // 'avatar' | 'product_reel'
    } = req.body;

    if (!ai) {
      // Fallback generator if API key not injected
      return res.json({
        fallback: true,
        script: getFallbackScript(language, shopName, productTitle, price, offerTag, city, mode),
      });
    }

    const languageInstructions: Record<string, string> = {
      Urdu: 'Urdu (اردو). Use authentic Pakistani bazaar terms: السلام علیکم، باجی، بھائی جان، نیا اسٹاک، کیش آن ڈلیوری، دھماکہ سیل.',
      Punjabi: 'Punjabi in Shahmukhi script (پنجابی - شاہ مکھی). Use authentic Punjabi shopkeeper phrases like: سس سری اکال / السلام علیکم، باؤ جی، نویں ورائٹی آ گئی اے، کمال کوالٹی، ریٹ وی بڑا چنگا اے.',
      Saraiki: 'Saraiki script (سرائیکی). Use warm Seraiki phrases: اسلام وعلیکم سئیں، ساڈی دوکان تے نواں مال آگئے، ٻہوں مناسب ریٹ ہے، ہک واری ضرور تشریف گھن آؤ.',
      Pashto: 'Pashto script (پښتو). Authentic Pashtun bazaar phrases: سلامونه ورونو، زمونږ په دوکان کښې نوی مال راغلی، بهترین کوالټی او ارزانه نرخونه.',
      English: 'English with Pakistani shopkeeper flair (Pakistani English). High-energy, warm, and inviting with terms like "Dhamaka Offer", "Cash on Delivery Available", "Super Fine Fabric".',
    };

    const targetLang = languageInstructions[language] || languageInstructions['Urdu'];

    const prompt = `You are an expert Pakistani marketing director creating a viral social media video reel ad (Mashhoori) for a shopkeeper.
Shop Name: "${shopName}"
Product: "${productTitle}"
Price / Discount: "${price}"
Special Offer Tag: "${offerTag}"
City / Market: "${city}"
Target Language: ${targetLang}
Format Mode: ${mode === 'avatar' ? 'Talking Shopkeeper Avatar presenting product' : 'Viral 9:16 Product Showcase Reel with hand presentation and zoom'}

Return a JSON object matching this schema:
{
  "headline": "Catchy 3-5 word title in target language",
  "voiceoverScript": "Full spoken 15-20 second promotional script in the selected language script. Natural, energetic, extremely convincing Pakistani shopkeeper tone.",
  "tagline": "Short banner tag for video overlay",
  "bulletPoints": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "viralCaptions": [
    {
      "caption": "Urgent discount announcement with emojis and call to action",
      "hashtags": "#DukaanAI #PakistaniBrands #Trending"
    },
    {
      "caption": "Social proof and quality guarantee with WhatsApp order CTA",
      "hashtags": "#WholesaleRate #PakistanShopping"
    },
    {
      "caption": "Viral hook question caption to maximize shares on TikTok & Instagram",
      "hashtags": "#ViralReels #ShopLocalPakistan"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            voiceoverScript: { type: Type.STRING },
            tagline: { type: Type.STRING },
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            viralCaptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  hashtags: { type: Type.STRING },
                },
                required: ['caption', 'hashtags'],
              },
            },
          },
          required: ['headline', 'voiceoverScript', 'tagline', 'bulletPoints', 'viralCaptions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, script: parsed });
  } catch (err: any) {
    console.error('Error generating script:', err);
    // Graceful fallback to guarantee zero breaking states for the shopkeeper
    const { shopName, productTitle, price, offerTag, city, language, mode } = req.body;
    return res.json({
      fallback: true,
      script: getFallbackScript(language, shopName, productTitle, price, offerTag, city, mode),
    });
  }
});

// API: Generate High-Quality Voiceover using Gemini TTS
app.post('/api/ai/voice', async (req, res) => {
  try {
    const { text, language = 'Urdu', voiceStyle = 'energetic' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!ai) {
      return res.json({
        fallback: true,
        message: 'No Gemini API key attached, use browser speech synthesis',
      });
    }

    // Call Gemini 3.8 Flash Lite TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 400),
              speechMetadata: {
                style: `A warm, welcoming, confident Pakistani shopkeeper speaking with authentic local flair. Tone: ${voiceStyle}.`,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Options: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    } else {
      return res.json({
        fallback: true,
        message: 'Audio part was not returned, switching to Web Speech audio synthesis',
      });
    }
  } catch (err: any) {
    console.error('Voice generation error:', err);
    return res.json({
      fallback: true,
      error: err.message,
      message: 'Using browser speech synthesis',
    });
  }
});

// Helper for rich localized shopkeeper scripts
function getFallbackScript(
  lang: string,
  shop: string = 'ہماری دکان',
  product: string = 'نیا مال',
  price: string = 'مناسب ترین ریٹ',
  tag: string = '50% رعایت',
  city: string = 'لاہور',
  mode: string = 'avatar'
) {
  const scripts: Record<string, any> = {
    Urdu: {
      headline: `${shop} - شاندار دھماکہ آفر!`,
      voiceoverScript: `السلام علیکم باجی اور بھائی جان! ${shop} پر ${product} کا بہترین نیا اسٹاک پہنچ چکا ہے۔ ${tag} کے ساتھ قیمت صرف ${price}! کیش آن ڈیلیوری پورے پاکستان میں دستیاب ہے۔ ابھی آرڈر کرنے کے لیے واٹس ایپ پر رابطہ کریں۔`,
      tagline: `${tag} • کیش آن ڈیلیوری`,
      bulletPoints: ['اصل کوالٹی گارنٹی کے ساتھ', 'ہول سیل اور ریٹیل ریٹس', 'پورے پاکستان میں ہوم ڈیلیوری'],
      viralCaptions: [
        {
          caption: `🔥 لو جی آ گیا دھماکہ! ${shop} پر ${product} کی شاندار ورائٹی۔ ابھی بک کریں اس سے پہلے کہ اسٹاک ختم ہو جائے! 📦`,
          hashtags: '#DukaanAI #PakistaniFashion #SalePakistan #LahoreShopping #KarachiStyle #CashOnDelivery',
        },
        {
          caption: `✨ ماشاءاللہ! بہترین کوالٹی اور مناسب ترین دام صرف ${shop} پر۔ واٹس ایپ پر آرڈر بھیجیں اور گھر بیٹھے پائیں!`,
          hashtags: '#UrduReels #BazaarPakistan #WholesaleRate #ViralReel #TrendingUrdu',
        },
        {
          caption: `⚡ کیا آپ کو بھی سستے اور معیاری ${product} کی تلاش ہے؟ تو ابھی ${shop} آئیں یا آن لائن منگوائیں!`,
          hashtags: '#PakistaniShopkeeper #ViralPakistan #DhamakaOffer #OnlineDukaan',
        },
      ],
    },
    Punjabi: {
      headline: `${shop} - وڈی بچت تے نویں ورائٹی!`,
      voiceoverScript: `السلام علیکم باؤ جی! ${shop} والے لے آئے نیں تواڈے لئی ${product} دا کمال نواں اسٹاک۔ ریٹ ایناں مناسب کہ دنگ رہ جاؤ گے، صرف ${price}! ${tag} نال مال کجھ ای دناں لئی ہے۔ فورا آرڈر کرو!`,
      tagline: `نویں ورائٹی • سستا تے چنگا`,
      bulletPoints: ['سولہ آنے کھرا مال', 'باؤ جی ریٹ وی بڑا چنگا اے', 'گھر بیٹھے پارسل منگواؤ'],
      viralCaptions: [
        {
          caption: `👑 باؤ جی ویکھو تے سہی! ${shop} تے ${product} دا زبردست اسٹاک آ گیا اے۔ پنڈ ہووے یا شہر، ہوم ڈیلیوری فری!`,
          hashtags: '#PunjabiReels #FaisalabadWholesale #LahoreMarket #PunjabShopping #DukaanAI',
        },
        {
          caption: `💰 وڈی بچت آفر! اینے کٹ ریٹ تے اینی سوہنی چیز تواں نوں کدرے ہور نئیں ملنی۔ شتابی نال واٹس ایپ تے میسج کرو!`,
          hashtags: '#Shahmukhi #DesiShopkeeper #ViralPunjab #KapraMarket',
        },
        {
          caption: `🚀 اے ویڈیو اپنے دوستاں نال شیئر کرو تے آفر دا فیدہ چکو۔ مال محدود اے باؤ جی!`,
          hashtags: '#PunjabiTrend #BazaariOffer #PakistaniBusiness',
        },
      ],
    },
    Saraiki: {
      headline: `${shop} - سرائیکی وسوں دی سوغات!`,
      voiceoverScript: `اسلام وعلیکم سئیں! ${shop} تے تساں سانگے ${product} دا ڈھیر سارا نواں مال آگئے۔ کوالٹی ہک نمبر تے ریٹ صرف ${price}! ${tag} نال اجائیں آرڈر کرو، مہربانی تھیسی۔`,
      tagline: `سوہنا مال • مناسب ریٹ`,
      bulletPoints: ['خالص کوالٹی دی گارنٹی', 'سئیں ریٹ بالکل جائز ہے', 'پورے دیس وچ ڈیلیوری'],
      viralCaptions: [
        {
          caption: `🌸 سئیں تہاڈی خدمت وچ حاضر! ${shop} تے ${product} دی لاجواب ورائٹی آگئی ہے۔ اجائیں آرڈر بھیجو!`,
          hashtags: '#SaraikiReels #MultanShopping #BahawalpurFashion #DukaanAI #SaraikiWaseb',
        },
        {
          caption: `❤️ ساڈے کولوں ہک واری شے گھنسو تاں بار بار آسو! سستا ریٹ تے کھرا سودا۔ واٹس ایپ تے رابطہ کرو۔`,
          hashtags: '#SaraikiCulture #SeraikiShop #SouthPunjab #WholesalePakistan',
        },
        {
          caption: `🔥 وسوں دی وڈی آفر! محدود اسٹاک ہے۔ ہک واری ضرور تشریف گھن آؤ۔`,
          hashtags: '#SaraikiVideo #ViralSaraiki #DesiDukaan',
        },
      ],
    },
    Pashto: {
      headline: `${shop} - نوی مال او ارزانه نرخونه!`,
      voiceoverScript: `سلامونه او احترامات درنو ورونو او خویندو! ${shop} تاسو لپاره د ${product} نوی او خائسته مال راوړی دی. نرخ صرف ${price} او ${tag} ورسره دی. ټول پاکستان کښې کیش آن ډلیوری شته!`,
      tagline: `اصلي کوالټي • ارزانه نرخ`,
      bulletPoints: ['د ۱۰۰٪ اصلي مال ضمانت', 'ډیر مناسب نرخونه', 'په ټول پاکستان کښې کور ته رسول'],
      viralCaptions: [
        {
          caption: `⭐ درنو ملګرو! زمونږ په دوکان ${shop} کښې د ${product} نوی کلیکشن راورسید. د واټس اپ د لارې زر تر زره آرډر وکړئ!`,
          hashtags: '#PashtoReels #PeshawarKarkhano #PashtunBusiness #DukaanAI #KPKCommerce',
        },
        {
          caption: `🎯 بهترینه کوالټی په ډیر کم قیمت کښې. د پاکستان په هر کونج کښې کیش آن ډلیوری ترلاسه کړئ!`,
          hashtags: '#PeshawarShopping #KhyberBazaar #ViralPashto #AfghanFashion',
        },
        {
          caption: `🔥 د محدود وخت لپاره ځانګړی رعایت! ملګرو سره یې هم شریک کړئ.`,
          hashtags: '#PashtunTradition #PakistaniPashto #BazaarDeals',
        },
      ],
    },
    English: {
      headline: `${shop} - Mega Discount Dhamaka!`,
      voiceoverScript: `Assalam-o-Alaikum! Welcome to ${shop}. Check out our brand new stock of ${product}! Premium quality at wholesale prices, starting at just ${price} with ${tag}. Cash on Delivery available all over Pakistan. Order now on WhatsApp!`,
      tagline: `${tag} • All Pakistan Delivery`,
      bulletPoints: ['100% Genuine Quality Promised', 'Direct Factory Wholesale Rates', 'Fast Cash on Delivery Service'],
      viralCaptions: [
        {
          caption: `🛍️ Big news for shoppers in ${city} and all across Pakistan! ${shop} has just dropped an insane collection of ${product}. Grab yours before it runs out! 🚀`,
          hashtags: '#PakistanShopping #LahoreFashion #KarachiDeals #CashOnDelivery #DukaanAI #ViralReels',
        },
        {
          caption: `✨ Wholesale rates directly to your doorstep! Premium ${product} with ${tag}. DM or WhatsApp us directly to order!`,
          hashtags: '#PakistaniBrands #BazaarDeals #WholesalePakistan #TrendingReel',
        },
        {
          caption: `🔥 Don't miss out on Pakistan's favorite shop! Tag a friend who needs this ${product} right now.`,
          hashtags: '#ShopLocalPK #DhamakaSale #PakistaniShopkeeper #ViralTrend',
        },
      ],
    },
  };

  return scripts[lang] || scripts['Urdu'];
}

// Development or Production Server
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Dukaan AI Mashhoori Studio running on http://localhost:${PORT}`);
  });
}

startServer();
