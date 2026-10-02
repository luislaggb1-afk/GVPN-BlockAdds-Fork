export type DnsCategory = 'STANDARD' | 'PRIVACY' | 'FAMILY' | 'CUSTOM';
export type DnsProtocol = 'PLAIN' | 'DOH' | 'DOT' | 'DOQ';

export interface DnsProvider {
  id: string;
  name: string;
  category: DnsCategory;
  ipAddress: string;
  dohUrl?: string | null;
  dotHost?: string | null;
  doqHost?: string | null;
  description: string;
  isCustom?: boolean;
}

export interface FilterList {
  id: string;
  name: string;
  url: string;
  description: string;
  isEnabled: boolean;
  isBuiltIn: boolean;
  domainCount: number;
  lastUpdated: number;
  category: 'AD' | 'SECURITY';
  ruleCount: number;
  bloomUrl?: string;
  trieUrl?: string;
  cssUrl?: string;
  scriptletsUrl?: string;
  originalUrl?: string;
  buildMode?: 'local' | 'server';
}

export type QueryStatus = 'blocked' | 'allowed' | 'whitelisted';
export type BlockReason = 'FILTER_LIST' | 'CUSTOM_RULE' | 'SECURITY' | 'FIREWALL' | 'UPSTREAM_DNS' | 'SHIZUKU_POLICY';

export interface DnsLogEntry {
  id: string;
  domain: string;
  timestamp: number;
  clientIp: string;
  resolvedIp?: string;
  status: QueryStatus;
  blockReason?: BlockReason;
  filterListName?: string;
  queryType: 'A' | 'AAAA' | 'HTTPS' | 'TXT' | 'CNAME';
  latencyMs: number;
  appName: string;
  appPackage: string;
  appIcon?: string;
}

export interface CustomDnsRule {
  id: string;
  ruleText: string;
  type: 'block' | 'allow' | 'comment';
  isWildcard: boolean;
  isEnabled: boolean;
  createdAt: number;
}

export interface WhitelistDomain {
  id: string;
  domain: string;
  isWildcard: boolean;
  createdAt: number;
}

export interface BlocklistDomain {
  id: string;
  domain: string;
  isWildcard: boolean;
  createdAt: number;
}

export interface AppInfo {
  packageName: string;
  name: string;
  category: 'user' | 'system';
  icon: string;
  isWhitelisted: boolean; // bypass VPN / filtering
  isFirewalled: boolean;  // blocked by firewall
  blockWifi: boolean;
  blockMobile: boolean;
  scheduleEnabled?: boolean;
  scheduleFrom?: string; // "09:00"
  scheduleTo?: string;   // "17:00"
  totalQueries: number;
  blockedQueries: number;
}

export interface WireGuardProfile {
  id: string;
  name: string;
  privateKey: string;
  address: string;
  dns: string;
  listenPort?: number;
  mtu?: number;
  peerPublicKey: string;
  peerEndpoint: string;
  peerAllowedIps: string;
  splitDns?: string;
  excludeLan: boolean;
  isConnected: boolean;
  importedAt: number;
}

export interface ProtectionProfile {
  id: string;
  name: string;
  description: string;
  level: 'basic' | 'standard' | 'strict' | 'family' | 'gaming' | 'custom';
  isBuiltIn: boolean;
  isActive: boolean;
  safeSearch: boolean;
  youtubeRestricted: boolean;
  blocklists: string[];
}

export interface ProfileSchedule {
  id: string;
  profileId: string;
  profileName: string;
  startTime: string;
  endTime: string;
  days: number[];
  isEnabled: boolean;
}

export type RoutingMode = 'vpn' | 'root_proxy' | 'shizuku';
export type DnsResponseType = 'custom_ip' | 'nxdomain' | 'refused';
export type AccentColor = 'navy' | 'blue' | 'slate' | 'indigo' | 'cyan' | 'steel';
export type UpdateFrequency = '6h' | '12h' | '24h' | '48h' | 'manual';

export interface ShizukuState {
  isInstalled: boolean;
  isRunning: boolean;
  hasPermission: boolean;
  version: number;
  port: number;
  lastPing: number;
}

export interface AppSettings {
  routingMode: RoutingMode;
  vpnStatus: 'protected' | 'unprotected' | 'connecting' | 'disconnecting' | 'paused';
  pauseUntil?: number | null;
  activeDnsProviderId: string;
  customDnsAddress: string;
  fallbackDnsAddress: string;
  dnsResponseType: DnsResponseType;
  safeSearch: boolean;
  youtubeRestricted: boolean;
  autoReconnect: boolean;
  trustedNetworksEnabled: boolean;
  trustedSsids: string[];
  currentWifiSsid: string | null;
  networkSwitchDelay: number;
  autoUpdateEnabled: boolean;
  autoUpdateFrequency: UpdateFrequency;
  autoUpdateWifiOnly: boolean;
  autoUpdateNotification: 'normal' | 'silent' | 'none';
  dailySummaryEnabled: boolean;
  milestoneNotificationsEnabled: boolean;
  anonymousCrashReporting: boolean;
  recordLogs: boolean;
  theme: 'dark' | 'light' | 'system';
  accentColor: AccentColor;
  showBottomNavLabels: boolean;
  language: string;
  httpsFilteringEnabled: boolean;
  httpsFilteringInstalled: boolean;
  filterHttp3: boolean;
  selectedBrowsers: string[];
  activeProfileId: string;
  hideFromRecents: boolean;
  isOnboardingCompleted: boolean;
  // Notificaciones de Seguridad y Estado
  notifyOnProtectionDisabled: boolean;
  notifyOnHighThreatVolume: boolean;
  threatVolumeThreshold: number;
  notifySoundEnabled: boolean;
  pushNotificationsEnabled: boolean;
}

export interface StatsOverview {
  totalQueries: number;
  blockedQueries: number;
  securityThreats: number;
  uptimeSeconds: number;
  startTime: number;
}
