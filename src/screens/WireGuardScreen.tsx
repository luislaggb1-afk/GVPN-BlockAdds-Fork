import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { WireGuardProfile } from '../types';
import { Shield, Plus, Upload, Trash2, Power, CheckCircle2, Info, Network } from 'lucide-react';

interface WireGuardScreenProps {
  onClose?: () => void;
}

export const WireGuardScreen: React.FC<WireGuardScreenProps> = ({ onClose }) => {
  const {
    wireguardProfiles,
    importWireguardConfig,
    toggleWireguardConnect,
    deleteWireguardProfile,
  } = useApp();

  const [showImportModal, setShowImportModal] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [confText, setConfText] = useState('');
  const [importError, setImportError] = useState('');

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confText.trim()) {
      setImportError('Por favor pega el contenido del archivo .conf');
      return;
    }

    const res = importWireguardConfig(profileName.trim() || 'Túnel WireGuard', confText);
    if (!res.success) {
      setImportError(res.error || 'Error al importar');
      return;
    }

    setProfileName('');
    setConfText('');
    setImportError('');
    setShowImportModal(false);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Túneles WireGuard</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Combina el bloqueo de anuncios GVPN con tu servidor VPN WireGuard cifrado
          </p>
        </div>

        <button
          onClick={() => setShowImportModal(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white flex items-center space-x-1.5 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Importar .conf</span>
        </button>
      </div>

      {/* Profiles List */}
      <div className="space-y-3">
        {wireguardProfiles.length === 0 ? (
          <div className="p-8 text-center bg-[#0F172A] rounded-2xl border border-[#1E293B]">
            <Network className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#94A3B8]">No hay perfiles WireGuard importados</p>
            <p className="text-xs text-[#64748B] mt-1">
              Importa un archivo .conf de tu servidor WireGuard o proveedor VPN.
            </p>
          </div>
        ) : (
          wireguardProfiles.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-2xl border transition-all ${
                p.isConnected
                  ? 'bg-[#1E293B] border-[#2563EB] ring-1 ring-[#2563EB]'
                  : 'bg-[#0F172A] border-[#1E293B]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-[#F8FAFC]">{p.name}</h3>
                    {p.isConnected && (
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                        Conectado
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[#94A3B8] block mt-0.5">
                    Endpoint: {p.peerEndpoint}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleWireguardConnect(p.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      p.isConnected
                        ? 'bg-rose-900/60 border border-rose-700 text-rose-300 hover:bg-rose-900'
                        : 'bg-[#2563EB] text-white hover:bg-blue-600'
                    }`}
                  >
                    {p.isConnected ? 'Desconectar' : 'Conectar'}
                  </button>

                  <button
                    onClick={() => deleteWireguardProfile(p.id)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-[#64748B]">
                <span>IP Asignada: {p.address}</span>
                <span>DNS: {p.dns}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Import */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#F8FAFC]">Importar Configuración WireGuard</h3>
              <button onClick={() => setShowImportModal(false)} className="text-[#64748B] hover:text-white">
                ✕
              </button>
            </div>

            {importError && (
              <p className="text-xs p-2 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300">
                {importError}
              </p>
            )}

            <form onSubmit={handleImportSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Nombre del Perfil</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="ej. Servidor Casa o VPN Trabajo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                  Contenido de configuración .conf
                </label>
                <textarea
                  rows={8}
                  value={confText}
                  onChange={(e) => setConfText(e.target.value)}
                  placeholder="[Interface]&#10;PrivateKey = ...&#10;Address = 10.200.0.2/32&#10;DNS = 1.1.1.1&#10;&#10;[Peer]&#10;PublicKey = ...&#10;Endpoint = vpn.ejemplo.com:51820&#10;AllowedIPs = 0.0.0.0/0"
                  className="w-full p-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-xs font-mono text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white transition shadow-sm"
                >
                  Importar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
