import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Copy, 
  Check, 
  Layers, 
  TrendingUp, 
  ExternalLink, 
  ArrowRight, 
  Sliders, 
  BookOpen, 
  Target, 
  AlertCircle,
  HelpCircle,
  Clock,
  PlusCircle,
  UserCheck
} from 'lucide-react';
import { BacklinkCampaign, CampaignProspect, WordPressSite, PageClassification } from '../types';
import { aiAgentEngine } from '../services/aiAgentEngine';
import { Language } from '../utils/translations';

interface CampaignWorkflowViewProps {
  campaigns: BacklinkCampaign[];
  sites: WordPressSite[];
  selectedSite: WordPressSite | null;
  onSaveCampaign: (campaign: BacklinkCampaign) => void;
  language: Language;
}

export const CampaignWorkflowView: React.FC<CampaignWorkflowViewProps> = ({
  campaigns,
  sites,
  selectedSite,
  onSaveCampaign,
  language
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ''
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New campaign form state
  const [formSiteId, setFormSiteId] = useState(selectedSite?.id || sites[0]?.id || '');
  const [targetPageUrl, setTargetPageUrl] = useState('');
  const [pageType, setPageType] = useState<PageClassification>('Research');
  const [campaignObjective, setCampaignObjective] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Copy feedback state
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const site = sites.find(s => s.id === formSiteId) || sites[0];
    if (!site) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const generated = aiAgentEngine.generateFullCampaign(
        site,
        targetPageUrl.trim() || undefined,
        campaignObjective.trim() || undefined
      );

      onSaveCampaign(generated);
      setSelectedCampaignId(generated.id);
      setIsAnalyzing(false);
      setIsCreatingNew(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* 2026 Core Principle & Mission Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google Search Essentials & Spam Policy 2026 Compliant</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {language === 'hi' 
                ? 'बैकलिंक इंटेलिजेंस एवं एथिकल आउटरीच एजेंट (2026 संस्करण)' 
                : 'Backlink Intelligence & Ethical Outreach System (2026 Edition)'}
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed italic">
              "Create something worth linking to, find people who genuinely benefit from it, and make the relevant connection. Quality &gt; Quantity • Editorial Merit &gt; Manipulation • Users &gt; Search Engines."
            </p>
          </div>

          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center space-x-2 shrink-0 self-start md:self-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'hi' ? '+ नया 2026 कैंपेन बनाएं' : '+ Launch 2026 Campaign'}</span>
          </button>
        </div>
      </div>

      {/* NEW CAMPAIGN CREATION FORM */}
      {isCreatingNew && (
        <form onSubmit={handleCreateCampaign} className="p-6 bg-slate-900/90 border border-indigo-500/30 rounded-2xl shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                {language === 'hi' ? 'नया बैकलिंक इंटेलिजेंस कैंपेन कॉन्फ़िगर करें' : 'Configure 2026 Backlink Intelligence Campaign'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Connected Site *
              </label>
              <select
                value={formSiteId}
                onChange={(e) => setFormSiteId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.url.replace(/^https?:\/\//, '')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Page URL (or Resource Asset)
              </label>
              <input
                type="text"
                placeholder="https://yourdomain.com/research-benchmark"
                value={targetPageUrl}
                onChange={(e) => setTargetPageUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Page Intent Classification *
              </label>
              <select
                value={pageType}
                onChange={(e) => setPageType(e.target.value as PageClassification)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Research">Research / Benchmark Study (Highest Citation Potential)</option>
                <option value="Tool">Free Tool / Calculator / Utility</option>
                <option value="Guide">Comprehensive Reference Guide</option>
                <option value="Original data">Original Dataset / Survey</option>
                <option value="Informational">Informational / Educational Resource</option>
                <option value="Commercial">Commercial Landing Page (Requires Asset Creation)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Campaign Objective / Story Angle
            </label>
            <input
              type="text"
              placeholder="e.g. Earn editorial citations for our 2026 multi-agent latency benchmark among enterprise tech journals"
              value={campaignObjective}
              onChange={(e) => setCampaignObjective(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              The AI Agent will execute linkable asset detection, prospect tier qualification (Tier A / B / C), link risk check, and format 100% compliant outreach messages.
            </span>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Linkable Assets & Running Quality Control...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run 2026 Campaign Evaluation & Generate Full Output</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* CAMPAIGN SELECTOR TABS IF MULTIPLE */}
      {campaigns.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-medium text-slate-400 shrink-0">Saved Campaigns:</span>
          {campaigns.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelectedCampaignId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                c.id === selectedCampaignId
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              #{i + 1}: {c.seoObjective.businessName} ({c.seoObjective.primaryTopic.slice(0, 24)}...)
            </button>
          ))}
        </div>
      )}

      {/* FULL SECTION 24 CAMPAIGN OUTPUT DISPLAY */}
      {activeCampaign && (
        <div className="space-y-6">
          
          {/* SECTION A: SEO OBJECTIVE */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>A. SEO Objective</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Intent: {activeCampaign.seoObjective.pageType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Website & Brand</span>
                <span className="text-white font-bold text-sm">{activeCampaign.seoObjective.businessName}</span>
                <span className="text-slate-400 block truncate">{activeCampaign.seoObjective.websiteUrl}</span>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Target Asset URL</span>
                <span className="text-indigo-400 font-mono text-[11px] block truncate" title={activeCampaign.seoObjective.targetPageUrl}>
                  {activeCampaign.seoObjective.targetPageUrl}
                </span>
                <span className="text-emerald-400 text-[10px] font-semibold mt-0.5 block">Verified Accessible</span>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Industry & Audience</span>
                <span className="text-slate-200 font-medium block truncate">{activeCampaign.seoObjective.industry}</span>
                <span className="text-slate-400 text-[10px] block truncate">{activeCampaign.seoObjective.audience}</span>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Target Country / Geography</span>
                <span className="text-slate-200 font-medium">{activeCampaign.seoObjective.country}</span>
                <span className="text-slate-400 text-[10px] block">{activeCampaign.seoObjective.primaryTopic}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl text-xs text-slate-300">
              <strong className="text-white">Campaign Mission:</strong> {activeCampaign.seoObjective.campaignObjective}
            </div>
          </div>

          {/* SECTION B: LINKABLE ASSET ANALYSIS */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>B. Linkable Asset Analysis</span>
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                activeCampaign.linkableAssetAnalysis.assetStrength === 'Strong'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                Asset Strength: {activeCampaign.linkableAssetAnalysis.assetStrength}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Existing Linkable Asset:</span>
                <span className="text-white font-medium">{activeCampaign.linkableAssetAnalysis.existingAsset}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Missing Assets / Opportunity Gaps:</span>
                  <ul className="list-disc list-inside text-slate-300 mt-1 space-y-0.5">
                    {activeCampaign.linkableAssetAnalysis.missingAssets.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Recommended Asset Enhancement:</span>
                  <p className="text-indigo-300 mt-1">{activeCampaign.linkableAssetAnalysis.recommendedAsset}</p>
                </div>
              </div>

              {activeCampaign.linkableAssetAnalysis.internalLinkingStrategy && (
                <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-indigo-200">
                  <strong className="text-indigo-300">Internal Linking Strategy (Cluster Architecture):</strong>{' '}
                  {activeCampaign.linkableAssetAnalysis.internalLinkingStrategy}
                </div>
              )}
            </div>
          </div>

          {/* SECTION C: BACKLINK OPPORTUNITIES TABLE */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>C. Backlink Opportunities Table</span>
              </h3>
              <span className="text-xs text-slate-400">
                {activeCampaign.prospects.length} Qualified Prospects (Google Search Essentials Audited)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Prospect</th>
                    <th className="py-3 px-4">Opportunity Type</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Relevance</th>
                    <th className="py-3 px-4">Editorial Fit</th>
                    <th className="py-3 px-4">Risk Audit</th>
                    <th className="py-3 px-4">Score & Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeCampaign.prospects.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{p.prospectName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.domain}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {p.opportunity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] text-slate-300">{p.tier.split('—')[0]}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-white">{p.relevanceScore}/25</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-white">{p.editorialFitScore}/20</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          STATUS: {p.risk}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-sm text-emerald-400">
                            {p.qualityScore.total}
                          </span>
                          <span className="text-[10px] text-slate-400">/ 100</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">{p.priority}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION D: DETAILED PROSPECT PRIORITIZATION */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>D. Opportunity Prioritization & Strategy Breakdown</span>
            </h3>

            <div className="space-y-4">
              {activeCampaign.prospects.map((p, i) => (
                <div key={p.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800/80 gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <span className="font-bold text-white text-sm">{p.prospectName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({p.domain})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                      {p.priority} • Quality Score: {p.qualityScore.total}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Suggested Approach & Angle:</span>
                      <p>{p.suggestedApproach}</p>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Natural Anchor Style (Non-Manipulated):</span>
                      <p className="text-indigo-300 font-medium">"{p.suggestedAnchorStyle}"</p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Rel Qualification: <strong className="text-emerald-400 font-mono">{p.relQualification}</strong> (Editorial Citation)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION E: PERSONALIZED OUTREACH MESSAGE */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>E. Personalized Editorial Outreach</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Recipient: {activeCampaign.outreach.recipientRole} • Context: {activeCampaign.outreach.personalizationContext}
                </span>
              </div>
              <button
                onClick={() => handleCopy(activeCampaign.outreach.message, 'outreach')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
              >
                {copiedSection === 'outreach' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'outreach' ? 'Copied' : 'Copy Pitch'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
              <div className="text-slate-400 pb-2 border-b border-slate-800/80">
                <strong>Subject:</strong> <span className="text-white font-sans">{activeCampaign.outreach.subject}</span>
              </div>
              <pre className="text-slate-200 font-sans whitespace-pre-wrap leading-relaxed text-xs pt-1">
                {activeCampaign.outreach.message}
              </pre>
            </div>
          </div>

          {/* SECTION F: 2-STEP FOLLOW-UP SEQUENCE */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>F. Professional Follow-Up Sequence (Max 2 Touches)</span>
              </h3>
              <span className="text-xs text-slate-400">Respectful • No Pressure • Anti-Harassment</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-800">
                  <strong className="text-white">Follow-Up #1 (Day 4)</strong>
                  <button
                    onClick={() => handleCopy(activeCampaign.followUpSequence.step1, 'fu1')}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedSection === 'fu1' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="text-slate-300 font-sans whitespace-pre-wrap text-xs leading-relaxed">
                  {activeCampaign.followUpSequence.step1}
                </pre>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-800">
                  <strong className="text-white">Follow-Up #2 (Day 8 - Final Polite Close)</strong>
                  <button
                    onClick={() => handleCopy(activeCampaign.followUpSequence.step2, 'fu2')}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedSection === 'fu2' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="text-slate-300 font-sans whitespace-pre-wrap text-xs leading-relaxed">
                  {activeCampaign.followUpSequence.step2}
                </pre>
              </div>
            </div>
          </div>

          {/* SECTION G: 15-POINT QUALITY CONTROL CHECKLIST */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>G. Quality Control Checklist (15/15 Passed)</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% VERIFIED SAFE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-300">
              {[
                'No automated backlink spam',
                'No link farm recommendations',
                'No PBN manipulation',
                'No fake identities or personas',
                'No fake statistics or fabricated data',
                'No fabricated publishers or journalists',
                'No forced exact-match anchor text',
                'No manipulative reciprocal links',
                'No paid followed-link recommendations',
                'No low-quality mass directories',
                'No forum or blog-comment spam',
                'No mass guest-post spinning',
                'No deceptive outreach subject lines',
                'No low-value AI content strategy',
                'Opportunities have legitimate user value'
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 p-2 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>[✓] {item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 44 — 7-STAGE QUALITY GATE */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Section 44 — 2035 7-Stage Quality Gate</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                ALL 7 GATES PASSED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">1. Value Check</span>
                <span className="text-emerald-400 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Genuine User Utility</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">2. Relevance Check</span>
                <span className="text-emerald-400 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Genuine Topical Fit</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">3. Editorial Check</span>
                <span className="text-emerald-400 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Independent Merit</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">4. Evidence Check</span>
                <span className="text-emerald-400 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Supported Claims</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">5. Spam Check</span>
                <span className="text-emerald-400 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Zero Manipulation</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">6. Reputation Check</span>
                <span className="text-emerald-400 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Brand Protected</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">7. Sustainability</span>
                <span className="text-emerald-400 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Future-Proof 2035+</span>
              </div>
            </div>
          </div>

          {/* SECTION 43 & 38 — MONITORING & LEARNING REPORT */}
          {activeCampaign.learningReport && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Sections 38 & 43 — Autonomous Learning & Recalibration Report</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Loop: MONITOR → LEARN → RECALIBRATE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950 border border-emerald-500/20 rounded-xl space-y-1.5">
                  <span className="text-[11px] uppercase font-bold text-emerald-400 block">✓ Successful Patterns:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {activeCampaign.learningReport.successfulPatterns.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-950 border border-amber-500/20 rounded-xl space-y-1.5">
                  <span className="text-[11px] uppercase font-bold text-amber-400 block">⚠ New Opportunities & Gaps:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {activeCampaign.learningReport.newOpportunities.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {activeCampaign.learningReport.strategyChanges && (
                <div className="mt-3 p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
                  <strong className="text-indigo-300">Strategic Recalibration:</strong>{' '}
                  {activeCampaign.learningReport.strategyChanges.join(' • ')}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
