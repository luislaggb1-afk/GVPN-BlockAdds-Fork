import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export const ActivityChart: React.FC = () => {
  const [range, setRange] = useState<'24h' | '7d'>('24h');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data24h = [
    { label: '00h', queries: 240, blocked: 82 },
    { label: '02h', queries: 140, blocked: 45 },
    { label: '04h', queries: 95, blocked: 28 },
    { label: '06h', queries: 180, blocked: 62 },
    { label: '08h', queries: 390, blocked: 135 },
    { label: '10h', queries: 620, blocked: 215 },
    { label: '12h', queries: 780, blocked: 260 },
    { label: '14h', queries: 710, blocked: 242 },
    { label: '16h', queries: 640, blocked: 210 },
    { label: '18h', queries: 590, blocked: 195 },
    { label: '20h', queries: 680, blocked: 230 },
    { label: '22h', queries: 490, blocked: 165 },
  ];

  const data7d = [
    { label: 'Lun', queries: 4210, blocked: 1390 },
    { label: 'Mar', queries: 4620, blocked: 1540 },
    { label: 'Mié', queries: 4890, blocked: 1620 },
    { label: 'Jue', queries: 5120, blocked: 1710 },
    { label: 'Vie', queries: 5430, blocked: 1840 },
    { label: 'Sáb', queries: 3980, blocked: 1290 },
    { label: 'Dom', queries: 3650, blocked: 1180 },
  ];

  const currentData = range === '24h' ? data24h : data7d;
  const maxQueries = Math.max(...currentData.map((d) => d.queries), 1);

  return (
    <div className="p-4 rounded-2xl bg-[#a8bff8]/88 backdrop-blur-[5px] border border-white/60 shadow-md space-y-4 transition-all duration-300 ease-out hover:scale-[1.02] hover:backdrop-blur-[12px] hover:bg-[#a8bff8]/95 hover:shadow-lg hover:border-white/90">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#000e1f] stroke-[2.5]" />
          <h4 className="font-extrabold text-sm text-[#000e1f]">Actividad</h4>
        </div>

        <div className="flex items-center p-0.5 rounded-full bg-[#000e1f]/10 border border-[#000e1f]/30">
          <button
            onClick={() => setRange('24h')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
              range === '24h'
                ? 'bg-[#000e1f] text-[#a8bff8] shadow-sm'
                : 'text-[#000e1f] hover:bg-[#000e1f]/10'
            }`}
          >
            24 Horas
          </button>
          <button
            onClick={() => setRange('7d')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
              range === '7d'
                ? 'bg-[#000e1f] text-[#a8bff8] shadow-sm'
                : 'text-[#000e1f] hover:bg-[#000e1f]/10'
            }`}
          >
            7 Días
          </button>
        </div>
      </div>

      {/* Bar Chart Visualization con línea base inferior */}
      <div className="pt-2">
        <div className="h-32 flex items-end justify-between gap-1.5 px-1 border-b border-[#000e1f]/30 pb-1">
          {currentData.map((item, idx) => {
            const totalHeight = Math.max(12, (item.queries / maxQueries) * 100);
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 px-2 py-1 bg-[#000e1f] border border-white/30 rounded-lg shadow-lg text-[10px] whitespace-nowrap pointer-events-none text-white">
                    <span className="font-bold block">{item.label}</span>
                    <span className="text-[#a8bff8]">Total: {item.queries}</span>
                    <span className="text-rose-300 ml-1.5">Bloqueados: {item.blocked}</span>
                  </div>
                )}

                {/* Bar Stack */}
                <div
                  className={`w-full rounded-t-sm transition-all duration-200 relative overflow-hidden flex flex-col justify-end ${
                    isHovered ? 'opacity-100 scale-x-110' : 'opacity-90'
                  }`}
                  style={{
                    height: `${totalHeight}%`,
                    backgroundColor: 'rgba(0, 14, 31, 0.2)',
                  }}
                >
                  {/* Blocked portion */}
                  <div
                    className="w-full bg-[#000e1f] rounded-t-sm"
                    style={{ height: `${(item.blocked / item.queries) * 100}%` }}
                  />
                </div>

                {/* X-axis label */}
                <span className="text-[10px] text-[#000e1f] mt-1.5 font-bold">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs text-[#000e1f] font-bold pt-1">
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#000e1f]/20 border border-[#000e1f]/40" />
          <span>Consultas totales</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#000e1f]" />
          <span>Anuncios bloqueados</span>
        </div>
      </div>
    </div>
  );
};
