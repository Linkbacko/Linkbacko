import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Globe, ExternalLink, ArrowRight, Check } from 'lucide-react';
import { HIGH_AUTHORITY_TARGETS } from '../data/mockInitialData';
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
  const [filterCategory, setFilterCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Editorial', 'Technology', 'Community', 'Profile'];

  const filtered = HIGH_AUTHORITY_TARGETS.filter(t => {
    if (filterCategory === 'All') return true;
    if (filterCategory === 'Editorial') return t.linkType === 'Editorial' || t.linkType === 'Guest Post';
    if (filterCategory === 'Technology') return t.category.includes('Technology') || t.category.includes('Tech');
    if (filterCategory === 'Community') return t.linkType === 'Community' || t.linkType === 'Resource List';
    if (filterCategory === 'Profile') return t.linkType === 'Profile' || t.linkType === 'Document';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'hi' ? 'टॉप हाई DA & PA अथॉरिटी वेबसाइट्स कैटलॉग' : 'High DA & PA Target Authority Network'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'hi' 
                  ? 'AI एजेंट द्वारा सत्यापित 50+ हाई अथॉरिटी डोमेन (DA 80 - 96+) जहां प्राकृतिक बैकलिंक्स बनाए जा सकते हैं' 
                  : 'Curated high domain authority publishers audited for safe, organic contextual backlink placements'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Filter:</span>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  filterCategory === c
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="text-xs text-emerald-400 font-medium hidden sm:block">
            {language === 'hi' ? '100% गूगल सुरक्षित और DoFollow' : '100% Penguin Safe • DoFollow Oriented'}
          </div>
        </div>

        {/* Targets Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          {filtered.map(target => (
            <div
              key={target.id}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{target.platformName}</h4>
                    <span className="text-xs text-indigo-400 font-mono">{target.domain}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      DA {target.da}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      PA {target.pa}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  {target.category} • Method: <span className="text-slate-200">{target.submissionMethod}</span>
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block">Traffic</span>
                    <span className="text-slate-200 font-semibold">{target.estMonthlyTraffic}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Spam Score</span>
                    <span className="text-emerald-400 font-semibold">{target.spamScore}% (Clean)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Safety Score</span>
                    <span className="text-indigo-400 font-semibold">{target.safetyScore}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Type: <strong className="text-white">{target.linkType}</strong>
                </span>
                <button
                  onClick={() => {
                    onSelectTargetForBuild(target);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center space-x-1.5"
                >
                  <span>{language === 'hi' ? 'यहाँ बैकलिंक बनाएं' : 'Target This Domain'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
