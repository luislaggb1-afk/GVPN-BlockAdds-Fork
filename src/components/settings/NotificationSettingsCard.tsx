import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, ShieldOff, Volume2, VolumeX, Sparkles, Check, AlertTriangle, Play, Smartphone } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { requestNotificationPermission, playAlertTone, sendSystemNotification } from '../../utils/notificationService';

export const NotificationSettingsCard: React.FC = () => {
  const { settings, updateSettings, triggerTestNotification } = useApp();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [testSent, setTestSent] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionStatus(res);
    if (res === 'granted') {
      updateSettings({ pushNotificationsEnabled: true });
      sendSystemNotification({
        title: '🔔 Notificaciones GVPN Habilitadas',
        body: 'Recibirás alertas críticas cuando la protección cambie o se detecten amenazas.',
        type: 'success',
      });
      playAlertTone('info');
    }
  };

  const handleTestNotification = (type: 'protection_disabled' | 'threat_detected') => {
    if (settings.notifySoundEnabled) {
      playAlertTone(type === 'threat_detected' ? 'threat' : 'warning');
    }

    if (type === 'protection_disabled') {
      triggerTestNotification({
        title: '⚠️ GVPN: Protección Desactivada',
        body: 'El túnel VPN se ha detenido. Tu dispositivo ya no está filtrando anuncios ni rastreadores.',
        type: 'protection_disabled',
        actionText: 'Reactivar Ahora',
      });
    } else {
      triggerTestNotification({
        title: '🛡️ GVPN: Alto Tráfico Malicioso',
        body: `Se interceptó una ráfaga de más de ${settings.threatVolumeThreshold || 25} intentos de conexión a dominios de malware y rastreo.`,
        type: 'threat_detected',
        actionText: 'Ver Registros',
      });
    }

    setTestSent(type);
    setTimeout(() => setTestSent(null), 3500);
  };

  return (
    <div className="p-4 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md space-y-4 transition-all duration-300 ease-out hover:backdrop-blur-[12px] hover:bg-[#a8bff8]/95 hover:shadow-lg hover:border-white/90">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#000e1f] text-[#a8bff8] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Bell className="w-4 h-4 stroke-[2.3]" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#000e1f] leading-tight">Alertas & Notificaciones</h4>
            <p className="text-[11px] font-bold text-[#000e1f]/75">Supervisión en tiempo real del estado de seguridad</p>
          </div>
        </div>

        {permissionStatus === 'granted' ? (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-950 border border-emerald-800/30 flex items-center gap-1">
            <Check className="w-2.5 h-2.5" /> Activo
          </span>
        ) : (
          <button
            onClick={handleRequestPermission}
            className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#000e1f] text-[#a8bff8] hover:bg-black transition shadow-sm"
          >
            Habilitar Push
          </button>
        )}
      </div>

      {/* Switches Grid */}
      <div className="space-y-2.5 pt-1">
        {/* 1. Alerta al Desactivar Protección */}
        <div className="p-3 rounded-xl bg-white/70 border border-[#000e1f]/10 flex items-center justify-between transition hover:bg-white/85">
          <div className="flex items-center space-x-2.5 pr-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-900 flex items-center justify-center flex-shrink-0">
              <ShieldOff className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#000e1f] block leading-tight">
                Alerta de Protección Desactivada
              </span>
              <span className="text-[10px] font-bold text-[#000e1f]/70 block">
                Avisa de inmediato si la VPN, Shizuku o Root se detienen
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={settings.notifyOnProtectionDisabled}
              onChange={(e) => updateSettings({ notifyOnProtectionDisabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#000e1f]"></div>
          </label>
        </div>

        {/* 2. Alerta de Tráfico Malicioso */}
        <div className="p-3 rounded-xl bg-white/70 border border-[#000e1f]/10 flex items-center justify-between transition hover:bg-white/85">
          <div className="flex items-center space-x-2.5 pr-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-900 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-[#000e1f] block leading-tight">
                Alerta de Tráfico Malicioso Masivo
              </span>
              <span className="text-[10px] font-bold text-[#000e1f]/70 block">
                Notificar al detectar ráfagas de malware o telemetría
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={settings.notifyOnHighThreatVolume}
              onChange={(e) => updateSettings({ notifyOnHighThreatVolume: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#000e1f]"></div>
          </label>
        </div>

        {/* Umbral de Tráfico Malicioso (Visible si está activo) */}
        {settings.notifyOnHighThreatVolume && (
          <div className="p-3 rounded-xl bg-white/60 border border-[#000e1f]/10 space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-black text-[#000e1f]">
              <span>Umbral de Amenazas por Minuto</span>
              <span className="px-2 py-0.5 rounded-full bg-[#000e1f] text-[#a8bff8] text-[10px]">
                &gt; {settings.threatVolumeThreshold || 25} amenazas
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[10, 25, 50, 100].map((thr) => (
                <button
                  key={thr}
                  onClick={() => updateSettings({ threatVolumeThreshold: thr })}
                  className={`py-1 rounded-lg text-[11px] font-extrabold transition ${
                    (settings.threatVolumeThreshold || 25) === thr
                      ? 'bg-[#000e1f] text-[#a8bff8] shadow-sm'
                      : 'bg-white/70 text-[#000e1f] hover:bg-white'
                  }`}
                >
                  {thr} req/m
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Sonido de Notificación */}
        <div className="p-3 rounded-xl bg-white/70 border border-[#000e1f]/10 flex items-center justify-between transition hover:bg-white/85">
          <div className="flex items-center space-x-2.5 pr-2">
            <div className="w-7 h-7 rounded-lg bg-[#000e1f]/10 text-[#000e1f] flex items-center justify-center flex-shrink-0">
              {settings.notifySoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-xs font-black text-[#000e1f] block leading-tight">
                Sonido Acústico de Seguridad
              </span>
              <span className="text-[10px] font-bold text-[#000e1f]/70 block">
                Reproducir tono sintetizado al interceptar eventos críticos
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={settings.notifySoundEnabled}
              onChange={(e) => updateSettings({ notifySoundEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#000e1f]"></div>
          </label>
        </div>
      </div>

      {/* Botones de Prueba Interactivos */}
      <div className="pt-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#000e1f]/70 block mb-1.5">
          Comprobar Alertas en Dispositivo
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleTestNotification('protection_disabled')}
            className="p-2 rounded-xl bg-white/80 hover:bg-white border border-[#000e1f]/15 text-[#000e1f] text-[11px] font-extrabold flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
          >
            <ShieldOff className="w-3.5 h-3.5 text-amber-700" />
            <span>{testSent === 'protection_disabled' ? '¡Alerta Emitida!' : 'Probar Desconexión'}</span>
          </button>

          <button
            onClick={() => handleTestNotification('threat_detected')}
            className="p-2 rounded-xl bg-white/80 hover:bg-white border border-[#000e1f]/15 text-[#000e1f] text-[11px] font-extrabold flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
            <span>{testSent === 'threat_detected' ? '¡Alerta Emitida!' : 'Probar Amenaza'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
