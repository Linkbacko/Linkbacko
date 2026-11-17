import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Backlink } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface GoogleSheetsExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  totalExported: number;
  timestamp: string;
}

export const googleSheetsService = {
  /**
   * Listen to auth state changes
   */
  initAuth(
    onAuthSuccess?: (user: User, token: string) => void,
    onAuthFailure?: () => void
  ) {
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (cachedAccessToken) {
          if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        } else if (!isSigningIn) {
          // Token will be acquired on next user interaction or refresh
          if (onAuthSuccess && cachedAccessToken) {
            onAuthSuccess(user, cachedAccessToken);
          }
        }
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    });
  },

  /**
   * Triggers popup sign in for Google Workspace / Sheets
   */
  async signInWithGoogle(): Promise<{ user: User; accessToken: string }> {
    try {
      isSigningIn = true;
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('Google Sheets OAuth authorization failed. No access token provided.');
      }
      cachedAccessToken = credential.accessToken;
      return { user: result.user, accessToken: cachedAccessToken };
    } finally {
      isSigningIn = false;
    }
  },

  /**
   * Sign out from Google account
   */
  async logout() {
    await signOut(auth);
    cachedAccessToken = null;
  },

  /**
   * Returns current cached token
   */
  getAccessToken(): string | null {
    return cachedAccessToken;
  },

  /**
   * Creates a formatted Google Sheet and writes all backlinks into it
   */
  async exportBacklinksToSheet(
    backlinks: Backlink[],
    customTitle?: string
  ): Promise<GoogleSheetsExportResult> {
    let token = cachedAccessToken;
    if (!token) {
      const signInRes = await this.signInWithGoogle();
      token = signInRes.accessToken;
    }

    const title = customTitle || `fitnesstoday.us — Live SEO Backlinks & Traffic Audit (${new Date().toLocaleDateString()})`;

    // 1. Create a new Spreadsheet via Google Sheets REST API v4
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title
        },
        sheets: [
          {
            properties: {
              title: 'Live Backlinks & Proof',
              gridProperties: {
                frozenRowCount: 1
              }
            }
          }
        ]
      })
    });

    if (!createRes.ok) {
      const errorData = await createRes.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Failed to create Google Spreadsheet (${createRes.status})`);
    }

    const sheetData = await createRes.json();
    const spreadsheetId = sheetData.spreadsheetId;
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // 2. Prepare Rows
    const headers = [
      'Target Platform',
      'Domain Authority (DA)',
      'Page Authority (PA)',
      'Estimated Monthly Traffic',
      'Live Target URL (Where Article & Backlink Live)',
      'Anchor Text',
      'Target Destination (fitnesstoday.us)',
      'Rel Qualification',
      'HTTP Status',
      'Indexing Status',
      'Opportunity Type',
      'Linked Article Title',
      'Verified Timestamp',
      'Editorial Excerpt & Proof'
    ];

    const rows = backlinks.map(b => [
      b.targetDomain,
      b.da,
      b.pa,
      `${(b.trafficEst || 0).toLocaleString()} visitors/mo`,
      b.targetUrl || '',
      b.anchorText,
      b.destinationUrl,
      b.rel || 'dofollow',
      b.httpStatus || 200,
      b.indexingStatus || 'Indexed',
      b.opportunityType || 'Editorial Citation',
      b.sourceArticleTitle || 'Clinical Muscle Recovery Protocols',
      b.verifiedAt || b.createdAt,
      b.generatedContentSnippet || ''
    ]);

    const valueRange = {
      values: [headers, ...rows]
    };

    // 3. Append data to sheet
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Live%20Backlinks%20%26%20Proof!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(valueRange)
      }
    );

    if (!appendRes.ok) {
      const appendErr = await appendRes.json().catch(() => ({}));
      throw new Error(appendErr.error?.message || 'Failed to populate Google Sheet rows.');
    }

    // 4. Style Header Row with Professional Palette
    try {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.12, green: 0.16, blue: 0.38 }, // Deep Indigo
                    textFormat: {
                      foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                      bold: true,
                      fontSize: 11
                    },
                    horizontalAlignment: 'CENTER'
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
              }
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: 0,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: headers.length
                }
              }
            }
          ]
        })
      });
    } catch {
      // Styling error is non-fatal
    }

    return {
      spreadsheetId,
      spreadsheetUrl,
      title,
      totalExported: backlinks.length,
      timestamp: new Date().toISOString()
    };
  }
};
