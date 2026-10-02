import React from 'react';
import { useApp } from '../../store/AppContext';
import { RefreshCw, Terminal, Cpu, Shield } from 'lucide-react';
import { GvpnLogo } from '../common/GvpnLogo';

interface HeaderProps {
  onOpenModes: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenModes,
}) => {
  const { settings, isUpdatingFilters, updateAllFilters } = useApp();

  const modeBadge = () => {
    switch (settings.routingMode) {
      case 'shizuku':
        return {
          label: 'Shizuku',
          icon: Terminal,
        };
      case 'root_proxy':
        return {
          label: 'Root',
          icon: Cpu,
        };
      case 'vpn':
      default:
        return {
          label: 'VPN',
          icon: Shield,
        };
    }
  };

  const badge = modeBadge();
  const ModeIcon = badge.icon;

  return (
    <header className="fixed top-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none transition-all">
      <div className="pointer-events-auto bg-[#203457]/95 border border-[#203457] backdrop-blur-2xl rounded-full px-3.5 py-1.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 max-w-lg w-full min-h-[44px]">
        {/* Left: GvpnLogo, GVPN, Mode badge alineados perfectamente al centro vertical */}
        <div className="flex items-center space-x-2 my-auto">
          <GvpnLogo className="w-5 h-5 flex-shrink-0" />

          <span className="font-extrabold text-sm tracking-tight text-[#F8FAFC] leading-none flex items-center">
            GVPN
          </span>

          <button
            onClick={onOpenModes}
            className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white/40 bg-[#a8bff8] text-[#000e1f] flex items-center space-x-1 transition hover:opacity-90 shadow-sm leading-none"
            title="Cambiar modo de operación (Básico, Root, Shizuku)"
          >
            <ModeIcon className="w-2.5 h-2.5 text-[#000e1f]" />
            <span className="leading-none">{badge.label}</span>
          </button>
        </div>

        {/* Right: Circular action button for refreshing filters */}
        <div className="flex items-center space-x-1.5 my-auto">
          <button
            onClick={() => updateAllFilters()}
            disabled={isUpdatingFilters}
            className="w-7 h-7 rounded-full bg-[#a8bff8] border border-white/60 flex items-center justify-center text-[#000e1f] hover:opacity-90 transition shadow-sm disabled:opacity-50"
            title="Actualizar listas de filtros"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#000e1f] ${isUpdatingFilters ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
