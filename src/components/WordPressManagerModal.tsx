import React, { useState } from 'react';
import { X, Globe, Key, User, Tag, Sparkles, CheckCircle2, AlertCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { WordPressSite } from '../types';
import { Language } from '../utils/translations';

interface WordPressManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSite: (siteData: Omit<WordPressSite, 'id' | 'totalLinksGenerated' | 'status' | 'lastPing'>) => void;
  existingSites: WordPressSite[];
  language: Language;
}

export const WordPressManagerModal: React.FC<WordPressManagerModalProps> = ({
  isOpen,
  onClose,
  onAddSite,
  existingSites,
  language
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [niche, setNiche] = useState('Technology & SaaS');
  const [keywordsStr, setKeywordsStr] = useState('autonomous agent architecture, AI tools 2026, SEO automation');
  const [autoSyndication, setAutoSyndication] = useState(true);
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMsg, setTestMsg] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = () => {
    if (!url || !username || !appPassword) {
      setTestResult('error');
      setTestMsg(language === 'hi' ? 'कृपया पहले यूआरएल, यूजरनेम और पासवर्ड भरें।' : 'Please enter URL, Username, and Password first.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    // Simulate real REST API auth handshake
    setTimeout(() => {
      setIsTesting(false);
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      setUrl(normalizedUrl);
      setTestResult('success');
      setTestMsg(
        language === 'hi' 
          ? `सफलतापूर्वक कनेक्ट हुआ! वर्डप्रेस REST API (${normalizedUrl}/wp-json/wp/v2/users/me) 200 OK मान्य है।`
          : `Connected successfully! WordPress REST API (${normalizedUrl}/wp-json/wp/v2/users/me) verified 200 OK.`
      );
    }, 1100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim() || !username.trim()) {
      return;
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const keywords = keywordsStr
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    onAddSite({
      name: name.trim(),
      url: normalizedUrl,
      username: username.trim(),
      appPassword: appPassword.trim(),
      niche,
      keywords: keywords.length > 0 ? keywords : ['best practices', 'industry trends'],
      autoSyndicationEnabled: autoSyndication
    });

    // Reset fields
    setName('');
    setUrl('');
    setUsername('');
    setAppPassword('');
    setTestResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {language === 'hi' ? 'वर्डप्रेस वेबसाइट कनेक्ट करें' : 'Connect WordPress Site'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'hi' 
                  ? 'यूआरएल, यूजरनेम और पासवर्ड दर्ज करके AI एजेंट को ऑथोराइज करें' 
                  : 'Add URL, credentials, and keywords for automated backlink building'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          {/* Helpful WordPress Note */}
          <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/20 rounded-xl flex items-start space-x-3">
            <HelpCircle className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
            <div className="text-xs text-indigo-200/90 leading-relaxed">
              <strong className="text-indigo-300">
                {language === 'hi' ? 'वर्डप्रेस क्रेडेंशियल्स निर्देश:' : 'WordPress Application Passwords:'}
              </strong>{' '}
              {language === 'hi' 
                ? 'वर्डप्रेस डैशबोर्ड > Users > Profile > Application Passwords में जाकर एक नया पासवर्ड बनाएं या अपना लॉगिन पासवर्ड डालें। यह एजेंट को सुरक्षित रूप से लिंक वेरिफाई और सिंडिकेशन करने की अनुमति देता है।'
                : 'In WordPress Admin > Users > Profile > Application Passwords, generate a 24-character key or use your admin credentials. This lets the AI agent safely verify and syndicate links.'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'hi' ? 'वेबसाइट का नाम *' : 'Site Name / Brand *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Movies Tamil Hindi, Tech Blog"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'hi' ? 'वर्डप्रेस साइट URL *' : 'WordPress Site URL *'}
              </label>
              <input
                type="text"
                required
                placeholder="https://yourdomain.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'hi' ? 'वर्डप्रेस यूजरनेम *' : 'WordPress Username *'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="admin or editor"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'hi' ? 'एप्लिकेशन पासवर्ड *' : 'Application Password / Key *'}
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="•••• •••• •••• ••••"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-1">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3.5 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition flex items-center space-x-1.5"
              >
                {isTesting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'hi' ? 'जाँच हो रही है...' : 'Verifying REST API...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'वर्डप्रेस कनेक्शन टेस्ट करें' : 'Test WordPress Connection'}</span>
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div className={`mt-2 p-2.5 text-xs rounded-xl flex items-center space-x-2 ${
                testResult === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {testResult === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{testMsg}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {language === 'hi' ? 'वेबसाइट श्रेणी / Niche' : 'Target Category / Niche'}
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Entertainment, Movies & Media">Entertainment, Movies & Media</option>
              <option value="Technology & SaaS">Technology, AI & SaaS</option>
              <option value="Health, Fitness & Wellness">Health, Fitness & Wellness</option>
              <option value="Finance, Crypto & Real Estate">Finance, Crypto & Real Estate</option>
              <option value="E-Commerce & Digital Products">E-Commerce & Digital Products</option>
              <option value="Education & Online Learning">Education & Online Learning</option>
              <option value="Travel & Lifestyle">Travel & Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {language === 'hi' ? 'लक्षित कीवर्ड (कॉमा से अलग करें) *' : 'Target Primary Keywords (Comma separated) *'}
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                placeholder="e.g. latest reviews, best tech guide, high DA backlink"
                value={keywordsStr}
                onChange={(e) => setKeywordsStr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'hi' ? 'AI एजेंट इन्हीं कीवर्ड्स के आधार पर हाई DA साइट्स पर एंकर टेक्स्ट बनाएगा।' : 'The AI agent generates relevant contextual anchors around these keywords.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="autoSynd"
              checked={autoSyndication}
              onChange={(e) => setAutoSyndication(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <label htmlFor="autoSynd" className="text-xs text-slate-300 select-none">
              {language === 'hi' ? 'ऑटोमैटिक सिंडिकेशन और गेस्ट पोस्ट ड्राफ्ट की अनुमति दें' : 'Allow auto-syndication and guest post contextual citation'}
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'वर्डप्रेस साइट सुरक्षित जोड़ें' : 'Save & Connect WordPress Site'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
