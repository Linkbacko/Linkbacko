import React, { useState } from 'react';
import { 
  Flame, 
  Table as TableIcon, 
  Sparkles, 
  Plus, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Filter,
  BarChart2,
  Trash2
} from 'lucide-react';
import { WordPressSite, Backlink, HighAuthorityTarget } from '../types';
import { HIGH_AUTHORITY_TARGETS } from '../data/mockInitialData';
import { Language } from '../utils/translations';

interface KeywordPerformanceHeatmapProps {
  sites: WordPressSite[];
  backlinks: Backlink[];
  selectedSite: WordPressSite | null;
  onSelectSite: (site: WordPressSite | null) => void;
  onTriggerAgentForKeyword: (siteId: string, keyword: string, preferredTargetId?: string) => void;
  onAddKeywordToSite: (siteId: string, newKeyword: string) => void;
  onRemoveKeywordFromSite: (siteId: string, keywordToRemove: string) => void;
  language: Language;
}

export const KeywordPerformanceHeatmap: React.FC<KeywordPerformanceHeatmapProps> = ({
  sites,
  backlinks,
  selectedSite,
  onSelectSite,
  onTriggerAgentForKeyword,
  onAddKeywordToSite,
  onRemoveKeywordFromSite,
  language
}) => {
  const [viewMode, setViewMode] = useState<'heatmap' | 'table'>('heatmap');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [selectedCellTarget, setSelectedCellTarget] = useState<{ keyword: string; target: HighAuthorityTarget; links: Backlink[] } | null>(null);

  // Active site to examine (fallback to first site or selectedSite)
  const currentSite = selectedSite || (sites.length > 0 ? sites[0] : null);

  if (!currentSite) {
    return null;
  }

  // Backlinks belonging to the current site
  const siteBacklinks = backlinks.filter(b => b.siteId === currentSite.id);

  // Top authority platforms for columns in the heatmap
  const targetPlatforms = HIGH_AUTHORITY_TARGETS.slice(0, 8); // Top 8 high DA platforms

  // Filter keywords by search
  const filteredKeywords = currentSite.keywords.filter(kw =>
    kw.toLowerCase().includes(searchKeyword.toLowerCase().trim())
  );

  // Compute metrics per keyword
  const keywordMetrics = filteredKeywords.map(kw => {
    const kwLower = kw.toLowerCase();
    
    // Match backlinks that contain or match this keyword in anchorText or destination
    const matchedLinks = siteBacklinks.filter(b => {
      const aLower = b.anchorText.toLowerCase();
      return aLower.includes(kwLower) || kwLower.includes(aLower);
    });

    const liveLinks = matchedLinks.filter(b => b.status === 'live');
    const pendingLinks = matchedLinks.filter(b => b.status === 'pending_verification');
    const failedLinks = matchedLinks.filter(b => b.status === 'failed');

    const totalLinks = matchedLinks.length;
    const avgDA = totalLinks > 0 ? Math.round(matchedLinks.reduce((acc, b) => acc + b.da, 0) / totalLinks) : 0;
    const avgPA = totalLinks > 0 ? Math.round(matchedLinks.reduce((acc, b) => acc + b.pa, 0) / totalLinks) : 0;
    const totalTraffic = matchedLinks.reduce((acc, b) => acc + (b.trafficEst || 0), 0);

    // Topical Authority Score (0 - 100)
    const authorityScore = Math.min(100, Math.round((liveLinks.length * 28) + (avgDA * 0.4)));

    // Mock rank movement simulation based on backlink equity
    const rankSeed = Math.abs(kw.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 15 + 2;
    const rankGain = Math.max(1, liveLinks.length * 2);

    return {
      keyword: kw,
      matchedLinks,
      totalLinks,
      liveCount: liveLinks.length,
      pendingCount: pendingLinks.length,
      failedCount: failedLinks.length,
      avgDA,
      avgPA,
      totalTraffic,
      authorityScore,
      currentRank: rankSeed,
      rankGain: liveLinks.length > 0 ? rankGain : 0,
      topReferringDomain: matchedLinks[0]?.targetDomain || '—'
    };
  });

  // Calculate overall site keyword health
  const totalKeywords = currentSite.keywords.length;
  const keywordsWithLiveLinks = currentSite.keywords.filter(kw => {
    const kwLower = kw.toLowerCase();
    return siteBacklinks.some(b => b.status === 'live' && (b.anchorText.toLowerCase().includes(kwLower) || kwLower.includes(b.anchorText.toLowerCase())));
  }).length;
  
  const coverageRate = totalKeywords > 0 ? Math.round((keywordsWithLiveLinks / totalKeywords) * 100) : 0;
  const totalTrafficAllKeywords = keywordMetrics.reduce((acc, m) => acc + m.totalTraffic, 0);

  const handleAddNewKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim()) return;
    onAddKeywordToSite(currentSite.id, newKeywordInput.trim());
    setNewKeywordInput('');
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-6">
      
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  {language === 'hi' 
                    ? 'कीवर्ड परफॉर्मेंस व अथॉरिटी हीटमैप' 
                    : 'Target Keywords Distribution & Authority Heatmap'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  Live SEO Metrics
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'hi'
                  ? `वेबसाइट "${currentSite.name}" के कीवर्ड्स, अथॉरिटी टियर्स और बैकलिंक एकाग्रता का विजुअल विश्लेषण`
                  : `Visual distribution matrix and topical authority performance for "${currentSite.name}" (${currentSite.url})`}
              </p>
            </div>
          </div>

          {/* View Toggles & Site Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Site Selector Dropdown */}
            {sites.length > 1 && (
              <select
                value={currentSite.id}
                onChange={(e) => {
                  const s = sites.find(x => x.id === e.target.value);
                  if (s) onSelectSite(s);
                }}
                className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.url.replace(/^https?:\/\//, '')})
                  </option>
                ))}
              </select>
            )}

            {/* View Switcher: Heatmap vs Table */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('heatmap')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  viewMode === 'heatmap'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'विजुअल हीटमैप' : 'Visual Heatmap'}</span>
              </button>
              
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'परफॉर्मेंस टेबल' : 'Analytics Table'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Quick KPI Stats Ribbon for Keywords */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="p-2.5 bg-slate-950/60 border border-slate-800/60 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {language === 'hi' ? 'लक्षित कीवर्ड्स' : 'Monitored Keywords'}
            </span>
            <span className="text-base font-bold text-white">{totalKeywords} keywords</span>
          </div>

          <div className="p-2.5 bg-slate-950/60 border border-slate-800/60 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {language === 'hi' ? 'कीवर्ड कवरेज' : 'High DA Coverage'}
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold text-emerald-400">{coverageRate}%</span>
              <span className="text-[10px] text-slate-400">({keywordsWithLiveLinks}/{totalKeywords})</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/60 border border-slate-800/60 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {language === 'hi' ? 'कुल कीवर्ड ट्रैफिक' : 'Total Referral Traffic'}
            </span>
            <span className="text-base font-bold text-sky-400">{totalTrafficAllKeywords.toLocaleString()}+ /mo</span>
          </div>

          <div className="p-2.5 bg-slate-950/60 border border-slate-800/60 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {language === 'hi' ? 'एंकर सुरक्षा स्कोर' : 'Anchor Diversity Health'}
            </span>
            <span className="text-base font-bold text-indigo-400">98.5% (Natural)</span>
          </div>
        </div>

      </div>

      {/* Search & Inline Add Keyword Toolbar */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder={language === 'hi' ? 'कीवर्ड खोजें...' : 'Filter keywords...'}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Add Keyword Form */}
        <form onSubmit={handleAddNewKeyword} className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder={language === 'hi' ? 'नया कीवर्ड जोड़ें...' : 'Add new target keyword...'}
            value={newKeywordInput}
            onChange={(e) => setNewKeywordInput(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-56"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center space-x-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'जोड़ें' : 'Add'}</span>
          </button>
        </form>

      </div>

      {/* VIEW 1: VISUAL HEATMAP MATRIX */}
      {viewMode === 'heatmap' && (
        <div className="p-5 overflow-x-auto">
          
          {/* Heatmap Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">
              {language === 'hi' ? 'हीटमैप संकेत (Link Density Heatmap):' : 'Heatmap Link Concentration Guide:'}
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-850 border border-slate-800 inline-block" />
                <span className="text-[11px]">0 Links (Unacquired)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500/40 inline-block" />
                <span className="text-[11px]">1 Link (Active)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 rounded bg-gradient-to-r from-emerald-500/60 to-teal-500/70 border border-emerald-400 inline-block" />
                <span className="text-[11px]">2+ High DA Links (Dominant)</span>
              </div>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                <th className="py-3 px-3 font-bold min-w-[200px]">
                  {language === 'hi' ? 'लक्षित कीवर्ड' : 'Target Keyword'}
                </th>
                {targetPlatforms.map(target => (
                  <th key={target.id} className="py-3 px-2 text-center min-w-[100px]">
                    <div className="font-semibold text-white truncate max-w-[110px] mx-auto">
                      {target.platformName.split(' ')[0]}
                    </div>
                    <div className="flex items-center justify-center space-x-1 mt-0.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        DA {target.da}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center min-w-[110px]">
                  {language === 'hi' ? 'अथॉरिटी स्कोर' : 'Topical Power'}
                </th>
                <th className="py-3 px-3 text-right min-w-[90px]">
                  {language === 'hi' ? 'कार्य' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {keywordMetrics.map((km) => {
                return (
                  <tr key={km.keyword} className="hover:bg-slate-800/20 transition group">
                    
                    {/* Keyword Title & Stats */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                        <span>"{km.keyword}"</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-semibold">{km.liveCount} live</span>
                        <span>•</span>
                        <span>{km.totalTraffic.toLocaleString()} clicks/mo</span>
                      </div>
                    </td>

                    {/* Heatmap Matrix Cells */}
                    {targetPlatforms.map(target => {
                      // Find backlinks matching this target domain AND this keyword
                      const cellLinks = km.matchedLinks.filter(b => b.targetDomain.toLowerCase() === target.domain.toLowerCase());
                      const linkCount = cellLinks.length;
                      const hasLive = cellLinks.some(b => b.status === 'live');

                      let cellBg = 'bg-slate-950/40 border-slate-800/60 text-slate-600 hover:border-slate-700';
                      if (linkCount >= 2) {
                        cellBg = 'bg-gradient-to-br from-emerald-500/30 to-teal-500/40 border-emerald-500/60 text-white font-extrabold shadow-sm shadow-emerald-500/10 hover:border-emerald-400';
                      } else if (linkCount === 1) {
                        cellBg = hasLive 
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold hover:border-emerald-400'
                          : 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold hover:border-amber-400';
                      }

                      return (
                        <td key={target.id} className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (linkCount > 0) {
                                setSelectedCellTarget({ keyword: km.keyword, target, links: cellLinks });
                              } else {
                                onTriggerAgentForKeyword(currentSite.id, km.keyword, target.id);
                              }
                            }}
                            title={
                              linkCount > 0
                                ? `${linkCount} backlink(s) on ${target.domain} for "${km.keyword}" (Click to view)`
                                : `No links yet. Click to build backlink on ${target.domain} (DA ${target.da}) with AI Agent!`
                            }
                            className={`w-full py-2 px-1 rounded-xl border transition flex flex-col items-center justify-center text-xs group/cell ${cellBg}`}
                          >
                            {linkCount > 0 ? (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs">{linkCount}</span>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                              </div>
                            ) : (
                              <div className="opacity-40 group-hover/cell:opacity-100 transition flex items-center justify-center text-[10px] text-slate-500 group-hover/cell:text-indigo-400">
                                <Plus className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {/* Authority Score Column */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center space-x-1.5">
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full"
                            style={{ width: `${km.authorityScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white">{km.authorityScore}%</span>
                      </div>
                    </td>

                    {/* Action Column: Boost with AI */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onTriggerAgentForKeyword(currentSite.id, km.keyword)}
                          title="Boost Keyword with AI Agent"
                          className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition flex items-center space-x-1 shadow"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Boost</span>
                        </button>

                        <button
                          onClick={() => onRemoveKeywordFromSite(currentSite.id, km.keyword)}
                          title="Remove Keyword"
                          className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {keywordMetrics.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 text-xs">
                    No keywords found. Add keywords above to begin tracking distribution and authority metrics.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: DETAILED ANALYTICS TABLE */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3 px-4">{language === 'hi' ? 'कीवर्ड एवं इरादा' : 'Target Keyword'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'बैकलिंक वॉल्यूम' : 'Backlink Volume'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'औसत अथॉरिटी' : 'Avg Authority'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'ट्रैफिक' : 'Monthly Traffic'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'टॉप रेफरिंग डोमेन' : 'Top Referring Domain'}</th>
                <th className="py-3 px-4">{language === 'hi' ? 'SERP रैंक वेलोसिटी' : 'SERP Velocity'}</th>
                <th className="py-3 px-4 text-right">{language === 'hi' ? 'कार्य' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {keywordMetrics.map((km) => (
                <tr key={km.keyword} className="hover:bg-slate-800/30 transition">
                  
                  {/* Keyword */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white text-xs block">"{km.keyword}"</span>
                    <span className="text-[10px] text-slate-400">
                      Topic relevance score: <strong className="text-emerald-400">{km.authorityScore}%</strong>
                    </span>
                  </td>

                  {/* Volume */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs">{km.totalLinks} links</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {km.liveCount} Live
                      </span>
                      {km.pendingCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {km.pendingCount} Pending
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Avg DA & PA */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-emerald-400 text-xs">
                        DA {km.avgDA || '—'}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        / PA {km.avgPA || '—'}
                      </span>
                    </div>
                  </td>

                  {/* Traffic */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white">
                      {km.totalTraffic.toLocaleString()}+ clicks
                    </span>
                    <span className="block text-[10px] text-slate-500">estimated organic pull</span>
                  </td>

                  {/* Top Domain */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 border border-slate-800 text-indigo-300">
                      {km.topReferringDomain}
                    </span>
                  </td>

                  {/* SERP Rank Velocity */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                      <span>Pos #{km.currentRank}</span>
                      {km.rankGain > 0 ? (
                        <span className="text-emerald-400 flex items-center text-[11px]">
                          <TrendingUp className="w-3 h-3 mr-0.5 inline" /> ↑ {km.rankGain}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Indexed</span>
                      )}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onTriggerAgentForKeyword(currentSite.id, km.keyword)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{language === 'hi' ? 'लिंक बनाएं' : 'Build Link'}</span>
                      </button>

                      <button
                        onClick={() => onRemoveKeywordFromSite(currentSite.id, km.keyword)}
                        title="Remove Keyword"
                        className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: Cell Details when clicking on an active Heatmap cell */}
      {selectedCellTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white">
                  {selectedCellTarget.target.platformName} ({selectedCellTarget.target.domain})
                </h4>
                <p className="text-xs text-indigo-400 mt-0.5">
                  Keyword Focus: "{selectedCellTarget.keyword}" • DA {selectedCellTarget.target.da}
                </p>
              </div>
              <button
                onClick={() => setSelectedCellTarget(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto">
              <span className="text-xs font-semibold text-slate-300 block">
                Backlinks on this Platform ({selectedCellTarget.links.length}):
              </span>
              {selectedCellTarget.links.map(l => (
                <div key={l.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">"{l.anchorText}"</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {l.status}
                    </span>
                  </div>
                  <a
                    href={l.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-indigo-400 hover:underline flex items-center space-x-1 break-all"
                  >
                    <span>{l.targetUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <p className="text-[11px] text-slate-400 italic font-sans pt-1">
                    {l.generatedContentSnippet || 'Contextual backlink reference'}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setSelectedCellTarget(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const kw = selectedCellTarget.keyword;
                  const tgtId = selectedCellTarget.target.id;
                  setSelectedCellTarget(null);
                  onTriggerAgentForKeyword(currentSite.id, kw, tgtId);
                }}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Build Another Link on {selectedCellTarget.target.domain}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
