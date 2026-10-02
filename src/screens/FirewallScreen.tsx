import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { AppInfo } from '../types';
import { Flame, Wifi, Smartphone, Search, Clock } from 'lucide-react';
import { ThemedAppIcon } from '../components/common/ThemedAppIcon';

export const FirewallScreen: React.FC = () => {
  const { apps, toggleFirewallApp, setAppFirewallSchedule, settings, vpnStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'blocked' | 'user' | 'system'>('all');
  const [scheduleModalApp, setScheduleModalApp] = useState<AppInfo | null>(null);

  // Schedule modal form
  const [schedEnabled, setSchedEnabled] = useState(false);
  const [schedFrom, setSchedFrom] = useState('09:00');
  const [schedTo, setSchedTo] = useState('17:00');

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'blocked') return app.isFirewalled;
    if (filterType === 'user') return app.category === 'user';
    if (filterType === 'system') return app.category === 'system';
    return true;
  });

  const blockedCount = apps.filter((a) => a.isFirewalled).length;

  const openScheduleModal = (app: AppInfo) => {
    setScheduleModalApp(app);
    setSchedEnabled(app.scheduleEnabled || false);
    setSchedFrom(app.scheduleFrom || '09:00');
    setSchedTo(app.scheduleTo || '17:00');
  };

  const saveSchedule = () => {
    if (!scheduleModalApp) return;
    setAppFirewallSchedule(scheduleModalApp.packageName, schedEnabled, schedFrom, schedTo);
    setScheduleModalApp(null);
  };

  const getStatusLabel = () => {
    if (settings.routingMode === 'shizuku') return 'Shizuku';
    if (settings.routingMode === 'root_proxy') return 'Root';
    if (vpnStatus === 'protected') return 'Activo';
    return 'Inactivo';
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title & Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Flame className="w-5 h-5 text-[#a8bff8] fill-current flex-shrink-0" />
          <h2 className="text-xl font-bold text-[#F8FAFC]">Firewall</h2>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#a8bff8] border border-white text-xs font-extrabold text-[#000e1f] shadow-sm">
          <Flame className="w-4 h-4 fill-current text-[#000e1f]" />
          <span>{getStatusLabel()}</span>
        </div>
      </div>

      {/* Search Input aclarada (#4a6195) con lupa y texto en #000e1f */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#000e1f]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar aplicación…"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#4a6195]/88 backdrop-blur-[5px] border border-white/20 focus:border-white/50 text-xs font-bold text-[#000e1f] placeholder-[#000e1f]/75 outline-none transition shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 text-xs">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'blocked', label: `Bloqueadas (${blockedCount})` },
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

      {/* Apps list con iconos tematizados (#a8bff8 y #000e1f) */}
      <div className="space-y-2.5">
        {filteredApps.map((app) => (
          <div
            key={app.packageName}
            className={`p-3.5 rounded-2xl border transition-all shadow-md flex items-center justify-between backdrop-blur-[5px] ${
              app.isFirewalled
                ? 'bg-[#a8bff8]/88 border-rose-500/80 ring-2 ring-rose-600/40'
                : 'bg-[#a8bff8]/88 border-white/60'
            }`}
          >
            {/* App Info */}
            <div className="flex items-center space-x-3 overflow-hidden">
              <ThemedAppIcon packageName={app.packageName} name={app.name} size="md" />
              <div className="overflow-hidden">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-extrabold text-[#000e1f] truncate">{app.name}</h4>
                  {app.scheduleEnabled && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#000e1f] text-[#a8bff8]">
                      {app.scheduleFrom}–{app.scheduleTo}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#000e1f]/75 font-semibold truncate block">
                  {app.packageName}
                </span>
              </div>
            </div>

            {/* Firewall Action Buttons */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Wi-Fi Toggle */}
              <button
                onClick={() => toggleFirewallApp(app.packageName, 'wifi')}
                className={`p-2 rounded-xl border text-xs flex items-center justify-center transition shadow-sm ${
                  app.blockWifi
                    ? 'bg-rose-950 border-rose-800 text-rose-300'
                    : 'bg-[#000e1f] border-white/20 text-[#a8bff8] hover:opacity-90'
                }`}
                title={app.blockWifi ? 'Wi-Fi Bloqueado' : 'Bloquear Wi-Fi'}
              >
                <Wifi className="w-4 h-4" />
              </button>

              {/* Mobile Data Toggle */}
              <button
                onClick={() => toggleFirewallApp(app.packageName, 'mobile')}
                className={`p-2 rounded-xl border text-xs flex items-center justify-center transition shadow-sm ${
                  app.blockMobile
                    ? 'bg-rose-950 border-rose-800 text-rose-300'
                    : 'bg-[#000e1f] border-white/20 text-[#a8bff8] hover:opacity-90'
                }`}
                title={app.blockMobile ? 'Datos Móviles Bloqueados' : 'Bloquear Datos Móviles'}
              >
                <Smartphone className="w-4 h-4" />
              </button>

              {/* Schedule Config button */}
              <button
                onClick={() => openScheduleModal(app)}
                className={`p-2 rounded-xl border text-xs flex items-center justify-center transition shadow-sm ${
                  app.scheduleEnabled
                    ? 'bg-amber-950 border-amber-800 text-amber-300'
                    : 'bg-[#000e1f] border-white/20 text-[#a8bff8] hover:opacity-90'
                }`}
                title="Configurar horario de bloqueo"
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal con fondo #a8bff8 */}
      {scheduleModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#a8bff8] border border-white rounded-3xl p-5 shadow-2xl space-y-4 text-[#000e1f]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#000e1f]" />
                <h3 className="font-extrabold text-sm text-[#000e1f]">Horario de Bloqueo</h3>
              </div>
              <button onClick={() => setScheduleModalApp(null)} className="text-[#000e1f] font-bold hover:opacity-75">
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-[#000e1f]/85">
              Restringe el acceso a internet para <strong>{scheduleModalApp.name}</strong> sólo durante un horario específico (ej. horas de estudio o trabajo).
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/70 border border-[#000e1f]/20 cursor-pointer">
                <span className="text-xs font-bold text-[#000e1f]">Activar horario automático</span>
                <input
                  type="checkbox"
                  checked={schedEnabled}
                  onChange={(e) => setSchedEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#000e1f] rounded"
                />
              </label>

              {schedEnabled && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-[#000e1f] block mb-1">Desde (HH:MM)</label>
                    <input
                      type="time"
                      value={schedFrom}
                      onChange={(e) => setSchedFrom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#000e1f]/30 text-xs font-bold text-[#000e1f] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#000e1f] block mb-1">Hasta (HH:MM)</label>
                    <input
                      type="time"
                      value={schedTo}
                      onChange={(e) => setSchedTo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#000e1f]/30 text-xs font-bold text-[#000e1f] outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center space-x-2">
                <button
                  onClick={() => setScheduleModalApp(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/70 hover:bg-white text-xs font-bold text-[#000e1f] transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveSchedule}
                  className="flex-1 py-2.5 rounded-xl bg-[#000e1f] hover:bg-black text-xs font-bold text-[#a8bff8] transition shadow-sm"
                >
                  Guardar Horario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
