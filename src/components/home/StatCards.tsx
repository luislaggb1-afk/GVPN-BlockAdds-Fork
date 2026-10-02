import React from 'react';
import { useApp } from '../../store/AppContext';
import { formatCount, formatDataSize, formatUptime } from '../../utils/helpers';

export const StatCards: React.FC = () => {
  const {
    totalQueries,
    blockedQueries,
    securityThreats,
    blockRate,
    dataSavedMb,
    activeFilterRulesCount,
    uptimeSeconds,
    vpnStatus,
  } = useApp();

  const isProtected = vpnStatus === 'protected';

  // 1. Tasa de Bloqueo: Gráfica de barras detallada con base y 3 niveles
  const DetailedBarChartIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="10" width="4.5" height="10" rx="1.5" fill="#000e1f" />
      <rect x="9.5" y="4" width="4.5" height="16" rx="1.5" fill="#000e1f" />
      <rect x="17" y="7" width="4.5" height="13" rx="1.5" fill="#000e1f" />
      <line x1="2" y1="21" x2="22" y2="21" stroke="#000e1f" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  // 2. Bloqueos: Escudo detallado con exclamación interior contrastante
  const DetailedShieldAlertIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L3 6V12C3 17.5 6.8 21.6 12 23C17.2 21.6 21 17.5 21 12V6L12 2Z"
        fill="#000e1f"
      />
      <path d="M12 7.5V13" stroke="#a8bff8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.2" fill="#a8bff8" />
    </svg>
  );

  // 3. Anuncios Bloqueados: Pantalla publicitaria con símbolo 'X' de bloqueo
  const DetailedAdBlockIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3.5" width="20" height="14" rx="2.5" fill="#000e1f" />
      <path
        d="M8.5 7.5L15.5 13.5M15.5 7.5L8.5 13.5"
        stroke="#a8bff8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M12 17.5V20.5" stroke="#000e1f" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 20.5H17" stroke="#000e1f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // 4. Reglas de Filtro: Panel de reglas / sliders con pistas y botones en contraste
  const DetailedFilterRulesIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" fill="#000e1f" />
      <path d="M6 7.5H18M6 12H18M6 16.5H18" stroke="#a8bff8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="7.5" r="2" fill="#a8bff8" />
      <circle cx="15" cy="12" r="2" fill="#a8bff8" />
      <circle cx="11" cy="16.5" r="2" fill="#a8bff8" />
    </svg>
  );

  // 5. Datos Ahorrados: Servidor / Unidad de almacenamiento con bahía y luces
  const DetailedHardDriveIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" fill="#000e1f" />
      <line x1="2.5" y1="13.5" x2="21.5" y2="13.5" stroke="#a8bff8" strokeWidth="1.5" />
      <circle cx="6.5" cy="16.5" r="1.25" fill="#a8bff8" />
      <circle cx="10" cy="16.5" r="1.25" fill="#a8bff8" />
      <line x1="15" y1="9" x2="18.5" y2="9" stroke="#a8bff8" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="15" y1="16.5" x2="18.5" y2="16.5" stroke="#a8bff8" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );

  // 6. Tiempo Protegido: Reloj detallado con bisel y manecillas
  const DetailedClockIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#000e1f" />
      <path
        d="M12 6.5V12L15.5 14.5"
        stroke="#a8bff8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="#a8bff8" />
    </svg>
  );

  const cards = [
    {
      title: 'Tasa de Bloqueo',
      value: `${blockRate}%`,
      subtitle: `${formatCount(blockedQueries)} de ${formatCount(totalQueries)}`,
      icon: DetailedBarChartIcon,
      progress: blockRate,
    },
    {
      title: 'Bloqueos',
      value: securityThreats.toString(),
      subtitle: 'Amenazas y rastreadores',
      icon: DetailedShieldAlertIcon,
    },
    {
      title: 'Anuncios Bloqueados',
      value: formatCount(blockedQueries),
      subtitle: 'Publicidad interceptada',
      icon: DetailedAdBlockIcon,
    },
    {
      title: 'Reglas de Filtro',
      value: formatCount(activeFilterRulesCount),
      subtitle: 'Listas locales compiladas',
      icon: DetailedFilterRulesIcon,
    },
    {
      title: 'Datos Ahorrados',
      value: formatDataSize(dataSavedMb),
      subtitle: 'Ancho de banda ahorrado',
      icon: DetailedHardDriveIcon,
    },
    {
      title: 'Tiempo Protegido',
      value: isProtected ? formatUptime(uptimeSeconds) : 'Pausado',
      subtitle: 'Sesión activa actual',
      icon: DetailedClockIcon,
      isLargeText: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md flex flex-col justify-between h-[96px] transition-all duration-300 ease-out hover:scale-[1.02] hover:backdrop-blur-[12px] hover:bg-[#a8bff8]/95 hover:shadow-lg hover:border-white/90"
          >
            {/* Icono a la izquierda del nombre */}
            <div className="flex items-center space-x-2 overflow-hidden">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold text-[#000e1f] truncate">{card.title}</span>
            </div>

            <div>
              <span className={`${card.isLargeText ? 'text-lg font-black' : 'text-base font-extrabold'} text-[#000e1f] tracking-tight block truncate`}>
                {card.value}
              </span>
              <p className="text-[10px] font-bold text-[#000e1f]/80 truncate">{card.subtitle}</p>
            </div>

            {card.progress !== undefined ? (
              <div className="w-full bg-[#000e1f]/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#000e1f] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, card.progress))}%` }}
                />
              </div>
            ) : (
              <div className="h-1.5" />
            )}
          </div>
        );
      })}
    </div>
  );
};
