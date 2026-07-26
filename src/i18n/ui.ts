import type { Lang } from './LanguageContext';

export type AgentKey = 'trend' | 'crm' | 'inventory' | 'ceo' | 'skill';

type Entry = { en: string; zh: string };

/**
 * Central dictionary for all static UI strings (labels, headings, buttons, scene copy).
 * Scenario/product/content strings live in the localized data layer (lib/data.*.ts).
 */
export const UI: Record<string, Entry> = {
  // ---------- App.tsx ----------
  appBadge: { en: 'VENDSOLUTION DECISION THEATER', zh: 'VENDSOLUTION 决策剧场' },
  appTitle: { en: 'AI Retail Decision Theater', zh: 'AI 零售决策剧场' },
  appQuote: { en: '"Let AI decide what your vending machine should sell tomorrow."', zh: '"让 AI 决定你的自动售货机明天该卖什么。"' },
  appSub: {
    en: 'Based on historical sales, similar device performance, location data, weather, events, customer feedback and inventory conditions.',
    zh: '基于历史销量、同类设备表现、位置数据、天气、活动、顾客反馈与库存状况进行决策。'
  },
  telemetryTitle: { en: 'SYSTEM TELEMETRY', zh: '系统遥测' },
  telemetryOnline: { en: 'ONLINE', zh: '在线' },
  telemetryNodes: { en: 'ACTIVE NODES:', zh: '活跃节点：' },
  telemetryConsensus: { en: 'CONSENSUS RATIO:', zh: '共识比率：' },
  telemetrySkills: { en: 'LOADED SKILLS:', zh: '已加载技能：' },
  telemetryActive: { en: 'ACTIVE', zh: '运行中' },
  telemetryTpu: { en: 'EDGE TPU ENGINE ACTIVE', zh: '边缘 TPU 引擎运行中' },
  skuEnvelope: { en: 'SKU STRATEGY ENVELOPE', zh: 'SKU 策略包' },
  loadedSkillLabel: { en: 'LOADED SKILL:', zh: '已加载技能：' },
  analyticalDirectives: { en: 'ANALYTICAL DIRECTIVES:', zh: '分析指令：' },
  startAnalysis: { en: 'START AI ANALYSIS', zh: '开始 AI 分析' },
  feat1Title: { en: 'Decentralized Execution', zh: '去中心化执行' },
  feat1Desc: { en: 'Runs directly on localized smart cabinet Edge TPU chips with zero latency.', zh: '直接运行在本地智能柜边缘 TPU 芯片上，零延迟响应。' },
  feat2Title: { en: 'Multi-Agent Consensus', zh: '多智能体共识' },
  feat2Desc: { en: 'Specialist agents debate inventory allocation to optimize profit and eliminate waste.', zh: '多个专家智能体对库存分配进行博弈，优化利润并消除浪费。' },
  feat3Title: { en: 'Dynamic Replenishment', zh: '动态补货' },
  feat3Desc: { en: 'Direct API integration with local distribution centers for instant logistics dispatch.', zh: '与本地配送中心直连 API，实现即时物流调度。' },
  footerBrand: { en: 'VENDSOLUTION AI OPERATING SYSTEM FOR GLOBAL UNATTENDED RETAIL', zh: 'VENDSOLUTION 全球无人零售 AI 操作系统' },
  footerRights: { en: 'ALL RIGHTS RESERVED', zh: '保留所有权利' },

  // ---------- Header.tsx ----------
  stage1: { en: 'Scenario Selection', zh: '场景选择' },
  stage2: { en: 'Multi-Agent Analysis', zh: '多智能体分析' },
  stage3: { en: 'CEO Agent Decision', zh: 'CEO 智能体决策' },
  stage4: { en: 'Recommendation Report', zh: '推荐报告' },
  headerScenarioLabel: { en: 'SCENARIO:', zh: '场景：' },
  headerNodes: { en: 'NODES:', zh: '节点：' },
  headerNodesOnline: { en: 'ONLINE', zh: '在线' },
  headerLatency: { en: 'LATENCY:', zh: '延迟：' },
  headerLiveDemo: { en: 'LIVE DEMO', zh: '实时演示' },
  headerSecure: { en: 'SECURE MULTI-AGENT PROTOCOL ACTIVE', zh: '安全多智能体协议已激活' },
  headerTagline: { en: 'UNATTENDED RETAIL OPERATING SYSTEM', zh: '无人零售操作系统' },

  // ---------- AgentSimulation.tsx ----------
  simStageTag: { en: 'STAGE 2 // COGNITIVE RECONNAISSANCE', zh: '阶段 2 // 认知侦察' },
  simWorking: { en: 'AI Agents Are Working', zh: 'AI 智能体正在工作' },
  simWorkingSub: { en: 'Multiple AI specialists are analyzing different dimensions of {name}.', zh: '多位 AI 专家正在分析「{name}」的不同维度。' },
  simPause: { en: 'Pause Simulation', zh: '暂停模拟' },
  simPlay: { en: 'Play Simulation', zh: '播放模拟' },
  simSpeed: { en: 'Change Speed (1x, 2x, 5x)', zh: '切换速度（1x、2x、5x）' },
  simSkip: { en: 'SKIP SIMULATION', zh: '跳过模拟' },
  simCogFlow: { en: 'AGENT COGNITION FLOW', zh: '智能体认知流' },
  simActive: { en: 'ACTIVE:', zh: '进行中：' },
  simBadgeTrend: { en: 'Trend Scout', zh: '趋势侦察员' },
  simBadgeSkill: { en: 'Scenario Skill', zh: '场景技能' },
  simBadgeSales: { en: 'Sales Analyst', zh: '销售分析师' },
  simBadgeCrm: { en: 'CRM Agent', zh: 'CRM 智能体' },
  simBadgeInventory: { en: 'Inventory Agent', zh: '库存智能体' },
  simCeo: { en: 'CEO AGENT', zh: 'CEO 智能体' },
  simScanTitle: { en: 'DATASET SCAN: GLOBAL UNATTENDED RETAIL', zh: '数据集扫描：全球无人零售' },
  simScanning: { en: 'SCANNING...', zh: '扫描中...' },
  simCabinetProfile: { en: 'Cabinet Profile:', zh: '柜机档案：' },
  simTotalNodes: { en: 'Total Similar Nodes:', zh: '相似节点总数：' },
  simDatapoints: { en: 'Historical Datapoints:', zh: '历史数据点：' },
  simCategoryMatch: { en: 'Baseline Category Match:', zh: '基准品类匹配：' },
  simConfidence: { en: 'Confidence', zh: '置信度' },
  weatherSignal: { en: 'WEATHER SIGNAL', zh: '天气信号' },
  eventTrigger: { en: 'EVENT TRIGGER', zh: '事件触发' },
  weatherCbd: { en: '35°C Heatwave Forecast', zh: '35°C 高温热浪预报' },
  weatherUni: { en: '24°C Moderate Clear', zh: '24°C 温和晴朗' },
  weatherOly: { en: '28°C Sunny Weekend', zh: '28°C 晴朗周末' },
  eventCbd: { en: 'Gym Expansions Active', zh: '周边健身房扩张中' },
  eventUni: { en: 'Exam Calendar Active', zh: '考试季日程激活' },
  eventOly: { en: '10K Fun Run Scheduled', zh: '10K 欢乐跑已排期' },
  weatherTrigger: { en: 'Trigger: High-capacity hydration items given +40% weight margin.', zh: '触发：大容量补水商品权重上调 40%。' },
  eventMatch: { en: 'Match: {skill}.', zh: '匹配：{skill}。' },
  crawlerStatus: { en: 'CRAWLER STATUS:', zh: '爬虫状态：' },
  crawlerRetrieving: { en: 'RETRIEVING SOCIO-ENVIRONMENTAL SIGNALS...', zh: '正在获取社会-环境信号...' },
  crmFeedTitle: { en: 'CRM Feedback Feed', zh: 'CRM 反馈流' },
  crmFeedSub: { en: 'Processing QR & App requests', zh: '处理二维码与 App 请求' },
  crmAnalyzed: { en: '100% ANALYZED', zh: '已分析 100%' },
  invScanTitle: { en: 'Inventory Risk Scanner', zh: '库存风险扫描' },
  invScanSub: { en: 'Evaluating expiration dates & stockouts', zh: '评估保质期与缺货情况' },
  invRisks: { en: '2 RISKS IDENTIFIED', zh: '发现 2 项风险' },
  alertLabel: { en: 'ALERT:', zh: '警报：' },
  alertCbd: { en: 'Chocolate near-expiry batch found (7 days remaining). Stockout risk on Cold Brew.', zh: '发现临期巧克力批次（剩余 7 天），冷萃咖啡存在缺货风险。' },
  alertUni: { en: 'Organic Salad high waste risk. Energy drinks completely sold out by midnight.', zh: '有机沙拉高损耗风险，能量饮料将于午夜前售罄。' },
  alertOly: { en: 'Canned Hot Coffee is dead stock. 1L Mineral Water running critically low.', zh: '罐装热咖啡为滞销库存，1L 矿泉水已逼近临界低位。' },
  sceneProgress: { en: 'SCENE {n} PROGRESS', zh: '场景 {n} 进度' },
  timeRemaining: { en: 'TIME REMAINING', zh: '剩余时间' },
  kernelConsole: { en: 'MULTI-AGENT KERNEL CONSOLE', zh: '多智能体内核控制台' },
  activeSpecialist: { en: 'ACTIVE SPECIALIST', zh: '当前智能体' },
  threadId: { en: 'THREAD_ID:', zh: '线程ID：' },
  taskDirective: { en: 'CURRENT TASK DIRECTIVE', zh: '当前任务指令' },
  liveFindings: { en: 'LIVE FINDINGS DISCOVERED', zh: '实时发现' },
  establishingFeeds: { en: 'Establishing telemetry feeds...', zh: '正在建立遥测数据流...' },
  scenarioTarget: { en: 'SCENARIO TARGET:', zh: '场景目标：' },

  // Agent display names & roles (scenes sidebar)
  agtCeo: { en: 'CEO Agent', zh: 'CEO 智能体' },
  agtSales: { en: 'Sales Analyst Agent', zh: '销售分析师智能体' },
  agtTrend: { en: 'Trend Scout Agent', zh: '趋势侦察智能体' },
  agtCrmInv: { en: 'CRM & Inventory Agents', zh: 'CRM 与库存智能体' },
  roleDirector: { en: 'Director', zh: '总监' },
  roleDataAnalyst: { en: 'Data Analyst', zh: '数据分析师' },
  roleTrendScout: { en: 'Trend Scout', zh: '趋势侦察' },
  roleLogistics: { en: 'Logistics', zh: '物流' },
  roleRelations: { en: 'Customer Relations', zh: '客户关系' },

  // AgentSimulation scene (5)
  scene0Title: { en: 'Agent Network Initialization', zh: '智能体网络初始化' },
  scene0Sub: { en: 'CEO Agent is assigning research tasks and establishing secure multi-agent protocols.', zh: 'CEO 智能体正在分派研究任务并建立安全的多智能体协议。' },
  scene0Desc: { en: 'CEO Agent establishes a secure network connection, boots scenario-specific skill engines, and assigns research directives to specialist agents.', zh: 'CEO 智能体与各专家智能体建立安全网络连接，启动场景专属技能引擎，并下达研究指令。' },
  scene1Title: { en: 'Historical Sales Intelligence', zh: '历史销售情报' },
  scene1Sub: { en: 'Sales Analyst Agent scans SKU performance metrics and historical turnover velocity.', zh: '销售分析师智能体扫描 SKU 表现指标与历史周转速度。' },
  scene1Desc: { en: 'Sales Analyst Agent processes historical transaction data of 35,000+ similar vending machines to establish SKU velocity baselines.', zh: '销售分析师智能体处理 35,000+ 台同类售货机的历史交易数据，建立 SKU 流速基线。' },
  scene2Title: { en: 'External Signal Analysis', zh: '外部信号分析' },
  scene2Sub: { en: 'Trend Scout Agent retrieves weather forecasts, social media trends, and regional event lists.', zh: '趋势侦察智能体获取天气预报、社媒热搜与区域活动清单。' },
  scene2Desc: { en: 'Trend Scout Agent runs web scraping and API lookups to identify weather triggers, social trends, and local sports or school events.', zh: '趋势侦察智能体通过爬虫与 API 查询识别天气触发、社媒热点以及本地赛事或校园活动。' },
  scene3Title: { en: 'Multi-Factor Alignments', zh: '多因子对齐' },
  scene3Sub: { en: 'CRM & Inventory Agents evaluate stock safety, customer feedback, and expiration risks.', zh: 'CRM 与库存智能体评估库存安全、顾客反馈与过期风险。' },
  scene3Desc: { en: 'CRM Agent processes direct customer feedback, while Inventory Agent verifies physical stock levels, capacity limits, and batch expiration thresholds.', zh: 'CRM 智能体处理直接顾客反馈，库存智能体核验实际库存水位、容量上限与批次到期阈值。' },
  scene4Title: { en: 'AI Decision Matrix Compilation', zh: 'AI 决策矩阵编译' },
  scene4Sub: { en: 'Evaluating multiple factors and calculating the optimal product portfolio.', zh: '综合多因子评估，计算最优商品组合。' },
  scene4Desc: { en: 'CEO Agent aggregates all findings into the multi-factor scoring matrix, triggering the alignment algorithm to categorize products into Increase, Maintain, Reduce, or Test.', zh: 'CEO 智能体将全部结论汇入多因子评分矩阵，触发对齐算法，将商品归为增补、维持、减少、试销四类。' },

  // ---------- CEODecision.tsx ----------
  ceoStageTag: { en: 'STAGE 3 // EXECUTIVE COGNITIVE SYNTHESIS', zh: '阶段 3 // 执行层认知综合' },
  ceoTitle: { en: 'CEO Agent Final Decision', zh: 'CEO 智能体最终决策' },
  ceoSub: {
    en: 'The CEO Agent synthesizes reports from all four AI specialists, balancing market growth, financial profit, and physical inventory risk.',
    zh: 'CEO 智能体综合四位 AI 专家的研判，在增长、利润与实物库存风险之间取得平衡。'
  },
  execCore: { en: 'EXECUTIVE CORE', zh: '执行核心' },
  decisionActive: { en: 'DECISION ACTIVE', zh: '决策激活' },
  ceoEngineDir: { en: 'DECISION ENGINE DIRECTOR', zh: '决策引擎总监' },
  verifyStreams: { en: 'VERIFYING INPUT STREAMS', zh: '校验输入流' },
  inTrendName: { en: 'Trend Report', zh: '趋势报告' },
  inTrendDesc: { en: 'Socio-environmental signals, weather, local social media trends', zh: '社会-环境信号、天气、本地社媒热点' },
  inCrmName: { en: 'Customer Feedback', zh: '顾客反馈' },
  inCrmDesc: { en: 'Direct app requests, QR-code scanner pings, sentiment index', zh: 'App 直连请求、二维码扫码、情绪指数' },
  inInvName: { en: 'Inventory Report', zh: '库存报告' },
  inInvDesc: { en: 'Unit levels, expiration buffer, physical shelf space, melting hazards', zh: '数量水位、保质缓冲、实体货道、融化隐患' },
  inSkillName: { en: 'Scenario Skill Engine', zh: '场景技能引擎' },
  inSkillDesc: { en: 'Location-specific behavior models, calendar events, price tolerances', zh: '地域行为模型、日历事件、价格容忍度' },
  statusVerified: { en: 'Verified', zh: '已核验' },
  statusProcessed: { en: 'Processed', zh: '已处理' },
  statusAudited: { en: 'Audited', zh: '已审计' },
  statusActive: { en: 'Active', zh: '运行中' },
  balanceCalib: { en: 'PORTFOLIO BALANCE CALIBRATION', zh: '组合平衡校准' },
  balanceOptimized: { en: 'OPTIMIZED', zh: '已优化' },
  growthFocus: { en: 'GROWTH FOCUS (VELOCITY)', zh: '增长聚焦（流速）' },
  profitContrib: { en: 'PROFIT MARGIN CONTRIBUTION', zh: '利润贡献' },
  riskAvoidance: { en: 'RISK AVOIDANCE (WASTE/SPOILAGE)', zh: '风险规避（损耗/变质）' },
  tabActions: { en: 'RECOMMENDED ACTIONS', zh: '推荐动作' },
  tabInputs: { en: 'INPUT STREAM DETAILS', zh: '输入流详情' },
  actionIncrease: { en: 'RECOMMENDED ACTION: INCREASE / REPLENISH', zh: '推荐动作：增补 / 补货' },
  actionTest: { en: 'RECOMMENDED ACTION: TRIAL EXPANSION (TEST)', zh: '推荐动作：试销扩张（测试）' },
  actionReduce: { en: 'RECOMMENDED ACTION: REDUCE / CLEARANCE', zh: '推荐动作：减少 / 清仓' },
  reasonLabel: { en: 'REASON:', zh: '原因：' },
  keyTelemetry: { en: 'KEY TELEMETRY EXTRACTED:', zh: '提取的关键遥测：' },
  ceoFooterNote: { en: 'Clicking "Generate Strategy Report" will compile a professional retail operations report.', zh: '点击「生成策略报告」将汇编一份专业的零售运营报告。' },
  generateReport: { en: 'GENERATE STRATEGY REPORT', zh: '生成策略报告' },

  // ---------- DecisionMatrix.tsx ----------
  matrixTitle: { en: 'AI Decision Matrix', zh: 'AI 决策矩阵' },
  matrixSub: {
    en: 'Evaluating multiple factors and calculating the optimal product portfolio based on real-time weights.',
    zh: '基于实时权重综合多因子，计算最优商品组合。'
  },
  runAlignment: { en: 'RUN PORTFOLIO ALIGNMENT', zh: '运行组合对齐' },
  resetMatrix: { en: 'RESET MATRIX VIEW', zh: '重置矩阵视图' },
  skuEval: { en: 'SKU Multi-Factor Evaluation', zh: 'SKU 多因子评估' },
  clickForDetails: { en: 'CLICK SKU FOR DETAILS', zh: '点击 SKU 查看详情' },
  weighted: { en: 'WEIGHTED', zh: '加权' },
  decisionLogic: { en: 'Decision Logic:', zh: '决策逻辑：' },
  sortingBoard: { en: 'Portfolio Sorting Board', zh: '组合排序看板' },
  alignmentPending: { en: 'Portfolio Alignment Pending', zh: '组合对齐待执行' },
  alignmentHint: { en: 'Click the "Run Portfolio Alignment" button above to execute the sorting algorithm.', zh: '点击上方「运行组合对齐」按钮以执行排序算法。' },
  skuUnit: { en: 'SKU', zh: '个 SKU' },
  noSkus: { en: 'No SKUs assigned', zh: '暂无 SKU 分配' },
  convergenceRatio: { en: 'CONVERGENCE RATIO: 100%', zh: '收敛比率：100%' },
  iterations: { en: 'ITERATIONS: 124', zh: '迭代次数：124' },
  catIncrease: { en: 'Increase / Replenish', zh: '增补 / 补货' },
  catTest: { en: 'Test / Trial', zh: '试销 / 测试' },
  catMaintain: { en: 'Maintain / Hold', zh: '维持 / 持有' },
  catReduce: { en: 'Reduce / Clear', zh: '减少 / 清仓' },

  // ---------- FinalReport.tsx ----------
  reportStageTag: { en: 'STAGE 4 // ACTIONABLE COGNITIVE REPORT', zh: '阶段 4 // 可执行认知报告' },
  reportTitle: { en: "Tomorrow's Product Strategy", zh: '明日商品策略' },
  reportSub: { en: 'Executive operational directive compiled by VendSolution AI Retail Brain.', zh: '由 VendSolution AI 零售大脑汇编的执行级运营指令。' },
  compiling: { en: 'COMPILING...', zh: '编译中...' },
  downloaded: { en: 'DOWNLOADED', zh: '已下载' },
  downloadPdf: { en: 'DOWNLOAD PDF', zh: '下载 PDF' },
  analyzeNew: { en: 'ANALYZE NEW SCENARIO', zh: '分析新场景' },
  targetNode: { en: 'TARGET VENDING NODE', zh: '目标售卖机节点' },
  reportMeta: { en: 'REPORT METADATA', zh: '报告元数据' },
  reportId: { en: 'REPORT ID:', zh: '报告ID：' },
  compiled: { en: 'COMPILED:', zh: '生成时间：' },
  justNow: { en: 'JUST NOW', zh: '刚刚' },
  engine: { en: 'ENGINE:', zh: '引擎：' },
  algoHealth: { en: 'ALGORITHMIC HEALTH', zh: '算法健康度' },
  convergence: { en: 'CONVERGENCE:', zh: '收敛：' },
  success100: { en: '100% SUCCESS', zh: '100% 成功' },
  skillApplied: { en: 'SKILL APPLIED:', zh: '已应用技能：' },
  decisionLatency: { en: 'DECISION LATENCY:', zh: '决策延迟：' },
  col1Title: { en: '1. ADD / REPLENISH', zh: '1. 增补 / 补货' },
  increaseStock: { en: 'INCREASE STOCK', zh: '增加库存' },
  currUnits: { en: 'CURR: {x}/{y} UNITS', zh: '当前：{x}/{y} 件' },
  plusUnits: { en: '+{q} UNITS', zh: '+{q} 件' },
  refillMax: { en: 'REFILL TO MAX', zh: '补满' },
  trialSku: { en: 'TRIAL TEST SKU', zh: '试销 SKU' },
  allocateSlots: { en: 'ALLOCATE SLOTS', zh: '分配货道' },
  col2Title: { en: '2. REDUCE / REALLOCATE', zh: '2. 减少 / 重新分配' },
  shrinkSlots: { en: 'SHRINK SLOTS', zh: '缩减货道' },
  minusSlots: { en: '-60% SLOTS', zh: '-60% 货道' },
  reallocate: { en: 'REALLOCATE', zh: '重新分配' },
  slotSavings: {
    en: 'Slot savings: 15 slots freed. Reallocated to high-margin Cold Brew Coffee and Electrolyte Water.',
    zh: '货道节省：释放 15 个货道，已重新分配给高毛利的冷萃咖啡与电解质水。'
  },
  col3Title: { en: '3. PROMOTION & CLEARANCE', zh: '3. 促销与清仓' },
  liquidateRisk: { en: 'LIQUIDATE RISK', zh: '清算风险' },
  discount: { en: 'DISCOUNT', zh: '折扣' },
  defaultPromo: { en: 'Implement 20% discount on near-expiry items.', zh: '对临期商品执行 8 折促销。' },
  bundleTitle: { en: 'Smart Bundle Recommendation', zh: '智能组合推荐' },
  demandBundle: { en: 'DEMAND BUNDLE', zh: '需求组合' },
  bundleCbd: {
    en: 'Bundle Cold Brew + Sea Salt Chips for a ¥2.00 morning discount. Stimulates slow-moving snack items.',
    zh: '冷萃咖啡 + 海盐薯片组合，早间立减 ¥2.00，带动滞销零食动销。'
  },
  bundleUni: {
    en: 'Activate "Exam Cram Combo" (Taurine Energy + Cup Noodles) for a 15% discount after 9:00 PM.',
    zh: '开启「备考组合」（牛磺酸能量饮料 + 杯装泡面），晚 9:00 后享 85 折。'
  },
  bundleOly: {
    en: 'Activate "Family Picnic Combo" (Isotonic Drink + Popcorn) for a Buy-1-Get-1-Free on Juice Boxes.',
    zh: '开启「家庭野餐组合」（等渗运动饮料 + 爆米花），果汁盒买一赠一。'
  },
  whyTitle: { en: 'Why AI Decided This (Algorithmic Source-Tracing)', zh: 'AI 为何这样决策（算法溯源）' },
  whySub: {
    en: 'Select any product below to audit the step-by-step reasoning trace and the contributing AI specialist agents.',
    zh: '点击下方任意商品，审计其逐步推理链路与做出贡献的 AI 专家智能体。'
  },
  auditConfidence: { en: 'AUDIT CONFIDENCE: 99.4%', zh: '审计置信度：99.4%' },
  verdict: { en: 'ALGORITHMIC VERDICT', zh: '算法裁决' },
  contributing: { en: 'CONTRIBUTING SPECIALISTS (SOURCE TAGS)', zh: '贡献智能体（来源标签）' },
  decisionCode: { en: 'DECISION CODE:', zh: '决策代码：' },
  actionIncreaseCode: { en: 'INCREASE', zh: '增补' },
  actionReduceCode: { en: 'REDUCE', zh: '减少' },
  actionTestCode: { en: 'TEST', zh: '试销' },
  actionMaintainCode: { en: 'MAINTAIN', zh: '维持' },
};

export function translate(key: string, lang: Lang, vars?: Record<string, string | number>): string {
  const entry = UI[key];
  let str = entry ? (entry[lang] ?? entry.en) : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}

/**
 * Map any (English or Chinese) agent display name to a stable key used for
 * pill colors / icon logic — language agnostic.
 */
export function mapAgentKey(agent: string): AgentKey {
  const a = agent.toLowerCase();
  const zh = agent;
  if (a.includes('trend') || zh.includes('趋势')) return 'trend';
  if (a.includes('crm') || zh.includes('客户') || zh.includes('关系')) return 'crm';
  if (a.includes('inventory') || zh.includes('库存')) return 'inventory';
  if (a.includes('ceo')) return 'ceo';
  return 'skill'; // Scenario Skill Agent or fallback
}
