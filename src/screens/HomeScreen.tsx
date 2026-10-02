import React from 'react';
import { useApp } from '../store/AppContext';
import { PowerButton } from '../components/home/PowerButton';
import { StatCards } from '../components/home/StatCards';
import { ActivityChart } from '../components/home/ActivityChart';
import { RecentBlockedList } from '../components/home/RecentBlockedList';

interface HomeScreenProps {
  onOpenLogs: () => void;
  onOpenDomainRules: () => void;
  onOpenModes: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenLogs,
  onOpenDomainRules,
  onOpenModes,
}) => {
  const { settings } = useApp();

  return (
    <div className="space-y-3 pb-24">
      {/* Main Power Button */}
      <PowerButton onOpenModes={onOpenModes} />

      {/* Metrics Cards (6 equal cards) */}
      <StatCards />

      {/* 24h & 7d Chart */}
      <ActivityChart />

      {/* Ranking de Bloqueos, Bloqueados Recientemente y Comprobar Filtrado */}
      <RecentBlockedList
        onOpenLogs={onOpenLogs}
        onOpenDomainRules={onOpenDomainRules}
      />
    </div>
  );
};
