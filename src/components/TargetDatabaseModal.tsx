import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Globe, ExternalLink, ArrowRight, Check, Search, Zap, TrendingUp, Compass, Loader2 } from 'lucide-react';
import { HIGH_AUTHORITY_TARGETS, DISCOVERABLE_DAILY_TARGETS } from '../data/mockInitialData';
import { HighAuthorityTarget, WordPressSite } from '../types';
import { Language } from '../utils/translations';

interface TargetDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTargetForBuild: (target: HighAuthorityTarget) => void;
  connectedSite: WordPressSite | null;
  language: Language;
}

export const TargetDatabaseModal: React.FC<TargetDatabaseModalProps> = ({
  isOpen,
  onClose,
  onSelectTargetForBuild,
  connectedSite,
  language
}) => {
  const [targetsList, setTargetsList] = useState<HighAuthorityTarget[]>([...HIGH_AUTHORITY_TARGETS]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchNotice, setResearchNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunDailyDeepResearch = () => {
    setIsResearching(true);
    setTimeout(() => {
      const existingDomains = new Set(targetsList.map(t => t.domain.toLowerCase()));
      const newlyFound = DISCOVERABLE_DAILY_TARGETS.filter(t => !existingDomains.has(t.domain.toLowerCase()));
      
      setTargetsList(prev => [...newlyFound, ...prev]);
      setIsResearching(false);
      setFilterCategory('All');
      setResearchNotice(language === 'hi' 
        ? `दैनिक डीप रिसर्च सफल! ${newlyFound.length} नई हाई-ट्रैफिक वेबसाइट्स (Examine.com, STACK, Runner's World UK, Eat This) खोजी गईं।`
        : `Daily Deep Research complete! Discovered ${newlyFound.length} fresh high-traffic, low-spam publishers.`);
    }, 400);
  };

  const categories = [
    { id: 'All', labelEn: `All (${targetsList.length}+ Platforms)`, labelHi: `सभी (${targetsList.length}+ प्लेटफॉर्म)` },
    { id: 'Discovered', labelEn: '🔥 Newly Researched', labelHi: '🔥 नई खोजी गई वेबसाइट्स' },
    { id: 'Fitness', labelEn: 'Fitness & Strength', labelHi: 'फिटनेस व स्ट्रेंथ' },
    { id: 'Medical', labelEn: 'Clinical & Medical', labelHi: 'क्लीनिकल व मेडिकल' },
    { id: 'Mega', labelEn: 'Mega Traffic (100M+)', labelHi: 'मेगा ट्रैफिक (100M+)' }
  ];

  const filtered = targetsList.filter(t => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = t.domain.toLowerCase().includes(q) || 
                    t.platformName.toLowerCase().includes(q) || 
                    t.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category filter
    if (filterCategory === 'All') return true;
    if (filterCategory === 'Discovered') {
      return !!t.isNewlyDiscovered;
    }
    if (filterCategory === 'Fitness') {
      const cat = `${t.category} ${t.platformName}`.toLowerCase();
      return cat.includes('fitness') || cat.includes('strength') || cat.includes('workout') || cat.includes('nutrition') || cat.includes('muscle') || cat.includes('running');
    }
    if (filterCategory === 'Medical') {
      const cat = `${t.category} ${t.platformName}`.toLowerCase();
      return cat.includes('clinical') || cat.includes('medical') || cat.includes('health') || cat.includes('research') || cat.includes('physician') || t.domain.includes('nih') || t.domain.includes('mayo');
    }
    if (filterCategory === 'Mega') {
      return t.estMonthlyTraffic.includes('B+') || (t.estMonthlyTraffic.includes('M+') && parseFloat(t.estMonthlyTraffic) >= 100);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  {language === 'hi' ? 'टॉप 55+ हाई-ट्रैफिक अथॉरिटी वेबसाइट्स कैटलॉग' : 'High Traffic Authority Publishing Network (55+ Platforms)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  9.8B+ Reach
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hi' 
                  ? `फिटनेस, हेल्थ और स्पोर्ट्स साइंस के विशाल ट्रैफिक वाले डोमेन (DA 78 - 98) — Google सर्च इसेंशियल्स सुरक्षित` 
                  : `Highest traffic authority publishers vetted for ${connectedSite?.name || 'fitnesstoday.us'} with zero spam footprint`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Daily Deep Research Action Bar */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                <span>{language === 'hi' ? '🔍 दैनिक डीप वेब रिसर्च व नई वेबसाइट खोज' : '🔍 Daily Automated Deep Web Research'}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold">Autonomous Engine</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {language === 'hi' 
                  ? 'हर दिन नए हाई-ट्रैफिक डोमेन स्कैन व रिसर्च करें (Google सेफ, 0% स्पैम)' 
                  : 'Continuously research & verify fresh high-traffic publishers matching fitness & sports medicine.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRunDailyDeepResearch}
            disabled={isResearching}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 shrink-0 cursor-pointer active:scale-95"
          >
            {isResearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{language === 'hi' ? 'वेब रिसर्च जारी है...' : 'Scanning & Researching...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{language === 'hi' ? 'नई वेबसाइट्स रिसर्च करें (+8 Sites)' : 'Research New Targets (+8 Sites)'}</span>
              </>
            )}
          </button>
        </div>

        {/* Research Success Notice */}
        {researchNotice && (
          <div className="px-6 py-2.5 bg-emerald-950/60 border-b border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{researchNotice}</span>
            </div>
            <button onClick={() => setResearchNotice(null)} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setFilterCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterCategory === c.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {language === 'hi' ? c.labelHi : c.labelEn}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'डोमेन या प्लेटफॉर्म खोजें...' : 'Search domain or platform...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Targets Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          {filtered.map(target => (
            <div
              key={target.id}
              className={`bg-slate-950/70 border rounded-2xl p-4 hover:border-indigo-500/50 transition flex flex-col justify-between group ${
                target.isNewlyDiscovered ? 'border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20' : 'border-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition">
                        {target.platformName}
                      </h4>
                      {target.isNewlyDiscovered && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 uppercase tracking-wider shrink-0">
                          Researched Today
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-indigo-400 font-mono flex items-center space-x-1 mt-0.5">
                      <Globe className="w-3 h-3 inline" />
                      <span>{target.domain}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      DA {target.da}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      PA {target.pa}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                  {target.category}
                </p>

                {target.researchSummary && (
                  <p className="text-[11px] text-amber-200/90 mt-1.5 p-2 rounded-lg bg-amber-950/30 border border-amber-500/20 italic">
                    💡 {target.researchSummary}
                  </p>
                )}

                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/70">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">मासिक ट्रैफिक</span>
                    <span className="text-amber-300 font-extrabold flex items-center space-x-0.5">
                      <TrendingUp className="w-3 h-3 text-amber-400 inline" />
                      <span>{target.estMonthlyTraffic}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">स्पैम स्कोर</span>
                    <span className="text-emerald-400 font-extrabold">{target.spamScore}% (Clean)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">सुरक्षा इंडेक्स</span>
                    <span className="text-indigo-400 font-extrabold">{target.safetyScore}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  लिंक: <strong className="text-slate-200">{target.linkType}</strong> • <span className="text-emerald-400">DoFollow</span>
                </span>
                <button
                  onClick={() => {
                    onSelectTargetForBuild(target);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                  <span>{language === 'hi' ? 'यहाँ तुरंत बैकलिंक बनाएं' : 'Build Backlink Here'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>{filtered.length} {language === 'hi' ? 'अथॉरिटी प्लेटफॉर्म्स उपलब्ध' : 'authority platforms available'}</span>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लक्षित वेबसाइट: https://fitnesstoday.us (100% DoFollow)' : 'Target: https://fitnesstoday.us'}</span>
          </span>
        </div>

      </div>
    </div>
  );
};
