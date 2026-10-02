import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ShieldCheck, Download, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, Lock } from 'lucide-react';

interface HttpsFilteringScreenProps {
  onClose?: () => void;
}

export const HttpsFilteringScreen: React.FC<HttpsFilteringScreenProps> = ({ onClose }) => {
  const {
    settings,
    updateSettings,
    downloadRootCaCert,
    verifyRootCaCert,
    isVerifyingCert,
  } = useApp();

  const [certDownloaded, setCertDownloaded] = useState(false);

  const handleDownload = () => {
    downloadRootCaCert();
    setCertDownloaded(true);
  };

  const browsers = [
    { pkg: 'com.android.chrome', name: 'Google Chrome', icon: '🌐' },
    { pkg: 'org.mozilla.firefox', name: 'Firefox Browser', icon: '🦊' },
    { pkg: 'com.brave.browser', name: 'Brave Browser', icon: '🦁' },
    { pkg: 'com.microsoft.emmx', name: 'Microsoft Edge', icon: '🌀' },
    { pkg: 'com.sec.android.app.sbrowser', name: 'Samsung Internet', icon: '🪐' },
    { pkg: 'com.duckduckgo.mobile.android', name: 'DuckDuckGo', icon: '🦆' },
  ];

  const toggleBrowser = (pkg: string) => {
    if (settings.selectedBrowsers.includes(pkg)) {
      updateSettings({
        selectedBrowsers: settings.selectedBrowsers.filter((b) => b !== pkg),
      });
    } else {
      updateSettings({
        selectedBrowsers: [...settings.selectedBrowsers, pkg],
      });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#F8FAFC]">Filtrado HTTPS Cosmético</h2>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Oculta espacios en blanco, banners de cookies y anuncios residuales dentro de navegadores web
        </p>
      </div>

      {/* Master Toggle Card */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
        <div className="space-y-0.5 pr-2">
          <h4 className="text-sm font-bold text-[#F8FAFC]">Filtro Cosmético HTTPS</h4>
          <p className="text-xs text-[#94A3B8]">
            Inyecta reglas CSS y scriptlets locales en respuestas web para eliminar anuncios vacíos.
          </p>
        </div>

        <button
          onClick={() => updateSettings({ httpsFilteringEnabled: !settings.httpsFilteringEnabled })}
          className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 flex-shrink-0 ${
            settings.httpsFilteringEnabled ? 'bg-[#2563EB]' : 'bg-[#1E293B] border border-[#334155]'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
              settings.httpsFilteringEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/70 border border-[#334155] space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-blue-400 font-bold">
          <Lock className="w-4 h-4" />
          <span>Privacidad 100% Protegida</span>
        </div>
        <p className="text-[#94A3B8] leading-relaxed">
          El certificado CA se genera <strong>únicamente en tu dispositivo local</strong>.
          GVPN nunca intercepta aplicaciones bancarias ni pasarelas de pago (lista de exclusión de 284 dominios financieros).
        </p>
      </div>

      {/* Setup Steps Guide */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-4">
        <h4 className="font-bold text-sm text-[#F8FAFC]">Guía de Configuración del Certificado</h4>

        {/* Step 1 */}
        <div className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Paso 1: Guardar Certificado CA</span>
            <span className="text-[11px] text-[#94A3B8]">Descarga GVPN-RootCA.crt a tu dispositivo</span>
          </div>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white flex items-center space-x-1.5 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{certDownloaded ? 'Descargado ✓' : 'Descargar'}</span>
          </button>
        </div>

        {/* Step 2 */}
        <div className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] space-y-1.5 text-xs text-[#94A3B8]">
          <span className="font-bold text-white block">Paso 2: Instalar en Ajustes de Android</span>
          <p className="text-[11px] leading-relaxed">
            1. Abre Ajustes de Android → Seguridad → Cifrado y credenciales.<br />
            2. Selecciona "Instalar un certificado" → "Certificado de CA".<br />
            3. Elige el archivo <code>GVPN-RootCA.crt</code> en tu carpeta Descargas.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">Paso 3: Verificar Instalación</span>
            <span className="text-[11px] text-[#94A3B8]">
              {settings.httpsFilteringInstalled
                ? 'Certificado verificado e instalado ✓'
                : 'Comprobar si el sistema confía en el certificado'}
            </span>
          </div>

          <button
            onClick={() => verifyRootCaCert()}
            disabled={isVerifyingCert}
            className="px-3 py-1.5 rounded-full bg-[#0F172A] border border-[#334155] hover:border-blue-500 text-xs font-semibold text-white flex items-center space-x-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingCert ? 'animate-spin text-blue-400' : ''}`} />
            <span>{isVerifyingCert ? 'Verificando…' : 'Verificar'}</span>
          </button>
        </div>
      </div>

      {/* Browser Selection Section */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-3">
        <h4 className="font-bold text-sm text-[#F8FAFC]">Navegadores Habilitados para Filtrado Cosmético</h4>
        <p className="text-xs text-[#94A3B8]">
          Sólo los navegadores seleccionados tendrán inyección de CSS para ocultar elementos de publicidad.
        </p>

        <div className="space-y-2 pt-1">
          {browsers.map((b) => {
            const isSelected = settings.selectedBrowsers.includes(b.pkg);

            return (
              <div
                key={b.pkg}
                onClick={() => toggleBrowser(b.pkg)}
                className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between cursor-pointer hover:border-slate-500 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-white block">{b.name}</span>
                    <span className="text-[10px] text-[#64748B]">{b.pkg}</span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    isSelected ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-[#475569]'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUIC / HTTP3 Toggle */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
        <div className="space-y-0.5 pr-2">
          <h4 className="text-sm font-bold text-[#F8FAFC]">Filtrar HTTP/3 (QUIC)</h4>
          <p className="text-xs text-[#94A3B8]">
            Fuerza conexiones navegables a HTTP/2 para permitir el filtrado cosmético de anuncios de Google/YouTube.
          </p>
        </div>

        <button
          onClick={() => updateSettings({ filterHttp3: !settings.filterHttp3 })}
          className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 flex-shrink-0 ${
            settings.filterHttp3 ? 'bg-[#2563EB]' : 'bg-[#1E293B] border border-[#334155]'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
              settings.filterHttp3 ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
