import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scenario, Product } from '../types';
import { useLanguage, mapAgentKey } from '../i18n';
import {
  TrendingUp, ArrowDownRight, Sparkles, CheckCircle2,
  FileText, ShieldAlert, Zap, Layers, BarChart3, AlertCircle
} from 'lucide-react';

interface CEODecisionProps {
  scenario: Scenario;
  onProceed: () => void;
}

export const CEODecision: React.FC<CEODecisionProps> = ({
  scenario,
  onProceed
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'decision' | 'inputs'>('decision');

  // Filter products by action
  const increaseProducts = scenario.products.filter(p => p.finalAction === 'Increase');
  const reduceProducts = scenario.products.filter(p => p.finalAction === 'Reduce');
  const testProducts = scenario.products.filter(p => p.finalAction === 'Test');

  const inputs = [
    { key: 'trend' as const, nameKey: 'inTrendName', sourceKey: 'inTrendName', descKey: 'inTrendDesc', statusKey: 'statusVerified', emoji: '📈', color: 'text-amber-400 border-amber-500/20 bg-amber-500/05' },
    { key: 'crm' as const, nameKey: 'inCrmName', sourceKey: 'inCrmName', descKey: 'inCrmDesc', statusKey: 'statusProcessed', emoji: '💬', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/05' },
    { key: 'inventory' as const, nameKey: 'inInvName', sourceKey: 'inInvName', descKey: 'inInvDesc', statusKey: 'statusAudited', emoji: '📦', color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/05' },
    { key: 'skill' as const, nameKey: 'inSkillName', sourceKey: 'inSkillName', descKey: 'inSkillDesc', statusKey: 'statusActive', emoji: '🧠', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/05' }
  ];

  return (
    <div className="space-y-6">

      {/* Stage Header */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-md">
        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          {t('ceoStageTag')}
        </span>
        <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
          {t('ceoTitle')}
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          {t('ceoSub')}
        </p>
      </div>

      {/* Main Boardroom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Holographic CEO Agent Card (1 column) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[460px] shadow-lg shadow-black/50">
            {/* Ambient Background Glow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-cyan-500/05 blur-2xl pointer-events-none" />

            <div className="space-y-6 z-10">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{t('execCore')}</span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('decisionActive')}
                </span>
              </div>

              {/* Holographic Avatar Representation */}
              <div className="flex flex-col items-center py-4">
                <div className="relative">
                  {/* Outer Scanning Rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-4 border border-dashed border-cyan-500/20 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-2 border border-cyan-500/10 rounded-full"
                  />
                  {/* Central Glow */}
                  <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-md" />
                  {/* Avatar Body */}
                  <div className="relative h-24 w-24 rounded-full bg-zinc-950 border-2 border-cyan-400 flex items-center justify-center text-5xl shadow-lg shadow-cyan-950/40">
                    🤖
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mt-4 font-mono">CEO_AGENT_V4.2</h3>
                <span className="text-[10px] font-mono text-zinc-400">{t('ceoEngineDir')}</span>
              </div>

              {/* Report Validation Checklist */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{t('verifyStreams')}</h4>
                <div className="space-y-1.5 font-mono text-xs">
                  {inputs.map((input) => (
                    <div key={input.key} className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-900">
                      <span className="text-zinc-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        {t(input.nameKey)}
                      </span>
                      <span className="text-[10px] text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-900/30">
                        {t(input.statusKey)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Balancer Graph / Slider representation */}
            <div className="border-t border-zinc-800/80 pt-4 mt-6 z-10 space-y-3">
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>{t('balanceCalib')}</span>
                <span className="text-white">{t('balanceOptimized')}</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {/* Growth */}
                <div>
                  <div className="flex justify-between text-[10px] text-cyan-400 mb-1">
                    <span>{t('growthFocus')}</span>
                    <span>85%</span>
                  </div>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                {/* Profit */}
                <div>
                  <div className="flex justify-between text-[10px] text-purple-400 mb-1">
                    <span>{t('profitContrib')}</span>
                    <span>75%</span>
                  </div>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                {/* Risk */}
                <div>
                  <div className="flex justify-between text-[10px] text-rose-400 mb-1">
                    <span>{t('riskAvoidance')}</span>
                    <span>90%</span>
                  </div>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Actions Board (2 columns) */}
        <div className="xl:col-span-2 space-y-6 flex flex-col justify-between">

          <div className="space-y-4">
            {/* Tabs to toggle between Decision Overview and Input Stream details */}
            <div className="flex border-b border-zinc-900 text-xs font-mono">
              <button
                onClick={() => setActiveTab('decision')}
                className={`pb-2.5 px-4 border-b-2 font-bold transition-colors cursor-pointer ${
                  activeTab === 'decision'
                    ? 'border-cyan-400 text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t('tabActions')}
              </button>
              <button
                onClick={() => setActiveTab('inputs')}
                className={`pb-2.5 px-4 border-b-2 font-bold transition-colors cursor-pointer ${
                  activeTab === 'inputs'
                    ? 'border-cyan-400 text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t('tabInputs')}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'decision' ? (
                <motion.div
                  key="decision-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Action1: Increase (Green) */}
                  <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <Zap className="h-4 w-4" />
                      {t('actionIncrease')}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {increaseProducts.map((p) => (
                        <div key={p.id} className="bg-zinc-950/60 border border-zinc-900 p-3.5 rounded-lg flex items-start gap-3">
                          <span className="text-3xl bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 shrink-0">{p.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{p.name}</h4>
                            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{p.category}</span>
                            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                              <span className="text-emerald-400 font-semibold font-mono">{t('reasonLabel')}</span> {p.whyDecided.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action2: Test (Purple) */}
                  <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="h-4 w-4" />
                      {t('actionTest')}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {testProducts.map((p) => (
                        <div key={p.id} className="bg-zinc-950/60 border border-zinc-900 p-3.5 rounded-lg flex items-start gap-3">
                          <span className="text-3xl bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 shrink-0">{p.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{p.name}</h4>
                            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{p.category}</span>
                            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                              <span className="text-purple-400 font-semibold font-mono">{t('reasonLabel')}</span> {p.whyDecided.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action3: Reduce (Red) */}
                  <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <ArrowDownRight className="h-4 w-4" />
                      {t('actionReduce')}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {reduceProducts.map((p) => (
                        <div key={p.id} className="bg-zinc-950/60 border border-zinc-900 p-3.5 rounded-lg flex items-start gap-3">
                          <span className="text-3xl bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 shrink-0">{p.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{p.name}</h4>
                            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{p.category}</span>
                            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                              <span className="text-rose-400 font-semibold font-mono">{t('reasonLabel')}</span> {p.whyDecided.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="inputs-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {inputs.map((input) => (
                    <div key={input.key} className={`p-4 border rounded-xl flex items-start gap-4 ${input.color}`}>
                      <div className="h-10 w-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xl shrink-0">
                        {input.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{t(input.nameKey)}</h4>
                          <span className="text-[10px] font-mono text-zinc-500">[{t(input.sourceKey)}]</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{t(input.descKey)}</p>

                        {/* Show specific finding from products based on this agent */}
                        <div className="mt-3 space-y-1.5 border-l border-zinc-800 pl-3">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block">{t('keyTelemetry')}</span>
                          {scenario.products.map(p =>
                            p.whyDecided.sources
                              .filter(s => mapAgentKey(s.agent) === input.key)
                              .map((s, idx) => (
                                <div key={idx} className="text-xs text-zinc-300 flex items-center gap-2">
                                  <span className="text-cyan-400 font-mono">▸</span>
                                  <span>{s.finding}</span>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Footer */}
          <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2.5 text-xs text-zinc-400">
              <AlertCircle className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
              <span>{t('ceoFooterNote')}</span>
            </div>
            <button
              onClick={onProceed}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-zinc-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-cyan-500/10 cursor-pointer flex items-center gap-2 self-end sm:self-center"
            >
              <FileText className="h-4 w-4" />
              {t('generateReport')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
