import { UserAccount, WordPressSite, Backlink, AgentLog, AgentSchedule, BacklinkCampaign, AutonomousCampaignSession } from '../types';
import { INITIAL_USER_ACCOUNT } from '../data/mockInitialData';

const ACCOUNTS_STORAGE_KEY = 'linkpulse_accounts_v1';
const ACTIVE_ACCOUNT_ID_KEY = 'linkpulse_active_account_id_v1';

export const storageService = {
  getAccounts(): UserAccount[] {
    try {
      const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (!data) {
        const initial = [INITIAL_USER_ACCOUNT];
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed: UserAccount[] = JSON.parse(data);
      let needsResave = false;
      parsed.forEach(acc => {
        // Enforce strictly one domain: fitnesstoday.us
        acc.sites = INITIAL_USER_ACCOUNT.sites;
        acc.linkableAssets = INITIAL_USER_ACCOUNT.linkableAssets;
        needsResave = true;

        if (acc.activeAutonomousCampaign) {
          acc.activeAutonomousCampaign.domain = 'https://fitnesstoday.us';
          acc.activeAutonomousCampaign.siteName = 'Fitness Today US';
          needsResave = true;
        }

        // Ensure all backlinks belong to fitnesstoday.us
        if (!acc.backlinks || acc.backlinks.length === 0 || acc.backlinks.some(b => b.destinationUrl?.includes('techtrendsglobal') || b.destinationUrl?.includes('fitnessstreet'))) {
          acc.backlinks = INITIAL_USER_ACCOUNT.backlinks;
          needsResave = true;
        } else {
          acc.backlinks.forEach(bl => {
            // Fix destination URL if not fitnesstoday.us
            if (!bl.destinationUrl || !bl.destinationUrl.includes('fitnesstoday.us')) {
              bl.destinationUrl = 'https://fitnesstoday.us/articles/muscle-recovery-hypertrophy-guide';
              bl.siteId = 'site-wp-fitness';
              needsResave = true;
            }

            if (!bl.targetUrl || bl.targetUrl.includes('-research-') || bl.targetUrl.includes('/publications/')) {
              bl.targetUrl = aiAgentEngine.resolveRealTargetUrl(bl.targetDomain, bl.anchorText, 'Fitness & Health');
              bl.httpStatus = 200;
              needsResave = true;
            }
          });
        }
      });
      if (needsResave) {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return [INITIAL_USER_ACCOUNT];
    }
  },

  getActiveAccountId(): string {
    return localStorage.getItem(ACTIVE_ACCOUNT_ID_KEY) || INITIAL_USER_ACCOUNT.id;
  },

  setActiveAccountId(id: string) {
    localStorage.setItem(ACTIVE_ACCOUNT_ID_KEY, id);
  },

  getActiveAccount(): UserAccount {
    const accounts = this.getAccounts();
    const activeId = this.getActiveAccountId();
    const found = accounts.find(a => a.id === activeId);
    if (found) return found;
    return accounts[0] || INITIAL_USER_ACCOUNT;
  },

  saveAccount(account: UserAccount) {
    const accounts = this.getAccounts();
    const idx = accounts.findIndex(a => a.id === account.id);
    if (idx >= 0) {
      accounts[idx] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  },

  createAccount(email: string, name: string, organization: string): UserAccount {
    const newAccount: UserAccount = {
      id: `usr-${Date.now().toString(36)}`,
      email,
      name,
      organization: organization || 'SEO Growth Corp',
      createdAt: new Date().toISOString(),
      plan: 'Agency Pro',
      sites: [],
      backlinks: [],
      agentSchedule: {
        autonomousMode: true,
        dripPacing: 'natural',
        minDelayHours: 12,
        maxDelayHours: 24,
        nextExecutionTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
        dailyCap: 2,
        activeHoursStart: 9,
        activeHoursEnd: 19,
        avoidWeekends: true,
        targetMinDA: 75,
        googleComplianceMode: true,
        agentX2035Mode: true
      },
      campaigns: [],
      linkableAssets: [],
      logs: [
        {
          id: `log-init-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `New CRM Account created for ${name} (${email}). Ready for 2026 Backlink Intelligence & Outreach.`
        }
      ]
    };

    const accounts = this.getAccounts();
    accounts.push(newAccount);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    this.setActiveAccountId(newAccount.id);
    return newAccount;
  },

  addWordPressSite(accountId: string, siteData: Omit<WordPressSite, 'id' | 'totalLinksGenerated' | 'status' | 'lastPing'>): WordPressSite {
    const accounts = this.getAccounts();
    const account = accounts.find(a => a.id === accountId);
    if (!account) throw new Error('Account not found');

    const newSite: WordPressSite = {
      ...siteData,
      id: `site-wp-${Date.now().toString(36)}`,
      status: 'connected',
      lastPing: new Date().toISOString(),
      totalLinksGenerated: 0
    };

    account.sites.push(newSite);
    account.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'success',
      message: `WordPress Site "${newSite.name}" (${newSite.url}) successfully authenticated via REST API credentials.`,
      targetDomain: newSite.url
    });

    this.saveAccount(account);
    return newSite;
  },

  updateSiteKeywords(accountId: string, siteId: string, keywords: string[]) {
    const accounts = this.getAccounts();
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;
    const site = account.sites.find(s => s.id === siteId);
    if (site) {
      site.keywords = keywords;
      this.saveAccount(account);
    }
  },

  addBacklink(accountId: string, backlink: Backlink) {
    const account = this.getActiveAccount();
    account.backlinks.unshift(backlink);

    // Update site link count
    const site = account.sites.find(s => s.id === backlink.siteId);
    if (site) {
      site.totalLinksGenerated = (site.totalLinksGenerated || 0) + 1;
    }

    this.saveAccount(account);
  },

  saveCampaign(accountId: string, campaign: BacklinkCampaign) {
    const account = this.getActiveAccount();
    if (!account.campaigns) account.campaigns = [];
    const idx = account.campaigns.findIndex(c => c.id === campaign.id);
    if (idx >= 0) {
      account.campaigns[idx] = campaign;
    } else {
      account.campaigns.unshift(campaign);
    }
    this.saveAccount(account);
  },

  updateAgentSchedule(accountId: string, schedule: Partial<AgentSchedule>) {
    const account = this.getActiveAccount();
    account.agentSchedule = { ...account.agentSchedule, ...schedule };
    this.saveAccount(account);
  },

  addLog(accountId: string, log: Omit<AgentLog, 'id' | 'timestamp'>) {
    const account = this.getActiveAccount();
    account.logs.unshift({
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    });
    if (account.logs.length > 50) {
      account.logs = account.logs.slice(0, 50);
    }
    this.saveAccount(account);
  },

  saveActiveCampaign(accountId: string, session: AutonomousCampaignSession | null) {
    const account = this.getActiveAccount();
    account.activeAutonomousCampaign = session || undefined;
    this.saveAccount(account);
  },

  updateActiveCampaignProgress(accountId: string, increment: number = 1) {
    const account = this.getActiveAccount();
    if (account.activeAutonomousCampaign) {
      account.activeAutonomousCampaign.completedLinksCount += increment;
      if (account.activeAutonomousCampaign.completedLinksCount >= account.activeAutonomousCampaign.totalTargetLinks) {
        account.activeAutonomousCampaign.status = 'completed';
      }
      this.saveAccount(account);
    }
  },

  resetToDemo() {
    localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_ACCOUNT_ID_KEY);
  }
};
