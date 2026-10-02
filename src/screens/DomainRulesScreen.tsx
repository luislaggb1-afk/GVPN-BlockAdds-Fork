import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { timeAgo } from '../utils/helpers';
import { Plus, Trash2, Search, CheckCircle2, ShieldBan, Info } from 'lucide-react';

export const DomainRulesScreen: React.FC = () => {
  const {
    whitelistDomains,
    addWhitelistDomain,
    removeWhitelistDomain,
    blocklistDomains,
    addBlocklistDomain,
    removeBlocklistDomain,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'whitelist' | 'blocklist'>('whitelist');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const currentList = activeTab === 'whitelist' ? whitelistDomains : blocklistDomains;
  const filteredList = currentList.filter((item) =>
    item.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = domainInput.trim().toLowerCase();
    if (!clean) {
      setErrorMessage('Por favor introduce un dominio');
      return;
    }

    if (activeTab === 'whitelist') {
      addWhitelistDomain(clean);
    } else {
      addBlocklistDomain(clean);
    }

    setDomainInput('');
    setErrorMessage('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Title & Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Reglas de Dominios</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5 font-bold">
            {whitelistDomains.length} en lista blanca • {blocklistDomains.length} en lista de bloqueo
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#a8bff8] border border-white text-xs font-extrabold text-[#000e1f] flex items-center space-x-1.5 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-[#000e1f]" />
          <span>Añadir Dominio</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
        <button
          onClick={() => setActiveTab('whitelist')}
          className={`py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-2 ${
            activeTab === 'whitelist'
              ? 'bg-[#a8bff8] text-[#000e1f] shadow-sm'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${activeTab === 'whitelist' ? 'text-[#000e1f]' : 'text-emerald-400'}`} />
          <span>Lista Blanca ({whitelistDomains.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blocklist')}
          className={`py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-2 ${
            activeTab === 'blocklist'
              ? 'bg-[#a8bff8] text-[#000e1f] shadow-sm'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <ShieldBan className={`w-4 h-4 ${activeTab === 'blocklist' ? 'text-[#000e1f]' : 'text-rose-400'}`} />
          <span>Lista de Bloqueo ({blocklistDomains.length})</span>
        </button>
      </div>

      {/* Search aclarada a #4a6195 con lupa y texto en #000e1f */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#000e1f]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Buscar en ${activeTab === 'whitelist' ? 'lista blanca' : 'lista de bloqueo'}…`}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#4a6195] border border-white/20 focus:border-white/50 text-xs font-bold text-[#000e1f] placeholder-[#000e1f]/75 outline-none transition shadow-sm"
        />
      </div>

      {/* List items con fondo #a8bff8 y texto #000e1f */}
      <div className="space-y-2">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center bg-[#a8bff8] rounded-2xl border border-white/60">
            <Info className="w-8 h-8 text-[#000e1f] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#000e1f]">
              No hay dominios registrados en esta sección.
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-[#a8bff8] border border-white/60 shadow-md flex items-center justify-between transition text-[#000e1f]"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#000e1f] text-[#a8bff8]">
                  {activeTab === 'whitelist' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#a8bff8]" />
                  ) : (
                    <ShieldBan className="w-4 h-4 text-[#a8bff8]" />
                  )}
                </div>

                <div className="overflow-hidden">
                  <span className="text-xs font-mono font-extrabold text-[#000e1f] truncate block">
                    {item.domain}
                  </span>
                  <div className="flex items-center space-x-2 text-[10px] text-[#000e1f]/75 font-semibold">
                    {item.isWildcard && (
                      <span className="bg-[#000e1f] text-[#a8bff8] px-1 rounded font-bold">Comodín (*)</span>
                    )}
                    <span>Añadido {timeAgo(item.createdAt)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  activeTab === 'whitelist'
                    ? removeWhitelistDomain(item.id)
                    : removeBlocklistDomain(item.id)
                }
                className="p-2 rounded-xl text-[#000e1f] hover:bg-black/10 transition"
                title="Eliminar regla"
              >
                <Trash2 className="w-4 h-4 text-[#000e1f]" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Domain */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#a8bff8] border border-white rounded-3xl p-5 shadow-2xl space-y-4 text-[#000e1f]">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#000e1f]">
                Añadir a {activeTab === 'whitelist' ? 'Lista Blanca' : 'Lista de Bloqueo'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#000e1f] font-bold hover:opacity-75">
                ✕
              </button>
            </div>

            {errorMessage && (
              <p className="text-xs p-2 rounded-xl bg-rose-900 text-white font-bold">
                {errorMessage}
              </p>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#000e1f] block mb-1">
                  Nombre de Dominio
                </label>
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="ej. *.ads.com o tracker.org"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#000e1f]/30 text-xs font-bold text-[#000e1f] outline-none"
                />
                <p className="text-[11px] text-[#000e1f]/80 mt-1 font-bold">
                  Puedes usar comodines: <code className="text-[#000e1f]">*.dominio.com</code> para incluir todos los subdominios.
                </p>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/70 hover:bg-white text-xs font-bold text-[#000e1f] transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#000e1f] hover:bg-black text-xs font-bold text-[#a8bff8] transition shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
