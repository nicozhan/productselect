import { Scenario } from '../types';

// 中文场景数据（结构与 SCENARIOS_EN 完全一致，仅文案本地化）
export const SCENARIOS_ZH: Scenario[] = [
  {
    id: 'cbd-office',
    name: 'CBD 写字楼智能柜',
    subtitle: '高频商务区补货站点',
    location: '北京 CBD 国贸，B 座大堂',
    loadedSkill: '白领行为技能',
    skillIcon: 'Briefcase',
    avatar: '🏢',
    description: '服务高收入白领人群，早高峰与午间峰值极端集中。对高端咖啡因、健康补水和快捷代餐需求旺盛。',
    metrics: {
      dailySales: '¥3,420',
      activeUsers: '480/天',
      stockLevel: '78%',
      efficiency: '94.2%'
    },
    analyzePoints: [
      '早高峰需求（8:00 - 9:30）',
      '高端咖啡与功能饮料消费',
      '商务客群的高价位承受力',
      '同类写字楼的历销相关性'
    ],
    products: [
      {
        id: 'cbd-electrolyte',
        name: '电解质水（柑橘味）',
        category: '功能饮料',
        icon: '🥤',
        currentStock: 12,
        capacity: 60,
        price: 6.5,
        cost: 2.8,
        scores: {
          salesPerformance: 94,
          customerDemand: 98,
          profitMargin: 82,
          scenarioMatch: 95,
          inventoryRisk: 95,
          marketTrend: 98
        },
        weightedScore: 93,
        initialAction: 'Maintain',
        finalAction: 'Increase',
        recommendationDetails: '补至满仓。高温预报叠加通勤补水趋势，预计需求激增 45%。',
        replenishQty: 40,
        whyDecided: {
          title: '热浪 + 通勤补水潮',
          description: '电解质水呈现极强的动销速度。即将到来的 35°C 热浪与「晨间补水」社媒趋势叠加，使其成为优先级最高的 SKU。',
          sources: [
            { agent: '趋势侦察智能体', role: '外部信号', finding: '北京气温明日升至 35°C。「补水攻略」本地社媒热度 +180%。', status: 'success' },
            { agent: '销售分析师智能体', role: '流速分析', finding: '同类天气下，该 SKU 周转速度达品类均值的 3.4 倍。', status: 'success' },
            { agent: '场景技能智能体', role: '画像匹配', finding: 'CBD 白领多在健身前或通勤后购买补水饮料，与白领行为技能高度契合。', status: 'info' }
          ]
        }
      },
      {
        id: 'cbd-coldbrew',
        name: '冷萃黑咖啡',
        category: '高端咖啡',
        icon: '☕',
        currentStock: 5,
        capacity: 40,
        price: 15.0,
        cost: 5.5,
        scores: {
          salesPerformance: 91,
          customerDemand: 96,
          profitMargin: 90,
          scenarioMatch: 98,
          inventoryRisk: 90,
          marketTrend: 88
        },
        weightedScore: 92,
        initialAction: 'Maintain',
        finalAction: 'Increase',
        recommendationDetails: '紧急补货。当前库存仅 12%。早高峰咖啡需求缺乏弹性，该 SKU 毛利高达 63%。',
        replenishQty: 30,
        whyDecided: {
          title: '缺乏弹性的早间咖啡因峰值',
          description: '冷萃是 8:00-9:00 到柜白领的首选。高利润空间决定了我们必须杜绝其缺货。',
          sources: [
            { agent: 'CRM 智能体', role: '顾客反馈', finding: '近 48 小时收到 14 条冷萃咖啡「缺货」反馈。', status: 'warning' },
            { agent: '库存智能体', role: '库存警报', finding: '当前库存（5 件）将在早高峰前 25 分钟内耗尽。', status: 'warning' },
            { agent: 'CEO 决策', role: '利润优化', finding: '基于高毛利（单件净利 ¥9.50）与强客户黏性，优先保障高端咖啡供应。', status: 'success' }
          ]
        }
      },
      {
        id: 'cbd-coconut',
        name: '高端椰子水',
        category: '天然补水',
        icon: '🥥',
        currentStock: 4,
        capacity: 25,
        price: 12.0,
        cost: 4.8,
        scores: {
          salesPerformance: 72,
          customerDemand: 86,
          profitMargin: 80,
          scenarioMatch: 82,
          inventoryRisk: 75,
          marketTrend: 96
        },
        weightedScore: 81,
        initialAction: 'Maintain',
        finalAction: 'Test',
        recommendationDetails: '分配试销货道。椰子水邻近高端健身房热度飙升。试水小规模铺货，捕捉本地健康白领客群。',
        replenishQty: 15,
        whyDecided: {
          title: '健康白领试销测试',
          description: '尽管历史销量中等，椰子水正经历强劲的宏观趋势上行，契合 CBD 活跃生活方式客群画像。',
          sources: [
            { agent: '趋势侦察智能体', role: '趋势挖掘', finding: '椰子水搜索量周环比 +45%，与周边高端健身俱乐部强相关。', status: 'success' },
            { agent: '场景技能智能体', role: '画像对齐', finding: '白领画像显示其愿意为天然低糖饮品支付溢价。', status: 'info' }
          ]
        }
      },
      {
        id: 'cbd-oolong',
        name: '无糖乌龙茶',
        category: '茶饮',
        icon: '🥤',
        currentStock: 22,
        capacity: 35,
        price: 5.5,
        cost: 2.2,
        scores: {
          salesPerformance: 80,
          customerDemand: 75,
          profitMargin: 70,
          scenarioMatch: 85,
          inventoryRisk: 88,
          marketTrend: 78
        },
        weightedScore: 78,
        initialAction: 'Maintain',
        finalAction: 'Maintain',
        recommendationDetails: '维持现有库存。销量高度稳定，无需立即补货，当前库存可覆盖 2.5 天正常需求。',
        whyDecided: {
          title: '表现稳定，库存充足',
          description: '无糖乌龙茶是可靠的「锚点」商品。库存健康，需求平稳，无需额外动作。',
          sources: [
            { agent: '销售分析师智能体', role: '稳定性核查', finding: '日销量波动小于 5%，需求模式极具可预测性。', status: 'info' },
            { agent: '库存智能体', role: '库存水位核查', finding: '当前 22 件库存对接下来 48 小时为最优。', status: 'success' }
          ]
        }
      },
      {
        id: 'cbd-chips',
        name: '海盐薯片',
        category: '零食',
        icon: '🥔',
        currentStock: 18,
        capacity: 20,
        price: 7.0,
        cost: 3.0,
        scores: {
          salesPerformance: 58,
          customerDemand: 52,
          profitMargin: 65,
          scenarioMatch: 50,
          inventoryRisk: 85,
          marketTrend: 42
        },
        weightedScore: 56,
        initialAction: 'Maintain',
        finalAction: 'Maintain',
        recommendationDetails: '保持库存。夏季写字楼内咸味零食流速偏低，白领更偏好清爽饮品与冷饮。',
        whyDecided: {
          title: '夏季零食低速',
          description: '高温周内薯片优先级低。维持现有库存、暂不补货，把货道留给高需求饮品。',
          sources: [
            { agent: '销售分析师智能体', role: '季节性分析', finding: '室外温度超过 30°C 时，零食品类销量下降 18%。', status: 'info' }
          ]
        }
      },
      {
        id: 'cbd-chocolate',
        name: '高端巧克力棒',
        category: '零食',
        icon: '🍫',
        currentStock: 14,
        capacity: 15,
        price: 18.0,
        cost: 8.0,
        scores: {
          salesPerformance: 38,
          customerDemand: 28,
          profitMargin: 75,
          scenarioMatch: 35,
          inventoryRisk: 20,
          marketTrend: 22
        },
        weightedScore: 39,
        initialAction: 'Reduce',
        finalAction: 'Reduce',
        recommendationDetails: '库存分配下调 60%。夏季柜门开启频繁，巧克力融化风险高，周转率低。',
        promotionDetails: '8 折促销，加速临期批次清仓。',
        whyDecided: {
          title: '融化隐患与临期清仓',
          description: '巧克力销量因季节偏好骤降。此外库存报告显示该批次仅剩 7 天保质期。',
          sources: [
            { agent: '库存智能体', role: '品质风险', finding: '高峰使用期柜内温度波动带来融化风险，7 天后到期。', status: 'warning' },
            { agent: 'CRM 智能体', role: '反馈分析', finding: '本周写字楼客群对该重巧克力零食零正向提及与购买。', status: 'info' },
            { agent: 'CEO 决策', role: '风险缓释', finding: '立即执行 8 折，清掉剩余 14 条并腾出货道给冷萃。', status: 'warning' }
          ]
        }
      }
    ],
    agentLogs: [
      { id: 'cbd-l1', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '08:00:01', message: '正在初始化北京 CBD 国贸智能柜分析，激活白领行为技能……', type: 'info', sceneIndex: 0 },
      { id: 'cbd-l2', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '08:00:03', message: '任务分派：销售分析师（历史销量）、趋势侦察（外部信号）、CRM 智能体（顾客反馈）、库存智能体（库存水位）。', type: 'info', sceneIndex: 0 },

      { id: 'cbd-l3', agentName: '销售分析师智能体', agentRole: '数据分析师', avatar: '📊', timestamp: '08:00:12', message: '扫描历史销量：分析跨越 3 个夏季的 35,000 台同类写字楼售货机。', type: 'info', sceneIndex: 1 },
      { id: 'cbd-l4', agentName: '销售分析师智能体', agentRole: '数据分析师', avatar: '📊', timestamp: '08:00:15', message: '识别头部品类：冷萃咖啡与无糖补水合计占写字楼总营收 64%。', type: 'success', sceneIndex: 1 },
      { id: 'cbd-l5', agentName: '销售分析师智能体', agentRole: '数据分析师', avatar: '📊', timestamp: '08:00:18', message: '警报：SKU「高端巧克力棒」日均周转仅 0.1 件，远低于效率阈值。', type: 'warning', sceneIndex: 1 },

      { id: 'cbd-l6', agentName: '趋势侦察智能体', agentRole: '趋势侦察', avatar: '🔍', timestamp: '08:00:22', message: '抓取外部信号：天气 API 预报北京明日 35°C 高温，紫外线指数：极强。', type: 'info', sceneIndex: 2 },
      { id: 'cbd-l7', agentName: '趋势侦察智能体', agentRole: '趋势侦察', avatar: '🔍', timestamp: '08:00:25', message: '社媒爬虫：「热浪生存」「冷萃」「电解质水」在北京商务区热度飙升（+140%）。', type: 'success', sceneIndex: 2 },
      { id: 'cbd-l8', agentName: '趋势侦察智能体', agentRole: '趋势侦察', avatar: '🔍', timestamp: '08:00:28', message: '侦测到本地健身房扩张：国贸 B 座 200 米内新开两家高端健身中心，对天然等渗饮料兴趣浓厚。', type: 'success', sceneIndex: 2 },

      { id: 'cbd-l9', agentName: 'CRM 智能体', agentRole: '客户关系', avatar: '💬', timestamp: '08:00:32', message: '处理顾客反馈：14 条 App 与二维码反馈报告冷萃咖啡「缺货」。', type: 'warning', sceneIndex: 3 },
      { id: 'cbd-l10', agentName: '库存智能体', agentRole: '物流', avatar: '📦', timestamp: '08:00:35', message: '核查柜内库存：冷萃咖啡仅剩 5 瓶（12% 容量），即将缺货。', type: 'warning', sceneIndex: 3 },
      { id: 'cbd-l11', agentName: '库存智能体', agentRole: '物流', avatar: '📦', timestamp: '08:00:38', message: '品质警报：巧克力棒批次 7 天后到期，柜门开启推高内部湿度，建议立即降价。', type: 'warning', sceneIndex: 3 },

      { id: 'cbd-l12', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '08:00:42', message: '编译 AI 决策矩阵，按权重计算：销售(30%)、需求(20%)、毛利(20%)、技能(15%)、风险(10%)、趋势(5%)。', type: 'info', sceneIndex: 4 },
      { id: 'cbd-l13', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '08:00:45', message: '矩阵排序完成：电解质水(93) 与冷萃(92) 归为增补；巧克力(39) 归为减少；椰子水(81) 归为试销。', type: 'success', sceneIndex: 4 }
    ]
  },
  {
    id: 'university-campus',
    name: '大学校园智能柜',
    subtitle: '学生生活方式与深夜便利站点',
    location: '浙江大学紫金港校区，3 号宿舍区',
    loadedSkill: '校园日历技能',
    skillIcon: 'GraduationCap',
    avatar: '🎓',
    description: '服务 Z 世代学生，熬夜学习习惯显著，价格高度敏感。受考试安排、游戏高峰与校园社媒趋势驱动。',
    metrics: {
      dailySales: '¥2,890',
      activeUsers: '620/天',
      stockLevel: '82%',
      efficiency: '89.5%'
    },
    analyzePoints: [
      '深夜采购高峰（22:00 - 次日 2:00）',
      '高咖啡因与快捷碳水零食偏好',
      '价格敏感与拼单行为',
      '校园日历：临近期末考试周'
    ],
    products: [
      {
        id: 'uni-energy',
        name: '牛磺酸能量饮料',
        category: '功能饮料',
        icon: '⚡',
        currentStock: 6,
        capacity: 50,
        price: 5.5,
        cost: 2.2,
        scores: {
          salesPerformance: 98,
          customerDemand: 99,
          profitMargin: 80,
          scenarioMatch: 98,
          inventoryRisk: 95,
          marketTrend: 95
        },
        weightedScore: 94,
        initialAction: 'Maintain',
        finalAction: 'Increase',
        recommendationDetails: '紧急补至满仓。考试周开启，历史数据显示能量饮料在 23:00-2:00 销量激增 120%。',
        replenishQty: 44,
        whyDecided: {
          title: '考试季熬夜冲刺潮',
          description: '学生正备考期末。宿舍深夜自习推高对高咖啡因能量饮料的巨量需求。',
          sources: [
            { agent: '场景技能智能体', role: '校园日历', finding: '下周一开启期末考试，图书馆延长至 24 小时开放，高咖啡因需求峰值已激活。', status: 'success' },
            { agent: 'CRM 智能体', role: '反馈分析', finding: '数十名学生要求更便宜的能量饮品，当前库存（6 件）今夜将彻底售罄。', status: 'warning' },
            { agent: '销售分析师智能体', role: '时段研究', finding: '深夜销量（22:00-2:00）占宿舍点位能量饮料总销量的 68%。', status: 'info' }
          ]
        }
      },
      {
        id: 'uni-noodles',
        name: '麻辣杯装泡面',
        category: '速食',
        icon: '🍜',
        currentStock: 4,
        capacity: 30,
        price: 4.5,
        cost: 1.8,
        scores: {
          salesPerformance: 95,
          customerDemand: 96,
          profitMargin: 75,
          scenarioMatch: 95,
          inventoryRisk: 90,
          marketTrend: 92
        },
        weightedScore: 91,
        initialAction: 'Maintain',
        finalAction: 'Increase',
        recommendationDetails: '提升库存水位。速食是学生夜间主要零食，当前库存仅 13%，已临临界。',
        replenishQty: 26,
        whyDecided: {
          title: '深夜自习慰藉食品',
          description: '麻辣泡面是熬夜或开黑学生绝对的首选零食，高周转与低价使其极具吸引力。',
          sources: [
            { agent: '销售分析师智能体', role: '周转率', finding: '杯装泡面每周五、六夜场必售罄，学生行为高度可预测。', status: 'success' },
            { agent: '库存智能体', role: '库存预警', finding: '柜内仅剩 4 杯，午夜前将缺货。', status: 'warning' }
          ]
        }
      },
      {
        id: 'uni-milktea',
        name: '香芋奶茶（罐装）',
        category: '甜饮',
        icon: '🧋',
        currentStock: 3,
        capacity: 20,
        price: 6.0,
        cost: 2.5,
        scores: {
          salesPerformance: 78,
          customerDemand: 88,
          profitMargin: 85,
          scenarioMatch: 90,
          inventoryRisk: 80,
          marketTrend: 94
        },
        weightedScore: 85,
        initialAction: 'Maintain',
        finalAction: 'Test',
        recommendationDetails: '引入罐装香芋奶茶试销批次。学生社媒趋势显示其对「高颜值甜饮」的课间休息需求强烈。',
        replenishQty: 15,
        whyDecided: {
          title: 'Z 世代甜系慰藉趋势',
          description: '香芋奶茶在校园社媒热度飙升。以平价罐装切入，无需咖啡馆溢价即可俘获甜饮渴望。',
          sources: [
            { agent: '趋势侦察智能体', role: '社媒聆听', finding: '香芋与奶茶风味在校园论坛帖子中的热度 +85%。', status: 'success' },
            { agent: '场景技能智能体', role: 'Z 世代画像', finding: '女性宿舍居民对甜美、上镜的慰藉食品亲和度极高。', status: 'info' }
          ]
        }
      },
      {
        id: 'uni-soda',
        name: '气泡柠檬苏打',
        category: '汽水',
        icon: '🥤',
        currentStock: 18,
        capacity: 25,
        price: 3.0,
        cost: 1.2,
        scores: {
          salesPerformance: 82,
          customerDemand: 80,
          profitMargin: 65,
          scenarioMatch: 85,
          inventoryRisk: 90,
          marketTrend: 75
        },
        weightedScore: 79,
        initialAction: 'Maintain',
        finalAction: 'Maintain',
        recommendationDetails: '保持库存。汽水销量稳定，库存 72%，无需立即补货。',
        whyDecided: {
          title: '汽水需求平稳',
          description: '柠檬汽水便宜可靠，当前库存完美覆盖未来 3 天。',
          sources: [
            { agent: '库存智能体', role: '容量核查', finding: '18 件库存充足，无缺货或过期风险。', status: 'success' }
          ]
        }
      },
      {
        id: 'uni-cookies',
        name: '巧克力曲奇',
        category: '零食',
        icon: '🍪',
        currentStock: 12,
        capacity: 15,
        price: 5.0,
        cost: 2.0,
        scores: {
          salesPerformance: 65,
          customerDemand: 70,
          profitMargin: 70,
          scenarioMatch: 75,
          inventoryRisk: 85,
          marketTrend: 60
        },
        weightedScore: 68,
        initialAction: 'Maintain',
        finalAction: 'Maintain',
        recommendationDetails: '无需动作。曲奇作为午后自习零食表现尚可。',
        whyDecided: {
          title: '零食表现尚可',
          description: '巧克力曲奇维持中等但平稳的销量，当前库存健康。',
          sources: [
            { agent: '销售分析师智能体', role: '流速核查', finding: '日均稳定售出 2-3 件，今日无需补货。', status: 'info' }
          ]
        }
      },
      {
        id: 'uni-salad',
        name: '高端有机沙拉',
        category: '鲜食',
        icon: '🥗',
        currentStock: 8,
        capacity: 10,
        price: 22.0,
        cost: 11.0,
        scores: {
          salesPerformance: 30,
          customerDemand: 25,
          profitMargin: 90,
          scenarioMatch: 40,
          inventoryRisk: 10,
          marketTrend: 45
        },
        weightedScore: 41,
        initialAction: 'Reduce',
        finalAction: 'Reduce',
        recommendationDetails: '有机沙拉库存下调 60%。定价过高超出典型学生预算，导致高损耗（鲜食保质期仅 2 天）。',
        promotionDetails: '晚 21:00 后对学生 85 折，清掉当前库存。',
        whyDecided: {
          title: '高价位损耗风险',
          description: '¥22 的高价难以吸引偏好平价餐食的学生，2 天保质期带来极高的库存浪费风险。',
          sources: [
            { agent: '库存智能体', role: '损耗警报', finding: '8 份库存中 3 份将于 24 小时内过期，该柜沙拉损耗率目前达 35%。', status: 'warning' },
            { agent: 'CRM 智能体', role: '价格分析', finding: '学生反馈显示，¥15 以上的代餐购买意愿骤降 70%。', status: 'warning' },
            { agent: 'CEO 决策', role: '库存优化', finding: '启动「深夜健康降价」（21:00 后 85 折）清货，并缩减后续货道分配。', status: 'success' }
          ]
        }
      }
    ],
    agentLogs: [
      { id: 'uni-l1', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '14:20:01', message: '正在初始化浙大校园智能柜分析，激活校园日历技能……', type: 'info', sceneIndex: 0 },
      { id: 'uni-l2', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '14:20:03', message: '分派研究任务，激活校园日历追踪：考试期侦测已开启。', type: 'info', sceneIndex: 0 },

      { id: 'uni-l3', agentName: '销售分析师智能体', agentRole: '数据分析师', avatar: '📊', timestamp: '14:20:12', message: '扫描历史销量：核查 18,000 台校园售货机，考试周深夜便利采购显著攀升。', type: 'info', sceneIndex: 1 },
      { id: 'uni-l4', agentName: '销售分析师智能体', agentRole: '数据分析师', avatar: '📊', timestamp: '14:20:15', message: '识别深夜峰值：22:00-2:00 占总日营收 58%，能量饮料与热泡面占其中 80%。', type: 'success', sceneIndex: 1 },

      { id: 'uni-l5', agentName: '趋势侦察智能体', agentRole: '趋势侦察', avatar: '🔍', timestamp: '14:20:22', message: '核查校园信号：浙大期末考试安排已确认，下周一至周五进行。', type: 'success', sceneIndex: 2 },
      { id: 'uni-l6', agentName: '趋势侦察智能体', agentRole: '趋势侦察', avatar: '🔍', timestamp: '14:20:25', message: '社媒爬虫：校园论坛涌现大量「通宵」「咖啡因燃料」「备考零食」讨论（+210%）。', type: 'success', sceneIndex: 2 },

      { id: 'uni-l7', agentName: 'CRM 智能体', agentRole: '客户关系', avatar: '💬', timestamp: '14:20:32', message: '处理学生反馈：多起投诉称 3 号宿舍区能量饮料午夜前即售罄。', type: 'warning', sceneIndex: 3 },
      { id: 'uni-l8', agentName: '库存智能体', agentRole: '物流', avatar: '📦', timestamp: '14:20:35', message: '库存扫描：牛磺酸能量饮料仅剩 6 瓶，麻辣杯面仅剩 4 杯，午夜前将缺货。', type: 'warning', sceneIndex: 3 },
      { id: 'uni-l9', agentName: '库存智能体', agentRole: '物流', avatar: '📦', timestamp: '14:20:38', message: '损耗警报：高端有机沙拉（¥22）3 份明日到期，因学生价格抗性损耗率达 35%。', type: 'warning', sceneIndex: 3 },

      { id: 'uni-l10', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '14:20:42', message: '编译 AI 决策矩阵，权重分配：销售(30%)、需求(20%)、毛利(20%)、技能(15%)、风险(10%)、趋势(5%)。', type: 'info', sceneIndex: 4 },
      { id: 'uni-l11', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '14:20:45', message: '矩阵编译完成：牛磺酸能量饮料(94) 与麻辣泡面(91) 归为增补；有机沙拉(41) 归为减少；香芋奶茶(85) 归为试销。', type: 'success', sceneIndex: 4 }
    ]
  },
  {
    id: 'olympic-park',
    name: '奥森公园智能柜',
    subtitle: '高客流运动与户外休闲枢纽',
    location: '北京奥林匹克森林公园，南门广场',
    loadedSkill: '天气与活动触发技能',
    skillIcon: 'CloudSun',
    avatar: '🏟️',
    description: '服务游客、家庭与高频跑者。销量高度依赖天气预报、周末人流与本地公园赛事活动。',
    metrics: {
      dailySales: '¥4,150',
      activeUsers: '750/天',
      stockLevel: '71%',
      efficiency: '91.8%'
    },
    analyzePoints: [
      '周末游客与跑者高峰（8:00 - 18:00）',
      '大容量补水与矿物质补给偏好',
      '天气触发的需求切换（温度、日照）',
      '园区既定活动（马拉松、家庭跑、节庆）'
    ],
    products: [
      {
        id: 'oly-water',
        name: '1L 矿泉水（运动盖）',
        category: '饮用水',
        icon: '💧',
        currentStock: 8,
        capacity: 80,
        price: 4.0,
        cost: 1.0,
        scores: {
          salesPerformance: 99,
          customerDemand: 98,
          profitMargin: 70,
          scenarioMatch: 99,
          inventoryRisk: 98,
          marketTrend: 90
        },
        weightedScore: 92,
        initialAction: 'Maintain',
        finalAction: 'Increase',
        recommendationDetails: '紧急补至满仓。晴朗周末（+28°C）叠加周日的本地 10K 欢乐跑，预计需求激增 250%。',
        replenishQty: 72,
        whyDecided: {
          title: '晴朗周末 + 10K 跑步活动',
          description: '炎热天气下的高强度活动，催生对大包装水的海量需求。即将到来的 10K 跑使其成为绝对优先级 SKU。',
          sources: [
            { agent: '场景技能智能体', role: '天气与活动技能', finding: '周日清晨南门开跑 10K 欢乐跑，高温 28°C，晴空。', status: 'success' },
            { agent: '销售分析师智能体', role: '活动相关性', finding: '同类跑步活动期间，历史数据显示水品类在活动结束前 4 小时即售罄。', status: 'success' },
            { agent: '库存智能体', role: '库存警报', finding: '当前仅 8 瓶（10% 容量），周六清晨前需紧急补货。', status: 'warning' }
          ]
        }
      },
      {
        id: 'oly-sports',
        name: '等渗运动饮料',
        category: '功能饮料',
        icon: '🏃',
        currentStock: 10,
        capacity: 60,
        price: 6.0,
        cost: 2.4,
        scores: {
          salesPerformance: 96,
          customerDemand: 97,
          profitMargin: 85,
          scenarioMatch: 98,
          inventoryRisk: 95,
          marketTrend: 95
        },
        weightedScore: 94,
        initialAction: 'Maintain',
        finalAction: 'Increase',
        recommendationDetails: '提升库存水位。跑者运动后高度偏爱运动饮料，60% 的高毛利使其成为关键营收驱动。',
        replenishQty: 50,
        whyDecided: {
          title: '运动后等渗补给',
          description: '奥森跑者偏好以等渗饮料替代普通汽水用于电解质恢复，高毛利叠加高销量，值得大比例货道分配。',
          sources: [
            { agent: '趋势侦察智能体', role: '微观人群', finding: '本季奥森跑步活动 +25%，肌肉恢复类搜索量高企。', status: 'success' },
            { agent: 'CRM 智能体', role: '反馈分析', finding: '跑者在 App 反馈中要求更冰爽的选项与更大运动盖。', status: 'info' }
          ]
        }
      },
      {
        id: 'oly-sorbet',
        name: '水果雪芭冰棒',
        category: '冰淇淋',
        icon: '🍦',
        currentStock: 5,
        capacity: 20,
        price: 8.0,
        cost: 3.2,
        scores: {
          salesPerformance: 80,
          customerDemand: 90,
          profitMargin: 90,
          scenarioMatch: 92,
          inventoryRisk: 50,
          marketTrend: 92
        },
        weightedScore: 85,
        initialAction: 'Maintain',
        finalAction: 'Test',
        recommendationDetails: '补货并试销扩充冰棒品类。晴朗天气与周末家庭野餐人流，带动面向儿童的高毛利冲动消费。',
        replenishQty: 15,
        whyDecided: {
          title: '周末家庭野餐冲动购',
          description: '冰淇淋是公园家庭游客周末的高毛利心头好，晴好天气预报使其成为试销扩张的上佳候选。',
          sources: [
            { agent: '趋势侦察智能体', role: '天气预报', finding: '周六晴好，太阳辐射指数 85%，冰冻甜品冲动购买的最佳条件。', status: 'success' },
            { agent: '场景技能智能体', role: '画像对齐', finding: '周末带娃家庭高度集中，冰棒代表 premium 毛利（60%）。', status: 'success' }
          ]
        }
      },
      {
        id: 'oly-popcorn',
        name: '咸味爆米花',
        category: '零食',
        icon: '🍿',
        currentStock: 12,
        capacity: 20,
        price: 6.0,
        cost: 2.2,
        scores: {
          salesPerformance: 75,
          customerDemand: 75,
          profitMargin: 80,
          scenarioMatch: 80,
          inventoryRisk: 85,
          marketTrend: 70
        },
        weightedScore: 76,
        initialAction: 'Maintain',
        finalAction: 'Maintain',
        recommendationDetails: '维持现有库存。爆米花作为周末漫步的家庭零食表现平稳，当前水位充足。',
        whyDecided: {
          title: '平稳的家庭休闲零食',
          description: '爆米花是休闲游客的稳定单品，当前 12 件库存足以覆盖周末。',
          sources: [
            { agent: '销售分析师智能体', role: '休闲趋势', finding: '周末日均稳定售出 4-5 袋，与家庭组团高度相关。', status: 'info' }
          ]
        }
      },
      {
        id: 'oly-fruit',
        name: '鲜切果杯',
        category: '鲜食',
        icon: '🍎',
        currentStock: 6,
        capacity: 15,
        price: 10.0,
        cost: 4.5,
        scores: {
          salesPerformance: 60,
          customerDemand: 65,
          profitMargin: 75,
          scenarioMatch: 70,
          inventoryRisk: 40,
          marketTrend: 65
        },
        weightedScore: 66,
        initialAction: 'Maintain',
        finalAction: 'Maintain',
        recommendationDetails: '保持库存。鲜果杯在晴朗午后表现良好，但保质期仅 24 小时，切勿过量补货以免浪费。',
        whyDecided: {
          title: '高损耗鲜果需谨慎',
          description: '鲜果人气高但极不耐储，库存须收紧，确保单日内完全周转。',
          sources: [
            { agent: '库存智能体', role: '保质期核查', finding: '鲜果杯须在 24 小时内售出，当前 6 件安全，但勿再追加。', status: 'info' }
          ]
        }
      },
      {
        id: 'oly-hotcoffee',
        name: '罐装热咖啡',
        category: '咖啡',
        icon: '☕',
        currentStock: 15,
        capacity: 20,
        price: 6.0,
        cost: 2.5,
        scores: {
          salesPerformance: 20,
          customerDemand: 15,
          profitMargin: 80,
          scenarioMatch: 10,
          inventoryRisk: 60,
          marketTrend: 10
        },
        weightedScore: 26,
        initialAction: 'Reduce',
        finalAction: 'Reduce',
        recommendationDetails: '紧急缩减热咖啡库存。夏季零需求，将其中 80% 货道重新分配给 1L 矿泉水，避免错失销售。',
        promotionDetails: '清仓或入仓留待秋季。',
        whyDecided: {
          title: '季节性温度错配',
          description: '室外温度超 25°C 时热咖啡近乎零销售，将其货道腾给矿泉水对营收最大化至关重要。',
          sources: [
            { agent: '销售分析师智能体', role: '季节表现', finding: '该点位热咖啡日销从冬季 8.5 件骤降至夏季 0.1 件。', status: 'warning' },
            { agent: '场景技能智能体', role: '天气对齐', finding: '晴热天气下，热饮与公园高频活动游客并不兼容。', status: 'warning' },
            { agent: 'CEO 决策', role: '货道重分配', finding: '将罐装热咖啡 15 个货道直接转给 1L 矿泉水，使水容量升至 95 件。', status: 'success' }
          ]
        }
      }
    ],
    agentLogs: [
      { id: 'oly-l1', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '06:30:01', message: '正在初始化北京奥森公园智能柜分析，激活天气与活动触发技能……', type: 'info', sceneIndex: 0 },
      { id: 'oly-l2', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '06:30:03', message: '分派研究任务，扫描园区活动日历与实时天气预报。', type: 'info', sceneIndex: 0 },

      { id: 'oly-l3', agentName: '销售分析师智能体', agentRole: '数据分析师', avatar: '📊', timestamp: '06:30:12', message: '扫描历史销量：核查 12,000 台公园售货机，晴好周末销量较工作日高 4.2 倍。', type: 'info', sceneIndex: 1 },
      { id: 'oly-l4', agentName: '销售分析师智能体', agentRole: '数据分析师', avatar: '📊', timestamp: '06:30:15', message: '品类警报：大容量矿泉水与运动饮料占周末销量体积的 72%。', type: 'success', sceneIndex: 1 },

      { id: 'oly-l5', agentName: '趋势侦察智能体', agentRole: '趋势侦察', avatar: '🔍', timestamp: '06:30:22', message: '获取天气预报：晴朗周末，高温 28°C，紫外线指数：高，风速：低。', type: 'success', sceneIndex: 2 },
      { id: 'oly-l6', agentName: '趋势侦察智能体', agentRole: '趋势侦察', avatar: '🔍', timestamp: '06:30:25', message: '活动库查询：「奥森 10K 欢乐跑」排期周日清晨，预计参赛 3,000 人。', type: 'success', sceneIndex: 2 },

      { id: 'oly-l7', agentName: 'CRM 智能体', agentRole: '客户关系', avatar: '💬', timestamp: '06:30:32', message: '处理跑者反馈：要求更大瓶型（1L+）与运动盖，便于跑步中畅饮。', type: 'info', sceneIndex: 3 },
      { id: 'oly-l8', agentName: '库存智能体', agentRole: '物流', avatar: '📦', timestamp: '06:30:35', message: '库存扫描：1L 矿泉水仅剩 8 瓶，等渗运动饮料仅剩 10 瓶，周六 9:00 前将缺货。', type: 'warning', sceneIndex: 3 },
      { id: 'oly-l9', agentName: '库存智能体', agentRole: '物流', avatar: '📦', timestamp: '06:30:38', message: '滞销警报：罐装热咖啡库存 15 件，近 14 天零销售。', type: 'warning', sceneIndex: 3 },

      { id: 'oly-l10', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '06:30:42', message: '编译 AI 决策矩阵，权重分配：销售(30%)、需求(20%)、毛利(20%)、技能(15%)、风险(10%)、趋势(5%)。', type: 'info', sceneIndex: 4 },
      { id: 'oly-l11', agentName: 'CEO 智能体', agentRole: '总监', avatar: '🤖', timestamp: '06:30:45', message: '矩阵编译完成：1L 矿泉水(92) 与等渗饮料(94) 归为增补；热咖啡(26) 归为减少；水果雪芭(85) 归为试销。', type: 'success', sceneIndex: 4 }
    ]
  }
];
