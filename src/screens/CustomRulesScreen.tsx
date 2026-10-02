import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { CustomDnsRule } from '../types';
import { timeAgo } from '../utils/helpers';
import {
  Code,
  Plus,
  Trash2,
  Download,
  Upload,
  HelpCircle,
  CheckCircle2,
  Copy,
  Info,
} from 'lucide-react';

interface CustomRulesScreenProps {
  onClose?: () => void;
}

export const CustomRulesScreen: React.FC<CustomRulesScreenProps> = ({ onClose }) => {
  const {
    customRules,
    addCustomRule,
    toggleCustomRule,
    deleteCustomRule,
    importCustomRules,
    deleteAllCustomRules,
  } = useApp();

  const [ruleInput, setRuleInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleInput.trim()) return;

    const res = addCustomRule(ruleInput);
    if (!res.success) {
      setErrorMessage(res.error || 'Error al añadir la regla');
      return;
    }

    setRuleInput('');
    setErrorMessage('');
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const count = importCustomRules(importText);
    setImportText('');
    setShowImportModal(false);
  };

  const handleExportText = () => {
    const text = customRules.map((r) => r.ruleText).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Title & Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Reglas Personalizadas</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Sintaxis AdGuard &amp; uBlock ({customRules.length} reglas)
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-full bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-white transition"
            title="Ayuda de sintaxis"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="p-2 rounded-full bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-white transition"
            title="Importar reglas"
          >
            <Upload className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportText}
            className="p-2 rounded-full bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-white transition"
            title="Copiar reglas al portapapeles"
          >
            <Copy className="w-4 h-4" />
          </button>

          {customRules.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('¿Eliminar todas las reglas personalizadas?')) {
                  deleteAllCustomRules();
                }
              }}
              className="p-2 rounded-full bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-rose-400 transition"
              title="Borrar todas las reglas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {copiedNotification && (
        <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-700/50 text-blue-300 text-xs text-center font-medium">
          ✓ Reglas copiadas al portapapeles
        </div>
      )}

      {/* Add Rule Input Card */}
      <form onSubmit={handleAddRule} className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={ruleInput}
            onChange={(e) => {
              setRuleInput(e.target.value);
              setErrorMessage('');
            }}
            placeholder="ej. ||ads.ejemplo.com^ o @@||permitido.org^"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs font-mono text-white outline-none focus:border-[#2563EB]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white transition flex items-center space-x-1 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-400 font-medium px-1">{errorMessage}</p>
        )}
      </form>

      {/* Rules list */}
      <div className="space-y-2">
        {customRules.length === 0 ? (
          <div className="p-8 text-center bg-[#0F172A] rounded-2xl border border-[#1E293B]">
            <Code className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#94A3B8]">
              No tienes reglas personalizadas configuradas.
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Las reglas personalizadas tienen máxima prioridad sobre las listas de filtros.
            </p>
          </div>
        ) : (
          customRules.map((rule) => {
            const isComment = rule.type === 'comment';
            const isAllow = rule.type === 'allow';

            return (
              <div
                key={rule.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isComment
                    ? 'bg-[#0B1120] border-[#1E293B] opacity-60'
                    : isAllow
                    ? 'bg-emerald-950/20 border-emerald-900/40'
                    : 'bg-[#0F172A] border-[#1E293B]'
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border flex-shrink-0 ${
                      isComment
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : isAllow
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950/80 text-rose-300 border-rose-800'
                    }`}
                  >
                    {isComment ? 'NOTA' : isAllow ? 'ALLOW' : 'BLOCK'}
                  </span>

                  <span className="text-xs font-mono text-[#F8FAFC] truncate">
                    {rule.ruleText}
                  </span>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {!isComment && (
                    <button
                      onClick={() => toggleCustomRule(rule.id)}
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                        rule.isEnabled ? 'bg-[#2563EB]' : 'bg-[#1E293B] border border-[#334155]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                          rule.isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  )}

                  <button
                    onClick={() => deleteCustomRule(rule.id)}
                    className="p-1 rounded-lg text-[#64748B] hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#F8FAFC]">Importar Reglas en Lote</h3>
              <button onClick={() => setShowImportModal(false)} className="text-[#64748B] hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-[#94A3B8]">
              Pega tus reglas de filtrado (una por línea). Se admiten reglas uBlock, AdGuard y comentarios (!).
            </p>

            <textarea
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="||ejemplo.com^&#10;@@||permitido.org^&#10;! Mi comentario&#10;*.ads.red.com"
              className="w-full p-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-xs font-mono text-white outline-none focus:border-[#2563EB]"
            />

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white transition shadow-sm"
              >
                Importar Reglas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Syntax Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#F8FAFC]">Sintaxis de Reglas</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-[#64748B] hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#94A3B8]">
              <div className="p-2.5 rounded-xl bg-[#1E293B]">
                <code className="text-[#38BDF8] font-bold">||dominio.com^</code>
                <p className="text-[11px] mt-0.5">Bloquea el dominio y todos sus subdominios.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#1E293B]">
                <code className="text-emerald-400 font-bold">@@||dominio.com^</code>
                <p className="text-[11px] mt-0.5">Permite el dominio con prioridad sobre las listas de bloqueo.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#1E293B]">
                <code className="text-[#38BDF8] font-bold">*.ads.ejemplo.com</code>
                <p className="text-[11px] mt-0.5">Bloquea subdominios específicos que coincidan con el patrón.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#1E293B]">
                <code className="text-slate-400 font-bold">! Comentario explicativo</code>
                <p className="text-[11px] mt-0.5">Línea de nota que el motor ignora.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
