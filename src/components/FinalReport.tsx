import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scenario, Product } from '../types';
import { useLanguage, mapAgentKey } from '../i18n';
import {
  Printer, Download, ShieldCheck, CheckCircle2, ArrowRight,
  TrendingUp, Percent, Truck, HelpCircle, RefreshCw, BarChart2,
  Calendar, MapPin, Tag, Brain, Layers
} from 'lucide-react';

interface FinalReportProps {
  scenario: Scenario;
  onReset: () => void;
}

const AGENT_PILL: Record<string, string> = {
  trend: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  crm: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  inventory: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  ceo: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  skill: 'bg-purple-500/10 border-purple-500/20 text-purple-400'
};

const ACTION_CODE: Record<string, string> = {
  Increase: 'actionIncreaseCode',
  Reduce: 'actionReduceCode',
  Test: 'actionTestCode',
  Maintain: 'actionMaintainCode'
};

export const FinalReport: React.FC<FinalReportProps> = ({
  scenario,
  onReset
}) => {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<Product>(scenario.products[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 2000);
  };

  const addProducts = scenario.products.filter(p => p.finalAction === 'Increase');
  const reduceProducts = scenario.products.filter(p => p.finalAction === 'Reduce');
  const testProducts = scenario.products.filter(p => p.finalAction === 'Test');
  const maintainProducts = scenario.products.filter(p => p.finalAction === 'Maintain');

  const bundleKey = scenario.id === 'cbd-office' ? 'bundleCbd'
    : scenario.id === 'university-campus' ? 'bundleUni' : 'bundleOly';

  return (
    <div className="space-y-6">

      {/* Report Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-sm">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {t('reportStageTag')}
          </span>
          <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
            {t('reportTitle')}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {t('reportSub')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs self-start sm:self-center">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>{t('compiling')}</span>
              </>
            ) : exportSuccess ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t('downloaded')}</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>{t('downloadPdf')}</span>
              </>
            )}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 rounded bg-gradient-to-r from-cyan-500 to-indigo-500 text-zinc-950 font-bold hover:brightness-110 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
          >
            {t('analyzeNew')}
          </button>
        </div>
      </div>

      {/* Professional Operation Report Sheet */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293703_1px,transparent_1px),linear-gradient(to_bottom,#1f293703_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Report Header Metadata */}
        <div className="border-b border-zinc-900 bg-zinc-900/10 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">{t('targetNode')}</span>
            <h3 className="text-base font-bold text-white">{scenario.name}</h3>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-cyan-400" />
              {scenario.location}
            </span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">{t('reportMeta')}</span>
            <div className="text-zinc-300 space-y-0.5">
              <div>{t('reportId')} <span className="text-white font-bold">VS-REP-{scenario.id.toUpperCase()}-09</span></div>
              <div>{t('compiled')} <span className="text-white">{t('justNow')}</span></div>
              <div>{t('engine')} <span className="text-cyan-400">AI BRAIN V4.2</span></div>
            </div>
          </div>

          <div className="space-y-1 font-mono text-xs">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">{t('algoHealth')}</span>
            <div className="text-zinc-300 space-y-0.5">
              <div>{t('convergence')} <span className="text-emerald-400 font-bold">{t('success100')}</span></div>
              <div>{t('skillApplied')} <span className="text-indigo-400">{scenario.loadedSkill}</span></div>
              <div>{t('decisionLatency')} <span className="text-white">1.48s</span></div>
            </div>
          </div>
        </div>

        {/* Action Directives Section */}
        <div className="p-6 md:p-8 border-b border-zinc-900 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

          {/* Column1: Replenish & Expand (Add) */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Truck className="h-4 w-4" />
                {t('col1Title')}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">{t('increaseStock')}</span>
            </div>

            <div className="space-y-3">
              {addProducts.map((p) => (
                <div key={p.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <span className="text-[9px] font-mono text-zinc-500">{t('currUnits', { x: p.currentStock, y: p.capacity })}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {t('plusUnits', { q: p.replenishQty ?? 0 })}
                    </span>
                    <span className="text-[9px] text-zinc-500 block font-mono mt-1">{t('refillMax')}</span>
                  </div>
                </div>
              ))}

              {/* Also show trial test products in the replenishment block */}
              {testProducts.map((p) => (
                <div key={p.id} className="p-3 bg-purple-950/10 border border-purple-900/30 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <span className="text-[9px] font-mono text-purple-400 font-semibold">{t('trialSku')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {t('plusUnits', { q: p.replenishQty ?? 0 })}
                    </span>
                    <span className="text-[9px] text-zinc-500 block font-mono mt-1">{t('allocateSlots')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column2: Reallocate & Reduce (Reduce) */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4" />
                {t('col2Title')}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">{t('shrinkSlots')}</span>
            </div>

            <div className="space-y-3">
              {reduceProducts.map((p) => (
                <div key={p.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <span className="text-[9px] font-mono text-zinc-500">{t('currUnits', { x: p.currentStock, y: p.capacity })}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {t('minusSlots')}
                    </span>
                    <span className="text-[9px] text-zinc-500 block font-mono mt-1">{t('reallocate')}</span>
                  </div>
                </div>
              ))}

              <div className="p-3 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-500 text-[11px] leading-relaxed">
                {t('slotSavings')}
              </div>
            </div>
          </div>

          {/* Column3: Promote & Liquidate (Promotion) */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Percent className="h-4 w-4" />
                {t('col3Title')}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">{t('liquidateRisk')}</span>
            </div>

            <div className="space-y-3">
              {reduceProducts.map((p) => (
                <div key={p.id} className="p-3 bg-amber-950/10 border border-amber-900/20 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{p.icon}</span>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {t('discount')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    {p.promotionDetails || t('defaultPromo')}
                  </p>
                </div>
              ))}

              {/* General Combo Promo */}
              <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{t('bundleTitle')}</h4>
                  <span className="text-[9px] font-mono text-cyan-400">{t('demandBundle')}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {t(bundleKey)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why AI Decided This Audit Panel */}
        <div className="p-6 md:p-8 relative z-10 space-y-6 bg-zinc-900/10">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
              <Brain className="h-4.5 w-4.5 text-cyan-400" />
              {t('whyTitle')}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {t('whySub')}
            </p>
          </div>

          {/* Product selector pills */}
          <div className="flex flex-wrap gap-2">
            {scenario.products.map((p) => {
              const isSelected = selectedProduct.id === p.id;
              const actionColor = p.finalAction === 'Increase'
                ? 'border-emerald-500/30 text-emerald-400'
                : p.finalAction === 'Reduce'
                ? 'border-rose-500/30 text-rose-400'
                : p.finalAction === 'Test'
                ? 'border-purple-500/30 text-purple-400'
                : 'border-blue-500/30 text-blue-400';

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                    isSelected
                      ? 'bg-zinc-900 border-cyan-500/50 text-white shadow shadow-cyan-950/20'
                      : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                  <span className={`text-[9px] font-mono border px-1 rounded ${actionColor}`}>
                    {t(ACTION_CODE[p.finalAction])}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reasoning trace box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProduct.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">{selectedProduct.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedProduct.name}</h4>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950 border border-cyan-800/30 px-2 py-0.5 rounded">
                      {t('decisionCode')} {t(ACTION_CODE[selectedProduct.finalAction])} // SCORE: {selectedProduct.weightedScore}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{t('auditConfidence')}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Reasoning summary */}
                <div className="md:col-span-1 space-y-2">
                  <h5 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">{t('verdict')}</h5>
                  <h4 className="text-sm font-bold text-white">{selectedProduct.whyDecided.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {selectedProduct.whyDecided.description}
                  </p>
                </div>

                {/* Source Agent Tags and findings */}
                <div className="md:col-span-2 space-y-3">
                  <h5 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">{t('contributing')}</h5>
                  <div className="space-y-2.5">
                    {selectedProduct.whyDecided.sources.map((source, idx) => {
                      const pillColor = AGENT_PILL[mapAgentKey(source.agent)] ?? AGENT_PILL.skill;

                      return (
                        <div key={idx} className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] font-mono font-bold border px-2 py-0.5 rounded ${pillColor}`}>
                                {source.agent}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">[{source.role}]</span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                              {source.finding}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
