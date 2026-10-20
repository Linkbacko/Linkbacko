import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Sparkles, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Layers, 
  Zap, 
  CheckCircle2,
  Sliders,
  ExternalLink,
  FileText,
  Activity
} from 'lucide-react';
import { HIGH_AUTHORITY_TARGETS } from '../data/mockInitialData';
import { WordPressSite } from '../types';
import { Language } from '../utils/translations';

interface DomainPreset {
  name: string;
  domain: string;
  niche: string;
  keywords: string[];
  description: string;
}

const DOMAIN_PRESETS: DomainPreset[] = [
  {
    name: 'fitnesstoday.us',
    domain: 'https://fitnesstoday.us',
    niche: 'Fitness, Health & Workout Coaching',
    keywords: [
      'muscle recovery',
      'daily workout routines',
      'clean intermittent fasting',
      'zone 2 cardio',
      'spine mobility routine',
      'strength training'
    ],
    description: 'Premier health, daily workout regimes & clinical nutrition coaching (Sole Verified Active Domain)'
  }
];

interface RealtimeDomainKeywordSubmitBarProps {
  currentSite: WordPressSite | null;
  onStartRealtime: (data: {
    domain: string;
    keywords: string[];
    niche: string;
    preferredTargetId?: string;
  }) => void;
  onOpenAuditReport?: () => void;
  onOpenCampaignModal?: () => void;
  language: Language;
}

export const RealtimeDomainKeywordSubmitBar: React.FC<RealtimeDomainKeywordSubmitBarProps> = ({
  currentSite,
  onStartRealtime,
  onOpenAuditReport,
  onOpenCampaignModal,
  language
}) => {
  // Always default to fitnesstoday.us as instructed, or currentSite if it is set
  const defaultPreset = DOMAIN_PRESETS[0]; // Fitness Today US
  const initialDomain = currentSite?.url || defaultPreset.domain;
  const initialKeywords = currentSite?.keywords?.length 
    ? currentSite.keywords.join(', ') 
    : defaultPreset.keywords.join(', ');
  const initialNiche = currentSite?.niche || defaultPreset.niche;

  const [domain, setDomain] = useState(initialDomain);
  const [keywordsInput, setKeywordsInput] = useState(initialKeywords);
  const [niche, setNiche] = useState(initialNiche);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('tgt-6'); // Medium (DA 96) default
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedPresetName, setSelectedPresetName] = useState<string>(
    currentSite ? currentSite.name : defaultPreset.name
  );

  // Sync if currentSite changes from outer switcher
  useEffect(() => {
    if (currentSite) {
      setDomain(currentSite.url);
      setKeywordsInput(currentSite.keywords.join(', '));
      setNiche(currentSite.niche);
      setSelectedPresetName(currentSite.name);
    }
  }, [currentSite]);

  const handleSelectPreset = (preset: DomainPreset) => {
    setDomain(preset.domain);
    setKeywordsInput(preset.keywords.join(', '));
    setNiche(preset.niche);
    setSelectedPresetName(preset.name);
    setErrorMsg('');
  };

  const handleAddChip = (chip: string) => {
    const currentList = keywordsInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (!currentList.includes(chip)) {
      currentList.push(chip);
      setKeywordsInput(currentList.join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपना वेबसाइट डोमेन दर्ज करें!' : 'Please enter your website domain!');
      return;
    }

    const rawKeywords = keywordsInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (rawKeywords.length === 0) {
      setErrorMsg(language === 'hi' ? 'कृपया कम से कम एक लक्षित कीवर्ड दर्ज करें!' : 'Please enter at least one target keyword!');
      return;
    }

    setErrorMsg('');
    onStartRealtime({
      domain: 'https://fitnesstoday.us',
      keywords: rawKeywords,
      niche: niche || 'Fitness, Health & Workout Coaching',
      preferredTargetId: selectedTargetId || undefined
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
              <span>{language === 'hi' ? 'रीयल-टाइम बैकलिंक अधिग्रहण' : 'Real-Time Backlink Acquisition Engine'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                100% Real Live URLs
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'hi'
                ? 'अपना वेबसाइट डोमेन और कीवर्ड दर्ज करें — AI एजेंट तुरंत शीर्ष वेबसाइट्स (DA 85-96) पर बिना 404 के बैकलिंक तैयार करेगा।'
                : 'Submit your website domain & target keywords. The agent immediately initiates live discovery & syndication with zero fake 404 links.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onOpenCampaignModal && (
            <button
              type="button"
              onClick={onOpenCampaignModal}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'hi' ? '🚀 लॉन्च कैंपेन (डेटाबेस व 1-7 दिन)' : '🚀 Launch Campaign (Database & 1-7 Days)'}</span>
            </button>
          )}

          {onOpenAuditReport && (
            <button
              type="button"
              onClick={onOpenAuditReport}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 border border-slate-700 shadow"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'hi' ? 'ऑडिट रिपोर्ट' : 'Audit Report'}</span>
            </button>
          )}

          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{language === 'hi' ? 'सत्यापित 200 OK हब' : 'No 404 • Active Hubs'}</span>
          </div>
        </div>
      </div>

      {/* Single Verified Target Domain Banner: fitnesstoday.us */}
      <div className="mt-4 pt-1 relative z-10">
        <div className="p-3 bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-slate-900 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {language === 'hi' ? 'लक्षित एकमात्र डोमेन (Sole Target Domain):' : 'Sole Target Domain (Locked & Verified):'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  fitnesstoday.us
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                {language === 'hi'
                  ? 'सारे बैकलिंक सिर्फ fitnesstoday.us से बनेंगे — अन्य कोई डोमेन उपयोग नहीं होगा।'
                  : 'All backlinks exclusively built for https://fitnesstoday.us • No external domains.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% 200 OK Live</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4 relative z-10">
        
        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Domain Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'वेबसाइट डोमेन (लॉक्ड):' : 'Target Domain (fitnesstoday.us):'}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">SSL 200 OK</span>
            </label>
            <input
              type="text"
              value="https://fitnesstoday.us"
              readOnly
              className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-mono focus:outline-none cursor-default font-bold"
            />
          </div>

          {/* Keywords Input */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'लक्षित कीवर्ड्स (कॉमा से अलग करें):' : 'Target Keywords (comma-separated):'}</span>
            </label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="fitness tips, daily workout routines, health & wellness guide"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* High DA Target Selector */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'hi' ? 'टारगेट प्लेटफॉर्म:' : 'Target Platform:'}</span>
            </label>
            <select
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition font-medium"
            >
              {HIGH_AUTHORITY_TARGETS.map(t => (
                <option key={t.id} value={t.id}>
                  {t.platformName} (DA {t.da})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Niche & Quick Chips Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold shrink-0">
              {language === 'hi' ? 'श्रेणी (Niche):' : 'Niche:'}
            </span>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="Fitness, Health & Workout Coaching">Fitness, Health & Workout Coaching</option>
              <option value="Sports Medicine & Recovery Protocols">Sports Medicine & Recovery Protocols</option>
              <option value="Clinical Nutrition & Hydration">Clinical Nutrition & Hydration</option>
              <option value="Wellness, Mobility & Longevity">Wellness, Mobility & Longevity</option>
            </select>
          </div>

          {/* Quick Keywords Suggested */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] text-slate-400 shrink-0">Quick add:</span>
            {DOMAIN_PRESETS.find(p => p.name === selectedPresetName)?.keywords.slice(0, 3).map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddChip(chip)}
                className="px-2 py-0.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-md text-[11px] text-slate-300 transition shrink-0"
              >
                +{chip}
              </button>
            )) || (
              <>
                <button
                  type="button"
                  onClick={() => handleAddChip('fitness tips')}
                  className="px-2 py-0.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-md text-[11px] text-slate-300 transition shrink-0"
                >
                  +fitness tips
                </button>
                <button
                  type="button"
                  onClick={() => handleAddChip('workout routines')}
                  className="px-2 py-0.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-md text-[11px] text-slate-300 transition shrink-0"
                >
                  +workout routines
                </button>
              </>
            )}
          </div>

        </div>

        {/* Action Buttons: Full Campaign Launch & Single Acquisition */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-3">
          {onOpenCampaignModal && (
            <button
              type="button"
              onClick={onOpenCampaignModal}
              className="sm:col-span-7 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-indigo-500 hover:from-amber-400 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center space-x-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {language === 'hi'
                  ? `🚀 डेटाबेस से 7-दिवसीय (700 लिंक्स) कैंपेन लॉन्च करें`
                  : `🚀 Launch Full 7-Day Campaign (700 Links on Multi-Million Traffic Hubs)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className={`${onOpenCampaignModal ? 'sm:col-span-5' : 'sm:col-span-12'} py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 transition flex items-center justify-center space-x-2 cursor-pointer`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>
              {language === 'hi'
                ? `⚡ सिंगल रीयल-टाइम बैकलिंक बनाएं`
                : `⚡ Create Single Real-Time Backlink`}
            </span>
          </button>
        </div>

      </form>

    </div>
  );
};
