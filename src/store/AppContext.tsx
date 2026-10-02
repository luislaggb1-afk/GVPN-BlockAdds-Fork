import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppSettings,
  DnsProvider,
  FilterList,
  DnsLogEntry,
  CustomDnsRule,
  WhitelistDomain,
  BlocklistDomain,
  AppInfo,
  WireGuardProfile,
  ProtectionProfile,
  ProfileSchedule,
  RoutingMode,
  ShizukuState,
} from '../types';
import {
  NotificationPayload,
  playAlertTone,
  sendSystemNotification,
} from '../utils/notificationService';
import {
  DEFAULT_DNS_PROVIDERS,
  DEFAULT_FILTER_LISTS,
  DEFAULT_PROFILES,
  DEFAULT_CUSTOM_RULES,
  DEFAULT_WHITELIST_DOMAINS,
  DEFAULT_BLOCKLIST_DOMAINS,
  DEFAULT_APPS,
  INITIAL_DNS_LOGS,
} from '../data/defaults';

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  // Routing & VPN control
  vpnStatus: AppSettings['vpnStatus'];
  toggleVpn: () => void;
  pauseVpn: (minutes?: number) => void;
  resumeVpn: () => void;
  connectionPhase: string;
  uptimeSeconds: number;
  setRoutingMode: (mode: RoutingMode) => void;
  // Shizuku
  shizukuState: ShizukuState;
  requestShizukuPermission: () => Promise<boolean>;
  restartShizukuService: () => void;
  // Stats
  totalQueries: number;
  blockedQueries: number;
  securityThreats: number;
  blockRate: number;
  dataSavedMb: number;
  activeFilterRulesCount: number;
  // Providers
  dnsProviders: DnsProvider[];
  activeDnsProvider: DnsProvider;
  setDnsProvider: (id: string) => void;
  saveCustomDns: (provider: DnsProvider) => void;
  // Filter Lists
  filterLists: FilterList[];
  toggleFilterList: (id: string) => void;
  addCustomFilterList: (list: Omit<FilterList, 'id' | 'isBuiltIn' | 'lastUpdated' | 'domainCount' | 'ruleCount'>) => void;
  deleteFilterList: (id: string) => void;
  updateAllFilters: () => Promise<void>;
  isUpdatingFilters: boolean;
  // Custom Rules
  customRules: CustomDnsRule[];
  addCustomRule: (ruleText: string) => { success: boolean; error?: string };
  toggleCustomRule: (id: string) => void;
  deleteCustomRule: (id: string) => void;
  importCustomRules: (rulesText: string) => number;
  deleteAllCustomRules: () => void;
  // Domain Rules
  whitelistDomains: WhitelistDomain[];
  addWhitelistDomain: (domain: string) => void;
  removeWhitelistDomain: (id: string) => void;
  blocklistDomains: BlocklistDomain[];
  addBlocklistDomain: (domain: string) => void;
  removeBlocklistDomain: (id: string) => void;
  // Apps & Firewall
  apps: AppInfo[];
  toggleAppWhitelist: (packageName: string) => void;
  toggleFirewallApp: (packageName: string, type: 'wifi' | 'mobile') => void;
  setAppFirewallSchedule: (packageName: string, enabled: boolean, from?: string, to?: string) => void;
  // Logs
  logs: DnsLogEntry[];
  clearLogs: () => void;
  quickWhitelistDomain: (domain: string) => void;
  quickBlockDomain: (domain: string) => void;
  // WireGuard
  wireguardProfiles: WireGuardProfile[];
  importWireguardConfig: (name: string, confText: string) => { success: boolean; error?: string };
  toggleWireguardConnect: (id: string) => void;
  deleteWireguardProfile: (id: string) => void;
  // Profiles
  profiles: ProtectionProfile[];
  activeProfile: ProtectionProfile;
  setActiveProfile: (id: string) => void;
  addCustomProfile: (name: string, description: string, blocklists: string[]) => void;
  deleteProfile: (id: string) => void;
  schedules: ProfileSchedule[];
  addSchedule: (schedule: Omit<ProfileSchedule, 'id'>) => void;
  deleteSchedule: (id: string) => void;
  // Trusted Networks
  addTrustedNetwork: (ssid: string) => void;
  removeTrustedNetwork: (ssid: string) => void;
  // Cert download
  downloadRootCaCert: () => void;
  verifyRootCaCert: () => Promise<boolean>;
  isVerifyingCert: boolean;
  // Backup / Restore
  exportSettingsJson: () => void;
  importSettingsJson: (jsonText: string) => boolean;
  // Notificaciones & Alertas
  activeNotification: NotificationPayload | null;
  closeNotification: () => void;
  triggerTestNotification: (payload: NotificationPayload) => void;
}

const STORAGE_KEY_SETTINGS = 'gvpn_settings_v2';
const STORAGE_KEY_FILTERS = 'gvpn_filters_v2';
const STORAGE_KEY_RULES = 'gvpn_rules_v2';
const STORAGE_KEY_WHITELIST = 'gvpn_whitelist_v2';
const STORAGE_KEY_BLOCKLIST = 'gvpn_blocklist_v2';
const STORAGE_KEY_APPS = 'gvpn_apps_v2';
const STORAGE_KEY_LOGS = 'gvpn_logs_v2';
const STORAGE_KEY_WG = 'gvpn_wg_v2';
const STORAGE_KEY_PROFILES = 'gvpn_profiles_v2';
const STORAGE_KEY_SCHEDULES = 'gvpn_schedules_v2';
const STORAGE_KEY_DNS = 'gvpn_dns_v2';
const STORAGE_KEY_SHIZUKU = 'gvpn_shizuku_v2';

const DEFAULT_SETTINGS: AppSettings = {
  routingMode: 'vpn', // 'vpn' (Básico) | 'root_proxy' (Root) | 'shizuku' (Shizuku)
  vpnStatus: 'protected',
  pauseUntil: null,
  activeDnsProviderId: 'adguard',
  customDnsAddress: '',
  fallbackDnsAddress: '1.1.1.1',
  dnsResponseType: 'custom_ip',
  safeSearch: false,
  youtubeRestricted: false,
  autoReconnect: true,
  trustedNetworksEnabled: false,
  trustedSsids: ['Red_Hogar_5G', 'Oficina_Principal'],
  currentWifiSsid: 'Red_Hogar_5G',
  networkSwitchDelay: 3,
  autoUpdateEnabled: true,
  autoUpdateFrequency: '24h',
  autoUpdateWifiOnly: true,
  autoUpdateNotification: 'normal',
  dailySummaryEnabled: true,
  milestoneNotificationsEnabled: true,
  anonymousCrashReporting: false,
  recordLogs: true,
  theme: 'dark',
  accentColor: 'navy',
  showBottomNavLabels: true,
  language: 'es',
  httpsFilteringEnabled: false,
  httpsFilteringInstalled: false,
  filterHttp3: true,
  selectedBrowsers: ['com.android.chrome', 'org.mozilla.firefox'],
  activeProfileId: 'default',
  hideFromRecents: false,
  isOnboardingCompleted: true,
  notifyOnProtectionDisabled: true,
  notifyOnHighThreatVolume: true,
  threatVolumeThreshold: 25,
  notifySoundEnabled: true,
  pushNotificationsEnabled: true,
};

const DEFAULT_SHIZUKU: ShizukuState = {
  isInstalled: true,
  isRunning: true,
  hasPermission: true,
  version: 13,
  port: 5566,
  lastPing: Date.now(),
};

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadFromStorage(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS)
  );
  const [shizukuState, setShizukuState] = useState<ShizukuState>(() =>
    loadFromStorage(STORAGE_KEY_SHIZUKU, DEFAULT_SHIZUKU)
  );
  const [filterLists, setFilterLists] = useState<FilterList[]>(() =>
    loadFromStorage(STORAGE_KEY_FILTERS, DEFAULT_FILTER_LISTS)
  );
  const [customRules, setCustomRules] = useState<CustomDnsRule[]>(() =>
    loadFromStorage(STORAGE_KEY_RULES, DEFAULT_CUSTOM_RULES)
  );
  const [whitelistDomains, setWhitelistDomains] = useState<WhitelistDomain[]>(() =>
    loadFromStorage(STORAGE_KEY_WHITELIST, DEFAULT_WHITELIST_DOMAINS)
  );
  const [blocklistDomains, setBlocklistDomains] = useState<BlocklistDomain[]>(() =>
    loadFromStorage(STORAGE_KEY_BLOCKLIST, DEFAULT_BLOCKLIST_DOMAINS)
  );
  const [apps, setApps] = useState<AppInfo[]>(() =>
    loadFromStorage(STORAGE_KEY_APPS, DEFAULT_APPS)
  );
  const [logs, setLogs] = useState<DnsLogEntry[]>(() =>
    loadFromStorage(STORAGE_KEY_LOGS, INITIAL_DNS_LOGS)
  );
  const [wireguardProfiles, setWireguardProfiles] = useState<WireGuardProfile[]>(() =>
    loadFromStorage(STORAGE_KEY_WG, [])
  );
  const [profiles, setProfiles] = useState<ProtectionProfile[]>(() =>
    loadFromStorage(STORAGE_KEY_PROFILES, DEFAULT_PROFILES)
  );
  const [schedules, setSchedules] = useState<ProfileSchedule[]>(() =>
    loadFromStorage(STORAGE_KEY_SCHEDULES, [
      {
        id: 'sch-1',
        profileId: 'strict',
        profileName: 'Estricto',
        startTime: '09:00',
        endTime: '17:00',
        days: [1, 2, 3, 4, 5],
        isEnabled: false,
      },
    ])
  );
  const [dnsProviders, setDnsProviders] = useState<DnsProvider[]>(() =>
    loadFromStorage(STORAGE_KEY_DNS, DEFAULT_DNS_PROVIDERS)
  );

  const [connectionPhase, setConnectionPhase] = useState<string>('');
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(3600 * 3 + 24 * 60 + 10);
  const [isUpdatingFilters, setIsUpdatingFilters] = useState<boolean>(false);
  const [isVerifyingCert, setIsVerifyingCert] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<NotificationPayload | null>(null);

  const closeNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  const triggerTestNotification = useCallback((payload: NotificationPayload) => {
    setActiveNotification(payload);
    sendSystemNotification(payload);
  }, []);

  // Sync to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHIZUKU, JSON.stringify(shizukuState));
  }, [shizukuState]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(filterLists));
  }, [filterLists]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(customRules));
  }, [customRules]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(whitelistDomains));
  }, [whitelistDomains]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BLOCKLIST, JSON.stringify(blocklistDomains));
  }, [blocklistDomains]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
  }, [apps]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 150)));
  }, [logs]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WG, JSON.stringify(wireguardProfiles));
  }, [wireguardProfiles]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }, [profiles]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DNS, JSON.stringify(dnsProviders));
  }, [dnsProviders]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const setRoutingMode = useCallback((mode: RoutingMode) => {
    updateSettings({ routingMode: mode });
  }, [updateSettings]);

  // Shizuku permission request
  const requestShizukuPermission = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 600));
    setShizukuState((prev) => ({
      ...prev,
      hasPermission: true,
      isRunning: true,
      lastPing: Date.now(),
    }));
    return true;
  }, []);

  const restartShizukuService = useCallback(() => {
    setShizukuState((prev) => ({
      ...prev,
      lastPing: Date.now(),
      isRunning: true,
    }));
  }, []);

  // Compute active DNS provider
  const activeDnsProvider = useMemo(() => {
    return (
      dnsProviders.find((p) => p.id === settings.activeDnsProviderId) ||
      dnsProviders[0]
    );
  }, [dnsProviders, settings.activeDnsProviderId]);

  // Compute active profile
  const activeProfile = useMemo(() => {
    return (
      profiles.find((p) => p.id === settings.activeProfileId) ||
      profiles[0]
    );
  }, [profiles, settings.activeProfileId]);

  // Compute active rules count
  const activeFilterRulesCount = useMemo(() => {
    return filterLists
      .filter((f) => f.isEnabled)
      .reduce((sum, f) => sum + f.domainCount, 0);
  }, [filterLists]);

  // Compute stats
  const totalQueries = useMemo(() => {
    const base = 5120;
    return base + logs.length;
  }, [logs.length]);

  const blockedQueries = useMemo(() => {
    const base = 1580;
    const fromLogs = logs.filter((l) => l.status === 'blocked').length;
    return base + fromLogs;
  }, [logs]);

  const securityThreats = useMemo(() => {
    const base = 34;
    const fromLogs = logs.filter((l) => l.blockReason === 'SECURITY').length;
    return base + fromLogs;
  }, [logs]);

  const blockRate = useMemo(() => {
    if (totalQueries === 0) return 0;
    return Math.round((blockedQueries / totalQueries) * 100);
  }, [totalQueries, blockedQueries]);

  const dataSavedMb = useMemo(() => {
    return Math.round(blockedQueries * 0.052 * 10) / 10;
  }, [blockedQueries]);

  // Uptime timer tick
  useEffect(() => {
    if (settings.vpnStatus !== 'protected') return;
    const interval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [settings.vpnStatus]);

  // Paused timer
  useEffect(() => {
    if (settings.vpnStatus === 'paused' && settings.pauseUntil) {
      if (Date.now() >= settings.pauseUntil) {
        updateSettings({ vpnStatus: 'protected', pauseUntil: null });
      }
    }
  }, [settings.vpnStatus, settings.pauseUntil, updateSettings]);

  // Live Query Simulator
  useEffect(() => {
    if (settings.vpnStatus !== 'protected' || !settings.recordLogs) return;

    const sampleQueries = [
      { domain: 'googleads.g.doubleclick.net', type: 'ad', app: 'com.android.chrome' },
      { domain: 'api.github.com', type: 'safe', app: 'com.android.chrome' },
      { domain: 'telemetry.sdk.analytics.com', type: 'tracker', app: 'com.instagram.android' },
      { domain: 'graph.facebook.com', type: 'tracker', app: 'com.instagram.android' },
      { domain: 'gateway.reddit.com', type: 'safe', app: 'com.reddit.frontpage' },
      { domain: 'events.redditmedia.com', type: 'ad', app: 'com.reddit.frontpage' },
      { domain: 'spclient.wg.spotify.com', type: 'safe', app: 'com.spotify.music' },
      { domain: 'ads.spotify.com', type: 'ad', app: 'com.spotify.music' },
      { domain: 'dns.google', type: 'safe', app: 'org.mozilla.firefox' },
      { domain: 'static.cloudflare.com', type: 'safe', app: 'org.mozilla.firefox' },
      { domain: 'malicious-payment-steal.xyz', type: 'security', app: 'com.android.chrome' },
      { domain: 'api.telegram.org', type: 'safe', app: 'org.telegram.messenger' },
      { domain: 'i.ytimg.com', type: 'safe', app: 'com.google.android.youtube' },
      { domain: 'pagead2.googlesyndication.com', type: 'ad', app: 'com.google.android.youtube' },
      { domain: 'log.byteoversea.com', type: 'tracker', app: 'com.zhiliaoapp.musically' },
    ];

    const interval = setInterval(() => {
      const q = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      const appItem = apps.find((a) => a.packageName === q.app) || apps[0];

      const isDomainWhitelisted = whitelistDomains.some(
        (w) => w.domain === q.domain || (w.isWildcard && q.domain.endsWith(w.domain.replace('*', '')))
      );

      const isFirewallBlocked = appItem.isFirewalled;

      let status: 'allowed' | 'blocked' | 'whitelisted' = 'allowed';
      let blockReason: DnsLogEntry['blockReason'] = undefined;
      let filterName: string | undefined = undefined;

      if (isFirewallBlocked) {
        status = 'blocked';
        blockReason = 'FIREWALL';
      } else if (isDomainWhitelisted || appItem.isWhitelisted) {
        status = 'whitelisted';
      } else if (q.type === 'security') {
        status = 'blocked';
        blockReason = 'SECURITY';
        filterName = 'URLhaus Malware & Phishing';
      } else if (q.type === 'ad' || q.type === 'tracker') {
        status = 'blocked';
        blockReason = settings.routingMode === 'shizuku' ? 'SHIZUKU_POLICY' : 'FILTER_LIST';
        filterName = 'StevenBlack Unified';
      }

      const newEntry: DnsLogEntry = {
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        domain: q.domain,
        timestamp: Date.now(),
        clientIp: '10.0.0.2',
        resolvedIp:
          status === 'blocked'
            ? '0.0.0.0'
            : `104.26.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`,
        status,
        blockReason,
        filterListName: filterName,
        queryType: Math.random() > 0.4 ? 'A' : 'HTTPS',
        latencyMs: Math.floor(Math.random() * 16) + 2,
        appName: appItem.name,
        appPackage: appItem.packageName,
        appIcon: appItem.icon,
      };

      setLogs((prev) => [newEntry, ...prev.slice(0, 199)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [settings.vpnStatus, settings.recordLogs, settings.routingMode, apps, whitelistDomains]);

  // Toggle connection
  const toggleVpn = useCallback(() => {
    if (settings.vpnStatus === 'protected' || settings.vpnStatus === 'paused') {
      updateSettings({ vpnStatus: 'disconnecting' });
      const stoppingMsg =
        settings.routingMode === 'shizuku'
          ? 'Desconectando túnel Shizuku (ADB)…'
          : settings.routingMode === 'root_proxy'
          ? 'Deteniendo Root Proxy (iptables)…'
          : 'Cerrando túnel VPN local…';
      setConnectionPhase(stoppingMsg);

      setTimeout(() => {
        updateSettings({ vpnStatus: 'unprotected', pauseUntil: null });
        setConnectionPhase('');

        // Trigger notification if configured
        if (settings.notifyOnProtectionDisabled) {
          const payload: NotificationPayload = {
            title: '⚠️ GVPN: Protección Desactivada',
            body: 'El filtrado y bloqueo de publicidad se han detenido.',
            type: 'protection_disabled',
            actionText: 'Reactivar',
            onAction: () => toggleVpn(),
          };
          setActiveNotification(payload);
          sendSystemNotification(payload);
          if (settings.notifySoundEnabled) playAlertTone('warning');
        }
      }, 600);
    } else {
      updateSettings({ vpnStatus: 'connecting' });
      setConnectionPhase('Cargando listas de filtros…');

      setTimeout(() => {
        setConnectionPhase('Preparando DNS seguro…');
        setTimeout(() => {
          const connectingMsg =
            settings.routingMode === 'shizuku'
              ? 'Conectando vía Shizuku IPC (Privilegios ADB)…'
              : settings.routingMode === 'root_proxy'
              ? 'Aplicando reglas iptables (Root)…'
              : 'Estableciendo interfaz VPN local…';
          setConnectionPhase(connectingMsg);
          setTimeout(() => {
            updateSettings({ vpnStatus: 'protected', pauseUntil: null });
            setConnectionPhase('');
            if (settings.notifySoundEnabled) playAlertTone('info');
          }, 600);
        }, 500);
      }, 500);
    }
  }, [settings.vpnStatus, settings.routingMode, settings.notifyOnProtectionDisabled, settings.notifySoundEnabled, updateSettings]);

  const pauseVpn = useCallback((minutes = 60) => {
    const pauseUntil = Date.now() + minutes * 60 * 1000;
    updateSettings({ vpnStatus: 'paused', pauseUntil });

    if (settings.notifyOnProtectionDisabled) {
      const payload: NotificationPayload = {
        title: '⏸️ GVPN: Protección en Pausa (1h)',
        body: 'El filtrado se ha pausado. Se reanudará automáticamente.',
        type: 'protection_disabled',
        actionText: 'Reanudar',
        onAction: () => resumeVpn(),
      };
      setActiveNotification(payload);
      sendSystemNotification(payload);
      if (settings.notifySoundEnabled) playAlertTone('info');
    }
  }, [settings.notifyOnProtectionDisabled, settings.notifySoundEnabled, updateSettings]);

  const resumeVpn = useCallback(() => {
    updateSettings({ vpnStatus: 'protected', pauseUntil: null });
  }, [updateSettings]);

  const setDnsProvider = useCallback((id: string) => {
    updateSettings({ activeDnsProviderId: id });
  }, [updateSettings]);

  const saveCustomDns = useCallback((provider: DnsProvider) => {
    setDnsProviders((prev) => {
      const idx = prev.findIndex((p) => p.id === provider.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = provider;
        return next;
      }
      return [...prev, provider];
    });
    updateSettings({ activeDnsProviderId: provider.id });
  }, [updateSettings]);

  const toggleFilterList = useCallback((id: string) => {
    setFilterLists((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isEnabled: !f.isEnabled } : f))
    );
  }, []);

  const addCustomFilterList = useCallback((list: Omit<FilterList, 'id' | 'isBuiltIn' | 'lastUpdated' | 'domainCount' | 'ruleCount'>) => {
    const newId = 'custom-' + Date.now();
    const count = 15000 + Math.floor(Math.random() * 60000);
    const newList: FilterList = {
      ...list,
      id: newId,
      isBuiltIn: false,
      isEnabled: true,
      domainCount: count,
      ruleCount: count,
      lastUpdated: Date.now(),
      buildMode: 'local',
    };
    setFilterLists((prev) => [newList, ...prev]);
  }, []);

  const deleteFilterList = useCallback((id: string) => {
    setFilterLists((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateAllFilters = useCallback(async () => {
    setIsUpdatingFilters(true);
    await new Promise((r) => setTimeout(r, 1200));
    setFilterLists((prev) =>
      prev.map((f) => ({
        ...f,
        lastUpdated: Date.now(),
        domainCount: f.domainCount + Math.floor(Math.random() * 50) - 20,
      }))
    );
    setIsUpdatingFilters(false);
  }, []);

  const addCustomRule = useCallback((ruleText: string) => {
    const trimmed = ruleText.trim();
    if (!trimmed) return { success: false, error: 'La regla no puede estar vacía' };

    let type: 'block' | 'allow' | 'comment' = 'block';
    let isWildcard = false;

    if (trimmed.startsWith('!')) {
      type = 'comment';
    } else if (trimmed.startsWith('@@')) {
      type = 'allow';
      isWildcard = trimmed.includes('*');
    } else {
      type = 'block';
      isWildcard = trimmed.includes('*') || trimmed.startsWith('||');
    }

    const newRule: CustomDnsRule = {
      id: 'rule-' + Date.now(),
      ruleText: trimmed,
      type,
      isWildcard,
      isEnabled: true,
      createdAt: Date.now(),
    };

    setCustomRules((prev) => [newRule, ...prev]);
    return { success: true };
  }, []);

  const toggleCustomRule = useCallback((id: string) => {
    setCustomRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  }, []);

  const deleteCustomRule = useCallback((id: string) => {
    setCustomRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const importCustomRules = useCallback((rulesText: string) => {
    const lines = rulesText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const parsed: CustomDnsRule[] = lines.map((line, idx) => {
      let type: 'block' | 'allow' | 'comment' = 'block';
      if (line.startsWith('!')) type = 'comment';
      else if (line.startsWith('@@')) type = 'allow';

      return {
        id: 'rule-' + (Date.now() + idx),
        ruleText: line,
        type,
        isWildcard: line.includes('*') || line.startsWith('||'),
        isEnabled: true,
        createdAt: Date.now(),
      };
    });

    setCustomRules((prev) => [...parsed, ...prev]);
    return parsed.length;
  }, []);

  const deleteAllCustomRules = useCallback(() => {
    setCustomRules([]);
  }, []);

  const addWhitelistDomain = useCallback((domain: string) => {
    const clean = domain.trim().toLowerCase();
    if (!clean) return;
    setWhitelistDomains((prev) => {
      if (prev.some((w) => w.domain === clean)) return prev;
      return [
        {
          id: 'w-' + Date.now(),
          domain: clean,
          isWildcard: clean.includes('*'),
          createdAt: Date.now(),
        },
        ...prev,
      ];
    });
  }, []);

  const removeWhitelistDomain = useCallback((id: string) => {
    setWhitelistDomains((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const addBlocklistDomain = useCallback((domain: string) => {
    const clean = domain.trim().toLowerCase();
    if (!clean) return;
    setBlocklistDomains((prev) => {
      if (prev.some((b) => b.domain === clean)) return prev;
      return [
        {
          id: 'b-' + Date.now(),
          domain: clean,
          isWildcard: clean.includes('*'),
          createdAt: Date.now(),
        },
        ...prev,
      ];
    });
  }, []);

  const removeBlocklistDomain = useCallback((id: string) => {
    setBlocklistDomains((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const toggleAppWhitelist = useCallback((packageName: string) => {
    setApps((prev) =>
      prev.map((a) =>
        a.packageName === packageName ? { ...a, isWhitelisted: !a.isWhitelisted } : a
      )
    );
  }, []);

  const toggleFirewallApp = useCallback((packageName: string, type: 'wifi' | 'mobile') => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.packageName !== packageName) return a;
        const newWifi = type === 'wifi' ? !a.blockWifi : a.blockWifi;
        const newMobile = type === 'mobile' ? !a.blockMobile : a.blockMobile;
        return {
          ...a,
          blockWifi: newWifi,
          blockMobile: newMobile,
          isFirewalled: newWifi || newMobile,
        };
      })
    );
  }, []);

  const setAppFirewallSchedule = useCallback((packageName: string, enabled: boolean, from = '09:00', to = '17:00') => {
    setApps((prev) =>
      prev.map((a) =>
        a.packageName === packageName
          ? {
              ...a,
              scheduleEnabled: enabled,
              scheduleFrom: from,
              scheduleTo: to,
            }
          : a
      )
    );
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const quickWhitelistDomain = useCallback((domain: string) => {
    addWhitelistDomain(domain);
  }, [addWhitelistDomain]);

  const quickBlockDomain = useCallback((domain: string) => {
    addBlocklistDomain(domain);
  }, [addBlocklistDomain]);

  const importWireguardConfig = useCallback((name: string, confText: string) => {
    try {
      const lines = confText.split('\n');
      let privKey = '';
      let addr = '10.200.0.2/32';
      let dns = '1.1.1.1';
      let pubKey = '';
      let endpoint = 'vpn.gvpn-node.net:51820';
      let allowedIps = '0.0.0.0/0, ::/0';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('PrivateKey')) privKey = trimmed.split('=')[1]?.trim() || '';
        if (trimmed.startsWith('Address')) addr = trimmed.split('=')[1]?.trim() || '';
        if (trimmed.startsWith('DNS')) dns = trimmed.split('=')[1]?.trim() || '';
        if (trimmed.startsWith('PublicKey')) pubKey = trimmed.split('=')[1]?.trim() || '';
        if (trimmed.startsWith('Endpoint')) endpoint = trimmed.split('=')[1]?.trim() || '';
        if (trimmed.startsWith('AllowedIPs')) allowedIps = trimmed.split('=')[1]?.trim() || '';
      }

      const newProfile: WireGuardProfile = {
        id: 'wg-' + Date.now(),
        name: name || 'Túnel WireGuard GVPN',
        privateKey: privKey || 'samplePrivateKey==',
        address: addr,
        dns,
        peerPublicKey: pubKey || 'publicWireguardKey123=',
        peerEndpoint: endpoint,
        peerAllowedIps: allowedIps,
        excludeLan: true,
        isConnected: false,
        importedAt: Date.now(),
      };

      setWireguardProfiles((prev) => [...prev, newProfile]);
      return { success: true };
    } catch {
      return { success: false, error: 'No se pudo analizar la configuración' };
    }
  }, []);

  const toggleWireguardConnect = useCallback((id: string) => {
    setWireguardProfiles((prev) =>
      prev.map((p) => ({
        ...p,
        isConnected: p.id === id ? !p.isConnected : false,
      }))
    );
  }, []);

  const deleteWireguardProfile = useCallback((id: string) => {
    setWireguardProfiles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setActiveProfile = useCallback((id: string) => {
    const prof = profiles.find((p) => p.id === id);
    if (!prof) return;

    setProfiles((prev) =>
      prev.map((p) => ({ ...p, isActive: p.id === id }))
    );

    updateSettings({
      activeProfileId: id,
      safeSearch: prof.safeSearch,
      youtubeRestricted: prof.youtubeRestricted,
    });

    setFilterLists((prev) =>
      prev.map((f) => ({
        ...f,
        isEnabled: prof.blocklists.includes(f.id),
      }))
    );
  }, [profiles, updateSettings]);

  const addCustomProfile = useCallback((name: string, description: string, blocklists: string[]) => {
    const newProfile: ProtectionProfile = {
      id: 'profile-' + Date.now(),
      name,
      description,
      level: 'custom',
      isBuiltIn: false,
      isActive: false,
      safeSearch: false,
      youtubeRestricted: false,
      blocklists,
    };
    setProfiles((prev) => [...prev, newProfile]);
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addSchedule = useCallback((schedule: Omit<ProfileSchedule, 'id'>) => {
    const newSchedule: ProfileSchedule = {
      ...schedule,
      id: 'sch-' + Date.now(),
    };
    setSchedules((prev) => [...prev, newSchedule]);
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addTrustedNetwork = useCallback((ssid: string) => {
    const clean = ssid.trim();
    if (!clean) return;
    updateSettings({
      trustedSsids: Array.from(new Set([...settings.trustedSsids, clean])),
    });
  }, [settings.trustedSsids, updateSettings]);

  const removeTrustedNetwork = useCallback((ssid: string) => {
    updateSettings({
      trustedSsids: settings.trustedSsids.filter((s) => s !== ssid),
    });
  }, [settings.trustedSsids, updateSettings]);

  const downloadRootCaCert = useCallback(() => {
    const certContent = `-----BEGIN CERTIFICATE-----
MIIClTCCAf4CCQCxN1U9X72m9DANBgkqhkiG9w0BAQsFADCBjjELMAkGA1UEBhMC
VVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28x
ETAPBgNVBAoMCEdWUE4xIzAhBgNVBAsMGkdWUE4gTG9jYWwgUk9PVCBDQTEgMB4G
A1UEAwwXR1ZQTiBJbnRlcmNlcHQgQ0EwHhcNMjQwMTAxMDAwMDAwWhcNMzQwMTAx
MDAwMDAwWjCBjjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAU
BgNVBAcMDVNhbiBGcmFuY2lzY28xETAPBgNVBAoMCEdWUE4xIzAhBgNVBAsMGkdW
UE4gTG9jYWwgUk9PVCBDQTEgMB4GA1UEAwwXR1ZQTiBJbnRlcmNlcHQgQ0EwggEi
MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC9wKjU7vX2z7mN...
-----END CERTIFICATE-----`;

    const blob = new Blob([certContent], { type: 'application/x-x509-ca-cert' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GVPN-RootCA.crt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const verifyRootCaCert = useCallback(async () => {
    setIsVerifyingCert(true);
    await new Promise((r) => setTimeout(r, 900));
    updateSettings({ httpsFilteringInstalled: true });
    setIsVerifyingCert(false);
    return true;
  }, [updateSettings]);

  const exportSettingsJson = useCallback(() => {
    const payload = {
      appName: 'GVPN',
      version: '6.5.2',
      exportDate: new Date().toISOString(),
      settings,
      shizukuState,
      filterLists,
      customRules,
      whitelistDomains,
      blocklistDomains,
      profiles,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gvpn-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [settings, shizukuState, filterLists, customRules, whitelistDomains, blocklistDomains, profiles]);

  const importSettingsJson = useCallback((jsonText: string) => {
    try {
      const data = JSON.parse(jsonText);
      if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
      if (data.filterLists) setFilterLists(data.filterLists);
      if (data.customRules) setCustomRules(data.customRules);
      if (data.whitelistDomains) setWhitelistDomains(data.whitelistDomains);
      if (data.blocklistDomains) setBlocklistDomains(data.blocklistDomains);
      if (data.profiles) setProfiles(data.profiles);
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        vpnStatus: settings.vpnStatus,
        toggleVpn,
        pauseVpn,
        resumeVpn,
        connectionPhase,
        uptimeSeconds,
        setRoutingMode,
        shizukuState,
        requestShizukuPermission,
        restartShizukuService,
        totalQueries,
        blockedQueries,
        securityThreats,
        blockRate,
        dataSavedMb,
        activeFilterRulesCount,
        dnsProviders,
        activeDnsProvider,
        setDnsProvider,
        saveCustomDns,
        filterLists,
        toggleFilterList,
        addCustomFilterList,
        deleteFilterList,
        updateAllFilters,
        isUpdatingFilters,
        customRules,
        addCustomRule,
        toggleCustomRule,
        deleteCustomRule,
        importCustomRules,
        deleteAllCustomRules,
        whitelistDomains,
        addWhitelistDomain,
        removeWhitelistDomain,
        blocklistDomains,
        addBlocklistDomain,
        removeBlocklistDomain,
        apps,
        toggleAppWhitelist,
        toggleFirewallApp,
        setAppFirewallSchedule,
        logs,
        clearLogs,
        quickWhitelistDomain,
        quickBlockDomain,
        wireguardProfiles,
        importWireguardConfig,
        toggleWireguardConnect,
        deleteWireguardProfile,
        profiles,
        activeProfile,
        setActiveProfile,
        addCustomProfile,
        deleteProfile,
        schedules,
        addSchedule,
        deleteSchedule,
        addTrustedNetwork,
        removeTrustedNetwork,
        downloadRootCaCert,
        verifyRootCaCert,
        isVerifyingCert,
        exportSettingsJson,
        importSettingsJson,
        activeNotification,
        closeNotification,
        triggerTestNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
