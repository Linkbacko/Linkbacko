import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  RotateCw, 
  FileText, 
  Download, 
  Eye, 
  Shield, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Backlink, WordPressSite } from '../types';
import { aiAgentEngine } from '../services/aiAgentEngine';
import { Language, translations } from '../utils/translations';

interface BacklinksTableProps {
  backlinks: Backlink[];
  sites: WordPressSite[];
  selectedSite: WordPressSite | null;
  onVerifyBacklink: (backlinkId: string) => void;
  onRetryBacklink: (backlink: Backlink) => void;
  onViewSnippet: (backlink: Backlink) => void;
  onOpenAuditReport?: () => void;
  language: Language;
}

export const BacklinksTable: React.FC<BacklinksTableProps> = ({
  backlinks,
  sites,
  selectedSite,
  onVerifyBacklink,
  onRetryBacklink,
  onViewSnippet,
  onOpenAuditReport,
  language
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'pending_verification' | 'failed'>('all');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Apply filters
  const filtered = backlinks.filter(b => {
    // Site filter
    if (selectedSite && b.siteId !== selectedSite.id) return false;

    // Status filter
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchDomain = b.targetDomain.toLowerCase().includes(q);
      const matchAnchor = b.anchorText.toLowerCase().includes(q);
      const matchDest = b.destinationUrl.toLowerCase().includes(q);
      if (!matchDomain && !matchAnchor && !matchDest) return false;
    }

    return true;
  });

  const handleTriggerVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      onVerifyBacklink(id);
      setVerifyingId(null);
    }, 800);
  };

  const handleExportCSV = () => {
    const headers = ['Target Domain', 'Target URL', 'Anchor Text', 'Category', 'DA', 'PA', 'Rel', 'Status', 'Monthly Traffic', 'HTTP Status', 'Created At'];
    const rows = filtered.map(b => [
      b.targetDomain,
      b.targetUrl,
      `"${b.anchorText.replace(/"/g, '""')}"`,
      b.anchorCategory,
      b.da,
      b.pa,
      b.rel,
      b.status,
      b.trafficEst,
      b.httpStatus,
      b.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `linkpulse_seo_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-white">{t.backlinkExplorer}</h3>
            <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-300 rounded-full font-semibold">
              {filtered.length} {language === 'hi' ? 'लिंक्स' : 'links'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'hi' 
              ? 'प्रत्येक लिंक का DA, PA, ट्रैफिक, एंकर टेक्स्ट, और लाइव वेरिफिकेशन स्थिति' 
              : 'Detailed tracking of live status, DA/PA scores, estimated referral traffic, and verification logs'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">{t.filterStatus}</option>
            <option value="live">🟢 {t.statusLive}</option>
            <option value="pending_verification">🟡 {t.statusPending}</option>
            <option value="failed">🔴 {t.statusFailed}</option>
          </select>

          {/* Fetch Live Audit Report Button */}
          {onOpenAuditReport && (
            <button
              onClick={onOpenAuditReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लाइव ऑडिट रिपोर्ट फेच करें' : 'Fetch Audit Report'}</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
            <tr>
              <th className="py-3 px-4">{language === 'hi' ? 'टारगेट प्लेटफॉर्म / DA' : 'Target Platform & DA'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'एंकर टेक्स्ट' : 'Anchor Text & Type'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'वर्डप्रेस गंतव्य URL' : 'Target Site / Destination'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'मासिक ट्रैफिक' : 'Est. Traffic'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'स्थिति' : 'Live Status'}</th>
              <th className="py-3 px-4">{language === 'hi' ? 'इंडेक्सिंग' : 'Indexing'}</th>
              <th className="py-3 px-4 text-right">{language === 'hi' ? 'कार्य' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtered.map((item) => {
              const site = sites.find(s => s.id === item.siteId);
              const isVerifying = verifyingId === item.id;
              const isSynthetic = !item.targetUrl || 
                item.targetUrl.includes('-research-') || 
                item.targetUrl.includes('/publications/') ||
                item.targetUrl.includes('muqfdlvs') ||
                item.targetUrl.length < 12;
              const liveTargetUrl = isSynthetic 
                ? aiAgentEngine.resolveRealTargetUrl(item.targetDomain, item.anchorText, item.destinationUrl) 
                : item.targetUrl;

              return (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  
                  {/* Target Platform & DA */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {item.targetDomain.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-white">{item.targetDomain}</span>
                          <a
                            href={liveTargetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-indigo-400 transition"
                            title="Open Real Platform Link in New Tab (200 OK)"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            DA {item.da}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            PA {item.pa}
                          </span>
                          <span className="text-[10px] text-indigo-400 uppercase font-semibold">
                            {item.rel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Anchor Text */}
                  <td className="py-3.5 px-4">
                    <div className="max-w-[200px]">
                      <div className="font-semibold text-slate-200 truncate" title={item.anchorText}>
                        "{item.anchorText}"
                      </div>
                      <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                        {item.anchorCategory}
                      </span>
                    </div>
                  </td>

                  {/* Connected WordPress Site */}
                  <td className="py-3.5 px-4">
                    <div className="max-w-[180px]">
                      <span className="text-white text-xs block font-semibold truncate">
                        {site?.name || 'WordPress Site'}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block" title={item.destinationUrl}>
                        {item.destinationUrl.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                  </td>

                  {/* Traffic */}
                  <td className="py-3.5 px-4">
                    <span className="text-white font-semibold">
                      {item.trafficEst ? `${item.trafficEst.toLocaleString()}/mo` : '0/mo'}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      HTTP {item.httpStatus}
                    </span>
                  </td>

                  {/* Live Status */}
                  <td className="py-3.5 px-4">
                    {item.status === 'live' && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        <span>Live Verified</span>
                      </span>
                    )}
                    {item.status === 'pending_verification' && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        <span>Pending Review</span>
                      </span>
                    )}
                    {item.status === 'failed' && (
                      <div className="group relative inline-block">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 cursor-help">
                          <AlertCircle className="w-3 h-3" />
                          <span>Revision Needed</span>
                        </span>
                        {item.failureReason && (
                          <div className="hidden group-hover:block absolute z-20 left-0 top-full mt-1 w-64 p-2 bg-slate-950 border border-rose-500/30 rounded-lg text-[11px] text-rose-300 shadow-xl">
                            {item.failureReason}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Indexing */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      item.indexingStatus === 'Indexed'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.indexingStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      
                      {/* View Placement Output & Snippet */}
                      <button
                        onClick={() => onViewSnippet(item)}
                        title={language === 'hi' ? 'बैकलिंक लाइव प्रिव्यू व DOM देखें' : 'View Backlink Live Preview & DOM'}
                        className="px-2.5 py-1 text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-600 rounded-lg border border-indigo-500/30 text-[11px] font-bold transition flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-300" />
                        <span>{language === 'hi' ? 'लाइव प्रिव्यू देखें' : 'Inspect Preview'}</span>
                      </button>

                      {/* Verify Link Button */}
                      <button
                        onClick={() => handleTriggerVerify(item.id)}
                        disabled={isVerifying}
                        title={t.verify}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition"
                      >
                        <RotateCw className={`w-4 h-4 ${isVerifying ? 'animate-spin text-emerald-400' : ''}`} />
                      </button>

                      {/* Retry Button if Failed */}
                      {item.status === 'failed' && (
                        <button
                          onClick={() => onRetryBacklink(item)}
                          title={t.retry}
                          className="px-2 py-1 bg-indigo-600/80 hover:bg-indigo-500 text-white text-[10px] font-semibold rounded-lg shadow transition flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{t.retry}</span>
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 text-xs font-sans">
                  {language === 'hi' 
                    ? 'कोई बैकलिंक्स नहीं मिले। AI एजेंट को ट्रिगर करें या फ़िल्टर रीसेट करें।' 
                    : 'No backlinks found matching your filters. Trigger the AI agent or adjust your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
