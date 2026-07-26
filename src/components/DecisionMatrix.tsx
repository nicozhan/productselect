import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFactorWeights } from '../lib/data';
import { Product } from '../types';
import { useLanguage } from '../i18n';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, BarChart3, ShieldCheck } from 'lucide-react';

interface DecisionMatrixProps {
  products: Product[];
  onComplete?: () => void;
  interactiveMode?: boolean;
}

export const DecisionMatrix: React.FC<DecisionMatrixProps> = ({
  products,
  onComplete,
  interactiveMode = true
}) => {
  const { lang, t } = useLanguage();
  const factorWeights = getFactorWeights(lang);
  const [isSorted, setIsSorted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // If not in interactive mode, auto-sort after a delay
    if (!interactiveMode) {
      const timer = setTimeout(() => {
        setIsSorted(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [interactiveMode]);

  // Reset sorting state when products change (e.g., scenario changed)
  useEffect(() => {
    setIsSorted(false);
    setSelectedProduct(null);
  }, [products]);

  const categories = [
    { id: 'Increase', labelKey: 'catIncrease', color: 'from-emerald-500/20 to-emerald-500/05 border-emerald-500/30 text-emerald-400', glow: 'shadow-emerald-950/20' },
    { id: 'Test', labelKey: 'catTest', color: 'from-purple-500/20 to-purple-500/05 border-purple-500/30 text-purple-400', glow: 'shadow-purple-950/20' },
    { id: 'Maintain', labelKey: 'catMaintain', color: 'from-blue-500/20 to-blue-500/05 border-blue-500/30 text-blue-400', glow: 'shadow-blue-950/20' },
    { id: 'Reduce', labelKey: 'catReduce', color: 'from-rose-500/20 to-rose-500/05 border-rose-500/30 text-rose-400', glow: 'shadow-rose-950/20' }
  ];

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-sm">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            {t('matrixTitle')}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            {t('matrixSub')}
          </p>
        </div>
        {interactiveMode && (
          <button
            onClick={() => {
              setIsSorted(!isSorted);
              if (onComplete && !isSorted) {
                // Trigger callback on first sort completion
                setTimeout(onComplete, 3000);
              }
            }}
            className={`px-5 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
              isSorted
                ? 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-zinc-950 hover:brightness-110 shadow-lg shadow-cyan-500/10'
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${!isSorted ? 'animate-spin' : ''}`} />
            {isSorted ? t('resetMatrix') : t('runAlignment')}
          </button>
        )}
      </div>

      {/* Scoring Factors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {factorWeights.map((f) => (
          <div key={f.name} className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3 hover:border-zinc-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{f.name}</span>
              <span className="text-xs font-bold font-mono" style={{ color: f.color }}>{f.weight}%</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${f.weight}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: f.color }}
              />
            </div>
            <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>

      {/* Main Board Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Side: Product List with detailed Factor Scores */}
        <div className="xl:col-span-2 space-y-3">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{t('skuEval')}</span>
              <span className="text-[10px] font-mono text-zinc-500">{t('clickForDetails')}</span>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {products.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900/80 border-cyan-500/40 shadow-md shadow-cyan-950/20'
                        : 'bg-zinc-900/30 border-zinc-800/60 hover:bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{p.name}</h4>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">{p.category}</span>
                        </div>
                      </div>

                      {/* Score Breakdown (Small screen hides this details) */}
                      <div className="hidden sm:flex items-center gap-4 flex-1 justify-end max-w-md">
                        {factorWeights.map((f) => {
                          const score = p.scores[f.key];
                          return (
                            <div key={f.name} className="text-center w-12 shrink-0">
                              <span className="text-[9px] text-zinc-500 block font-mono uppercase">{f.name}</span>
                              <span className="text-xs font-bold font-mono" style={{ color: score > 75 ? '#10b981' : score > 45 ? '#3b82f6' : '#ef4444' }}>
                                {score}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Weighted Score */}
                      <div className="text-right shrink-0">
                        <span className="text-[9px] text-zinc-500 block font-mono">{t('weighted')}</span>
                        <span className="text-sm font-bold font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {p.weightedScore}
                        </span>
                      </div>
                    </div>

                    {/* Expandable factor bars on selection */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mt-3 pt-3 border-t border-zinc-800"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
                            {factorWeights.map((f) => {
                              const score = p.scores[f.key];
                              return (
                                <div key={f.name} className="flex items-center justify-between gap-4 py-1">
                                  <span className="text-zinc-400">{f.name} ({f.weight}%):</span>
                                  <div className="flex items-center gap-2 flex-1 max-w-[150px] justify-end">
                                    <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full"
                                        style={{ width: `${score}%`, backgroundColor: f.color }}
                                      />
                                    </div>
                                    <span className="font-bold w-6 text-right" style={{ color: f.color }}>{score}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-zinc-400 mt-2 bg-zinc-950 p-2.5 rounded border border-zinc-800/80 leading-relaxed">
                            <strong className="text-cyan-400 font-mono">{t('decisionLogic')}</strong> {p.whyDecided.title}. {p.whyDecided.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Animated Sorting Board */}
        <div className="space-y-4">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{t('sortingBoard')}</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>

            {/* Unsorted bucket (shown only when isSorted is false) */}
            <AnimatePresence mode="wait">
              {!isSorted ? (
                <motion.div
                  key="unsorted-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/10"
                >
                  <Sparkles className="h-10 w-10 text-cyan-500/40 mb-3 animate-pulse" />
                  <h4 className="text-sm font-bold text-zinc-300">{t('alignmentPending')}</h4>
                  <p className="text-xs text-zinc-500 mt-2 max-w-[240px] leading-relaxed">
                    {t('alignmentHint')}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="sorted-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 space-y-3"
                >
                  {categories.map((cat) => {
                    const catProducts = products.filter(p => p.finalAction === cat.id);
                    return (
                      <div
                        key={cat.id}
                        className={`p-3 rounded-lg border bg-gradient-to-r ${cat.color} ${cat.glow} shadow-inner flex flex-col gap-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full bg-current`} />
                            {t(cat.labelKey)}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800">
                            {catProducts.length} {catProducts.length === 1 ? t('skuUnit') : `${catProducts.length} ${t('skuUnit')}`}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-1">
                          {catProducts.map((p) => (
                            <motion.div
                              key={p.id}
                              layoutId={`prod-tag-${p.id}`}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                              onClick={() => setSelectedProduct(p)}
                              className="px-2.5 py-1.5 rounded bg-zinc-950/80 border border-zinc-800 hover:border-zinc-600 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-white"
                            >
                              <span>{p.icon}</span>
                              <span>{p.name}</span>
                              <span className="text-[9px] font-mono text-cyan-400 font-bold bg-cyan-950 border border-cyan-800/30 px-1 rounded">
                                {p.weightedScore}
                              </span>
                            </motion.div>
                          ))}
                          {catProducts.length === 0 && (
                            <span className="text-[10px] text-zinc-500 italic py-1">{t('noSkus')}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Matrix Status Footer */}
            <div className="border-t border-zinc-900 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                {t('convergenceRatio')}
              </span>
              <span>{t('iterations')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
