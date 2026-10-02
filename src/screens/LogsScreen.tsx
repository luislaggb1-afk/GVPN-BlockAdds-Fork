import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { timeAgo } from '../utils/helpers';
import {
  Search,
  Check,
  X,
  Clock,
  ExternalLink,
  Plus,
  Info,
} from 'lucide-react';
import { ThemedAppIcon } from '../components/common/ThemedAppIcon';
import { LogFileIcon } from '../components/common/LogFileIcon';

interface LogsScreenProps {
  onClose?: () => void;
}

export const LogsScreen: React.FC<LogsScreenProps> = () => {
  const { logs, quickWhitelistDomain } = useApp();
  const [filter, setFilter] = useState<'all' | 'blocked' | 'allowed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'blocked' && log.status !== 'blocked') return false;
    if (filter === 'allowed' && log.status !== 'allowed') return false;
    if (
      searchQuery &&
      !log.domain.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.appName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header con icono a la izquierda del título */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <LogFileIcon className="w-5 h-5 text-[#a8bff8] fill-current flex-shrink-0" />
          <h2 className="text-xl font-bold text-[#F8FAFC]">Registros</h2>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#203457] text-[#a8bff8] border border-white/10 shadow-sm">
          {logs.length} eventos
        </span>
      </div>

      {/* Filter Tabs en píldora clara con texto oscuro */}
      <div className="flex space-x-2 p-1 rounded-2xl bg-[#203457]/80 backdrop-blur-[5px] border border-white/10">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'all'
              ? 'bg-[#a8bff8] text-[#000e1f] shadow-md'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
          }`}
        >
          Todos ({logs.length})
        </button>
        <button
          onClick={() => setFilter('blocked')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'blocked'
              ? 'bg-[#a8bff8] text-[#000e1f] shadow-md'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
          }`}
        >
          Bloqueados ({logs.filter((l) => l.status === 'blocked').length})
        </button>
        <button
          onClick={() => setFilter('allowed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'allowed'
              ? 'bg-[#a8bff8] text-[#000e1f] shadow-md'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
          }`}
        >
          Permitidos ({logs.filter((l) => l.status === 'allowed').length})
        </button>
      </div>

      {/* Search Input con fondo #4a6195 y texto #000e1f */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#000e1f] absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filtrar por dominio o aplicación…"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#4a6195]/88 backdrop-blur-[5px] border border-white/20 focus:border-white/50 text-xs font-bold text-[#000e1f] placeholder-[#000e1f]/75 outline-none transition shadow-sm"
        />
      </div>

      {/* Query logs list con fondo #a8bff8 y backdrop blur */}
      <div className="space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center bg-[#a8bff8]/88 backdrop-blur-[5px] rounded-2xl border border-white/60">
            <Info className="w-8 h-8 text-[#000e1f] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#000e1f]">
              No hay consultas registradas con los filtros actuales.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isBlocked = log.status === 'blocked';

            return (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="p-3 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] hover:bg-[#a8bff8]/95 border border-white/60 shadow-md transition flex items-center justify-between cursor-pointer text-[#000e1f]"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <ThemedAppIcon packageName={log.appPackage} name={log.appName} size="sm" />
                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-xs text-[#000e1f] truncate">
                        {log.domain}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#000e1f]/10 text-[#000e1f] font-mono font-bold">
                        {log.queryType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-[#000e1f]/80 mt-0.5 font-bold">
                      <span>{log.appName}</span>
                      <span>•</span>
                      <span>{timeAgo(log.timestamp)}</span>
                      <span>•</span>
                      <span>{log.latencyMs}ms</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold font-mono tracking-tight flex items-center space-x-1 ${
                      isBlocked
                        ? 'bg-[#000e1f] text-[#a8bff8] border border-white/20'
                        : 'bg-white/80 text-[#000e1f] border border-[#000e1f]/20'
                    }`}
                  >
                    {isBlocked ? (
                      <>
                        <X className="w-3 h-3 text-[#a8bff8]" />
                        <span>Bloqueado</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 text-[#000e1f]" />
                        <span>Permitido</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Log Detail Modal con fondo #a8bff8 */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#a8bff8] rounded-3xl p-6 max-w-sm w-full border border-white space-y-4 shadow-2xl text-[#000e1f]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ThemedAppIcon
                  packageName={selectedLog.appPackage}
                  name={selectedLog.appName}
                  size="md"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-[#000e1f]">{selectedLog.appName}</h3>
                  <span className="text-[11px] text-[#000e1f]/80 font-bold font-mono">
                    {selectedLog.appPackage}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-full bg-[#000e1f]/10 hover:bg-[#000e1f]/20 transition text-[#000e1f]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/70 border border-[#000e1f]/15">
                <span className="text-[10px] text-[#000e1f]/80 font-extrabold uppercase block">
                  Dominio solicitado
                </span>
                <span className="font-bold text-[#000e1f] break-all text-xs">
                  {selectedLog.domain}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white/70 border border-[#000e1f]/15">
                  <span className="text-[10px] text-[#000e1f]/80 font-extrabold uppercase block">
                    Estado
                  </span>
                  <span className="font-bold text-[#000e1f]">
                    {selectedLog.status === 'blocked' ? 'Bloqueado' : 'Permitido'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-[#000e1f]/15">
                  <span className="text-[10px] text-[#000e1f]/80 font-extrabold uppercase block">
                    Latencia
                  </span>
                  <span className="font-bold text-[#000e1f]">{selectedLog.elapsedMs} ms</span>
                </div>
              </div>

              {selectedLog.ruleMatched && (
                <div className="p-2.5 rounded-xl bg-white/70 border border-[#000e1f]/15">
                  <span className="text-[10px] text-[#000e1f]/80 font-extrabold uppercase block">
                    Regla coincidente
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#000e1f]">
                    {selectedLog.ruleMatched}
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  quickWhitelistDomain(selectedLog.domain);
                  setSelectedLog(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#000e1f] hover:bg-black text-[#a8bff8] text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#a8bff8]" />
                <span>Permitir siempre</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
