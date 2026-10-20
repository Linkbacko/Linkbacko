import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  FileCheck,
  HelpCircle,
  ExternalLink,
  Ban
} from 'lucide-react';
import { aiAgentEngine } from '../services/aiAgentEngine';
import { LinkRiskAudit, PageClassification } from '../types';
import { Language } from '../utils/translations';

interface LinkRiskAuditorProps {
  language: Language;
}

export const LinkRiskAuditor: React.FC<LinkRiskAuditorProps> = ({ language }) => {
  const [auditMode, setAuditMode] = useState<'prospectRisk' | 'assetDetection'>('prospectRisk');
  
  // Prospect Risk input
  const [prospectUrl, setProspectUrl] = useState('');
  const [prospectContext, setProspectContext] = useState<'Editorial' | 'Directory' | 'Guest Post' | 'Sponsored' | 'Forum/Comment' | 'Resource Page'>('Editorial');
  const [auditResult, setAuditResult] = useState<LinkRiskAudit | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Asset Detection input
  const [myPageUrl, setMyPageUrl] = useState('');
  const [myPageType, setMyPageType] = useState<PageClassification>('Informational');
  const [assetResult, setAssetResult] = useState<ReturnType<typeof aiAgentEngine.analyzePageAndAssets> | null>(null);
  const [isAnalyzingAsset, setIsAnalyzingAsset] = useState(false);

  const handleAuditProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectUrl.trim()) return;

    setIsAuditing(true);
    setAuditResult(null);

    setTimeout(() => {
      const result = aiAgentEngine.evaluateLinkRisk(prospectUrl.trim(), prospectContext);
      setAuditResult(result);
      setIsAuditing(false);
    }, 800);
  };

  const handleAnalyzeAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myPageUrl.trim()) return;

    setIsAnalyzingAsset(true);
    setAssetResult(null);

    setTimeout(() => {
      const result = aiAgentEngine.analyzePageAndAssets(myPageUrl.trim(), myPageType);
      setAssetResult(result);
      setIsAnalyzingAsset(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Switcher & Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>
                {language === 'hi'
                  ? 'गूगल-कम्प्लायंस एवं लिंक रिस्क ऑडिटर (Google Search Essentials Engine)'
                  : 'Google Search Essentials & Link Risk Auditor (2026 Engine)'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'स्पैम लिंकिंग रिस्क की जांच करें और अपने पेजों के लिंकेबल एसेट्स (Linkable Assets) का ऑडिट करें'
                : 'Evaluate candidate prospects against Google link spam policies and detect linkable asset viability'}
            </p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setAuditMode('prospectRisk')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                auditMode === 'prospectRisk'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Prospect Risk Check
            </button>
            <button
              onClick={() => setAuditMode('assetDetection')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                auditMode === 'assetDetection'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Linkable Asset Detection
            </button>
          </div>
        </div>

        {/* TOOL 1: PROSPECT RISK CHECK */}
        {auditMode === 'prospectRisk' && (
          <div className="mt-5 space-y-4">
            <form onSubmit={handleAuditProspect} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Candidate Prospect Domain or Article URL *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. techtarget.com, ezine-directory.net, or blog article URL"
                    value={prospectUrl}
                    onChange={(e) => setProspectUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Opportunity Type Context
                </label>
                <select
                  value={prospectContext}
                  onChange={(e) => setProspectContext(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Editorial">Editorial Citation</option>
                  <option value="Resource Page">Resource Page</option>
                  <option value="Guest Post">Guest Contribution</option>
                  <option value="Sponsored">Sponsored / Commercial</option>
                  <option value="Directory">Directory Submission</option>
                  <option value="Forum/Comment">Forum / Comment Post</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                  {isAuditing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Auditing Prospect against Search Essentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Audit Candidate Prospect for Link Risk</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Audit Result Display */}
            {auditResult && (
              <div className={`p-5 rounded-2xl border transition animate-in fade-in ${
                auditResult.status === 'SAFE'
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : auditResult.status === 'CAUTION'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-rose-950/20 border-rose-500/40'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    {auditResult.status === 'SAFE' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {auditResult.status === 'CAUTION' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {auditResult.status === 'REJECT' && <Ban className="w-5 h-5 text-rose-400" />}
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Audit Verdict: STATUS = {auditResult.status}
                    </h4>
                  </div>
                  {auditResult.relOverride && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Required Rel: rel="{auditResult.relOverride}"
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Audit Findings:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-200">
                      {auditResult.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  {auditResult.safeAlternative && (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl mt-3">
                      <strong className="text-indigo-400 block mb-0.5">Safer 2026 Alternative Recommendation:</strong>
                      <p className="text-slate-300">{auditResult.safeAlternative}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOOL 2: LINKABLE ASSET DETECTION */}
        {auditMode === 'assetDetection' && (
          <div className="mt-5 space-y-4">
            <form onSubmit={handleAnalyzeAsset} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Page URL to Evaluate *
                </label>
                <div className="relative">
                  <FileCheck className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="https://yourdomain.com/data-benchmark-or-guide"
                    value={myPageUrl}
                    onChange={(e) => setMyPageUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Page Type
                </label>
                <select
                  value={myPageType}
                  onChange={(e) => setMyPageType(e.target.value as PageClassification)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Research">Research / Benchmark Study</option>
                  <option value="Tool">Free Tool / Calculator</option>
                  <option value="Guide">Comprehensive Guide</option>
                  <option value="Original data">Original Data / Survey</option>
                  <option value="Commercial">Commercial Product / Pricing</option>
                  <option value="Informational">Informational Article</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isAnalyzingAsset}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                  {isAnalyzingAsset ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Checking Linkable Worth & Citation Potential...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Detect Linkable Assets & Citation Justification</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Asset Detection Result */}
            {assetResult && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Linkable Asset Evaluation: <span className="text-indigo-400">{assetResult.detectedAsset}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Classified as: {assetResult.pageType}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    assetResult.assetStrength === 'Strong'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    Asset Strength: {assetResult.assetStrength}
                  </span>
                </div>

                {assetResult.isCommercial && (
                  <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-start space-x-2 text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong>Commercial Page Detected:</strong> Google Search Essentials advises against attempting to force external editorial links directly to commercial conversion pages. Build an informational research/tool asset first, then pass link equity internally.
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block font-semibold mb-1">Missing Link Magnet Elements:</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {assetResult.missingAssets.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block font-semibold mb-1">Recommended Asset Upgrade:</span>
                    <p className="text-indigo-300">{assetResult.recommendedAsset}</p>
                  </div>
                </div>

                <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
                  <strong className="text-indigo-300">Recommended Internal Linking Architecture:</strong>
                  <p className="text-slate-300 mt-0.5">{assetResult.internalLinkingStrategy}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
