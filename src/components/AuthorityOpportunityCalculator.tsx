import React, { useState } from 'react';
import { 
  Calculator, 
  Sliders, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { AuthorityOpportunityIndex } from '../types';
import { Language } from '../utils/translations';

interface AuthorityOpportunityCalculatorProps {
  language: Language;
}

export const AuthorityOpportunityCalculator: React.FC<AuthorityOpportunityCalculatorProps> = ({ language }) => {
  // Section 14 Inputs
  const [relevance, setRelevance] = useState(19); // 0-20
  const [editorialContext, setEditorialContext] = useState(18); // 0-20
  const [audienceOverlap, setAudienceOverlap] = useState(14); // 0-15
  const [informationValue, setInformationValue] = useState(14); // 0-15
  const [referralPotential, setReferralPotential] = useState(8); // 0-10
  const [publisherQuality, setPublisherQuality] = useState(9); // 0-10
  const [relationshipPotential, setRelationshipPotential] = useState(4); // 0-5
  const [brandTrust, setBrandTrust] = useState(4); // 0-5
  const [manipulationRisk, setManipulationRisk] = useState(0); // 0 to 25 (deduction)

  // Section 17 Negative Pattern Flags
  const [hasPbnSignal, setHasPbnSignal] = useState(false);
  const [hasUnnaturalAnchors, setHasUnnaturalAnchors] = useState(false);
  const [hasAutomatedSite, setHasAutomatedSite] = useState(false);
  const [hasCommentSpam, setHasCommentSpam] = useState(false);

  // Calculate total score
  const totalDeduction = manipulationRisk + (hasPbnSignal ? 25 : 0) + (hasUnnaturalAnchors ? 15 : 0) + (hasAutomatedSite ? 20 : 0) + (hasCommentSpam ? 20 : 0);
  const grossScore = relevance + editorialContext + audienceOverlap + informationValue + referralPotential + publisherQuality + relationshipPotential + brandTrust;
  const netScore = Math.max(0, Math.min(100, grossScore - totalDeduction));

  let tierLabel: AuthorityOpportunityIndex['tier'] = 'Prime Authority (85-100)';
  let tierBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (netScore >= 85) {
    tierLabel = 'Prime Authority (85-100)';
    tierBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (netScore >= 70) {
    tierLabel = 'Strong Contributor (70-84)';
    tierBadge = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  } else if (netScore >= 50) {
    tierLabel = 'Contextual Value (50-69)';
    tierBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else {
    tierLabel = 'Sub-threshold (<50)';
    tierBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  }

  const isHighRisk = totalDeduction >= 20 || hasPbnSignal || hasCommentSpam;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <span>Section 14 & 17 — Multidimensional Link Value & Risk Model</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Never reduce link value to a single 3rd-party metric. Evaluate 9 dimensions of authority, context, and negative pattern detection.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Authority Opportunity Index</span>
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">
              {netScore} / 100
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border block mt-1 ${tierBadge}`}>
              {tierLabel}
            </span>
          </div>
        </div>

        {/* Warning if High Risk */}
        {isHighRisk && (
          <div className="mt-4 p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="text-rose-400">Section 17 Risk = HIGH:</strong> Negative link pattern detected (PBN, automated synthetic footprint, or comment spam). Candidate must be excluded from acquisition recommendations.
            </div>
          </div>
        )}

        {/* Dimension Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          
          {/* Dimension 1: Relevance */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-300">1. Topical & Entity Relevance (0-20)</span>
              <span className="text-emerald-400 font-mono">{relevance} / 20</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={relevance}
              onChange={(e) => setRelevance(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Dimension 2: Editorial Context */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-300">2. Editorial Context & Citation Need (0-20)</span>
              <span className="text-emerald-400 font-mono">{editorialContext} / 20</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={editorialContext}
              onChange={(e) => setEditorialContext(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Dimension 3: Audience Overlap */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-300">3. Audience Overlap & Reader Fit (0-15)</span>
              <span className="text-indigo-400 font-mono">{audienceOverlap} / 15</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              value={audienceOverlap}
              onChange={(e) => setAudienceOverlap(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Dimension 4: Information Value */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-300">4. Information Value & Gain (0-15)</span>
              <span className="text-indigo-400 font-mono">{informationValue} / 15</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              value={informationValue}
              onChange={(e) => setInformationValue(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Dimension 5: Referral Potential */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-300">5. Referral Potential & Direct Clicks (0-10)</span>
              <span className="text-sky-400 font-mono">{referralPotential} / 10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={referralPotential}
              onChange={(e) => setReferralPotential(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Dimension 6: Publisher Quality */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-300">6. Publisher Quality & Standards (0-10)</span>
              <span className="text-sky-400 font-mono">{publisherQuality} / 10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={publisherQuality}
              onChange={(e) => setPublisherQuality(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Dimension 7: Relationship Potential */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-300">7. Relationship Potential (0-5)</span>
              <span className="text-purple-400 font-mono">{relationshipPotential} / 5</span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              value={relationshipPotential}
              onChange={(e) => setRelationshipPotential(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Dimension 8: Brand Trust */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-300">8. Brand Trust Contribution (0-5)</span>
              <span className="text-purple-400 font-mono">{brandTrust} / 5</span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              value={brandTrust}
              onChange={(e) => setBrandTrust(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

        </div>

        {/* SECTION 17: NEGATIVE PATTERN CHECKBOXES */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Section 17 — Negative Link Pattern Detection Checks</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-300">
            <label className="flex items-center space-x-2 p-2 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={hasPbnSignal}
                onChange={(e) => setHasPbnSignal(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-rose-500"
              />
              <span className={hasPbnSignal ? 'text-rose-400 font-semibold' : ''}>PBN / Link Farm Signal (-25)</span>
            </label>

            <label className="flex items-center space-x-2 p-2 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={hasUnnaturalAnchors}
                onChange={(e) => setHasUnnaturalAnchors(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-rose-500"
              />
              <span className={hasUnnaturalAnchors ? 'text-rose-400 font-semibold' : ''}>Unnatural Anchor Concentration (-15)</span>
            </label>

            <label className="flex items-center space-x-2 p-2 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={hasAutomatedSite}
                onChange={(e) => setHasAutomatedSite(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-rose-500"
              />
              <span className={hasAutomatedSite ? 'text-rose-400 font-semibold' : ''}>Automated / Low-Value AI (-20)</span>
            </label>

            <label className="flex items-center space-x-2 p-2 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={hasCommentSpam}
                onChange={(e) => setHasCommentSpam(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-rose-500"
              />
              <span className={hasCommentSpam ? 'text-rose-400 font-semibold' : ''}>Forum / Comment Spam (-20)</span>
            </label>
          </div>
        </div>

      </div>

    </div>
  );
};
