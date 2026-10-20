import React from 'react';
import { 
  Bot, 
  Globe, 
  Users, 
  PlusCircle, 
  Play, 
  Sparkles, 
  Languages, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { UserAccount, WordPressSite } from '../types';
import { Language, translations } from '../utils/translations';

interface NavbarProps {
  currentAccount: UserAccount;
  allAccounts: UserAccount[];
  selectedSite: WordPressSite | null;
  onSelectSite: (site: WordPressSite | null) => void;
  onOpenAuthModal: () => void;
  onOpenWordPressModal: () => void;
  onTriggerAgent: () => void;
  isTriggering: boolean;
  language: Language;
  onToggleLanguage: () => void;
  onOpenTargetsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAccount,
  selectedSite,
  onSelectSite,
  onOpenAuthModal,
  onOpenWordPressModal,
  onTriggerAgent,
  isTriggering,
  language,
  onToggleLanguage,
  onOpenTargetsModal
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 text-white font-bold">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">{t.brand}</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  Autonomous CRM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center: Active WordPress Site Switcher & Status */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-900/80 border border-slate-800/80 rounded-xl px-3 py-1.5">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-400 font-medium">{t.connectedSites}:</span>
            
            {currentAccount.sites.length > 0 ? (
              <div className="flex items-center space-x-2">
                <select
                  value={selectedSite?.id || ''}
                  onChange={(e) => {
                    const found = currentAccount.sites.find(s => s.id === e.target.value);
                    onSelectSite(found || null);
                  }}
                  className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                >
                  <option value="">{t.filterAllSites} ({currentAccount.sites.length})</option>
                  {currentAccount.sites.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.url.replace(/^https?:\/\//, '')})
                    </option>
                  ))}
                </select>
                <button
                  onClick={onOpenWordPressModal}
                  title={t.addSite}
                  className="text-xs text-indigo-400 hover:text-indigo-300 p-1 rounded hover:bg-slate-800 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenWordPressModal}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1"
              >
                <span>⚠️ {t.connectWordpress}</span>
              </button>
            )}
          </div>

          {/* Right Action Buttons & User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* High DA Targets Directory CTA */}
            <button
              onClick={onOpenTargetsModal}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.browseTargets}</span>
            </button>

            {/* Run AI Agent Step CTA */}
            <button
              onClick={onTriggerAgent}
              disabled={isTriggering || currentAccount.sites.length === 0}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md transition ${
                isTriggering || currentAccount.sites.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20 active:scale-95'
              }`}
            >
              {isTriggering ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Agent Working...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.triggerNow}</span>
                </>
              )}
            </button>

            {/* Connect WordPress Button */}
            <button
              onClick={onOpenWordPressModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{t.connectWordpress}</span>
              <span className="sm:hidden">WP</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              title="Toggle English / हिन्दी"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Account / CRM Switcher Button */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition group text-left"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-inner">
                {currentAccount.name.slice(0, 2)}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-200 group-hover:text-white leading-none">
                  {currentAccount.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[100px] leading-tight">
                  {currentAccount.organization || currentAccount.email}
                </p>
              </div>
              <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 ml-1" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
