import React from 'react';
import { 
  Cpu, 
  Terminal, 
  Clock, 
  Sliders, 
  ShieldCheck, 
  Calendar, 
  SunMedium, 
  Sparkles, 
  RefreshCw,
  Info,
  TrendingUp
} from 'lucide-react';
import { UserAccount, AgentSchedule } from '../types';
import { Language, translations } from '../utils/translations';

interface AgentControlCenterProps {
  account: UserAccount;
  onUpdateSchedule: (schedule: Partial<AgentSchedule>) => void;
  language: Language;
}

export const AgentControlCenter: React.FC<AgentControlCenterProps> = ({
  account,
  onUpdateSchedule,
  language
}) => {
  const t = translations[language];
  const { agentSchedule, logs } = account;

  return (
    <div className="space-y-6">
      
      {/* Top Configuration & Human-Timing Settings */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'hi' ? 'AI एजेंट ऑटोनॉमस कंट्रोल सेंटर' : 'AI Agent Autonomous Control & Scheduler'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'hi' 
                  ? 'इंसान की तरह सुरक्षित लिंक गति, समय सीमा और टारगेट क्राइटेरिया कॉन्फ़िगर करें' 
                  : 'Configure human-like link velocity pacing, active daytime windows, and safety rules'}
              </p>
            </div>
          </div>

          {/* Autonomous Mode Toggle */}
          <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              {language === 'hi' ? 'ऑटोनॉमस मोड:' : 'Autonomous Mode:'}
            </span>
            <button
              onClick={() => onUpdateSchedule({ autonomousMode: !agentSchedule.autonomousMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                agentSchedule.autonomousMode ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  agentSchedule.autonomousMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${agentSchedule.autonomousMode ? 'text-emerald-400' : 'text-slate-500'}`}>
              {agentSchedule.autonomousMode ? (language === 'hi' ? 'सक्रिय' : 'ACTIVE') : (language === 'hi' ? 'बंद' : 'PAUSED')}
            </span>
          </div>
        </div>

        {/* Pacing Speed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          
          {/* Conservative Mode */}
          <div
            onClick={() => onUpdateSchedule({ dripPacing: 'conservative', minDelayHours: 24, maxDelayHours: 48, dailyCap: 1 })}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              agentSchedule.dripPacing === 'conservative'
                ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">
                {language === 'hi' ? '1. कंजर्वेटिव (अति-सुरक्षित)' : '1. Conservative (Ultra Safe)'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                1 link / 48h
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi' 
                ? 'बिल्कुल नई वेबसाइट्स (0-3 महीने पुरानी) के लिए सर्वश्रेष्ठ। पेनल्टी का 0% जोखिम।' 
                : 'Best for brand new domains (0-3 months old). 0% risk of search engine algorithmic scrutiny.'}
            </p>
          </div>

          {/* Natural Human Mode (Recommended) */}
          <div
            onClick={() => onUpdateSchedule({ dripPacing: 'natural', minDelayHours: 12, maxDelayHours: 24, dailyCap: 2 })}
            className={`p-4 rounded-xl border cursor-pointer transition relative ${
              agentSchedule.dripPacing === 'natural'
                ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full shadow">
              {language === 'hi' ? 'सिफारिश' : 'Recommended'}
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">
                {language === 'hi' ? '2. नेचुरल ह्यूमन (इंसान की तरह)' : '2. Natural Human Rhythm'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                1-2 links / 24h
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi' 
                ? 'रैंडम घंटों में दिन के समय बैकलिंक बनाता है। वास्तविक SEO लेखक की तरह स्थिर ऑर्गेनिक विकास।' 
                : 'Organic timing with natural hour jitter. Mimics active tech writers contributing contextual posts.'}
            </p>
          </div>

          {/* Accelerated Mode */}
          <div
            onClick={() => onUpdateSchedule({ dripPacing: 'accelerated', minDelayHours: 6, maxDelayHours: 12, dailyCap: 4 })}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              agentSchedule.dripPacing === 'accelerated'
                ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">
                {language === 'hi' ? '3. त्वरित विकास (Accelerated)' : '3. Accelerated Growth'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-medium">
                2-4 links / 24h
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi' 
                ? 'स्थापित वेबसाइट्स (DA 30+) के लिए जहां तेजी से अथॉरिटी स्केल करना हो।' 
                : 'Designed for established domains (DA 30+) ready for rapid topical authority expansion.'}
            </p>
          </div>

        </div>

        {/* Daily Target Volume & Google Safe Pacing */}
        <div className="mt-5 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hi' ? 'दैनिक बैकलिंक लक्ष्य (Daily Target Volume):' : 'Daily Link Target Volume (1 to 200 links/day):'}</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'रोज 100-200 बैकलिंक्स बनाने के लिए लक्ष्य चुनें। एजेंट मानवीय गति से समय अंतराल में विभाजित करके गूगल पॉलिसी का पालन करेगा।'
                  : 'Target 100-200 backlinks/day. Staggered algorithmically across daylight hours to maintain 100% Google SpamBrain compliance.'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                {agentSchedule.dailyCap || 2} {language === 'hi' ? 'लिंक्स / दिन' : 'links / day'}
              </span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[2, 10, 25, 50, 100, 200].map((cap) => (
              <button
                key={cap}
                type="button"
                onClick={() => onUpdateSchedule({ dailyCap: cap })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  agentSchedule.dailyCap === cap
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                }`}
              >
                {cap === 100 || cap === 200 ? `⚡ ${cap}/day (Scale)` : `${cap}/day`}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Controls: Minimum DA & Working Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-5 border-t border-slate-800/80">
          
          {/* Target Min DA Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hi' ? 'न्यूनतम डोमेन अथॉरिटी (DA फ़िल्टर):' : 'Minimum Target Authority (DA):'}</span>
              </label>
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                DA {agentSchedule.targetMinDA || 75}+
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={90}
              step={5}
              value={agentSchedule.targetMinDA || 75}
              onChange={(e) => onUpdateSchedule({ targetMinDA: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>DA 60 (Broader reach)</span>
              <span>DA 75 (High standard)</span>
              <span>DA 90 (Only Tech Giants)</span>
            </div>
          </div>

          {/* Active Working Window */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'सक्रिय संपादकीय घंटे (Daylight Window):' : 'Editorial Working Hours Window:'}</span>
            </label>
            <div className="flex items-center space-x-3 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>
                {language === 'hi' ? 'सक्रिय समय:' : 'Active hours:'}{' '}
                <strong className="text-white">09:00 AM — 07:00 PM</strong> (Local Time)
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <input
                type="checkbox"
                id="skipWk"
                checked={agentSchedule.avoidWeekends}
                onChange={(e) => onUpdateSchedule({ avoidWeekends: e.target.checked })}
                className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <label htmlFor="skipWk" className="cursor-pointer select-none">
                {language === 'hi' ? 'सप्ताहांत (शनिवार-रविवार) स्किप करें ताकि नेचुरल लगे' : 'Skip weekends to match standard editorial office shifts'}
              </label>
            </div>

            <div className="flex items-center space-x-2 text-xs text-indigo-300">
              <input
                type="checkbox"
                id="agentX2035"
                checked={agentSchedule.agentX2035Mode}
                onChange={(e) => onUpdateSchedule({ agentX2035Mode: e.target.checked })}
                className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-400 w-4 h-4"
              />
              <label htmlFor="agentX2035" className="cursor-pointer select-none font-semibold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {language === 'hi' 
                    ? '2035 बैकलिंक इंटेलिजेंस एजेंट X मोड (प्राइम डायरेक्टिव, 7-स्टेज क्वालिटी गेट व AI सर्च विजिबिलिटी)' 
                    : 'Agent X 2035 Mode (Prime Directive, 7-Stage Quality Gate & AI Answer Engine Indexing)'}
                </span>
              </label>
            </div>
          </div>

        </div>

      </div>

      {/* AI Agent Decision & Execution Terminal */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-mono">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>linkpulse-agent-v2.6 // stdout stream</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5" />
              ONLINE & LISTENING
            </span>
          </div>
        </div>

        {/* Terminal Logs Output */}
        <div className="p-5 font-mono text-xs space-y-3 max-h-[380px] overflow-y-auto bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-800">
          {logs.map((log) => {
            const time = new Date(log.timestamp).toLocaleTimeString();
            let badgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
            let label = 'INFO';

            if (log.level === 'decision') {
              badgeColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
              label = 'DECISION';
            } else if (log.level === 'success') {
              badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
              label = 'SUCCESS';
            } else if (log.level === 'warning') {
              badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              label = 'WARN';
            } else if (log.level === 'error') {
              badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
              label = 'ERROR';
            }

            return (
              <div key={log.id} className="leading-relaxed border-b border-slate-900/80 pb-2.5 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-slate-500 text-[11px]">[{time}]</span>
                  <span className={`px-1.5 py-0.2 rounded border text-[10px] font-semibold ${badgeColor}`}>
                    {label}
                  </span>
                  {log.targetDomain && (
                    <span className="text-slate-400 text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      @{log.targetDomain}
                    </span>
                  )}
                </div>
                <div className="text-slate-200 text-xs pl-2 border-l-2 border-slate-800">
                  {log.message}
                </div>
                {log.details && (
                  <div className="text-slate-400 text-[11px] pl-2 mt-1 italic font-sans">
                    {log.details}
                  </div>
                )}
              </div>
            );
          })}

          {logs.length === 0 && (
            <div className="text-slate-500 text-center py-8 font-sans">
              No execution events recorded yet. Trigger the AI agent to initiate autonomous link discovery.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
