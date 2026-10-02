import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Search } from 'lucide-react';
import { ThemedAppIcon } from '../components/common/ThemedAppIcon';

interface AppManagementScreenProps {
  onClose?: () => void;
}

export const AppManagementScreen: React.FC<AppManagementScreenProps> = ({ onClose }) => {
  const { apps, toggleAppWhitelist } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'whitelisted' | 'user' | 'system'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'queries' | 'blocked'>('blocked');

  let processedApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'whitelisted') return app.isWhitelisted;
    if (filterType === 'user') return app.category === 'user';
    if (filterType === 'system') return app.category === 'system';
    return true;
  });

  processedApps.sort((a, b) => {
    if (sortBy === 'queries') return b.totalQueries - a.totalQueries;
    if (sortBy === 'blocked') return b.blockedQueries - a.blockedQueries;
    return a.name.localeCompare(b.name);
  });

  const whitelistedCount = apps.filter((a) => a.isWhitelisted).length;

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#F8FAFC]">Gestión de Aplicaciones</h2>
        <p className="text-xs text-[#94A3B8] mt-0.5 font-bold">
          {whitelistedCount} aplicaciones excluidas del filtrado de GVPN
        </p>
      </div>

      {/* Search & Sort Controls aclarada a #4a6195 con lupa y texto en #000e1f */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#000e1f]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar aplicación…"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#4a6195] border border-white/20 focus:border-white/50 text-xs font-bold text-[#000e1f] placeholder-[#000e1f]/75 outline-none transition shadow-sm"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] text-xs font-bold text-[#94A3B8] outline-none"
        >
          <option value="blocked">Por Bloqueos</option>
          <option value="queries">Por Consultas</option>
          <option value="name">Por Nombre</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 text-xs">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'whitelisted', label: `Excluidas (${whitelistedCount})` },
          { key: 'user', label: 'De Usuario' },
          { key: 'system', label: 'Del Sistema' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key as any)}
            className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
              filterType === tab.key
                ? 'bg-[#a8bff8] text-[#000e1f] shadow-sm'
                : 'bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* App items con fondo #a8bff8 y ThemedAppIcon */}
      <div className="space-y-2">
        {processedApps.map((app) => (
          <div
            key={app.packageName}
            className={`p-3 rounded-2xl border transition-all shadow-md flex items-center justify-between text-[#000e1f] ${
              app.isWhitelisted
                ? 'bg-[#a8bff8] border-amber-500/80 ring-2 ring-amber-600/40'
                : 'bg-[#a8bff8] border-white/60'
            }`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <ThemedAppIcon packageName={app.packageName} name={app.name} size="md" />
              <div className="overflow-hidden">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-extrabold text-[#000e1f] truncate">{app.name}</h4>
                  {app.isWhitelisted && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#000e1f] text-[#a8bff8]">
                      Excluida de VPN
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#000e1f]/75 font-semibold truncate block">
                  {app.packageName} • {app.blockedQueries} bloqueados
                </span>
              </div>
            </div>

            {/* Whitelist Toggle */}
            <button
              onClick={() => toggleAppWhitelist(app.packageName)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 flex-shrink-0 ${
                app.isWhitelisted ? 'bg-[#000e1f]' : 'bg-[#000e1f]/20 border border-[#000e1f]/30'
              }`}
              title={app.isWhitelisted ? 'Excluida del filtrado' : 'Filtrando tráfico'}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#a8bff8] shadow-md transform transition-transform ${
                  app.isWhitelisted ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
