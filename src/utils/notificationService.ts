// Notification Service for GVPN
export interface NotificationPayload {
  title: string;
  body: string;
  type: 'protection_disabled' | 'threat_detected' | 'info' | 'success' | 'warning';
  icon?: string;
  actionText?: string;
  onAction?: () => void;
}

// Subtle audio synthesizer for security alerts (Web Audio API)
export function playAlertTone(type: 'warning' | 'threat' | 'info' = 'warning') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'threat') {
      // Urgent double beep (threat warning)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);
      osc.frequency.setValueAtTime(640, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (type === 'warning') {
      // Minor alert tone for protection disabled
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(330, now + 0.25);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.26);
    } else {
      // Soft ping for success / info
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.18);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.21);
    }
  } catch (e) {
    // AudioContext may be restricted before user interaction
    console.debug('Audio notification not allowed yet', e);
  }
}

// Request Browser Push Notification Permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (err) {
    console.warn('Error requesting notification permission', err);
    return Notification.permission;
  }
}

// Send system notification
export function sendSystemNotification(payload: NotificationPayload) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      const notif = new Notification(payload.title, {
        body: payload.body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: `gvpn-${payload.type}-${Date.now()}`,
      });

      notif.onclick = () => {
        window.focus();
        if (payload.onAction) payload.onAction();
        notif.close();
      };
    } catch (e) {
      console.warn('Could not display system notification', e);
    }
  }
}
