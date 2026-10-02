import React from 'react';
import { ShieldAlert, ShieldOff, Bell, X, Check, ArrowRight } from 'lucide-react';
import { NotificationPayload } from '../../utils/notificationService';

interface NotificationToastProps {
  notification: NotificationPayload | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
}) => {
  if (!notification) return null;

  const isThreat = notification.type === 'threat_detected';
  const isOff = notification.type === 'protection_disabled';

  return (
    <div className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-fadeIn">
      <div className="pointer-events-auto max-w-md w-full bg-[#1E293B]/95 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 shadow-2xl shadow-black/80 flex items-start space-x-3 text-white">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isThreat
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : isOff
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-[#a8bff8]/20 text-[#a8bff8] border border-[#a8bff8]/30'
          }`}
        >
          {isThreat ? (
            <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
          ) : isOff ? (
            <ShieldOff className="w-5 h-5 stroke-[2.2]" />
          ) : (
            <Bell className="w-5 h-5 stroke-[2.2]" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
            {notification.title}
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
            {notification.body}
          </p>

          {notification.actionText && (
            <div className="mt-2 flex items-center space-x-2">
              <button
                onClick={() => {
                  if (notification.onAction) notification.onAction();
                  onClose();
                }}
                className="px-3 py-1 rounded-full bg-[#a8bff8] text-[#000e1f] text-xs font-black flex items-center space-x-1 hover:opacity-90 transition shadow-sm"
              >
                <span>{notification.actionText}</span>
                <ArrowRight className="w-3 h-3 text-[#000e1f]" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
