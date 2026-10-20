export type BacklinkStatus = 'live' | 'pending_verification' | 'failed' | 'retrying' | 'scheduled';
export type LinkType = 'Editorial' | 'Guest Post' | 'Profile' | 'Resource List' | 'Community' | 'Document' | 'Digital PR' | 'Research Citation';
export type LinkRel = 'dofollow' | 'nofollow' | 'sponsored' | 'ugc';

export type EvidenceClassification = 'VERIFIED' | 'SUPPORTED' | 'INFERRED' | 'ESTIMATED' | 'UNVERIFIED' | 'UNKNOWN';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type LinkDecayStatus = 'ACTIVE' | 'REDIRECTED' | 'REMOVED' | 'NOINDEX' | 'BROKEN' | 'CHANGED' | 'UNQUALIFIED' | 'QUALIFIED' | 'UNKNOWN';

export type LinkPurpose = 
  | 'REFERENCE' 
  | 'CITATION' 
  | 'RESOURCE' 
  | 'RECOMMENDATION' 
  | 'PARTNERSHIP' 
  | 'EDITORIAL' 
  | 'NEWS' 
  | 'RESEARCH' 
  | 'EDUCATIONAL' 
  | 'LOCAL' 
  | 'COMMUNITY' 
  | 'SPONSORED' 
  | 'ADVERTISEMENT' 
  | 'USER-GENERATED' 
  | 'OTHER';

export type PageClassification = 
  | 'Commercial' 
  | 'Informational' 
  | 'Research' 
  | 'Tool' 
  | 'Calculator' 
  | 'Study' 
  | 'Original data' 
  | 'Guide' 
  | 'Resource' 
  | 'Case study' 
  | 'Product' 
  | 'Service';

export type OpportunityType = 
  | 'Editorial Citation'
  | 'Resource Page'
  | 'Original Research'
  | 'Expert Contribution'
  | 'Digital PR'
  | 'Broken-Link Replacement'
  | 'Unlinked Brand Mention'
  | 'Partner/Association Citation'
  | 'Local Citation'
  | 'Podcast/Interview'
  | 'Community Contribution';

export type ProspectTier = 
  | 'Tier A — Highly Relevant' 
  | 'Tier B — Contextually Relevant' 
  | 'Tier C — General Opportunities';

export interface AuthorityOpportunityIndex {
  relevance: number; // 0-20
  editorialContext: number; // 0-20
  audienceOverlap: number; // 0-15
  informationValue: number; // 0-15
  referralPotential: number; // 0-10
  publisherQuality: number; // 0-10
  relationshipPotential: number; // 0-5
  brandTrust: number; // 0-5
  manipulationRisk: number; // 0 to -25 (penalty)
  total: number; // 0-100
  tier: 'Prime Authority (85-100)' | 'Strong Contributor (70-84)' | 'Contextual Value (50-69)' | 'Sub-threshold (<50)';
}

export interface QualityGateCheck {
  valueCheck: boolean; // Does this provide genuine user value?
  relevanceCheck: boolean; // Is the opportunity genuinely relevant?
  editorialCheck: boolean; // Would an independent publisher reasonably reference it?
  evidenceCheck: boolean; // Are important claims supported?
  spamCheck: boolean; // Could this reasonably be interpreted as manipulative link building? (Must be NO)
  reputationCheck: boolean; // Could this damage the organization if publicly disclosed? (Must be NO)
  sustainabilityCheck: boolean; // Would the strategy still make sense several years from now?
  allPassed: boolean;
}

export interface AuthorityGraphNode {
  id: string;
  type: 'ENTITY' | 'TOPIC' | 'EXPERTISE' | 'EVIDENCE' | 'REFERENCE' | 'PUBLISHER' | 'KNOWLEDGE_SYSTEM';
  label: string;
  category: string;
  status: 'active' | 'gap' | 'unlinked' | 'monitored';
  centralityScore: number; // 0-100
  connections: string[];
}

export interface PublishedArticle {
  id: string;
  title: string;
  slug: string;
  fullUrl: string;
  author: string;
  readingTime: string;
  keyTakeaway: string;
  sampleParagraph: string;
  targetKeywords: string[];
  recommendedAnchor: string;
  relevanceScore: number;
}

export interface WordPressSite {
  id: string;
  name: string;
  url: string;
  username: string;
  appPassword?: string;
  niche: string;
  keywords: string[];
  status: 'connected' | 'error' | 'pending';
  lastPing?: string;
  autoSyndicationEnabled: boolean;
  totalLinksGenerated: number;
  entityName?: string;
  coreTopics?: string[];
  evidenceAssets?: string[];
  publishedArticles?: PublishedArticle[];
}

export interface HighAuthorityTarget {
  id: string;
  domain: string;
  platformName: string;
  category: string;
  tier: ProspectTier;
  da: number;
  pa: number;
  spamScore: number;
  estMonthlyTraffic: string;
  linkType: LinkType;
  submissionMethod: 'REST API' | 'Editorial Pitch' | 'Markdown Publish' | 'Author Profile' | 'Resource Curate' | 'Digital PR Outreach';
  typicalIndexingDays: number;
  safetyScore: number;
  status: 'active' | 'in_queue' | 'cooldown';
  editorialStandards: string;
  acceptableOpportunityTypes: OpportunityType[];
  ecosystemSurface: 'Traditional Search' | 'AI Answer Engine' | 'Knowledge Graph' | 'Research Repository' | 'Industry Publication';
  isEasyBuild?: boolean;
}

export interface OutreachQualityScore {
  relevance: number; // 0-25
  editorialFit: number; // 0-20
  audienceFit: number; // 0-15
  contentQuality: number; // 0-15
  referralPotential: number; // 0-10
  relationshipPotential: number; // 0-10
  spamRisk: number; // -0 to -20
  total: number; // 0-100
  classification: 'Strong opportunity' | 'Worth evaluating' | 'Low priority' | 'Do not pursue';
}

export interface LinkRiskAudit {
  status: 'SAFE' | 'CAUTION' | 'REJECT';
  reasons: string[];
  safeAlternative?: string;
  paidSignalDetected?: boolean;
  relOverride?: LinkRel;
  primeDirectivePassed: boolean; // "Would this reference still make sense if search engines did not exist?"
}

export interface Backlink {
  id: string;
  siteId: string;
  targetDomain: string;
  targetUrl: string;
  destinationUrl: string;
  anchorText: string;
  anchorCategory: 'Exact Match' | 'Partial Match' | 'Branded' | 'Generic' | 'LSI Context';
  da: number;
  pa: number;
  rel: LinkRel;
  status: BacklinkStatus;
  createdAt: string;
  verifiedAt?: string;
  nextRetryAt?: string;
  trafficEst: number;
  httpStatus: number;
  indexingStatus: 'Indexed' | 'Crawled' | 'Pending';
  failureReason?: string;
  generatedContentSnippet?: string;
  aiAgentNotes: string;
  opportunityType?: OpportunityType;
  qualityScore?: number;
  riskStatus?: 'SAFE' | 'CAUTION' | 'REJECT';
  linkPurpose?: LinkPurpose;
  evidenceClassification?: EvidenceClassification;
  decayStatus?: LinkDecayStatus;
  aiSearchVisibility?: 'Attributed in AI Overviews' | 'Direct Citation' | 'Graph Connected' | 'Crawled';
  sourceArticleTitle?: string;
  sourceArticleUrl?: string;
}

export interface AgentSchedule {
  autonomousMode: boolean;
  dripPacing: 'conservative' | 'natural' | 'accelerated';
  minDelayHours: number;
  maxDelayHours: number;
  nextExecutionTime: string;
  dailyCap: number;
  activeHoursStart: number;
  activeHoursEnd: number;
  avoidWeekends: boolean;
  targetMinDA: number;
  googleComplianceMode: boolean;
  agentX2035Mode: boolean; // Enables 2035 Web Authority & Entity Intelligence Loop
}

export interface AgentLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error' | 'decision';
  message: string;
  details?: string;
  targetDomain?: string;
  confidence?: ConfidenceLevel;
}

export interface LinkableAsset {
  id: string;
  title: string;
  type: 'Original Research' | 'Industry Benchmark' | 'Free Tool' | 'Interactive Calculator' | 'Comprehensive Reference Guide' | 'Proprietary Dataset';
  url: string;
  strength: 'Strong' | 'Moderate' | 'Needs Improvement';
  citationReason: string;
  targetAudience: string;
  informationGainScore?: number; // 1-10
  evidenceStatus?: EvidenceClassification;
}

export interface CampaignProspect {
  id: string;
  prospectName: string;
  domain: string;
  url: string;
  opportunity: OpportunityType;
  tier: ProspectTier;
  relevanceScore: number;
  editorialFitScore: number;
  risk: 'SAFE' | 'CAUTION' | 'REJECT';
  riskReason?: string;
  qualityScore: OutreachQualityScore;
  priority: 'High Priority (80-100)' | 'Worth Evaluating (60-79)' | 'Low Priority (40-59)' | 'REJECTED (<40)';
  suggestedApproach: string;
  suggestedPage: string;
  suggestedAnchorStyle: string;
  outreachAngle: string;
  relQualification: LinkRel;
  confidence: ConfidenceLevel;
  linkPurpose: LinkPurpose;
}

export interface BacklinkCampaign {
  id: string;
  createdAt: string;
  seoObjective: {
    websiteUrl: string;
    targetPageUrl: string;
    businessName: string;
    industry: string;
    audience: string;
    country: string;
    primaryTopic: string;
    pageType: PageClassification;
    campaignObjective: string;
  };
  linkableAssetAnalysis: {
    existingAsset: string;
    assetStrength: 'Strong' | 'Moderate' | 'Needs Improvement' | 'None';
    missingAssets: string[];
    recommendedAsset: string;
    internalLinkingStrategy: string;
  };
  prospects: CampaignProspect[];
  outreach: {
    subject: string;
    message: string;
    personalizationContext: string;
    recipientRole: string;
  };
  followUpSequence: {
    step1: string;
    step2: string;
  };
  qualityControl: {
    noSpam: boolean;
    noLinkFarms: boolean;
    noPBN: boolean;
    noFakeIdentities: boolean;
    noFakeStats: boolean;
    noFabricatedPublishers: boolean;
    noForcedAnchorText: boolean;
    noManipulativeReciprocal: boolean;
    noPaidFollowedLinks: boolean;
    noLowQualityDirectories: boolean;
    noForumCommentSpam: boolean;
    noMassGuestPost: boolean;
    noDeceptiveOutreach: boolean;
    noLowValueAIContent: boolean;
    genuineUserValue: boolean;
  };
  authorityMap?: {
    entity: string;
    topics: string[];
    expertise: string[];
    evidence: string[];
    existingAuthority: string;
    gaps: string[];
  };
  qualityGate?: QualityGateCheck;
  learningReport?: {
    successfulPatterns: string[];
    failedPatterns: string[];
    newOpportunities: string[];
    strategyChanges: string[];
  };
}

export interface AutonomousCampaignSession {
  id: string;
  domain: string;
  siteName: string;
  durationDays: number;
  dailyVelocity: number;
  totalTargetLinks: number;
  completedLinksCount: number;
  status: 'active' | 'paused' | 'completed';
  startedAt: string;
  estimatedCompletionAt: string;
  currentRunningTarget?: string;
  logs: string[];
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  organization: string;
  createdAt: string;
  plan: 'Starter SEO' | 'Agency Pro' | 'Enterprise Autonomous';
  sites: WordPressSite[];
  backlinks: Backlink[];
  agentSchedule: AgentSchedule;
  logs: AgentLog[];
  campaigns?: BacklinkCampaign[];
  linkableAssets?: LinkableAsset[];
  authorityGraph?: AuthorityGraphNode[];
  activeAutonomousCampaign?: AutonomousCampaignSession;
}
