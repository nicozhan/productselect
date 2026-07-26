import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getScenarios } from './lib/data';
import { useLanguage } from './i18n';
import { Header } from './components/Header';
import { AgentSimulation } from './components/AgentSimulation';
import { CEODecision } from './components/CEODecision';
import { FinalReport } from './components/FinalReport';
import {
  Briefcase, GraduationCap, CloudSun, MapPin, Cpu, Check,
  ArrowRight, Sparkles, Activity
} from 'lucide-react';

function App() {
  const { lang, t } = useLanguage();
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('cbd-office');

  const SCENARIOS = getScenarios(lang);
  const selectedScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentStage(2); // Jump directly to simulation stage
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 1:
        return (
          <motion.div
            key="stage-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-12 py-6"
          >
            {/* Hero Section Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 p-8 sm:p-12 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 shadow-2xl">
              {/* Background Neural Network Graphic with Gradient Overlay */}
              <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <img src="/images/network-glow.png" className="w-full h-full object-cover" alt="AI Neural Network" />
                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent" />
              </div>

              <div className="relative z-10 flex-1 space-y-4 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  {t('appBadge')}
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {t('appTitle')}
                </h1>
                <p className="text-base sm:text-lg text-zinc-300 font-semibold max-w-2xl leading-relaxed">
                  {t('appQuote')}
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                  {t('appSub')}
                </p>
              </div>

              {/* Live telemetry block on the right */}
              <div className="relative z-10 w-full md:w-auto shrink-0 bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl font-mono text-xs space-y-3 min-w-[240px]">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[10px] text-zinc-500">
                  <span>{t('telemetryTitle')}</span>
                  <span className="text-cyan-400">{t('telemetryOnline')}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{t('telemetryNodes')}</span>
                    <span className="text-white">12,482</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{t('telemetryConsensus')}</span>
                    <span className="text-emerald-400">99.98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">{t('telemetrySkills')}</span>
                    <span className="text-indigo-400">3 ACTIVE</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex items-center gap-2 text-[10px] text-zinc-400">
                  <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  <span>{t('telemetryTpu')}</span>
                </div>
              </div>
            </div>

            {/* Scenario Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {SCENARIOS.map((scenario) => {
                // Determine icon
                let IconComponent = Briefcase;
                let iconColor = 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5';
                if (scenario.id === 'university-campus') {
                  IconComponent = GraduationCap;
                  iconColor = 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
                } else if (scenario.id === 'olympic-park') {
                  IconComponent = CloudSun;
                  iconColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
                }

                return (
                  <div
                    key={scenario.id}
                    className="relative group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm hover:border-zinc-700/80 hover:bg-zinc-900/50 transition-all duration-300"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-cyan-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="space-y-4">
                      {/* Scenario Icon & Header */}
                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 rounded-xl border flex items-center justify-center text-xl shadow ${iconColor}`}>
                          <IconComponent className="h-5.5 w-5.5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {scenario.name}
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                            {t('skuEnvelope')}
                          </span>
                        </div>
                      </div>

                      {/* Subtitle & Location */}
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-300 font-semibold">{scenario.subtitle}</p>
                        <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                          {scenario.location}
                        </p>
                      </div>

                      <hr className="border-zinc-800/80" />

                      {/* Loaded Skill */}
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-900/40 rounded-lg px-2.5 py-1.5">
                        <Cpu className="h-3.5 w-3.5 shrink-0" />
                        <span>{t('loadedSkillLabel')} <strong className="text-white font-bold">{scenario.loadedSkill}</strong></span>
                      </div>

                      {/* Analyze Points */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">{t('analyticalDirectives')}</span>
                        <ul className="space-y-1.5 text-xs text-zinc-400">
                          {scenario.analyzePoints.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-6">
                      <button
                        onClick={() => handleSelectScenario(scenario.id)}
                        className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-950 hover:bg-white hover:border-white transition-all duration-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                      >
                        <span>{t('startAnalysis')}</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Platform Credibility & Tech Footprint */}
            <div className="max-w-4xl mx-auto border border-zinc-800 bg-zinc-900/10 rounded-2xl p-6 backdrop-blur-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xl">🎛️</span>
                <h4 className="text-xs font-bold text-white font-mono uppercase">{t('feat1Title')}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{t('feat1Desc')}</p>
              </div>
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xl">📊</span>
                <h4 className="text-xs font-bold text-white font-mono uppercase">{t('feat2Title')}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{t('feat2Desc')}</p>
              </div>
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xl">⚡</span>
                <h4 className="text-xs font-bold text-white font-mono uppercase">{t('feat3Title')}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{t('feat3Desc')}</p>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="stage-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-4"
          >
            <AgentSimulation
              scenario={selectedScenario}
              onComplete={() => setCurrentStage(3)}
              currentStage={currentStage}
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="stage-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-4"
          >
            <CEODecision
              scenario={selectedScenario}
              onProceed={() => setCurrentStage(4)}
            />
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="stage-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-4"
          >
            <FinalReport
              scenario={selectedScenario}
              onReset={() => setCurrentStage(1)}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen relative overflow-hidden flex flex-col justify-between selection:bg-cyan-500 selection:text-zinc-950">

      {/* Decorative Cybernetic Background Lines & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/05 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/05 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-violet-500/05 blur-3xl pointer-events-none" />

      {/* Header / Control Bar */}
      <Header
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        selectedScenario={selectedScenario}
        scenarios={SCENARIOS}
        onSelectScenario={(id) => {
          setSelectedScenarioId(id);
          setCurrentStage(2); // Reset back to simulation when switching scenarios
        }}
      />

      {/* Dynamic Stage Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {renderStageContent()}
        </AnimatePresence>
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs font-mono text-zinc-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{t('footerBrand')}</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>© {new Date().getFullYear()} VENDSOLUTION INC.</span>
            <span className="text-zinc-700">|</span>
            <span>{t('footerRights')}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
