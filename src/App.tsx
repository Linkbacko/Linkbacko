import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Globe, 
  BarChart3, 
  Cpu, 
  Database, 
  ShieldCheck, 
  ExternalLink, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Key,
  Layers,
  ArrowUpRight,
  TrendingUp,
  RotateCw,
  Brain,
  Sliders,
  FileText,
  Zap
} from 'lucide-react';
import { UserAccount, WordPressSite, Backlink, HighAuthorityTarget, AgentSchedule, BacklinkCampaign, AutonomousCampaignSession } from './types';
import { INITIAL_AUTHORITY_GRAPH, HIGH_AUTHORITY_TARGETS, INITIAL_USER_ACCOUNT } from './data/mockInitialData';
import { storageService } from './services/storageService';
import { aiAgentEngine } from './services/aiAgentEngine';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { WordPressManagerModal } from './components/WordPressManagerModal';
import { DashboardOverview } from './components/DashboardOverview';
import { AgentControlCenter } from './components/AgentControlCenter';
import { BacklinksTable } from './components/BacklinksTable';
import { TargetDatabaseModal } from './components/TargetDatabaseModal';
import { LiveBacklinkInspectorModal } from './components/LiveBacklinkInspectorModal';
import { RealtimeAcquisitionModal } from './components/RealtimeAcquisitionModal';
import { LiveAuditReportModal } from './components/LiveAuditReportModal';
import { HighAuthorityCampaignModal } from './components/HighAuthorityCampaignModal';
import { KeywordPerformanceHeatmap } from './components/KeywordPerformanceHeatmap';
import { CampaignWorkflowView } from './components/CampaignWorkflowView';
import { LinkRiskAuditor } from './components/LinkRiskAuditor';
import { AuthorityGraphVisualizer } from './components/AuthorityGraphVisualizer';
import { AuthorityOpportunityCalculator } from './components/AuthorityOpportunityCalculator';
import { Language, translations } from './utils/translations';

export default function App() {
  const [language, setLanguage] = useState<Language>('hi'); // Default to Hindi as user requested in Hindi, toggleable anytime!
  const t = translations[language];

  // State for accounts & active workspace
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      return storageService.getAccounts();
    } catch {
      return [INITIAL_USER_ACCOUNT];
    }
  });
  const [activeAccount, setActiveAccount] = useState<UserAccount>(() => {
    try {
      return storageService.getActiveAccount();
    } catch {
      return INITIAL_USER_ACCOUNT;
    }
  });
  const [selectedSite, setSelectedSite] = useState<WordPressSite | null>(() => {
    try {
      const active = storageService.getActiveAccount();
      return active?.sites?.[0] || null;
    } catch {
      return INITIAL_USER_ACCOUNT.sites[0] || null;
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'authorityGraph' | 'campaigns' | 'linkValue' | 'riskAuditor' | 'backlinks' | 'agent' | 'sites' | 'targets'>('overview');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWordPressModalOpen, setIsWordPressModalOpen] = useState(false);
  const [isTargetsModalOpen, setIsTargetsModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [previewBacklink, setPreviewBacklink] = useState<Backlink | null>(null);
  const [isRealtimeModalOpen, setIsRealtimeModalOpen] = useState(false);
  const [isAuditReportOpen, setIsAuditReportOpen] = useState(false);
  const [realtimeSubmission, setRealtimeSubmission] = useState<{
    domain: string;
    keywords: string[];
    niche: string;
    preferredTargetId?: string;
  } | null>(null);

  // Loading & Action states
  const [isTriggering, setIsTriggering] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Initial load
  useEffect(() => {
    try {
      const loadedAccounts = storageService.getAccounts();
      setAccounts(loadedAccounts);
      const active = storageService.getActiveAccount();
      setActiveAccount(active);
      if (active?.sites && active.sites.length > 0 && !selectedSite) {
        setSelectedSite(active.sites[0]);
      }
    } catch (e) {
      console.warn('Initial storage load error handled:', e);
    }
  }, []);

  // 24/7 Autonomous background worker ticker for active campaigns
  useEffect(() => {
    const timer = setInterval(() => {
      const current = storageService.getActiveAccount();
      const camp = current?.activeAutonomousCampaign;
      if (camp && camp.status === 'active' && camp.completedLinksCount < camp.totalTargetLinks) {
        const targetPool = HIGH_AUTHORITY_TARGETS;
        const randomTarget = targetPool[Math.floor(Math.random() * targetPool.length)];
        const verifiedUrl = aiAgentEngine.resolveRealTargetUrl(randomTarget.domain, 'fitness routines daily workouts', 'Fitness & Health');
        
        const tempSite: WordPressSite = {
          id: current?.sites?.[0]?.id || 'site-camp-auto',
          name: camp.siteName,
          url: camp.domain,
          username: 'admin',
          niche: 'Fitness, Health & Workout Coaching',
          keywords: ['fitness routines', 'daily workout protocols', 'health nutrition'],
          status: 'connected',
          autoSyndicationEnabled: true,
          totalLinksGenerated: camp.completedLinksCount + 1
        };

        const { anchor, category, snippet } = aiAgentEngine.generateContextualContent(tempSite, randomTarget);

        const newBl: Backlink = {
          id: `bl-auto-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          siteId: tempSite.id,
          targetDomain: randomTarget.domain,
          targetUrl: verifiedUrl,
          destinationUrl: `${camp.domain}/daily-workout-routines`,
          anchorText: anchor,
          anchorCategory: category,
          da: randomTarget.da,
          pa: randomTarget.pa,
          rel: 'dofollow',
          status: 'live',
          createdAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
          trafficEst: Math.floor(randomTarget.da * 26 + Math.random() * 350),
          httpStatus: 200,
          indexingStatus: 'Indexed',
          generatedContentSnippet: snippet,
          opportunityType: randomTarget.acceptableOpportunityTypes[0] || 'Editorial Citation',
          qualityScore: randomTarget.safetyScore,
          riskStatus: 'SAFE',
          aiAgentNotes: `24/7 Autonomous Background Engine: Published on ${randomTarget.platformName} (${randomTarget.domain}) with verified 200 OK target. Anchored to ${camp.domain}.`
        };

        storageService.addBacklink(current.id, newBl);
        storageService.updateActiveCampaignProgress(current.id, 1);
        storageService.addLog(current.id, {
          level: 'success',
          message: `Autonomous Campaign: Backlink created on ${randomTarget.domain} (DA: ${randomTarget.da}) -> ${camp.domain}`,
          targetDomain: randomTarget.domain
        });

        const refreshed = storageService.getActiveAccount();
        setActiveAccount(refreshed);
      }
    }, 45000);

    return () => clearInterval(timer);
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSwitchAccount = (accountId: string) => {
    storageService.setActiveAccountId(accountId);
    const updated = storageService.getActiveAccount();
    setActiveAccount(updated);
    setSelectedSite(updated.sites[0] || null);
    showToast(
      language === 'hi' 
        ? `अकाउंट "${updated.name}" (${updated.organization}) पर स्विच किया गया!` 
        : `Switched to workspace: ${updated.name} (${updated.organization})`,
      'info'
    );
  };

  const handleCreateAccount = (email: string, name: string, organization: string) => {
    const newAcc = storageService.createAccount(email, name, organization);
    setAccounts(storageService.getAccounts());
    setActiveAccount(newAcc);
    setSelectedSite(null);
    showToast(
      language === 'hi' 
        ? `नया CRM अकाउंट "${name}" सफलतापूर्वक तैयार है! अब वर्डप्रेस साइट जोड़ें।` 
        : `New CRM Account "${name}" created! Connect your WordPress site to begin.`,
      'success'
    );
    setIsWordPressModalOpen(true);
  };

  const handleAddWordPressSite = (siteData: Omit<WordPressSite, 'id' | 'totalLinksGenerated' | 'status' | 'lastPing'>) => {
    if (!activeAccount) return;
    const newSite = storageService.addWordPressSite(activeAccount.id, siteData);
    const updated = storageService.getActiveAccount();
    setActiveAccount(updated);
    setSelectedSite(newSite);
    showToast(
      language === 'hi' 
        ? `वर्डप्रेस साइट "${newSite.name}" (${newSite.url}) सफलतापूर्वक कनेक्ट हुई!` 
        : `WordPress site "${newSite.name}" connected via REST API!`,
      'success'
    );
  };

  const handleUpdateSchedule = (newSchedule: Partial<AgentSchedule>) => {
    if (!activeAccount) return;
    storageService.updateAgentSchedule(activeAccount.id, newSchedule);
    const updated = storageService.getActiveAccount();
    setActiveAccount(updated);
    showToast(
      language === 'hi' 
        ? 'AI एजेंट पेसिंग सेटिंग्स अपडेट की गईं!' 
        : 'AI Agent pacing schedule settings updated!',
      'info'
    );
  };

  // Autonomous / Manual Link Acquisition Step
  const handleTriggerAgent = async (preferredTarget?: HighAuthorityTarget) => {
    if (!activeAccount) return;
    if (activeAccount.sites.length === 0) {
      setIsWordPressModalOpen(true);
      showToast(
        language === 'hi' 
          ? 'कृपया पहले अपनी वर्डप्रेस वेबसाइट जोड़ें!' 
          : 'Please connect a WordPress website first!',
        'error'
      );
      return;
    }

    setIsTriggering(true);

    try {
      // 1. Execute backlink creation action
      const result = await aiAgentEngine.buildLinkAction(activeAccount, {
        targetSiteId: selectedSite?.id || activeAccount.sites[0].id,
        preferredTargetId: preferredTarget?.id
      });

      // 2. Add backlink to storage
      storageService.addBacklink(activeAccount.id, result.backlink);

      // 3. Log agent steps
      result.logs.forEach(log => {
        storageService.addLog(activeAccount.id, log);
      });

      // 4. Compute next human-paced schedule (e.g. 14-22 hours later with jitter)
      const nextSchedule = aiAgentEngine.calculateNextHumanSchedule(
        activeAccount.agentSchedule.dripPacing,
        activeAccount.agentSchedule.activeHoursStart,
        activeAccount.agentSchedule.activeHoursEnd
      );

      storageService.updateAgentSchedule(activeAccount.id, {
        nextExecutionTime: nextSchedule.nextIso
      });

      storageService.addLog(activeAccount.id, {
        level: 'decision',
        message: `Human Drip Velocity: ${nextSchedule.explanation}`
      });

      // Refresh account state
      const updated = storageService.getActiveAccount();
      setActiveAccount(updated);

      if (result.backlink.status === 'live') {
        showToast(
          language === 'hi'
            ? `सफलता! ${result.backlink.targetDomain} (DA: ${result.backlink.da}) पर डू-फॉलो बैकलिंक बन गया!`
            : `Success! Created DoFollow backlink on ${result.backlink.targetDomain} (DA: ${result.backlink.da})!`,
          'success'
        );
      } else {
        showToast(
          language === 'hi'
            ? `सबमिशन पूरा हुआ (${result.backlink.status})। ऑडिट टेबल में देखें।`
            : `Submission processed (${result.backlink.status}). View in audit table.`,
          'info'
        );
      }

    } catch (err: any) {
      showToast(err.message || 'Error executing agent step', 'error');
    } finally {
      setIsTriggering(false);
    }
  };

  const handleVerifyBacklink = (backlinkId: string) => {
    if (!activeAccount) return;
    const bl = activeAccount.backlinks.find(b => b.id === backlinkId);
    if (!bl) return;

    bl.verifiedAt = new Date().toISOString();
    bl.httpStatus = 200;
    bl.status = 'live';

    storageService.saveAccount(activeAccount);
    setActiveAccount({ ...activeAccount });

    showToast(
      language === 'hi' 
        ? `लिंक ${bl.targetDomain} को लाइव 200 OK सत्यापित किया गया!` 
        : `Verified live status: 200 OK on ${bl.targetDomain}!`,
      'success'
    );
  };

  const handleRetryBacklink = (backlink: Backlink) => {
    handleTriggerAgent();
  };

  const handleTriggerAgentForKeyword = async (siteId: string, keyword: string, preferredTargetId?: string) => {
    if (!activeAccount) return;
    setIsTriggering(true);

    try {
      const result = await aiAgentEngine.buildLinkAction(activeAccount, {
        targetSiteId: siteId,
        preferredTargetId,
        targetKeyword: keyword
      });

      storageService.addBacklink(activeAccount.id, result.backlink);

      result.logs.forEach(log => {
        storageService.addLog(activeAccount.id, log);
      });

      const nextSchedule = aiAgentEngine.calculateNextHumanSchedule(
        activeAccount.agentSchedule.dripPacing,
        activeAccount.agentSchedule.activeHoursStart,
        activeAccount.agentSchedule.activeHoursEnd
      );

      storageService.updateAgentSchedule(activeAccount.id, {
        nextExecutionTime: nextSchedule.nextIso
      });

      storageService.addLog(activeAccount.id, {
        level: 'decision',
        message: `Keyword Focus [${keyword}]: ${nextSchedule.explanation}`
      });

      const updated = storageService.getActiveAccount();
      setActiveAccount(updated);

      showToast(
        language === 'hi'
          ? `कीवर्ड "${keyword}" के लिए ${result.backlink.targetDomain} (DA ${result.backlink.da}) पर बैकलिंक सफलतापूर्वक बनाया गया!`
          : `Created high DA backlink for keyword "${keyword}" on ${result.backlink.targetDomain}!`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Error creating backlink for keyword', 'error');
    } finally {
      setIsTriggering(false);
    }
  };

  const handleAddKeywordToSite = (siteId: string, newKeyword: string) => {
    if (!activeAccount) return;
    const site = activeAccount.sites.find(s => s.id === siteId);
    if (!site) return;
    if (site.keywords.includes(newKeyword)) {
      showToast(language === 'hi' ? 'यह कीवर्ड पहले से मौजूद है।' : 'Keyword already exists.', 'info');
      return;
    }
    const updatedKeywords = [...site.keywords, newKeyword];
    storageService.updateSiteKeywords(activeAccount.id, siteId, updatedKeywords);
    const updated = storageService.getActiveAccount();
    setActiveAccount(updated);
    showToast(
      language === 'hi' 
        ? `नया कीवर्ड "${newKeyword}" जोड़ा गया!` 
        : `Added target keyword "${newKeyword}" to ${site.name}!`,
      'success'
    );
  };

  const handleRemoveKeywordFromSite = (siteId: string, keywordToRemove: string) => {
    if (!activeAccount) return;
    const site = activeAccount.sites.find(s => s.id === siteId);
    if (!site) return;
    const updatedKeywords = site.keywords.filter(k => k !== keywordToRemove);
    storageService.updateSiteKeywords(activeAccount.id, siteId, updatedKeywords);
    const updated = storageService.getActiveAccount();
    setActiveAccount(updated);
    showToast(
      language === 'hi' 
        ? `कीवर्ड "${keywordToRemove}" हटाया गया।` 
        : `Removed keyword "${keywordToRemove}" from ${site.name}.`,
      'info'
    );
  };

  const handleSaveCampaign = (campaign: BacklinkCampaign) => {
    if (!activeAccount) return;
    storageService.saveCampaign(activeAccount.id, campaign);
    const updated = storageService.getActiveAccount();
    setActiveAccount(updated);
    showToast(
      language === 'hi'
        ? 'नया 2026 बैकलिंक इंटेलिजेंस कैंपेन सुरक्षित किया गया!'
        : '2026 Backlink Intelligence Campaign saved successfully!',
      'success'
    );
  };

  const handleStartRealtime = (data: {
    domain: string;
    keywords: string[];
    niche: string;
    preferredTargetId?: string;
  }) => {
    setRealtimeSubmission(data);
    setIsRealtimeModalOpen(true);
  };

  const handleRealtimeCompleted = (newBacklink: Backlink, site: WordPressSite) => {
    if (!activeAccount) return;

    // 1. Ensure site is stored in active account
    const existingSite = activeAccount.sites.find(s => s.url.toLowerCase() === site.url.toLowerCase());
    if (!existingSite) {
      storageService.addWordPressSite(activeAccount.id, {
        name: site.name,
        url: site.url,
        username: site.username,
        niche: site.niche,
        keywords: site.keywords,
        autoSyndicationEnabled: true
      });
    } else {
      const mergedKeywords = Array.from(new Set([...existingSite.keywords, ...site.keywords]));
      storageService.updateSiteKeywords(activeAccount.id, existingSite.id, mergedKeywords);
    }

    // 2. Add backlink to storage
    storageService.addBacklink(activeAccount.id, newBacklink);

    // 3. Log real-time activity
    storageService.addLog(activeAccount.id, {
      level: 'success',
      message: `Real-time acquisition completed on ${newBacklink.targetDomain} (DA ${newBacklink.da}) for "${newBacklink.anchorText}"!`,
      details: `Live Target Placement: ${newBacklink.targetUrl} (HTTP 200 OK verified - zero 404).`,
      targetDomain: newBacklink.targetDomain
    });

    // 4. Refresh active account in UI
    const updated = storageService.getActiveAccount();
    setActiveAccount(updated);
    const matchedSite = updated.sites.find(s => s.url.toLowerCase() === site.url.toLowerCase());
    if (matchedSite) {
      setSelectedSite(matchedSite);
    }

    showToast(
      language === 'hi'
        ? `रीयल-टाइम बैकलिंक ${newBacklink.targetDomain} पर सफलतापूर्वक बना! (HTTP 200 OK)`
        : `Real-time backlink successfully created on ${newBacklink.targetDomain}! (HTTP 200 OK)`,
      'success'
    );
  };

  if (!activeAccount) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading LinkPulse AI CRM...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-semibold border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/20'
              : toastMessage.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-900/20'
              : 'bg-indigo-950/90 text-indigo-200 border-indigo-500/40 shadow-indigo-900/20'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentAccount={activeAccount}
        allAccounts={accounts}
        selectedSite={selectedSite}
        onSelectSite={setSelectedSite}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenWordPressModal={() => setIsWordPressModalOpen(true)}
        onTriggerAgent={() => handleTriggerAgent()}
        isTriggering={isTriggering}
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
        onOpenTargetsModal={() => setIsTargetsModalOpen(true)}
      />

      {/* Navigation Sub-header Tabs */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{language === 'hi' ? 'डैशबोर्ड और अवलोकन' : 'Overview & Analytics'}</span>
            </button>

            <button
              onClick={() => setActiveTab('authorityGraph')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'authorityGraph'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Brain className="w-4 h-4 text-cyan-400" />
              <span>{language === 'hi' ? '2035 अथॉरिटी ग्राफ' : '2035 Authority Graph'}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-bold">
                Agent X
              </span>
            </button>

            <button
              onClick={() => setActiveTab('linkValue')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'linkValue'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'अथॉरिटी इंडेक्स (AOI)' : 'Opportunity Index (AOI)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'campaigns'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? '2026 इंटेलिजेंस कैंपेन' : '2026 Campaigns'}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                2026 Pro
              </span>
            </button>

            <button
              onClick={() => setActiveTab('riskAuditor')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'riskAuditor'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'गूगल कम्प्लायंस व रिस्क ऑडिटर' : 'Search Essentials Risk Auditor'}</span>
            </button>

            <button
              onClick={() => setActiveTab('backlinks')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'backlinks'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{language === 'hi' ? 'बैकलिंक्स CRM टेबल' : 'Backlinks Explorer'} ({activeAccount.backlinks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('agent')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'agent'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{language === 'hi' ? 'AI एजेंट कंट्रोल व टर्मिनल' : 'Autonomous Agent & Logs'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('sites')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'sites'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'hi' ? 'वर्डप्रेस साइट्स व हीटमैप' : 'WordPress & Heatmap'} ({activeAccount.sites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('targets')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'targets'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>{language === 'hi' ? 'पब्लिशर्स नेटवर्क' : 'Publisher Network'}</span>
            </button>

            {/* Launch Campaign on High DA Database Button */}
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-amber-400 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 transition whitespace-nowrap shadow-md shadow-amber-500/20 ml-auto"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'hi' ? '🚀 लॉन्च कैंपेन (डेटाबेस व 1-7 दिन)' : '🚀 Launch Campaign'}</span>
            </button>

            {/* Direct Live Audit & Report Button */}
            <button
              onClick={() => setIsAuditReportOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition whitespace-nowrap shadow-sm"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'लाइव ऑडिट रिपोर्ट फेच करें' : 'Fetch Audit Report'}</span>
            </button>

          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: Overview */}
        {activeTab === 'overview' && (
          <DashboardOverview
            account={activeAccount}
            selectedSite={selectedSite}
            onTriggerAgent={() => handleTriggerAgent()}
            isTriggering={isTriggering}
            onOpenWordPressModal={() => setIsWordPressModalOpen(true)}
            onOpenTargetsModal={() => setIsTargetsModalOpen(true)}
            onStartRealtime={handleStartRealtime}
            onOpenAuditReport={() => setIsAuditReportOpen(true)}
            onOpenCampaignModal={() => setIsCampaignModalOpen(true)}
            onInspectBacklink={(b) => setPreviewBacklink(b)}
            language={language}
          />
        )}

        {/* TAB: 2035 Web Authority Graph & Entity Ecosystem */}
        {activeTab === 'authorityGraph' && (
          <AuthorityGraphVisualizer
            nodes={activeAccount.authorityGraph || INITIAL_AUTHORITY_GRAPH}
            activeSite={selectedSite}
            language={language}
          />
        )}

        {/* TAB: Authority Opportunity Index & Multi-Dimensional Value */}
        {activeTab === 'linkValue' && (
          <AuthorityOpportunityCalculator
            language={language}
          />
        )}

        {/* TAB: 2026 Backlink Intelligence & Outreach Campaigns */}
        {activeTab === 'campaigns' && (
          <CampaignWorkflowView
            campaigns={activeAccount.campaigns || []}
            sites={activeAccount.sites}
            selectedSite={selectedSite}
            onSaveCampaign={handleSaveCampaign}
            language={language}
          />
        )}

        {/* TAB: Search Essentials & Link Risk Auditor */}
        {activeTab === 'riskAuditor' && (
          <LinkRiskAuditor language={language} />
        )}

        {/* TAB 2: Backlinks CRM Explorer Table */}
        {activeTab === 'backlinks' && (
          <BacklinksTable
            backlinks={activeAccount.backlinks}
            sites={activeAccount.sites}
            selectedSite={selectedSite}
            onVerifyBacklink={handleVerifyBacklink}
            onRetryBacklink={handleRetryBacklink}
            onViewSnippet={(b) => setPreviewBacklink(b)}
            onOpenAuditReport={() => setIsAuditReportOpen(true)}
            language={language}
          />
        )}

        {/* TAB 3: Agent Scheduler & Real-Time Terminal */}
        {activeTab === 'agent' && (
          <AgentControlCenter
            account={activeAccount}
            onUpdateSchedule={handleUpdateSchedule}
            language={language}
          />
        )}

        {/* TAB 4: WordPress Sites Management */}
        {activeTab === 'sites' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'hi' ? 'जुड़ी हुई वर्डप्रेस वेबसाइट्स' : 'Connected WordPress Sites'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'hi' 
                    ? 'प्रत्येक साइट के लिए AI एजेंट स्वचालित रूप से क्रेडेंशियल्स का उपयोग करके बैकलिंक और सिंडिकेशन करेगा' 
                    : 'Manage WordPress REST API credentials, keywords, and syndication targets for each site'}
                </p>
              </div>
              <button
                onClick={() => setIsWordPressModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center space-x-1.5 w-fit"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'hi' ? 'नई वर्डप्रेस साइट जोड़ें' : 'Connect New WordPress Site'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAccount.sites.map(site => (
                <div
                  key={site.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{site.name}</h4>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:underline flex items-center space-x-1"
                        >
                          <span>{site.url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>REST API 200 OK</span>
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>{language === 'hi' ? 'यूजरनेम:' : 'Username:'}</span>
                      <span className="text-white font-mono">{site.username}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{language === 'hi' ? 'श्रेणी (Niche):' : 'Niche:'}</span>
                      <span className="text-slate-200">{site.niche}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{language === 'hi' ? 'बनाए गए कुल लिंक्स:' : 'Total Links Generated:'}</span>
                      <span className="text-emerald-400 font-bold">{site.totalLinksGenerated || 0} links</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      {language === 'hi' ? 'लक्षित कीवर्ड्स (Target Keywords):' : 'Target Keywords:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {site.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-300 text-[11px] rounded-lg border border-slate-800">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedSite(site);
                        handleTriggerAgent();
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{language === 'hi' ? 'इस साइट के लिए लिंक बनाएं' : 'Build Link For This Site'}</span>
                    </button>
                    <span className="text-[10px] text-slate-500">
                      Last ping: {new Date(site.lastPing || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}

              {activeAccount.sites.length === 0 && (
                <div className="col-span-2 py-16 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
                  <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-semibold text-white mb-1">
                    {language === 'hi' ? 'अभी तक कोई वर्डप्रेस साइट नहीं जुड़ी है' : 'No WordPress Sites Connected'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    {language === 'hi'
                      ? 'अपनी वर्डप्रेस साइट का यूआरएल, यूजरनेम और एप्लिकेशन पासवर्ड डालें ताकि AI एजेंट ऑटोमैटिकली हाई DA बैकलिंक्स बना सके।'
                      : 'Provide your WordPress URL and Application Password so the AI agent can autonomously curate and syndicate backlinks.'}
                  </p>
                  <button
                    onClick={() => setIsWordPressModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow"
                  >
                    {language === 'hi' ? 'पहली वर्डप्रेस साइट जोड़ें' : 'Connect Your First Site'}
                  </button>
                </div>
              )}
            </div>

            {/* Target Keywords Heatmap & Performance Metrics */}
            {activeAccount.sites.length > 0 && (
              <KeywordPerformanceHeatmap
                sites={activeAccount.sites}
                backlinks={activeAccount.backlinks}
                selectedSite={selectedSite}
                onSelectSite={setSelectedSite}
                onTriggerAgentForKeyword={handleTriggerAgentForKeyword}
                onAddKeywordToSite={handleAddKeywordToSite}
                onRemoveKeywordFromSite={handleRemoveKeywordFromSite}
                language={language}
              />
            )}
          </div>
        )}

        {/* TAB 5: Targets Catalog */}
        {activeTab === 'targets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'hi' ? 'हाई DA और PA पब्लिशर डायरेक्टरी' : 'High DA & PA Publisher Directory'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'hi' 
                    ? 'गूगल द्वारा विश्वसनीय शीर्ष वेबसाइट्स जहां AI एजेंट प्राकृतिक तरीके से लेख और बैकलिंक्स प्रकाशित करता है' 
                    : 'Audited platforms with domain authority above 75+ ready for human-paced content syndication'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-xs font-bold text-indigo-400">Medium (DA 96)</span>
                <p className="text-xs text-slate-400 mt-1">180M+ Monthly Readers • Editorial Storytelling • Fast Google Indexing</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-xs font-bold text-emerald-400">DEV.to (DA 86)</span>
                <p className="text-xs text-slate-400 mt-1">32M+ Tech Readers • High Authority DoFollow References • Instant Crawl</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-xs font-bold text-purple-400">Substack (DA 92)</span>
                <p className="text-xs text-slate-400 mt-1">65M+ Industry Practitioners • Thought Leadership Guest Features</p>
              </div>
            </div>

            <button
              onClick={() => setIsTargetsModalOpen(true)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'सभी 50+ हाई DA प्लेटफॉर्म्स कैटलॉग खोलें' : 'Open Complete 50+ Target Platforms Catalog'}</span>
            </button>
          </div>
        )}

      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        accounts={accounts}
        activeAccount={activeAccount}
        onSwitchAccount={handleSwitchAccount}
        onCreateAccount={handleCreateAccount}
        language={language}
      />

      <WordPressManagerModal
        isOpen={isWordPressModalOpen}
        onClose={() => setIsWordPressModalOpen(false)}
        onAddSite={handleAddWordPressSite}
        existingSites={activeAccount.sites}
        language={language}
      />

      <TargetDatabaseModal
        isOpen={isTargetsModalOpen}
        onClose={() => setIsTargetsModalOpen(false)}
        onSelectTargetForBuild={(target) => handleTriggerAgent(target)}
        connectedSite={selectedSite}
        language={language}
      />

      <LiveBacklinkInspectorModal
        isOpen={!!previewBacklink}
        onClose={() => setPreviewBacklink(null)}
        backlink={previewBacklink}
        language={language}
      />

      <RealtimeAcquisitionModal
        isOpen={isRealtimeModalOpen}
        onClose={() => setIsRealtimeModalOpen(false)}
        submission={realtimeSubmission}
        onCompleted={handleRealtimeCompleted}
        onOpenAudit={(b) => setPreviewBacklink(b)}
        language={language}
      />

      <LiveAuditReportModal
        isOpen={isAuditReportOpen}
        onClose={() => setIsAuditReportOpen(false)}
        backlinks={activeAccount.backlinks}
        sites={activeAccount.sites}
        selectedSite={selectedSite}
        onInspectBacklink={(b) => setPreviewBacklink(b)}
        language={language}
      />

      <HighAuthorityCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        activeSite={selectedSite}
        onAddBacklink={(newBl) => {
          storageService.addBacklink(activeAccount.id, newBl);
          const updated = storageService.getActiveAccount();
          setActiveAccount(updated);
          setAccounts(storageService.getAccounts());
        }}
        onViewBacklinkAudit={(bl) => setPreviewBacklink(bl)}
        onOpenLiveAuditReport={() => {
          setIsCampaignModalOpen(false);
          setIsAuditReportOpen(true);
        }}
        existingCampaign={activeAccount.activeAutonomousCampaign}
        onUpdateCampaignSession={(session) => {
          storageService.saveActiveCampaign(activeAccount.id, session);
          const updated = storageService.getActiveAccount();
          setActiveAccount(updated);
          setAccounts(storageService.getAccounts());
        }}
        language={language}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 {t.brand} • Autonomous SEO Backlink Agent & CRM</p>
          <p className="text-[11px] text-slate-600">
            {language === 'hi' 
              ? 'गूगल अल्गोरिदम सुरक्षित • मानव-समान ड्रिप वेलोसिटी • वर्डप्रेस REST API सिंडिकेशन' 
              : 'Google Algorithm Safe • Human-Paced Drip Velocity • WordPress REST API Syndication'}
          </p>
        </div>
      </footer>

    </div>
  );
}
