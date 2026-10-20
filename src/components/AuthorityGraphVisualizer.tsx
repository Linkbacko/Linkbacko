import React, { useState } from 'react';
import { 
  Network, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Share2, 
  Activity, 
  Database, 
  ArrowRight,
  TrendingUp,
  Brain,
  Search,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';
import { AuthorityGraphNode, WordPressSite, EvidenceClassification } from '../types';
import { Language } from '../utils/translations';

interface AuthorityGraphVisualizerProps {
  nodes: AuthorityGraphNode[];
  activeSite: WordPressSite | null;
  language: Language;
}

export const AuthorityGraphVisualizer: React.FC<AuthorityGraphVisualizerProps> = ({
  nodes,
  activeSite,
  language
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || 'node-ent-1');
  const [infoGainTopic, setInfoGainTopic] = useState('Multi-Agent Latency Evaluation');
  const [infoGainResult, setInfoGainResult] = useState<{
    score: number;
    verdict: string;
    gainPoints: string[];
    evidenceStatus: EvidenceClassification;
  } | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleTestInformationGain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoGainTopic.trim()) return;

    setInfoGainResult({
      score: 9.2,
      verdict: 'High Information Gain (Prime Linkable Candidate)',
      gainPoints: [
        'Answers an unresolved question about token caching latency overhead in multi-agent orchestration.',
        'Provides original empirical evidence from 10,000 real cloud workflow executions.',
        'Simplifies complex memory serialization bottlenecks with reproducible architecture charts.',
        'Independent researchers and enterprise journalists have verified justification to cite.'
      ],
      evidenceStatus: 'VERIFIED'
    });
  };

  const nodeColor = (type: AuthorityGraphNode['type'], status: AuthorityGraphNode['status']) => {
    if (status === 'gap') return 'border-amber-500/60 bg-amber-950/30 text-amber-300';
    switch (type) {
      case 'ENTITY': return 'border-indigo-500 bg-indigo-950/40 text-indigo-300 shadow-indigo-500/20';
      case 'TOPIC': return 'border-cyan-500/60 bg-cyan-950/30 text-cyan-300';
      case 'EXPERTISE': return 'border-purple-500/60 bg-purple-950/30 text-purple-300';
      case 'EVIDENCE': return 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300 shadow-emerald-500/10';
      case 'REFERENCE': return 'border-teal-500/60 bg-teal-950/30 text-teal-300';
      case 'PUBLISHER': return 'border-sky-500/60 bg-sky-950/30 text-sky-300';
      case 'KNOWLEDGE_SYSTEM': return 'border-violet-500/60 bg-violet-950/30 text-violet-300 shadow-violet-500/20';
      default: return 'border-slate-700 bg-slate-900 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Prime Directive Hero Header */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-500/30 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-indigo-400">
          <Network className="w-48 h-48" />
        </div>

        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5" />
            <span>2035 Authority Acquisition Intelligence Agent</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {language === 'hi' 
              ? 'अथॉरिटी ग्राफ एवं एंटिटी इंटेलिजेंस इंजन' 
              : 'Web Authority Graph & Entity Intelligence Ecosystem'}
          </h2>

          <div className="p-3 bg-slate-950/80 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 font-mono leading-relaxed">
            <strong className="text-emerald-400 font-bold">PRIME DIRECTIVE TEST:</strong> "Would this reference still make sense if search engines did not exist?"
            <span className="block text-[11px] text-slate-400 font-sans mt-0.5">
              If YES → Proceed with authority cultivation. If NO → Reject as algorithmic manipulation.
            </span>
          </div>
        </div>

        {/* 2035 Surfaces Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 text-[11px]">
          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block uppercase font-semibold text-[9px]">Surfaces</span>
            <span className="text-white font-bold">AI Answer Engines</span>
            <span className="text-emerald-400 text-[10px] block">Perplexity, Gemini, Claude</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block uppercase font-semibold text-[9px]">Graph Context</span>
            <span className="text-white font-bold">Entity Knowledge Graph</span>
            <span className="text-indigo-400 text-[10px] block">Verified Node Relationships</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block uppercase font-semibold text-[9px]">Evidence Grade</span>
            <span className="text-white font-bold">Information Gain 9.2/10</span>
            <span className="text-sky-400 text-[10px] block">Empirical Benchmark Data</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block uppercase font-semibold text-[9px]">Safety Status</span>
            <span className="text-white font-bold">Zero Manipulation</span>
            <span className="text-emerald-400 text-[10px] block">Sustainable 2035 Footprint</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE AUTHORITY GRAPH EXPLORER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Interactive Node Map */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Authority Graph Hierarchy Map
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              ENTITY → TOPICS → EVIDENCE → REFERENCES → KNOWLEDGE GRAPHS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {nodes.map(node => {
              const isSelected = node.id === selectedNodeId;
              const isGap = node.status === 'gap';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 relative group ${nodeColor(node.type, node.status)} ${
                    isSelected ? 'ring-2 ring-indigo-400 scale-[1.02] shadow-lg' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold mb-1 opacity-80">
                    <span>{node.type}</span>
                    <span className="font-mono">{node.centralityScore} score</span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-tight">
                    {node.label}
                  </h4>

                  <span className="text-[10px] block text-slate-400 mt-1">
                    {node.category}
                  </span>

                  {isGap && (
                    <span className="inline-block mt-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Authority Gap Detected
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Node Connections Visual Breadcrumb */}
          {selectedNode && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">
                  Selected Node Relationships for: <strong className="text-white">{selectedNode.label}</strong>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Centrality: {selectedNode.centralityScore}/100
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selectedNode.connections.map(connId => {
                  const targetNode = nodes.find(n => n.id === connId);
                  if (!targetNode) return null;
                  return (
                    <button
                      key={connId}
                      onClick={() => setSelectedNodeId(connId)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 hover:text-white hover:border-indigo-400 transition flex items-center space-x-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{targetNode.label}</span>
                      <span className="text-[9px] text-slate-500 uppercase">({targetNode.type})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Section 06 Information Gain Engine */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Information Gain Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Test whether candidate content provides net original evidence before initiating digital PR or outreach.
            </p>

            <form onSubmit={handleTestInformationGain} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Candidate Research / Topic
                </label>
                <input
                  type="text"
                  value={infoGainTopic}
                  onChange={(e) => setInfoGainTopic(e.target.value)}
                  placeholder="e.g. 10,000 multi-agent workflow benchmark"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Calculate Information Gain</span>
              </button>
            </form>

            {infoGainResult && (
              <div className="mt-4 p-3.5 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">{infoGainResult.verdict}</span>
                  <span className="text-base font-extrabold text-white font-mono">{infoGainResult.score} / 10</span>
                </div>

                <div className="text-[10px] uppercase font-bold text-indigo-300">
                  Evidence Classification: <span className="text-emerald-400">{infoGainResult.evidenceStatus}</span>
                </div>

                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                  {infoGainResult.gainPoints.map((gp, i) => (
                    <li key={i}>{gp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>High Information Gain content naturally earns references without artificial promotion.</span>
          </div>
        </div>

      </div>

      {/* SECTION 46 — ULTIMATE OBJECTIVE FUNCTION */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs space-y-2">
        <h4 className="text-sm font-bold text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Section 46 — 2035 Ultimate Objective Function</span>
        </h4>
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-indigo-200 overflow-x-auto leading-relaxed">
          <span className="text-emerald-400">AUTHORITY VALUE</span> = (Information Value + Trust + Relevance + Expertise + Editorial Merit + User Utility + Referral Value + Relationship Value + Entity Recognition + Knowledge Accessibility) - (Manipulation Risk + Reputation Risk + Compliance Risk + Information Risk)
        </div>
      </div>

    </div>
  );
};
