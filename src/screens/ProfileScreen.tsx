import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ProtectionProfile, ProfileSchedule } from '../types';
import { Layers, Plus, Trash2, Clock, Check, Shield, Info, Calendar } from 'lucide-react';

interface ProfileScreenProps {
  onClose?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onClose }) => {
  const {
    profiles,
    activeProfile,
    setActiveProfile,
    addCustomProfile,
    deleteProfile,
    schedules,
    addSchedule,
    deleteSchedule,
    filterLists,
  } = useApp();

  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDesc, setNewProfileDesc] = useState('');
  const [selectedFilterIds, setSelectedFilterIds] = useState<string[]>([]);

  // Schedule modal
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [schedProfileId, setSchedProfileId] = useState(profiles[0]?.id || 'default');
  const [schedStart, setSchedStart] = useState('09:00');
  const [schedEnd, setSchedEnd] = useState('17:00');
  const [schedDays, setSchedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleDay = (day: number) => {
    if (schedDays.includes(day)) {
      setSchedDays(schedDays.filter((d) => d !== day));
    } else {
      setSchedDays([...schedDays, day]);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    addCustomProfile(newProfileName.trim(), newProfileDesc.trim() || 'Perfil personalizado', selectedFilterIds);
    setNewProfileName('');
    setNewProfileDesc('');
    setSelectedFilterIds([]);
    setShowAddProfileModal(false);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const prof = profiles.find((p) => p.id === schedProfileId);
    if (!prof) return;

    addSchedule({
      profileId: prof.id,
      profileName: prof.name,
      startTime: schedStart,
      endTime: schedEnd,
      days: schedDays,
      isEnabled: true,
    });

    setShowAddScheduleModal(false);
  };

  const daysLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="space-y-6 pb-24">
      {/* Title & Add Profile */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Perfiles de Protección</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Ajusta los niveles de bloqueo según el contexto o el momento del día
          </p>
        </div>

        <button
          onClick={() => setShowAddProfileModal(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white flex items-center space-x-1.5 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Crear Perfil</span>
        </button>
      </div>

      {/* Profiles Cards */}
      <div className="space-y-3">
        {profiles.map((profile) => {
          const isActive = activeProfile.id === profile.id;

          return (
            <div
              key={profile.id}
              onClick={() => setActiveProfile(profile.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-[#1E293B] border-[#2563EB] ring-1 ring-[#2563EB] shadow-md'
                  : 'bg-[#0F172A] border-[#1E293B] hover:border-[#334155]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-[#2563EB] text-white' : 'bg-[#1E293B] text-[#94A3B8]'
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-[#F8FAFC]">{profile.name}</h3>
                      {profile.isBuiltIn ? (
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          Integrado
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                          Personalizado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{profile.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!profile.isBuiltIn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProfile(profile.id);
                      }}
                      className="p-1 rounded-lg text-[#64748B] hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isActive ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-[#475569]'
                    }`}
                  >
                    {isActive && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Profile Details Tag */}
              <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-[#64748B]">
                <span>{profile.blocklists.length} listas de filtros asignadas</span>
                <div className="flex items-center space-x-2">
                  {profile.safeSearch && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
                      SafeSearch
                    </span>
                  )}
                  {profile.youtubeRestricted && (
                    <span className="px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40">
                      YouTube Restringido
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Schedules Section */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <h4 className="font-bold text-sm text-[#F8FAFC]">Horarios Programados</h4>
          </div>
          <button
            onClick={() => setShowAddScheduleModal(true)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir horario</span>
          </button>
        </div>

        <p className="text-xs text-[#94A3B8]">
          Cambia automáticamente al perfil de tu preferencia según la hora y los días de la semana.
        </p>

        {schedules.length === 0 ? (
          <p className="text-xs text-[#64748B] py-2 text-center">
            No tienes horarios programados activos.
          </p>
        ) : (
          <div className="space-y-2 pt-1">
            {schedules.map((sch) => (
              <div
                key={sch.id}
                className="p-3 rounded-xl bg-[#1E293B] border border-[#334155]/60 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{sch.profileName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {sch.startTime} – {sch.endTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1 text-[10px] text-[#94A3B8]">
                    <span>Días:</span>
                    {sch.days.map((d) => (
                      <span key={d} className="font-medium text-slate-300">
                        {daysLabels[d - 1]}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => deleteSchedule(sch.id)}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add Custom Profile */}
      {showAddProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#F8FAFC]">Crear Perfil Personalizado</h3>
              <button onClick={() => setShowAddProfileModal(false)} className="text-[#64748B] hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Nombre</label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="ej. Modo Trabajo o Modo Noche"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Descripción</label>
                <input
                  type="text"
                  value={newProfileDesc}
                  onChange={(e) => setNewProfileDesc(e.target.value)}
                  placeholder="ej. Bloqueo estricto para concentrarse"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1.5">
                  Seleccionar Listas de Filtro Activas
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {filterLists.map((fl) => {
                    const isChecked = selectedFilterIds.includes(fl.id);
                    return (
                      <label
                        key={fl.id}
                        className="flex items-center space-x-2 p-2 rounded-xl bg-[#1E293B] border border-[#334155] cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedFilterIds(selectedFilterIds.filter((id) => id !== fl.id));
                            } else {
                              setSelectedFilterIds([...selectedFilterIds, fl.id]);
                            }
                          }}
                          className="accent-[#2563EB]"
                        />
                        <span className="text-[#F8FAFC]">{fl.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddProfileModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white transition shadow-sm"
                >
                  Crear Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Schedule */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0F172A] border border-[#334155] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#F8FAFC]">Programar Horario</h3>
              <button onClick={() => setShowAddScheduleModal(false)} className="text-[#64748B] hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Perfil</label>
                <select
                  value={schedProfileId}
                  onChange={(e) => setSchedProfileId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none focus:border-[#2563EB]"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#94A3B8] block mb-1">Inicio</label>
                  <input
                    type="time"
                    value={schedStart}
                    onChange={(e) => setSchedStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#94A3B8] block mb-1">Fin</label>
                  <input
                    type="time"
                    value={schedEnd}
                    onChange={(e) => setSchedEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#94A3B8] block mb-1">Días activos</label>
                <div className="flex items-center justify-between gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition ${
                        schedDays.includes(d)
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#1E293B] text-[#64748B]'
                      }`}
                    >
                      {daysLabels[d - 1]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white transition shadow-sm"
                >
                  Guardar Horario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
