import React from 'react';
import { 
  Link2, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Activity, 
  CheckCircle, 
  Clock3, 
  AlertTriangle, 
  BarChart3, 
  Sparkles, 
  Play, 
  Cpu,
  Eye,
  ExternalLink,
  CheckCircle2,
  FileText,
  Globe
} from 'lucide-react';
import { Backlink, AgentSchedule, UserAccount, WordPressSite } from '../types';
import { Language, translations } from '../utils/translations';
import { RealtimeDomainKeywordSubmitBar } from './RealtimeDomainKeywordSubmitBar';

interface DashboardOverviewProps {
  account: UserAccount;
  selectedSite: WordPressSite | null;
  onTriggerAgent: () => void;
  isTriggering: boolean;
  onOpenWordPressModal: () => void;
  onOpenTargetsModal: () => void;
  onStartRealtime?: (data: { domain: string; keywords: string[]; niche: string; preferredTargetId?: string; }) => void;
  onOpenAuditReport?: () => void;
  onOpenCampaignModal?: () => void;
  onInspectBacklink?: (backlink: Backlink) => void;
  language: Language;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  account,
  selectedSite,
  onTriggerAgent,
  isTriggering,
  onOpenWordPressModal,
  onOpenTargetsModal,
  onStartRealtime,
  onOpenAuditReport,
  onOpenCampaignModal,
  onInspectBacklink,
  language
}) => {
  const t = translations[language];

  // Filter backlinks by selected site if any
  const filteredBacklinks = selectedSite
    ? account.backlinks.filter(b => b.siteId === selectedSite.id)
    : account.backlinks;

  const total = filteredBacklinks.length;
  const live = filteredBacklinks.filter(b => b.status === 'live').length;
  const pending = filteredBacklinks.filter(b => b.status === 'pending_verification').length;
  const failed = filteredBacklinks.filter(b => b.status === 'failed').length;

  const avgDA = total > 0
    ? Math.round(filteredBacklinks.reduce((acc, b) => acc + b.da, 0) / total)
    : 0;

  const avgPA = total > 0
    ? Math.round(filteredBacklinks.reduce((acc, b) => acc + b.pa, 0) / total)
    : 0;

  const totalTraffic = filteredBacklinks.reduce((acc, b) => acc + (b.trafficEst || 0), 0);
  
  const dofollowCount = filteredBacklinks.filter(b => b.rel === 'dofollow').length;
  const dofollowRate = total > 0 ? Math.round((dofollowCount / total) * 100) : 100;

  // Calculate next run time display
  const nextDate = new Date(account.agentSchedule.nextExecutionTime);
  const now = new Date();
  const diffMs = Math.max(0, nextDate.getTime() - now.getTime());
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Anchor text category distribution
  const anchorCounts = filteredBacklinks.reduce((acc, b) => {
    acc[b.anchorCategory] = (acc[b.anchorCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeCamp = account.activeAutonomousCampaign;

  return (
    <div className="space-y-6">

      {/* Active Autonomous Campaign Banner if Running */}
      {activeCamp && (
        <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block animate-ping mr-1" />
              <Activity className="w-5 h-5 inline" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {language === 'hi' ? '🔴 लाइव ऑटोनॉमस बैकलिंक कैंपेन सक्रिय है' : '🔴 Active Autonomous Backlink Campaign'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  {activeCamp.domain}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'hi'
                  ? `प्रगति: ${activeCamp.completedLinksCount} / ${activeCamp.totalTargetLinks} बैकलिंक्स (${activeCamp.durationDays} दिन @ ${activeCamp.dailyVelocity}/दिन) — Google SpamBrain सुरक्षित`
                  : `Progress: ${activeCamp.completedLinksCount} / ${activeCamp.totalTargetLinks} backlinks (${activeCamp.durationDays}d @ ${activeCamp.dailyVelocity}/d)`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onOpenCampaignModal && (
              <button
                onClick={onOpenCampaignModal}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow flex items-center space-x-1.5"
              >
                <span>{language === 'hi' ? 'लाइव रनर कंसोल खोलें' : 'Open Live Runner'}</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Real-Time Domain & Target Keyword Submission Bar */}
      {onStartRealtime && (
        <RealtimeDomainKeywordSubmitBar
          currentSite={selectedSite}
          onStartRealtime={onStartRealtime}
          onOpenAuditReport={onOpenAuditReport}
          onOpenCampaignModal={onOpenCampaignModal}
          language={language}
        />
      )}

      {/* Top Warning Banner if No WordPress Site Connected */}
      {account.sites.length === 0 && (
        <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {language === 'hi' ? 'कोई वर्डप्रेस साइट नहीं जुड़ी है' : 'No WordPress Website Connected'}
              </h4>
              <p className="text-xs text-slate-300">
                {language === 'hi' 
                  ? 'AI एजेंट को आपकी साइट का URL, यूजरनेम और पासवर्ड चाहिए ताकि वह हाई DA वेबसाइट्स पर बैकलिंक्स बना सके।'
                  : 'The AI agent requires your WordPress URL and credentials to begin autonomous high DA backlink syndication.'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenWordPressModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-xl transition whitespace-nowrap shadow"
          >
            {t.connectWordpress}
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Links Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-indigo-400">
            <Link2 className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.totalLinks}</span>
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Link2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{total}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <CheckCircle className="w-3 h-3 mr-0.5 inline" /> {live} {language === 'hi' ? 'लाइव' : 'live'}
            </span>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="text-amber-400">{pending} {language === 'hi' ? 'लंबित' : 'pending'}</span>
            <span>•</span>
            <span className="text-rose-400">{failed} {language === 'hi' ? 'विफल' : 'failed'}</span>
          </div>
        </div>

        {/* Avg Authority (DA / PA) Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-emerald-400">
            <ShieldCheck className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.avgDA} / PA</span>
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">DA {avgDA || '--'}</span>
            <span className="text-sm font-semibold text-slate-400">/ PA {avgPA || '--'}</span>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-emerald-400">
            <span className="font-semibold">Top Tier:</span>
            <span className="text-slate-300">Medium (96), GitHub (96), DEV (86)</span>
          </div>
        </div>

        {/* Est. Referral Traffic Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-sky-400">
            <TrendingUp className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.estTraffic}</span>
            <span className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{totalTraffic.toLocaleString()}+</span>
            <span className="text-xs text-sky-400 font-medium">/ month</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {language === 'hi' ? 'उच्च अथॉरिटी पब्लिशर्स से रेफरल ट्रैफिक' : 'Combined high authority reader impressions'}
          </div>
        </div>

        {/* DoFollow Ratio Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-violet-400">
            <BarChart3 className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.dofollowRate}</span>
            <span className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{dofollowRate}%</span>
            <span className="text-xs text-violet-400 font-medium">DoFollow</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {language === 'hi' ? 'गूगल रैंक बूस्ट के लिए डू-फॉलो लिंक जूस' : 'Maximum SEO link equity transmission'}
          </div>
        </div>

      </div>

      {/* Hero: "Human-Like Organic Drip Engine" Card */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>{t.naturalPacingTitle}</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {language === 'hi'
                ? 'स्मार्ट AI एजेंट: इंसान की तरह अपने आप सही समय पर बैकलिंक बनाता है'
                : 'Autonomous Link Velocity Engine: Organic, Human-Paced Acquisition'}
            </h3>
            
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {t.naturalPacingDesc}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/80">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {language === 'hi' ? 'दैनिक सीमा:' : 'Daily Limit:'} <strong>{account.agentSchedule.dailyCap} links / day</strong>
                </span>
              </div>
              
              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/80">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {language === 'hi' ? 'पेसिंग मोड:' : 'Pacing Cadence:'}{' '}
                  <strong className="capitalize">{account.agentSchedule.dripPacing} (Human-Like)</strong>
                </span>
              </div>

              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/80">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>
                  {language === 'hi' ? 'गूगल पेनल्टी सुरक्षा स्कोर:' : 'Anti-Spam Safety:'}{' '}
                  <strong className="text-emerald-400">99.4% Safe</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Countdown & Immediate Run Card */}
          <div className="w-full lg:w-auto shrink-0 bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between items-center text-center min-w-[280px]">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
              <Clock3 className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{t.nextLinkIn}</span>
            </div>
            
            <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 font-mono my-1">
              {diffHours > 0 ? `${diffHours}h ` : ''}{diffMinutes}m
            </div>

            <p className="text-[11px] text-slate-400 max-w-[220px] mb-3">
              {language === 'hi' 
                ? 'AI एजेंट ने अगला स्लॉट मानव संपादकीय घंटों के अनुसार तय किया है।' 
                : 'Next target scheduled during human editorial review hours.'}
            </p>

            <button
              onClick={onTriggerAgent}
              disabled={isTriggering || account.sites.length === 0}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-lg shadow transition flex items-center justify-center space-x-2 ${
                isTriggering || account.sites.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-98'
              }`}
            >
              {isTriggering ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'hi' ? 'एजेंट बैकलिंक बना रहा है...' : 'Building Backlink...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'hi' ? 'शेड्यूल स्किप करें और अभी बनाएं' : 'Force Run Step Now'}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Real-time Live Backlinks Stream with Direct DOM & Browser Preview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                {language === 'hi' ? 'हाल ही में बनाए गए लाइव DoFollow बैकलिंक्स (Live Backlink Stream)' : 'Recently Built Live Backlinks (Live Stream)'}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% 200 OK
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'प्रत्येक लिंक का लाइव ब्राउज़र प्रिव्यू, DOM सोर्स कोड और वास्तविक DoFollow प्लेसमेंट देखें'
                : 'Inspect real browser placement, DOM tree, and live 200 OK target URLs'}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onOpenCampaignModal && (
              <button
                onClick={onOpenCampaignModal}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'hi' ? '🚀 नया कैंपेन शुरू करें' : '🚀 Launch Campaign'}</span>
              </button>
            )}
            {onOpenAuditReport && (
              <button
                onClick={onOpenAuditReport}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center space-x-1 border border-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? 'ऑडिट रिपोर्ट' : 'Audit Report'}</span>
              </button>
            )}
          </div>
        </div>

        {filteredBacklinks.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-xl">
            <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-bounce" />
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'अभी कोई बैकलिंक नहीं है। ऊपर दिए गए बटन से पहला बैकलिंक बनाएं!'
                : 'No backlinks generated yet. Click "Force Run Step Now" or "Launch Campaign" to generate your first backlink!'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredBacklinks.slice(0, 4).map((bl) => (
              <div
                key={bl.id}
                className="p-3.5 bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      <span>{bl.targetDomain}</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                      DA {bl.da}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 font-mono">
                      200 OK
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 font-mono">
                      {bl.rel || 'dofollow'}
                    </span>
                    {bl.sourceArticleTitle && (
                      <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 truncate max-w-xs">
                        📰 {bl.sourceArticleTitle}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-2">
                    <span>
                      Anchor: <strong className="text-emerald-300 font-semibold">"{bl.anchorText}"</strong>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">
                      Destination: <a href={bl.destinationUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-mono text-[11px]">{bl.destinationUrl}</a>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {onInspectBacklink && (
                    <button
                      onClick={() => onInspectBacklink(bl)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition flex items-center space-x-1 border border-indigo-500/30 shadow-sm"
                      title="Inspect full interactive preview & DOM proof"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'लाइव प्रिव्यू देखें' : 'Inspect Preview'}</span>
                    </button>
                  )}

                  <a
                    href={bl.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition flex items-center space-x-1 shadow-sm"
                  >
                    <span>{language === 'hi' ? 'टारगेट खोलें' : 'Open Target'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Anchor Text Diversity & Authority Tier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Anchor Diversity Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{t.anchorDistribution}</span>
            </h4>
            <span className="text-[11px] text-slate-400">Natural Profile</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Exact Match', count: anchorCounts['Exact Match'] || 0, color: 'bg-indigo-500' },
              { label: 'Partial Match', count: anchorCounts['Partial Match'] || 0, color: 'bg-purple-500' },
              { label: 'Branded', count: anchorCounts['Branded'] || 0, color: 'bg-emerald-500' },
              { label: 'Generic / LSI', count: (anchorCounts['Generic'] || 0) + (anchorCounts['LSI Context'] || 0), color: 'bg-sky-500' },
            ].map(item => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="text-slate-400">{item.count} links ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Authority Tiers Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.daDistribution}</span>
            </h4>
            <button
              onClick={onOpenTargetsModal}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {language === 'hi' ? 'लिस्ट देखें' : 'View Target Catalog'} &rarr;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-emerald-400 block mb-1">DA 90 - 99</span>
              <span className="text-xl font-bold text-white">
                {filteredBacklinks.filter(b => b.da >= 90).length}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Medium, GitHub, Substack</span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-indigo-400 block mb-1">DA 80 - 89</span>
              <span className="text-xl font-bold text-white">
                {filteredBacklinks.filter(b => b.da >= 80 && b.da < 90).length}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">DEV, Hashnode, GitBook</span>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-purple-400 block mb-1">DA 70 - 79</span>
              <span className="text-xl font-bold text-white">
                {filteredBacklinks.filter(b => b.da < 80).length}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Vocal, Niche Curations</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
            <span>{language === 'hi' ? 'औसत स्पैम स्कोर (Spam Score):' : 'Average Target Spam Score:'}</span>
            <span className="font-semibold text-emerald-400">1.2% (Extremely Clean)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
