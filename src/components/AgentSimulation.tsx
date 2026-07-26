import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scenario, AgentLog } from '../types';
import { useLanguage } from '../i18n';
import { DecisionMatrix } from './DecisionMatrix';
import {
  Cpu, Play, Pause, FastForward, Terminal, ArrowRight,
  Sparkles, CheckCircle, Network, TrendingUp, HelpCircle,
  MessageSquare, Package, BarChart3, ShieldAlert
} from 'lucide-react';

interface AgentSimulationProps {
  scenario: Scenario;
  onComplete: () => void;
  currentStage: number;
}

export const AgentSimulation: React.FC<AgentSimulationProps> = ({
  scenario,
  onComplete,
  currentStage
}) => {
  const { t } = useLanguage();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState<1 | 2 | 5>(1);
  const [progress, setProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<AgentLog[]>([]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // 场景定义（文案通过 t() 按语言切换）
  const scenes = [
    {
      titleKey: 'scene0Title',
      subtitleKey: 'scene0Sub',
      descKey: 'scene0Desc',
      activeAgentKey: 'agtCeo',
      agentRoleKey: 'roleDirector',
      agentAvatar: '🤖',
      agentColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20 shadow-cyan-950/50'
    },
    {
      titleKey: 'scene1Title',
      subtitleKey: 'scene1Sub',
      descKey: 'scene1Desc',
      activeAgentKey: 'agtSales',
      agentRoleKey: 'roleDataAnalyst',
      agentAvatar: '📊',
      agentColor: 'text-blue-400 border-blue-500/40 bg-blue-950/20 shadow-blue-950/50'
    },
    {
      titleKey: 'scene2Title',
      subtitleKey: 'scene2Sub',
      descKey: 'scene2Desc',
      activeAgentKey: 'agtTrend',
      agentRoleKey: 'roleTrendScout',
      agentAvatar: '🔍',
      agentColor: 'text-amber-400 border-f59e0b/40 bg-amber-950/20 shadow-amber-950/50'
    },
    {
      titleKey: 'scene3Title',
      subtitleKey: 'scene3Sub',
      descKey: 'scene3Desc',
      activeAgentKey: 'agtCrmInv',
      agentRoleKey: 'roleLogistics',
      agentAvatar: '📦',
      agentColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/20 shadow-indigo-950/50'
    },
    {
      titleKey: 'scene4Title',
      subtitleKey: 'scene4Sub',
      descKey: 'scene4Desc',
      activeAgentKey: 'agtCeo',
      agentRoleKey: 'roleDirector',
      agentAvatar: '🤖',
      agentColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20 shadow-cyan-950/50'
    }
  ];

  // 按场景选择对应的天气 / 事件 / 警报文案
  const sid = scenario.id;
  const weatherKey = sid === 'cbd-office' ? 'weatherCbd' : sid === 'university-campus' ? 'weatherUni' : 'weatherOly';
  const eventKey = sid === 'cbd-office' ? 'eventCbd' : sid === 'university-campus' ? 'eventUni' : 'eventOly';
  const alertKey = sid === 'cbd-office' ? 'alertCbd' : sid === 'university-campus' ? 'alertUni' : 'alertOly';

  // Base durations for each scene (in seconds)
  const sceneDuration = 10;

  // Manage simulation progress
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 100 / (sceneDuration * 10); // tick every 100ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + intervalTime * simulationSpeed;
        if (nextProgress >= 100) {
          // Move to next scene
          if (sceneIndex < scenes.length - 1) {
            setSceneIndex((idx) => idx + 1);
            return 0;
          } else {
            // Completed simulation!
            setIsPlaying(false);
            clearInterval(timer);
            onComplete();
            return 100;
          }
        }
        return nextProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, sceneIndex, simulationSpeed]);
  // Update terminal logs as simulation ticks
  useEffect(() => {
    // Filter scenario logs for current scene index
    const logs = scenario.agentLogs.filter(log => log.sceneIndex <= sceneIndex);
    setTerminalLogs(logs);
  }, [sceneIndex, scenario]);
  // Auto scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);
  // Fast forward speed toggle
  const toggleSpeed = () => {
    setSimulationSpeed((prev) => {
      if (prev === 1) return 2;
      if (prev === 2) return 5;
      return 1;
    });
  };

  // Jump to specific scene
  const jumpToScene = (idx: number) => {
    setSceneIndex(idx);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-6">

      {/* Simulation Progress Bar */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {t('simStageTag')}
            </span>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Network className="h-5.5 w-5.5 text-cyan-400 animate-pulse" />
              {t('simWorking')}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {t('simWorkingSub', { name: scenario.name })}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title={isPlaying ? t('simPause') : t('simPlay')}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleSpeed}
              className="px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5"
              title={t('simSpeed')}
            >
              <FastForward className="h-3.5 w-3.5" />
              <span>{simulationSpeed}x</span>
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 rounded bg-gradient-to-r from-cyan-500 to-indigo-500 text-zinc-950 font-bold hover:brightness-110 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
            >
              {t('simSkip')}
            </button>
          </div>
        </div>
        {/* Timeline Steps */}
        <div className="relative mt-6 mb-2">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 -translate-y-1/2 z-0 transition-all duration-100"
            style={{ width: `${(sceneIndex / (scenes.length - 1)) * 100 + (progress / (scenes.length - 1))}%` }}
          />

          {/* Steps */}
          <div className="relative flex justify-between z-10">
            {scenes.map((scene, idx) => {
              const isPassed = idx < sceneIndex;
              const isActive = idx === sceneIndex;

              return (
                <button
                  key={scene.titleKey}
                  onClick={() => jumpToScene(idx)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center font-mono text-xs transition-all duration-300 border ${
                      isActive
                        ? 'bg-cyan-500 text-zinc-950 border-cyan-400 font-bold scale-110 ring-4 ring-cyan-500/15'
                        : isPassed
                        ? 'bg-zinc-900 text-emerald-400 border-emerald-500/50'
                        : 'bg-zinc-950 text-zinc-500 border-zinc-800 group-hover:border-zinc-700'
                    }`}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-2 hidden md:block max-w-[100px] text-center truncate ${
                      isActive ? 'text-cyan-400 font-bold' : isPassed ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    {t(scene.titleKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Visualizer Panel (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Agent Collaboration Network or active scene visualizer */}
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 relative overflow-hidden h-[340px] flex flex-col justify-between">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{t('simCogFlow')}</span>
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                {t('simActive')} {t(scenes[sceneIndex].titleKey).toUpperCase()}
              </span>
            </div>

            {/* Scene-Specific Visualizer */}
            <div className="flex-1 flex items-center justify-center relative z-10 my-4">

              {/* Scene 1: Agent Network Initialization */}
              {sceneIndex === 0 && (
                <div className="relative w-full max-w-md h-full flex items-center justify-center">
                  {/* Glowing core */}
                  <div className="absolute h-32 w-32 rounded-full bg-cyan-500/05 blur-xl animate-pulse" />

                  {/* Multi-Agent Node Graph */}
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 200">
                    {/* Connecting Lines */}
                    <g stroke="#1e293b" strokeWidth="1.5">
                      <line x1="200" y1="100" x2="80" y2="40" className="stroke-cyan-500/20" />
                      <line x1="200" y1="100" x2="320" y2="40" className="stroke-cyan-500/20" />
                      <line x1="200" y1="100" x2="80" y2="160" className="stroke-cyan-500/20" />
                      <line x1="200" y1="100" x2="320" y2="160" className="stroke-cyan-500/20" />
                      <line x1="200" y1="100" x2="200" y2="30" className="stroke-cyan-500/20" />
                    </g>
                    {/* Animated Pulses */}
                    <g>
                      <circle r="3" fill="#22d3ee">
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 200 100 L 80 40" />
                      </circle>
                      <circle r="3" fill="#3b82f6">
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 200 100 L 320 40" />
                      </circle>
                      <circle r="3" fill="#f59e0b">
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 200 100 L 80 160" />
                      </circle>
                      <circle r="3" fill="#6366f1">
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 200 100 L 320 160" />
                      </circle>
                      <circle r="3" fill="#10b981">
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 200 100 L 200 30" />
                      </circle>
                    </g>
                  </svg>
                  {/* Node Badges */}
                  <div className="absolute top-[30px] left-[50px] bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-zinc-300">{t('simBadgeTrend')}</div>
                  <div className="absolute top-[20px] left-[175px] bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-zinc-300">{t('simBadgeSkill')}</div>
                  <div className="absolute top-[30px] right-[50px] bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-zinc-300">{t('simBadgeSales')}</div>
                  <div className="absolute bottom-[30px] left-[55px] bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-zinc-300">{t('simBadgeCrm')}</div>
                  <div className="absolute bottom-[30px] right-[55px] bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-zinc-300">{t('simBadgeInventory')}</div>
                  {/* Central CEO Agent */}
                  <div className="absolute bg-zinc-900 border-2 border-cyan-500 text-cyan-400 rounded-full h-16 w-16 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20">
                    <span className="text-xl">🤖</span>
                    <span className="text-[9px] font-mono font-bold">{t('simCeo')}</span>
                  </div>
                </div>
              )}

              {/* Scene 2: Historical Sales Intelligence */}
              {sceneIndex === 1 && (
                <div className="w-full max-w-md flex flex-col justify-center gap-4">
                  <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-4 font-mono text-xs">
                    <div className="flex items-center justify-between mb-3 text-[10px] text-zinc-500">
                      <span>{t('simScanTitle')}</span>
                      <span className="text-blue-400">{t('simScanning')}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1.5">
                        <span className="text-zinc-400">{t('simCabinetProfile')}</span>
                        <span className="text-white font-bold">{scenario.location}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1.5">
                        <span className="text-zinc-400">{t('simTotalNodes')}</span>
                        <span className="text-blue-400 font-bold">35,248 Machines</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800/50 pb-1.5">
                        <span className="text-zinc-400">{t('simDatapoints')}</span>
                        <span className="text-white font-bold">14,820,912 Tx</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">{t('simCategoryMatch')}</span>
                        <span className="text-emerald-400 font-bold">94.8% {t('simConfidence')}</span>
                      </div>
                    </div>
                  </div>
                  {/* Custom mini bar chart */}
                  <div className="flex justify-around items-end h-20 px-4">
                    {scenario.products.slice(0, 4).map((p) => (
                      <div key={p.id} className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="w-full max-w-[40px] bg-zinc-900 border border-zinc-800 rounded-t overflow-hidden h-16 relative">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${p.scores.salesPerformance}%` }}
                            transition={{ duration: 1 }}
                            className="absolute bottom-0 left-0 right-0 bg-blue-500/30 border-t border-blue-400"
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[50px]">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scene 3: External Signal Analysis */}
              {sceneIndex === 2 && (
                <div className="w-full max-w-md grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider block">{t('weatherSignal')}</span>
                      <h4 className="text-sm font-bold text-white mt-1">
                        {t(weatherKey)}
                      </h4>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-2 font-mono">
                      {t('weatherTrigger')}
                    </div>
                  </div>

                  <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-violet-400 uppercase tracking-wider block">{t('eventTrigger')}</span>
                      <h4 className="text-sm font-bold text-white mt-1">
                        {t(eventKey)}
                      </h4>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-2 font-mono">
                      {t('eventMatch', { skill: scenario.loadedSkill })}
                    </div>
                  </div>

                  <div className="col-span-2 bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">{t('crawlerStatus')}</span>
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      {t('crawlerRetrieving')}
                    </span>
                  </div>
                </div>
              )}

              {/* Scene 4: Multi-Factor Alignments */}
              {sceneIndex === 3 && (
                <div className="w-full max-w-md space-y-3">
                  <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <MessageSquare className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{t('crmFeedTitle')}</h4>
                        <p className="text-[10px] text-zinc-500">{t('crmFeedSub')}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{t('crmAnalyzed')}</span>
                  </div>

                  <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <Package className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{t('invScanTitle')}</h4>
                        <p className="text-[10px] text-zinc-500">{t('invScanSub')}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-bold">{t('invRisks')}</span>
                  </div>

                  <div className="p-2.5 bg-zinc-900/30 border border-zinc-800/50 rounded-lg text-[10px] font-mono text-zinc-400 leading-relaxed">
                    <span className="text-amber-400 font-bold">{t('alertLabel')}</span> {t(alertKey)}
                  </div>
                </div>
              )}

              {/* Scene 5: AI Decision Matrix Compilation */}
              {sceneIndex === 4 && (
                <div className="w-full max-w-lg">
                  <DecisionMatrix products={scenario.products} interactiveMode={false} />
                </div>
              )}

            </div>

            {/* Bottom Progress Bar */}
            <div className="relative z-10 w-full bg-zinc-900/80 border-t border-zinc-800/80 p-3 flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                  <span>{t('sceneProgress', { n: sceneIndex + 1 })}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] text-zinc-500 block font-mono">{t('timeRemaining')}</span>
                <span className="text-xs font-bold text-white font-mono">
                  {Math.max(0, Math.ceil((sceneDuration - (progress * sceneDuration) / 100) / simulationSpeed))}s
                </span>
              </div>
            </div>
          </div>

          {/* Terminal Console (Scrolling Logs) */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 font-mono text-xs flex flex-col h-[220px]">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="font-bold">{t('kernelConsole')}</span>
              </div>
              <span className="text-[10px] text-zinc-600">vendsolution_brain_daemon.log</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-[11px] leading-relaxed select-text scrollbar-thin">
              {terminalLogs.map((log) => {
                const colorMap = {
                  info: 'text-zinc-400',
                  success: 'text-emerald-400',
                  warning: 'text-amber-400',
                  error: 'text-rose-400'
                };
                return (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-zinc-600">[{log.timestamp}]</span>
                    <span className="text-cyan-500 shrink-0">[{log.agentName}]</span>
                    <span className={colorMap[log.type]}>{log.message}</span>
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* Focused Agent Sidebar (Right 1 column) */}
        <div className="space-y-6">

          {/* Active Agent card */}
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between h-full min-h-[380px]">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{t('activeSpecialist')}</span>
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-500 font-mono text-[9px] px-2 py-0.5 rounded">
                  {t('threadId')} {sceneIndex + 1}
                </span>
              </div>

              {/* Agent Profile Header */}
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-2xl border flex items-center justify-center text-3xl shadow-lg ${scenes[sceneIndex].agentColor}`}>
                  {scenes[sceneIndex].agentAvatar}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{t(scenes[sceneIndex].activeAgentKey)}</h3>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{t(scenes[sceneIndex].agentRoleKey)}</span>
                </div>
              </div>

              {/* Agent description */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{t('taskDirective')}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 border border-zinc-800/50 p-3 rounded-lg">
                  {t(scenes[sceneIndex].descKey)}
                </p>
              </div>

              {/* Current Findings list */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{t('liveFindings')}</h4>
                <div className="space-y-2">
                  {scenario.agentLogs
                    .filter(log => log.sceneIndex === sceneIndex && (log.type === 'success' || log.type === 'warning'))
                    .map((log) => (
                      <div key={log.id} className="flex gap-2.5 items-start text-xs p-2.5 bg-zinc-900/20 border border-zinc-800/50 rounded-lg">
                        {log.type === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-zinc-300 leading-relaxed">{log.message}</span>
                      </div>
                    ))}
                  {scenario.agentLogs.filter(log => log.sceneIndex === sceneIndex && (log.type === 'success' || log.type === 'warning')).length === 0 && (
                    <div className="text-xs text-zinc-500 italic py-2">{t('establishingFeeds')}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Next stage indicator */}
            <div className="border-t border-zinc-900 pt-4 mt-6">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>{t('scenarioTarget')}</span>
                <span className="text-white font-bold">{scenario.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
