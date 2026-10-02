import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { DnsProvider, DnsResponseType } from '../types';
import { Globe, Shield, Plus, Check, Settings, Info, Server } from 'lucide-react';

interface DnsProviderScreenProps {
  onClose?: () => void;
}

export const DnsProviderScreen: React.FC<DnsProviderScreenProps> = ({ onClose }) => {
  const {
    dnsProviders,
    activeDnsProvider,
    setDnsProvider,
    saveCustomDns,
    settings,
    updateSettings,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'PRIVACY' | 'STANDARD' | 'FAMILY' | 'CUSTOM'>('ALL');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom DNS form
  const [customName, setCustomName] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customError, setCustomError] = useState('');

  const filteredProviders = dnsProviders.filter((p) => {
    if (activeCategory === 'ALL') return true;
    return p.category === activeCategory;
  });

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customAddress.trim()) {
      setCustomError('Por favor completa el nombre y la dirección del servidor');
      return;
    }

    const isDoh = customAddress.startsWith('https://');
    const isDot = customAddress.startsWith('tls://');
    const isDoq = customAddress.startsWith('quic://');

    const newProvider: DnsProvider = {
      id: 'custom-dns-' + Date.now(),
      name: customName.trim(),
      category: 'CUSTOM',
      ipAddress: isDoh || isDot || isDoq ? '0.0.0.0' : customAddress.trim(),
      dohUrl: isDoh ? customAddress.trim() : null,
      dotHost: isDot ? customAddress.replace('tls://', '') : null,
      doqHost: isDoq ? customAddress.replace('quic://', '') : null,
      description: customDesc.trim() || 'Servidor DNS personalizado',
      isCustom: true,
    };

    saveCustomDns(newProvider);
    setCustomName('');
    setCustomAddress('');
    setCustomDesc('');
    setCustomError('');
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Servidores DNS</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Configura el proveedor DNS que resolverá las peticiones de red
          </p>
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white flex items-center space-x-1.5 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir DNS</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'ALL', label: 'Todos' },
          { key: 'PRIVACY', label: 'Privacidad' },
          { key: 'STANDARD', label: 'Estándar' },
          { key: 'FAMILY', label: 'Familiar' },
          { key: 'CUSTOM', label: 'Personalizados' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key as any)}
            className={`px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
              activeCategory === tab.key
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Providers Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredProviders.map((provider) => {
          const isSelected = activeDnsProvider.id === provider.id;

          return (
            <div
              key={provider.id}
              onClick={() => setDnsProvider(provider.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1E293B] border-[#2563EB] ring-1 ring-[#2563EB]'
                  : 'bg-[#0F172A] border-[#1E293B] hover:border-[#334155]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#2563EB] text-white' : 'bg-[#1E293B] text-[#94A3B8]'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">{provider.name}</h4>
                      <span className="text-[10px] text-[#64748B] font-mono">
                        {provider.dohUrl ? 'DNS-over-HTTPS' : provider.ipAddress}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-[#475569]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <p className="text-xs text-[#94A3B8] mt-2.5 leading-relaxed">
                  {provider.description}
                </p>
              </div>

              {provider.dohUrl && (
                <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-[#64748B]">
                  <span className="px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-300 font-semibold">
                    DoH Cifrado
                  </span>
                  <span className="truncate max-w-[150px] font-mono text-[9px] text-[#94A3B8]">
                    {provider.dohUrl}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Advanced DNS Options (Fallback & Response Type) */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-4">
        <div className="flex items-center space-x-2">
          <Server className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-bold text-[#F8FAFC]">Opciones Avanzadas de DNS</h4>
        </div>

        {/* Fallback DNS */}
        <div>
          <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
            Servidor DNS de Respaldo (Fallback)
          </label>
          <input
            type="text"
            value={settings.fallbackDnsAddress}
            onChange={(e) => updateSettings({ fallbackDnsAddress: e.target.value })}
            placeholder="1.1.1.1 o 8.8.8.8"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs font-mono text-white outline-none focus:border-[#2563EB]"
          />
          <p className="text-[11px] text-[#64748B] mt-1">
            Se utiliza automáticamente si el servidor DNS principal experimenta fallos de conectividad.
          </p>
        </div>

        {/* DNS Response Type */}
        <div>
          <label className="text-xs font-semibold text-[#94A3B8] block mb-1.5">
            Tipo de Respuesta para Dominios Bloqueados
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'custom_ip', label: '0.0.0.0 (Null)', desc: 'Ruta nula predeterminada' },
              { key: 'nxdomain', label: 'NXDOMAIN', desc: 'Dominio no existe' },
              { key: 'refused', label: 'REFUSED', desc: 'Petición rechazada' },
            ].map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => updateSettings({ dnsResponseType: type.key as DnsResponseType })}
                className={`p-2.5 rounded-xl border text-left transition ${
                  settings.dnsResponseType === type.key
                    ? 'bg-[#1E293B] border-[#2563EB] text-white'
                    : 'bg-[#1E293B]/40 border-[#334155] text-[#94A3B8] hover:text-white'
                }`}
              >
                <span className="font-mono text-xs font-bold block">{type.label}</span>
                <span className="text-[10px] text-[#64748B] block mt-0.5">{type.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom DNS Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#F8FAFC]">Añadir Servidor DNS</h3>
              <button onClick={() => setShowCustomModal(false)} className="text-[#64748B] hover:text-white">
                ✕
              </button>
            </div>

            {customError && (
              <p className="text-xs p-2 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300">
                {customError}
              </p>
            )}

            <form onSubmit={handleSaveCustom} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Nombre</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="ej. Mi DNS Privado"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                  Dirección IP o URL (DoH / DoT / DoQ)
                </label>
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="ej. 94.140.14.14 o https://dns.ejemplo.com/dns-query"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs font-mono text-white outline-none focus:border-[#2563EB]"
                />
                <p className="text-[10px] text-[#64748B] mt-1">
                  Detecta automáticamente Plain IP, DoH (https://), DoT (tls://) o DoQ (quic://).
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Descripción</label>
                <input
                  type="text"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Servidor DNS corporativo o doméstico"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
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
