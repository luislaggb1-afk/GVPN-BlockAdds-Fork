import React from 'react';
import { useApp } from '../../store/AppContext';
import { Power, Pause, Play } from 'lucide-react';

interface PowerButtonProps {
  onOpenModes: () => void;
}

export const PowerButton: React.FC<PowerButtonProps> = ({ onOpenModes }) => {
  const {
    vpnStatus,
    toggleVpn,
    pauseVpn,
    resumeVpn,
    connectionPhase,
    settings,
  } = useApp();

  const isProtected = vpnStatus === 'protected';
  const isConnecting = vpnStatus === 'connecting';
  const isDisconnecting = vpnStatus === 'disconnecting';
  const isPaused = vpnStatus === 'paused';

  const getStatusText = () => {
    if (isConnecting) return 'Conectando…';
    if (isDisconnecting) return 'Desconectando…';
    if (isPaused) return 'Protección en Pausa';
    if (isProtected) {
      if (settings.routingMode === 'shizuku') return 'Protegido con Shizuku';
      if (settings.routingMode === 'root_proxy') return 'Protegido con Root';
      return 'Protegido';
    }
    return 'Desprotegido';
  };

  const getStatusDesc = () => {
    if (connectionPhase) return connectionPhase;
    if (isPaused) return 'Pausado por 1 hora. Reanudará automáticamente.';
    if (isProtected) {
      if (settings.routingMode === 'shizuku') {
        return 'Filtrando anuncios vía ADB (Ranura VPN libre)';
      }
      if (settings.routingMode === 'root_proxy') {
        return 'Filtrando mediante iptables (Ranura VPN libre)';
      }
      return 'Tu dispositivo está protegido contra anuncios y rastreadores';
    }
    return 'Toca el botón para activar la protección de GVPN';
  };

  return (
    <div className="grid grid-cols-2 gap-3 items-center py-2 px-1 w-full max-w-lg mx-auto">
      {/* Columna 1: Botón de Encendido (Centrado) */}
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Anillo mínimo sutil alrededor del botón activo */}
          {isProtected && (
            <div className="absolute w-[104px] h-[104px] rounded-full border border-[#a8bff8]/40 animate-pulse pointer-events-none" />
          )}

          <button
            onClick={toggleVpn}
            disabled={isConnecting || isDisconnecting}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative z-10 select-none shadow-xl ${
              isProtected
                ? 'bg-[#a8bff8] text-[#000e1f] hover:opacity-95 shadow-blue-950/50 active:scale-95'
                : isPaused
                ? 'bg-[#4a6195] hover:bg-[#5a71a5] text-white shadow-blue-950/40 active:scale-95'
                : isConnecting || isDisconnecting
                ? 'bg-slate-800 text-blue-400 border border-blue-600/40'
                : 'bg-[#1E293B] hover:bg-slate-700 text-slate-300 border border-[#334155] shadow-black/40 active:scale-95'
            }`}
            title="Alternar protección GVPN"
          >
            {isConnecting || isDisconnecting ? (
              <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Power className="w-9 h-9 stroke-[2.4]" />
                <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-95">
                  {isProtected ? 'ACTIVO' : isPaused ? 'PAUSA' : 'ENCENDER'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Columna 2: Textos de Estado, Descripción y Botón de Pausa (Centrados) */}
      <div className="flex flex-col items-center justify-center text-center px-1">
        <h3
          className={`font-bold font-comfortaa text-[18px] tracking-tight leading-snug ${
            isProtected
              ? 'text-[#a8bff8]'
              : isPaused
              ? 'text-[#4a6195]'
              : isConnecting
              ? 'text-blue-300'
              : 'text-slate-400'
          }`}
        >
          {getStatusText()}
        </h3>

        <p className="text-xs text-[#94A3B8] leading-tight mt-1 max-w-[200px]">
          {getStatusDesc()}
        </p>

        {/* Botón de acción (Pausar 1h / Reanudar) */}
        {isProtected && (
          <div className="mt-2.5 flex items-center justify-center">
            <button
              onClick={() => pauseVpn(60)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#a8bff8] border border-white/60 hover:opacity-90 text-xs font-bold text-[#000e1f] transition shadow-md"
            >
              <Pause className="w-3.5 h-3.5 text-[#000e1f] fill-current" />
              <span className="text-[#000e1f]">Pausar 1h</span>
            </button>
          </div>
        )}

        {isPaused && (
          <div className="mt-2.5 flex items-center justify-center">
            <button
              onClick={resumeVpn}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#a8bff8] hover:opacity-90 text-xs font-bold text-[#000e1f] transition shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-[#000e1f] text-[#000e1f]" />
              <span className="text-[#000e1f]">Reanudar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
