import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { formatCount } from '../utils/helpers';
import { Search, Plus, RefreshCw, Trash2, Filter } from 'lucide-react';

export const FilterSetupScreen: React.FC = () => {
  const {
    filterLists,
    toggleFilterList,
    updateAllFilters,
    isUpdatingFilters,
    addCustomFilterList,
    deleteFilterList,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'AD' | 'SECURITY' | 'custom'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add custom list form state
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<'AD' | 'SECURITY'>('AD');
  const [formError, setFormError] = useState('');

  const filteredLists = filterLists.filter((list) => {
    const matchesSearch =
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'custom') {
        if (!list.url.includes('http')) return false;
      } else if (list.category !== selectedCategory) {
        return false;
      }
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUrl.trim()) {
      setFormError('Por favor completa el nombre y la URL de la lista.');
      return;
    }

    try {
      new URL(formUrl);
    } catch {
      setFormError('Ingresa una URL válida (http:// o https://)');
      return;
    }

    addCustomFilterList({
      name: formName.trim(),
      url: formUrl.trim(),
      description: formDesc.trim() || 'Lista de filtros personalizada',
      isEnabled: true,
      category: formCategory,
      bloomUrl: '',
      trieUrl: '',
      cssUrl: '',
      scriptletsUrl: '',
    });

    setFormName('');
    setFormUrl('');
    setFormDesc('');
    setFormError('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title & Circular Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Filter className="w-5 h-5 text-[#a8bff8] fill-current flex-shrink-0" />
          <h2 className="text-xl font-bold text-[#F8FAFC]">Filtros</h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Circular Refresh Button */}
          <button
            onClick={() => updateAllFilters()}
            disabled={isUpdatingFilters}
            className="w-9 h-9 rounded-full bg-[#a8bff8] border border-white/60 flex items-center justify-center text-[#000e1f] hover:opacity-90 transition disabled:opacity-50 shadow-sm"
            title="Actualizar listas de filtros"
          >
            <RefreshCw className={`w-4 h-4 text-[#000e1f] ${isUpdatingFilters ? 'animate-spin' : ''}`} />
          </button>

          {/* Circular Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-9 h-9 rounded-full bg-[#a8bff8] border border-white/60 flex items-center justify-center text-[#000e1f] hover:opacity-90 transition shadow-sm"
            title="Añadir lista personalizada"
          >
            <Plus className="w-4 h-4 text-[#000e1f]" />
          </button>
        </div>
      </div>

      {/* Search Bar aclarada a #4a6195 con lupa y texto en #000e1f */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#000e1f]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar listas de filtros…"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#4a6195]/88 backdrop-blur-[5px] border border-white/20 focus:border-white/50 text-xs font-bold text-[#000e1f] placeholder-[#000e1f]/75 outline-none transition shadow-sm"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'AD', label: 'Publicidad & Rastreo' },
          { key: 'SECURITY', label: 'Seguridad' },
          { key: 'custom', label: 'Personalizadas' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCategory(tab.key as any)}
            className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
              selectedCategory === tab.key
                ? 'bg-[#a8bff8] text-[#000e1f] shadow-sm'
                : 'bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lists Cards */}
      <div className="space-y-3">
        {filteredLists.map((list) => {
          const ruleCountStr = list.ruleCount ? formatCount(list.ruleCount) : 'Varios';

          return (
            <div
              key={list.id}
              className={`p-4 rounded-2xl border transition-all shadow-md flex items-center justify-between backdrop-blur-[5px] ${
                list.isEnabled
                  ? 'bg-[#a8bff8]/88 border-white/80 ring-1 ring-white/30 text-[#000e1f]'
                  : 'bg-[#0F172A]/85 border-[#1E293B] text-slate-300'
              }`}
            >
              <div className="pr-4 overflow-hidden">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-xs font-extrabold truncate ${list.isEnabled ? 'text-[#000e1f]' : 'text-white'}`}>
                    {list.name}
                  </h4>
                  {!list.isBuiltIn && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">
                      Custom
                    </span>
                  )}
                </div>

                <p className={`text-[11px] font-bold mt-1 leading-relaxed ${list.isEnabled ? 'text-[#000e1f]/80' : 'text-slate-400'}`}>
                  {list.description}
                </p>
              </div>

              {/* Lado derecho: regla count alineada a la derecha arriba del toggle */}
              <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    list.isEnabled
                      ? 'bg-[#000e1f] text-[#a8bff8]'
                      : 'bg-[#1E293B] text-slate-400 border border-[#334155]'
                  }`}
                >
                  {ruleCountStr} reglas
                </span>

                <div className="flex items-center space-x-2">
                  {!list.isBuiltIn && (
                    <button
                      onClick={() => deleteFilterList(list.id)}
                      className="p-2 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 transition"
                      title="Eliminar lista personalizada"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => toggleFilterList(list.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                      list.isEnabled
                        ? 'bg-[#000e1f]'
                        : 'bg-[#1E293B] border border-[#334155]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full shadow-md transform transition-transform ${
                        list.isEnabled ? 'translate-x-5 bg-[#a8bff8]' : 'translate-x-0 bg-slate-400'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom List Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-3xl p-5 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Añadir Lista de Filtros</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#94A3B8] hover:text-white">
                ✕
              </button>
            </div>

            {formError && (
              <p className="text-xs p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 font-medium">
                {formError}
              </p>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Nombre de la Lista</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej. Mis reglas personales"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">URL del archivo (.txt / .list)</label>
                <input
                  type="text"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://example.com/filters.txt"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Descripción (opcional)</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Bloqueo adicional para..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#94A3B8] block mb-1">Categoría</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none"
                >
                  <option value="AD">Publicidad &amp; Rastreo (AD)</option>
                  <option value="SECURITY">Seguridad (SECURITY)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white transition shadow-sm"
                >
                  Guardar y Activar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
