import React, { useState } from 'react';
import { X, UserPlus, Check, Lock, Mail, Building, User, LogIn, Sparkles } from 'lucide-react';
import { UserAccount } from '../types';
import { Language } from '../utils/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  activeAccount: UserAccount;
  onSwitchAccount: (accountId: string) => void;
  onCreateAccount: (email: string, name: string, organization: string) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  accounts,
  activeAccount,
  onSwitchAccount,
  onCreateAccount,
  language
}) => {
  const [mode, setMode] = useState<'switch' | 'create'>('switch');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmitNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill in all required fields.');
      return;
    }
    setError('');
    onCreateAccount(email.trim(), name.trim(), organization.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {language === 'hi' ? 'CRM मल्टी-अकाउंट मैनेजर' : 'Multi-Account CRM Manager'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'hi' ? 'क्लाइंट और वेबसाइट्स के लिए अलग-अलग अकाउंट्स' : 'Manage separate client profiles & backlink workspaces'}
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

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1.5 mx-6 mt-4 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('switch')}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'switch'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? 'अकाउंट चुनें' : 'Existing Accounts'} ({accounts.length})
          </button>
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'create'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + {language === 'hi' ? 'नया यूजर साइन अप' : 'Sign Up New User'}
          </button>
        </div>

        {/* Tab 1: Existing Accounts list */}
        {mode === 'switch' && (
          <div className="p-6 space-y-3 max-h-[380px] overflow-y-auto">
            <p className="text-xs text-slate-400 mb-2">
              {language === 'hi'
                ? 'जिस अकाउंट का बैकलिंक डेटा व सेटिंग्स देखना चाहते हैं, उस पर क्लिक करें:'
                : 'Select an account to load its autonomous backlink engine, WordPress sites, and CRM logs:'}
            </p>

            {accounts.map(acc => {
              const isActive = acc.id === activeAccount.id;
              return (
                <div
                  key={acc.id}
                  onClick={() => {
                    onSwitchAccount(acc.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    isActive
                      ? 'border-indigo-500/50 bg-indigo-500/10 shadow-sm shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {acc.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-white">{acc.name}</span>
                        {isActive && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                            {language === 'hi' ? 'सक्रिय' : 'Active'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {acc.organization || acc.email} • {acc.sites.length} {language === 'hi' ? 'वेबसाइट्स' : 'Sites'} • {acc.backlinks.length} {language === 'hi' ? 'लिंक्स' : 'Links'}
                      </p>
                    </div>
                  </div>
                  {isActive && <Check className="w-5 h-5 text-indigo-400" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Create / Sign Up New Account */}
        {mode === 'create' && (
          <form onSubmit={handleSubmitNewAccount} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'hi' ? 'ईमेल एड्रेस *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="client@growthbrand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'hi' ? 'अकाउंट पासवर्ड *' : 'Password *'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'hi' ? 'एजेंसी या ब्रांड नाम' : 'Organization / Agency / Brand Name'}
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Acme Media Corp"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'अकाउंट बनाएं और शुरू करें' : 'Create Account & Open Workspace'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
