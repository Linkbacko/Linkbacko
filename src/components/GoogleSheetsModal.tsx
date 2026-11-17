import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  RotateCw, 
  Download, 
  LogOut, 
  User as UserIcon,
  Globe,
  Database
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Backlink } from '../types';
import { Language } from '../utils/translations';
import { googleSheetsService, GoogleSheetsExportResult } from '../services/googleSheetsService';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backlinks: Backlink[];
  language: Language;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  backlinks,
  language
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<GoogleSheetsExportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = googleSheetsService.initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      const res = await googleSheetsService.signInWithGoogle();
      setCurrentUser(res.user);
    } catch (err: any) {
      console.error('Google Sign in failed:', err);
      setErrorMessage(err.message || 'Failed to authenticate with Google.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSheetsService.logout();
      setCurrentUser(null);
      setExportResult(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    try {
      const result = await googleSheetsService.exportBacklinksToSheet(backlinks);
      setExportResult(result);
    } catch (err: any) {
      console.error('Export error:', err);
      setErrorMessage(err.message || 'Failed to export backlinks to Google Sheets.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  {language === 'hi' ? 'गूगल शीट्स एक्सपोर्ट व लाइव सिंक' : 'Google Sheets Export & Real-Time Sync'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'hi' 
                  ? 'fitnesstoday.us के सभी लाइव बैकलिंक्स, DA/PA मैट्रिक्स व URL को गूगल स्प्रेडशीट में सेव करें' 
                  : 'Sync all fitnesstoday.us live backlinks, authority metrics, and live URLs to Google Sheets'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {errorMessage && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Account Status Card */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-11 h-11 rounded-full border-2 border-emerald-500 shadow"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-xs text-slate-400 font-medium">
                  {currentUser ? (language === 'hi' ? 'कनेक्टेड गूगल अकाउंट:' : 'Connected Google Account:') : (language === 'hi' ? 'गूगल अकाउंट कनेक्ट करें:' : 'Connect Google Workspace:')}
                </div>
                <div className="text-sm font-bold text-white">
                  {currentUser ? (currentUser.displayName || currentUser.email) : (language === 'hi' ? 'अभी कनेक्ट नहीं है' : 'Not Connected')}
                </div>
                {currentUser?.email && (
                  <div className="text-xs text-emerald-400 font-mono">
                    {currentUser.email}
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0">
              {currentUser ? (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center space-x-1 border border-slate-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'साइन आउट' : 'Sign Out'}</span>
                </button>
              ) : (
                /* Official GSI Material Sign in button */
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
                >
                  {isSigningIn ? (
                    <RotateCw className="w-4 h-4 animate-spin text-indigo-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  )}
                  <span>{isSigningIn ? (language === 'hi' ? 'कनेक्ट हो रहा है...' : 'Connecting...') : (language === 'hi' ? 'Google से साइन इन करें' : 'Sign in with Google')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Export Action Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {language === 'hi' ? 'एक्सपोर्ट हेतु उपलब्ध बैकलिंक्स:' : 'Backlinks Ready for Export:'}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {backlinks.length} {language === 'hi' ? 'लाइव रिकॉर्ड्स' : 'Live Records'}
              </span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'यह एक्शन आपके गूगल ड्राइव में एक नई पेशेवर गूगल स्प्रेडशीट तैयार करेगा जिसमें प्रत्येक बैकलिंक का प्लेटफॉर्म (DA/PA), लाइव 200 OK यूआरएल, एंकर टेक्स्ट, और स्रोत आर्टिकल का पूरा ब्योरा शामिल होगा।'
                : 'This action will generate a formatted Google Spreadsheet in your Google Drive containing Target Domain, DA/PA, Monthly Traffic, Live Published URL, Anchor Text, and fitnesstoday.us Destination link.'}
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
            >
              {isExporting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-white" />
                  <span>{language === 'hi' ? 'गूगल स्प्रेडशीट तैयार की जा रही है...' : 'Exporting to Google Sheets...'}</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>
                    {language === 'hi'
                      ? `📊 सभी ${backlinks.length} बैकलिंक्स गूगल शीट्स में एक्सपोर्ट करें`
                      : `📊 Export All ${backlinks.length} Backlinks to Google Sheet`}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Export Result Success Card */}
          {exportResult && (
            <div className="p-5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold text-white">
                  {language === 'hi' ? 'गूगल स्प्रेडशीट सफलतापूर्वक तैयार!' : 'Google Spreadsheet Successfully Created!'}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div>
                  <strong>{language === 'hi' ? 'शीट का शीर्षक:' : 'Sheet Title:'}</strong> {exportResult.title}
                </div>
                <div>
                  <strong>{language === 'hi' ? 'कुल पंक्तियाँ:' : 'Total Rows:'}</strong> {exportResult.totalExported} records
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={exportResult.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-600/40"
                >
                  <span>{language === 'hi' ? '🔗 गूगल शीट्स में खोलें (Open in Google Sheets)' : '🔗 Open in Google Sheets'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Google Drive API v3 • Sheets API v4 OAuth 2.0</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
