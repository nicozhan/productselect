import React from 'react';
import { Cpu, ChevronRight, Activity, Layers, ShieldCheck, Zap, Languages } from 'lucide-react';
import { Scenario } from '../types';
import { useLanguage } from '../i18n';

interface HeaderProps {
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  selectedScenario: Scenario;
  scenarios: Scenario[];
  onSelectScenario: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  setCurrentStage,
  selectedScenario,
  scenarios,
  onSelectScenario
}) => {
  const { lang, setLang, t } = useLanguage();
  const stages = [
    { num: 1, label: t('stage1') },
    { num: 2, label: t('stage2') },
    { num: 3, label: t('stage3') },
    { num: 4, label: t('stage4') }
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-lg blur-sm opacity-70 animate-pulse"></div>
              <div className="relative bg-zinc-900 border border-zinc-700 p-1.5 rounded-lg flex items-center justify-center">
                <Cpu className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-white text-sm sm:text-base">VENDSOLUTION</span>
                <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-widest">AI Brain v4.2</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono block -mt-0.5">{t('headerTagline')}</span>
            </div>
          </div>

          {/* Scenario Quick Selector */}
          {currentStage > 1 && (
            <div className="hidden md:flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-1 text-xs">
              <span className="text-zinc-500 font-mono">{t('headerScenarioLabel')}</span>
              <select
                value={selectedScenario.id}
                onChange={(e) => onSelectScenario(e.target.value)}
                className="bg-transparent text-cyan-400 font-semibold focus:outline-none cursor-pointer border-none p-0 pr-6"
              >
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Live Status Indicators + Language Toggle */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
            <div className="hidden lg:flex items-center gap-2 text-zinc-400">
              <Activity className="h-3.5 w-3.5 text-cyan-500 animate-pulse" />
              <span>{t('headerNodes')} <span className="text-white">12,482 {t('headerNodesOnline')}</span></span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-zinc-400">
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
              <span>{t('headerLatency')} <span className="text-emerald-400">14ms</span></span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{t('headerLiveDemo')}</span>
            </div>

            {/* 中 / EN toggle */}
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-cyan-500/50 transition-colors cursor-pointer"
              title="切换语言 / Switch language"
            >
              <Languages className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-bold text-[11px]">{lang === 'zh' ? '中' : 'EN'}</span>
            </button>
          </div>
        </div>

        {/* User Journey Progress Tracker */}
        <div className="flex flex-wrap items-center justify-between border-t border-zinc-900 py-3 gap-y-2">
          <nav className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar scroll-smooth w-full md:w-auto">
            {stages.map((stage, idx) => {
              const isActive = currentStage === stage.num;
              const isCompleted = currentStage > stage.num;

              return (
                <React.Fragment key={stage.num}>
                  {idx > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-700 shrink-0" />
                  )}
                  <button
                    onClick={() => setCurrentStage(stage.num)}
                    className={`flex items-center gap-2 text-xs font-mono transition-all duration-300 py-1 px-2 rounded-md hover:bg-zinc-900 shrink-0 ${
                      isActive
                        ? 'text-cyan-400 font-semibold bg-cyan-500/10 border border-cyan-500/20'
                        : isCompleted
                        ? 'text-zinc-400 hover:text-white'
                        : 'text-zinc-600 cursor-not-allowed'
                    }`}
                    disabled={!isCompleted && !isActive && stage.num > currentStage}
                  >
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                        isActive
                          ? 'bg-cyan-500 text-zinc-950 border-cyan-400'
                          : isCompleted
                          ? 'bg-zinc-800 text-emerald-400 border-emerald-500/40'
                          : 'bg-transparent text-zinc-600 border-zinc-800'
                      }`}
                    >
                      {isCompleted ? '✓' : stage.num}
                    </span>
                    <span className="hidden sm:inline">{stage.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
            <span>{t('headerSecure')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
