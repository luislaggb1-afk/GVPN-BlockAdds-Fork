import React, { useState } from 'react';
import { useApp } from './store/AppContext';
import { Header } from './components/layout/Header';
import { BottomPillNav, TabKey } from './components/layout/BottomPillNav';
import { HomeScreen } from './screens/HomeScreen';
import { FilterSetupScreen } from './screens/FilterSetupScreen';
import { FirewallScreen } from './screens/FirewallScreen';
import { DomainRulesScreen } from './screens/DomainRulesScreen';
import { RoutingModesScreen } from './screens/RoutingModesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LogsScreen } from './screens/LogsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DnsProviderScreen } from './screens/DnsProviderScreen';
import { CustomRulesScreen } from './screens/CustomRulesScreen';
import { AppManagementScreen } from './screens/AppManagementScreen';
import { WireGuardScreen } from './screens/WireGuardScreen';
import { HttpsFilteringScreen } from './screens/HttpsFilteringScreen';
import { NotificationToast } from './components/common/NotificationToast';
import { ArrowLeft } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeNotification, closeNotification } = useApp();
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [overlayScreen, setOverlayScreen] = useState<string | null>(null);

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'logs':
        return <LogsScreen />;
      case 'filters':
        return <FilterSetupScreen />;
      case 'firewall':
        return <FirewallScreen />;
      case 'settings':
        return (
          <SettingsScreen
            onNavigateToDns={() => setOverlayScreen('dns')}
            onNavigateToModes={() => setOverlayScreen('modes')}
            onNavigateToProfiles={() => setOverlayScreen('profiles')}
            onNavigateToWireguard={() => setOverlayScreen('wireguard')}
            onNavigateToHttps={() => setOverlayScreen('https')}
            onNavigateToCustomRules={() => setOverlayScreen('custom_rules')}
            onNavigateToDomainRules={() => setOverlayScreen('domain_rules')}
            onNavigateToAppManagement={() => setOverlayScreen('app_management')}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            onOpenLogs={() => setCurrentTab('logs')}
            onOpenDomainRules={() => setOverlayScreen('domain_rules')}
            onOpenModes={() => setOverlayScreen('modes')}
          />
        );
    }
  };

  const renderOverlay = () => {
    if (!overlayScreen) return null;

    let content = null;
    let title = '';

    switch (overlayScreen) {
      case 'logs':
        content = <LogsScreen onClose={() => setOverlayScreen(null)} />;
        title = 'Registros DNS';
        break;
      case 'profiles':
        content = <ProfileScreen onClose={() => setOverlayScreen(null)} />;
        title = 'Perfiles de Protección';
        break;
      case 'dns':
        content = <DnsProviderScreen onClose={() => setOverlayScreen(null)} />;
        title = 'Servidor DNS';
        break;
      case 'custom_rules':
        content = <CustomRulesScreen onClose={() => setOverlayScreen(null)} />;
        title = 'Reglas Personalizadas';
        break;
      case 'domain_rules':
        content = <DomainRulesScreen />;
        title = 'Reglas de Dominio';
        break;
      case 'modes':
        content = <RoutingModesScreen onClose={() => setOverlayScreen(null)} />;
        title = 'Modos de Operación';
        break;
      case 'app_management':
        content = <AppManagementScreen onClose={() => setOverlayScreen(null)} />;
        title = 'Exclusión de Apps';
        break;
      case 'wireguard':
        content = <WireGuardScreen onClose={() => setOverlayScreen(null)} />;
        title = 'Túneles WireGuard';
        break;
      case 'https':
        content = <HttpsFilteringScreen onClose={() => setOverlayScreen(null)} />;
        title = 'Filtrado HTTPS';
        break;
    }

    const isModes = overlayScreen === 'modes';

    return (
      <div className="fixed inset-0 z-50 bg-[#0B1120] overflow-y-auto animate-fadeIn">
        {/* Floating Overlay Header Pill */}
        <header className="sticky top-3 z-40 flex justify-center px-4 pointer-events-none mb-3">
          <div className="pointer-events-auto bg-[#203457]/95 border border-[#203457] backdrop-blur-2xl rounded-full px-3.5 py-1.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 max-w-lg w-full ring-1 ring-white/10 min-h-[44px]">
            <button
              onClick={() => setOverlayScreen(null)}
              className="w-7 h-7 rounded-full bg-[#a8bff8] border border-white/60 text-[#000e1f] flex items-center justify-center hover:opacity-90 transition shadow-sm my-auto flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#000e1f]" />
            </button>
            <span className="font-extrabold text-sm text-[#F8FAFC] tracking-tight leading-none my-auto text-center flex-1 truncate">
              {title}
            </span>
            <div className="w-7 h-7 flex-shrink-0 pointer-events-none" />
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-20">{content}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col antialiased selection:bg-[#a8bff8]/40 selection:text-[#000e1f]">
      {/* Top Floating Pill Header */}
      <Header
        onOpenModes={() => setOverlayScreen('modes')}
      />

      {/* Dynamic Security & Status Notification Toast */}
      <NotificationToast
        notification={activeNotification}
        onClose={closeNotification}
      />

      {/* Main Content Area con animaciones suaves de transición entre pestañas y separación unificada */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-[68px] pb-24">
        <div key={currentTab} className="animate-tab-enter">
          {renderActiveScreen()}
        </div>
      </main>

      {/* Bottom Floating Pill Navigation */}
      <BottomPillNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Full-screen Secondary Overlays */}
      {renderOverlay()}
    </div>
  );
};
