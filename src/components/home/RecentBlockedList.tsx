import React from 'react';
import { useApp } from '../../store/AppContext';
import { timeAgo } from '../../utils/helpers';
import { Shield, ShieldAlert, Plus, ExternalLink, ArrowRight, Globe } from 'lucide-react';
import { ThemedAppIcon } from '../common/ThemedAppIcon';

interface RecentBlockedListProps {
  onOpenLogs: () => void;
  onOpenDomainRules: () => void;
}

export const RecentBlockedList: React.FC<RecentBlockedListProps> = ({
  onOpenLogs,
  onOpenDomainRules,
}) => {
  const { logs, quickWhitelistDomain } = useApp();

  const blockedLogs = logs.filter((l) => l.status === 'blocked').slice(0, 5);

  const topBlocked = [
    { domain: 'googleads.g.doubleclick.net', count: 489, category: 'Publicidad', pct: 85 },
    { domain: 'graph.facebook.com', count: 320, category: 'Rastreo', pct: 65 },
    { domain: 'pagead2.googlesyndication.com', count: 215, category: 'Publicidad', pct: 45 },
    { domain: 'telemetry.sdk.analytics.com', count: 184, category: 'Telemetría', pct: 35 },
  ];

  return (
    <div className="space-y-3">
      {/* Ranking de Bloqueos con icono relleno y blur */}
      <div className="p-4 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md space-y-3 transition-all duration-300 ease-out hover:scale-[1.02] hover:backdrop-blur-[12px] hover:bg-[#a8bff8]/95 hover:shadow-lg hover:border-white/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#000e1f] fill-current" />
            <h4 className="font-extrabold text-sm text-[#000e1f]">Ranking de Bloqueos</h4>
          </div>
          <button
            onClick={onOpenDomainRules}
            className="px-3 py-1.5 rounded-full bg-[#000e1f] text-[#a8bff8] text-xs font-bold flex items-center space-x-1 shadow-sm hover:bg-black transition"
          >
            <span>Ver reglas</span>
            <ArrowRight className="w-3 h-3 text-[#a8bff8]" />
          </button>
        </div>

        <div className="space-y-2.5">
          {topBlocked.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-white/70 hover:bg-white/90 border border-[#000e1f]/15 transition space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <span className="w-5 h-5 rounded-full bg-[#000e1f] text-[#a8bff8] flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-[#000e1f] truncate">
                    {item.domain}
                  </span>
                </div>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-full bg-[#000e1f] text-[#a8bff8]">
                  {item.count}
                </span>
              </div>
              <div className="w-full bg-[#000e1f]/15 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#000e1f] h-full rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloqueados Recientemente con icono relleno y blur */}
      <div className="p-4 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md space-y-3 transition-all duration-300 ease-out hover:scale-[1.02] hover:backdrop-blur-[12px] hover:bg-[#a8bff8]/95 hover:shadow-lg hover:border-white/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-[#000e1f] fill-current" />
            <h4 className="font-extrabold text-sm text-[#000e1f]">Bloqueados Recientemente</h4>
          </div>
          <button
            onClick={onOpenLogs}
            className="px-3 py-1.5 rounded-full bg-[#000e1f] text-[#a8bff8] text-xs font-bold flex items-center space-x-1 shadow-sm hover:bg-black transition"
          >
            <span>Ver todo</span>
            <ArrowRight className="w-3 h-3 text-[#a8bff8]" />
          </button>
        </div>

        {blockedLogs.length === 0 ? (
          <p className="text-xs text-[#000e1f]/80 py-3 text-center font-bold">
            No hay consultas bloqueadas todavía.
          </p>
        ) : (
          <div className="space-y-2">
            {blockedLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-white/70 hover:bg-white/90 border border-[#000e1f]/15 flex items-center justify-between transition"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <ThemedAppIcon packageName={log.appPackage} name={log.appName} size="sm" />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-[#000e1f] truncate block">
                      {log.domain}
                    </span>
                    <div className="flex items-center space-x-2 text-[10px] text-[#000e1f]/80 font-semibold">
                      <span>{log.appName}</span>
                      <span>•</span>
                      <span>{timeAgo(log.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => quickWhitelistDomain(log.domain)}
                  className="p-1.5 rounded-lg bg-[#000e1f] text-[#a8bff8] hover:bg-black transition"
                  title="Permitir (añadir a lista blanca)"
                >
                  <Plus className="w-3.5 h-3.5 text-[#a8bff8]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comprobar Filtrado Card con blur */}
      <div className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex items-center justify-between transition-all duration-300 ease-out hover:scale-[1.02] hover:backdrop-blur-[12px] hover:bg-[#a8bff8]/95 hover:shadow-lg hover:border-white/90">
        <div className="flex items-center space-x-2.5">
          <Globe className="w-4 h-4 text-[#000e1f] fill-current" />
          <h4 className="text-sm font-extrabold text-[#000e1f]">Comprobar Filtrado</h4>
        </div>
        <a
          href="https://adblock.turtlecute.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-[#000e1f] hover:bg-black text-xs font-bold text-[#a8bff8] flex items-center space-x-1.5 transition shadow-sm"
        >
          <span>Probar</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#a8bff8]" />
        </a>
      </div>
    </div>
  );
};
