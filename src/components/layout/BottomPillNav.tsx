import React from 'react';
import { Shield, Filter, Flame } from 'lucide-react';
import { LogFileIcon } from '../common/LogFileIcon';
import { DetailedSettingsIcon } from '../common/DetailedSettingsIcon';

export type TabKey = 'home' | 'filters' | 'firewall' | 'logs' | 'settings';

interface BottomPillNavProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const BottomPillNav: React.FC<BottomPillNavProps> = ({ currentTab, onTabChange }) => {
  const tabs: {
    key: TabKey;
    label: string;
    icon: (props: { className?: string; isDark?: boolean }) => React.ReactNode;
  }[] = [
    {
      key: 'home',
      label: 'Inicio',
      icon: ({ className }) => <Shield className={`${className} fill-current`} />,
    },
    {
      key: 'filters',
      label: 'Filtros',
      icon: ({ className }) => <Filter className={`${className} fill-current`} />,
    },
    {
      key: 'firewall',
      label: 'Firewall',
      icon: ({ className }) => <Flame className={`${className} fill-current`} />,
    },
    {
      key: 'logs',
      label: 'Registros',
      icon: ({ className, isDark }) => <LogFileIcon className={className} isDark={isDark} />,
    },
    {
      key: 'settings',
      label: 'Ajustes',
      icon: ({ className, isDark }) => <DetailedSettingsIcon className={className} isDark={isDark} />,
    },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-[#203457]/90 border border-white/20 backdrop-blur-2xl rounded-full p-1.5 shadow-2xl shadow-black/80 inline-flex items-center gap-1 ring-1 ring-white/10 transition-all">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`relative flex items-center justify-center py-2 px-3 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
                isActive
                  ? 'bg-[#a8bff8] text-[#000e1f] shadow-md shadow-black/40 font-bold scale-[1.02]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 active:scale-95'
              }`}
            >
              <div className="flex items-center space-x-1.5 transition-transform duration-200">
                <span
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-110 text-[#000e1f]' : 'text-[#94A3B8]'
                  }`}
                >
                  {tab.icon({
                    className: 'w-4 h-4',
                    isDark: isActive,
                  })}
                </span>
                {isActive && (
                  <span className="text-xs font-bold tracking-wide whitespace-nowrap pr-0.5 animate-fadeIn text-[#000e1f] transition-opacity duration-200">
                    {tab.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
