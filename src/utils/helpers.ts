export function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toLocaleString();
}

export function formatDataSize(mb: number): string {
  if (mb >= 1024) {
    return (mb / 1024).toFixed(2) + ' GB';
  }
  return mb.toFixed(1) + ' MB';
}

export function formatUptime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hours > 0) {
    return `${pad(hours)}h ${pad(minutes)}m`;
  }
  return `${pad(minutes)}m ${pad(seconds)}s`;
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return 'ahora';
  if (seconds < 60) return `hace ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export function getAccentColorHex(accent?: string): { primary: string; dim: string; text: string; bgSoft: string; borderSoft: string } {
  switch (accent) {
    case 'indigo':
      return { primary: '#4F46E5', dim: '#4338CA', text: '#818CF8', bgSoft: 'rgba(79, 70, 229, 0.15)', borderSoft: 'rgba(79, 70, 229, 0.35)' };
    case 'slate':
      return { primary: '#475569', dim: '#334155', text: '#94A3B8', bgSoft: 'rgba(71, 85, 105, 0.15)', borderSoft: 'rgba(71, 85, 105, 0.35)' };
    case 'cyan':
      return { primary: '#0284C7', dim: '#0369A1', text: '#38BDF8', bgSoft: 'rgba(2, 132, 199, 0.15)', borderSoft: 'rgba(2, 132, 199, 0.35)' };
    case 'steel':
      return { primary: '#2563EB', dim: '#1E40AF', text: '#60A5FA', bgSoft: 'rgba(37, 99, 235, 0.15)', borderSoft: 'rgba(37, 99, 235, 0.35)' };
    case 'navy':
    default:
      // Navy Blue Palette (no neon, deep and rich)
      return { primary: '#2563EB', dim: '#1D4ED8', text: '#93C5FD', bgSoft: 'rgba(37, 99, 235, 0.14)', borderSoft: 'rgba(37, 99, 235, 0.3)' };
  }
}
