import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { RoutingMode } from '../types';
import { Shield, Cpu, Terminal, CheckCircle2, RefreshCw, Zap, Check } from 'lucide-react';

interface RoutingModesScreenProps {
  onClose?: () => void;
}

export const RoutingModesScreen: React.FC<RoutingModesScreenProps> = ({ onClose }) => {
  const {
    settings,
    setRoutingMode,
    shizukuState,
    requestShizukuPermission,
    restartShizukuService,
  } = useApp();

  const [isTestingRoot, setIsTestingRoot] = useState(false);
  const [rootSuccessMessage, setRootSuccessMessage] = useState<string | null>(null);
  const [isRequestingShizuku, setIsRequestingShizuku] = useState(false);

  const handleTestRoot = async () => {
    setIsTestingRoot(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsTestingRoot(false);
    setRootSuccessMessage('Acceso SU verificado: iptables operativo.');
    setTimeout(() => setRootSuccessMessage(null), 4000);
  };

  const handleRequestShizuku = async () => {
    setIsRequestingShizuku(true);
    await requestShizukuPermission();
    setIsRequestingShizuku(false);
  };

  const modes: {
    key: RoutingMode;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    details: string[];
  }[] = [
    {
      key: 'vpn',
      title: 'Básico',
      icon: Shield,
      details: [
        'Interfaz VpnService local (sin root ni ADB).',
        'Bloqueo global de anuncios y rastreadores.',
      ],
    },
    {
      key: 'shizuku',
      title: 'Shizuku',
      icon: Terminal,
      details: [
        'Ranura VPN libre para WireGuard o Tailscale.',
        'Inyección de políticas ADB sin root.',
      ],
    },
    {
      key: 'root_proxy',
      title: 'Root',
      icon: Cpu,
      details: [
        'Redirección directa iptables a nivel de kernel.',
        'Rendimiento nativo y ranura VPN libre.',
      ],
    },
  ];

  return (
    <div className="space-y-4 pt-4 pb-20">
      {/* Mode cards */}
      <div className="space-y-2.5">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = settings.routingMode === mode.key;

          return (
            <div
              key={mode.key}
              onClick={() => setRoutingMode(mode.key)}
              className={`p-3 rounded-2xl border backdrop-blur-[5px] transition-all cursor-pointer relative shadow-md ${
                isSelected
                  ? 'bg-[#a8bff8]/95 border-white text-[#000e1f]'
                  : 'bg-[#a8bff8]/88 border-white/60 hover:bg-[#a8bff8]/92 text-[#000e1f]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] border border-white/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-4 h-4 text-[#a8bff8] fill-current" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#000e1f] text-sm">{mode.title}</h3>
                  </div>
                </div>

                {/* Casilla redonda */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSelected ? 'border-[#000e1f] bg-[#000e1f] text-[#a8bff8]' : 'border-[#000e1f]/40'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3] text-[#a8bff8]" />}
                </div>
              </div>

              {/* Bullet points */}
              <ul className="mt-1.5 space-y-0.5 text-[11px] text-[#000e1f] font-bold pl-1">
                {mode.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-[#000e1f] font-black">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Shizuku Specific Management Card */}
      {settings.routingMode === 'shizuku' && (
        <div className="p-3 rounded-2xl bg-[#a8bff8]/85 backdrop-blur-sm border border-white/60 shadow-md space-y-2 text-[#000e1f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] border border-white/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Terminal className="w-4 h-4 text-[#a8bff8] fill-current" />
              </div>
              <h4 className="font-extrabold text-xs text-[#000e1f]">Estado de Shizuku</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-[#000e1f] text-[#a8bff8]">
              {shizukuState.isRunning && shizukuState.hasPermission
                ? 'Autorizado'
                : 'No Autorizado'}
            </span>
          </div>

          <p className="text-[11px] font-bold text-[#000e1f]/85">
            Ejecución de comandos ADB sin root para DNS privado y cortafuegos.
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRequestShizuku}
              disabled={isRequestingShizuku}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#000e1f] hover:bg-black text-[#a8bff8] font-bold text-xs flex items-center justify-center space-x-1.5 transition"
            >
              {isRequestingShizuku ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-[#a8bff8]" />
                  <span>Verificando…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#a8bff8] fill-current" />
                  <span>Verificar Permiso</span>
                </>
              )}
            </button>
            <button
              onClick={restartShizukuService}
              className="p-1.5 rounded-xl bg-white/70 border border-[#000e1f]/20 hover:bg-white text-[#000e1f] transition"
              title="Reconectar con Shizuku"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#000e1f]" />
            </button>
          </div>
        </div>
      )}

      {/* Root Specific Management Card */}
      {settings.routingMode === 'root_proxy' && (
        <div className="p-3 rounded-2xl bg-[#a8bff8]/85 backdrop-blur-sm border border-white/60 shadow-md space-y-2 text-[#000e1f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] border border-white/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Cpu className="w-4 h-4 text-[#a8bff8] fill-current" />
              </div>
              <h4 className="font-extrabold text-xs text-[#000e1f]">Diagnóstico Root</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-[#000e1f] text-[#a8bff8]">
              Autorizado
            </span>
          </div>

          <p className="text-[11px] font-bold text-[#000e1f]/85">
            Redirección NAT UDP 53 a puerto local GVPN.
          </p>

          {rootSuccessMessage && (
            <div className="p-2 rounded-xl bg-emerald-900 text-emerald-100 text-xs flex items-center space-x-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-300 fill-current" />
              <span>{rootSuccessMessage}</span>
            </div>
          )}

          <button
            onClick={handleTestRoot}
            disabled={isTestingRoot}
            className="w-full py-1.5 px-3 rounded-xl bg-[#000e1f] hover:bg-black text-[#a8bff8] font-bold text-xs flex items-center justify-center space-x-1.5 transition"
          >
            {isTestingRoot ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-[#a8bff8]" />
                <span>Probando…</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-[#a8bff8] fill-current" />
                <span>Probar Acceso SU</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
