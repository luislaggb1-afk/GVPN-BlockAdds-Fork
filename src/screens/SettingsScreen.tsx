import React from 'react';
import { useApp } from '../store/AppContext';
import {
  Shield,
  Layers,
  Globe,
  Smartphone,
  FileCode,
  ChevronRight,
  Terminal,
  Lock,
  ListChecks,
  Search,
  RefreshCw,
} from 'lucide-react';
import { DetailedSettingsIcon } from '../components/common/DetailedSettingsIcon';
import { NotificationSettingsCard } from '../components/settings/NotificationSettingsCard';

interface SettingsScreenProps {
  onNavigateToDns: () => void;
  onNavigateToModes: () => void;
  onNavigateToProfiles: () => void;
  onNavigateToWireguard: () => void;
  onNavigateToHttps: () => void;
  onNavigateToCustomRules: () => void;
  onNavigateToDomainRules: () => void;
  onNavigateToAppManagement: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigateToDns,
  onNavigateToModes,
  onNavigateToProfiles,
  onNavigateToWireguard,
  onNavigateToHttps,
  onNavigateToCustomRules,
  onNavigateToDomainRules,
  onNavigateToAppManagement,
}) => {
  const {
    settings,
    updateSettings,
    activeDnsProvider,
    activeProfile,
  } = useApp();

  const getRoutingLabel = () => {
    if (settings.routingMode === 'shizuku') return 'Shizuku (ADB API)';
    if (settings.routingMode === 'root_proxy') return 'Root (iptables)';
    return 'Básico (VPN Local)';
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Title con icono a la izquierda */}
      <div className="flex items-center space-x-2.5">
        <DetailedSettingsIcon className="w-5 h-5 text-[#a8bff8] flex-shrink-0" isDark={false} />
        <h2 className="text-xl font-bold text-[#F8FAFC]">Ajustes</h2>
      </div>

      {/* SECCIÓN: NOTIFICACIONES & ALERTAS DE SEGURIDAD */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#a8bff8] px-1 block">
          Alertas &amp; Monitoreo de Seguridad
        </span>
        <NotificationSettingsCard />
      </div>

      {/* SECCIÓN: PROTECCIÓN & ENRUTAMIENTO */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#a8bff8] px-1 block">
          Protección &amp; Enrutamiento
        </span>

        {/* Modo de operación */}
        <div
          onClick={onNavigateToModes}
          className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between hover:bg-[#a8bff8]/95 transition cursor-pointer text-[#000e1f]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[#a8bff8] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#000e1f] block">Modo de Operación</span>
              <span className="text-[11px] font-bold text-[#000e1f]/80">
                {getRoutingLabel()} (Básico, Root, Shizuku)
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#000e1f]" />
        </div>

        {/* Servidor DNS */}
        <div
          onClick={onNavigateToDns}
          className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between hover:bg-[#a8bff8]/95 transition cursor-pointer text-[#000e1f]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#a8bff8] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#000e1f] block">Servidor DNS Upstream</span>
              <span className="text-[11px] font-bold text-[#000e1f]/80">
                {activeDnsProvider.name} ({activeDnsProvider.ipAddress})
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#000e1f]" />
        </div>

        {/* Perfil de Protección */}
        <div
          onClick={onNavigateToProfiles}
          className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between hover:bg-[#a8bff8]/95 transition cursor-pointer text-[#000e1f]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#a8bff8] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#000e1f] block">Perfil de Protección</span>
              <span className="text-[11px] font-bold text-[#000e1f]/80">
                {activeProfile.name} (Nivel: {activeProfile.level})
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#000e1f]" />
        </div>

        {/* Auto Reconexión Switch */}
        <div className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between text-[#000e1f]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-[#a8bff8] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#000e1f] block">Reconexión Automática</span>
              <span className="text-[11px] font-bold text-[#000e1f]/80">
                Reanudar protección al reiniciar el dispositivo
              </span>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ autoReconnect: !settings.autoReconnect })}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
              settings.autoReconnect ? 'bg-[#000e1f]' : 'bg-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#a8bff8] shadow-md transform transition-transform ${
                settings.autoReconnect ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* SECCIÓN: APLICACIONES & REGLAS */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#a8bff8] px-1 block">
          Aplicaciones &amp; Reglas
        </span>

        {/* Reglas de Dominio */}
        <div
          onClick={onNavigateToDomainRules}
          className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between hover:bg-[#a8bff8]/95 transition cursor-pointer text-[#000e1f]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center">
              <ListChecks className="w-4 h-4 text-[#a8bff8] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#000e1f] block">Reglas de Dominio</span>
              <span className="text-[11px] font-bold text-[#000e1f]/80">
                Lista blanca y lista de bloqueo personalizada
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#000e1f]" />
        </div>

        {/* App Management */}
        <div
          onClick={onNavigateToAppManagement}
          className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between hover:bg-[#a8bff8]/95 transition cursor-pointer text-[#000e1f]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-[#a8bff8] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#000e1f] block">Exclusión de Aplicaciones</span>
              <span className="text-[11px] font-bold text-[#000e1f]/80">
                Bypass de VPN para apps bancarias o locales
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#000e1f]" />
        </div>

        {/* WireGuard */}
        <div
          onClick={onNavigateToWireguard}
          className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between hover:bg-[#a8bff8]/95 transition cursor-pointer text-[#000e1f]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#a8bff8] fill-current" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#000e1f] block">Túneles WireGuard</span>
              <span className="text-[11px] font-bold text-[#000e1f]/80">
                Conexión cifrada a tu servidor VPN personal
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#000e1f]" />
        </div>

        {/* HTTPS Cosmetic Filtering */}
        <div
          onClick={onNavigateToHttps}
          className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between hover:bg-[#a8bff8]/95 transition cursor-pointer text-[#000e1f]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#a8bff8] fill-current" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#000e1f] block">Filtrado HTTPS Cosmético</span>
              <span className="text-[11px] font-bold text-[#000e1f]/80">
                Ocultar espacios en blanco y banners residuales
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#000e1f]" />
        </div>

        {/* Custom Rules */}
        <div
          onClick={onNavigateToCustomRules}
          className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between hover:bg-[#a8bff8]/95 transition cursor-pointer text-[#000e1f]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center">
              <FileCode className="w-4 h-4 text-[#a8bff8] stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#000e1f] block">Reglas Personalizadas</span>
              <span className="text-[11px] font-bold text-[#000e1f]/80">
                Reglas sintaxis AdGuard y uBlock Origin
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#000e1f]" />
        </div>
      </div>
    </div>
  );
};
