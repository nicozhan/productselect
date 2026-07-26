import { Scenario, FactorWeight } from '../types';
import type { Lang } from '../i18n';
import { SCENARIOS_ZH } from './data.zh';

export const FACTOR_WEIGHTS_EN: FactorWeight[] = [
  { name: 'Sales Performance', key: 'salesPerformance', weight: 30, color: '#3b82f6', description: 'Historical velocity and SKU turnover rate' },
  { name: 'Customer Demand', key: 'customerDemand', weight: 20, color: '#10b981', description: 'Direct feedback, requests, and category satisfaction' },
  { name: 'Profit Margin', key: 'profitMargin', weight: 20, color: '#8b5cf6', description: 'Net margin contribution per unit' },
  { name: 'Scenario Match', key: 'scenarioMatch', weight: 15, color: '#f59e0b', description: 'Alignment with location-specific customer personas' },
  { name: 'Inventory Risk', key: 'inventoryRisk', weight: 10, color: '#ef4444', description: 'Expiration date buffer and stockout/melting hazards' },
  { name: 'Market Trend', key: 'marketTrend', weight: 5, color: '#06b6d4', description: 'Regional social media search surges and macro signals' }
];

export const calculateWeightedScore = (scores: {
  salesPerformance: number;
  customerDemand: number;
  profitMargin: number;
  scenarioMatch: number;
  inventoryRisk: number;
  marketTrend: number;
}) => {
  return Math.round(
    (scores.salesPerformance * 0.30) +
    (scores.customerDemand * 0.20) +
    (scores.profitMargin * 0.20) +
    (scores.scenarioMatch * 0.15) +
    (scores.inventoryRisk * 0.10) +
    (scores.marketTrend * 0.05)
  );
};

export const SCENARIOS_EN: Scenario[] = [
  {
    id: 'cbd-office',
    name: 'CBD Office Smart Cabinet',
    subtitle: 'The high-frequency business district replenishment station',
    location: 'Beijing CBD Guomao, Tower B Lobby',
    loadedSkill: 'Office Worker Behavior Skill',
    skillIcon: 'Briefcase',
    avatar: '🏢',
    description: 'Serving high-earning white-collar professionals with extreme morning and lunch peaks. High demand for premium caffeine, healthy hydration, and quick meal replacements.',
    metrics: {
      dailySales: '¥3,420',
      activeUsers: '480/day',
      stockLevel: '78%',
      efficiency: '94.2%'
    },
    analyzePoints: [
      'Morning peak demand (8:00 AM - 9:30 AM)',
      'Premium coffee and functional beverage consumption',
      'Business customer premium price tolerance',
      'Similar office building historical sales correlations'
    ],
    products: [
      {
        id: 'cbd-electrolyte',
        name: 'Electrolyte Water (Citrus)',
        category: 'Functional Drink',
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
          inventoryRisk: 95, // high safety
          marketTrend: 98
        },
        weightedScore: 93,
        initialAction: 'Maintain',
        finalAction: 'Increase',
        recommendationDetails: 'Increase stock to maximum capacity. High-temperature forecast combined with morning commute hydration trends indicates a 45% demand surge.',
        replenishQty: 40,
        whyDecided: {
          title: 'Heatwave + Commuter Demand Surge',
          description: 'Electrolyte Water is showing extreme velocity. The combination of an upcoming 35°C heatwave and social trends around "morning hydration" makes this our highest priority SKU.',
          sources: [
            { agent: 'Trend Scout Agent', role: 'External Signals', finding: 'Beijing temperature rising to 35°C tomorrow. "Hydration hacks" trending +180% on local social media.', status: 'success' },
            { agent: 'Sales Analyst Agent', role: 'Velocity Analysis', finding: 'SKU turnover rate is 3.4x faster than typical category average under similar weather conditions.', status: 'success' },
            { agent: 'Scenario Skill Agent', role: 'Persona Matching', finding: 'CBD workers purchase hydration drinks pre-workout or post-commute. High match with Office Worker Behavior Skill.', status: 'info' }
          ]
        }
      },
      {
        id: 'cbd-coldbrew',
        name: 'Cold Brew Black Coffee',
        category: 'Premium Coffee',
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
        recommendationDetails: 'Replenish urgently. Current stock is at 12%. Morning rush hour coffee demand is inelastic, and this SKU yields a 63% gross margin.',
        replenishQty: 30,
        whyDecided: {
          title: 'Inelastic Morning Caffeine Peak',
          description: 'Cold Brew is the primary choice for office workers arriving between 8:00 AM and 9:00 AM. High profit margins dictate that we must never stock out.',
          sources: [
            { agent: 'CRM Agent', role: 'Customer Feedback', finding: 'Received 14 "out of stock" feedback pings for cold brew coffee in the last 48 hours.', status: 'warning' },
            { agent: 'Inventory Agent', role: 'Stock Alert', finding: 'Current stock (5 units) will deplete within the first 25 minutes of morning rush hour.', status: 'warning' },
            { agent: 'CEO Decision', role: 'Profit Optimization', finding: 'Prioritize premium coffee due to high profit margin (¥9.50/unit net profit) and strong customer loyalty.', status: 'success' }
          ]
        }
      },
      {
        id: 'cbd-coconut',
        name: 'Premium Coconut Water',
        category: 'Natural Hydration',
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
        recommendationDetails: 'Allocate trial slots. Coconut water is trending heavily in neighboring high-end gyms. Test a small expansion to capture local health-conscious office demographic.',
        replenishQty: 15,
        whyDecided: {
          title: 'Health-Conscious Gym Demographic Test',
          description: 'While historical sales are moderate, coconut water is experiencing a massive macro-trend surge and matches the active-lifestyle CBD professional profile.',
          sources: [
            { agent: 'Trend Scout Agent', role: 'Trend Mining', finding: 'Coconut water search volume is up 45% week-over-week. Strong correlation with high-end fitness clubs nearby.', status: 'success' },
            { agent: 'Scenario Skill Agent', role: 'Persona Alignment', finding: 'Office worker profile shows high willingness to pay premium prices for natural, low-sugar beverages.', status: 'info' }
          ]
        }
      },
      {
        id: 'cbd-oolong',
        name: 'Sugar-Free Oolong Tea',
        category: 'Tea',
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
        recommendationDetails: 'Maintain current inventory levels. Sales are highly stable. No immediate replenishment needed as stock is sufficient for 2.5 days of normal demand.',
        whyDecided: {
          title: 'Stable Performance, Adequate Stock',
          description: 'Sugar-Free Oolong Tea is a reliable "anchor" product. Stock levels are healthy, and demand is stable. No action required.',
          sources: [
            { agent: 'Sales Analyst Agent', role: 'Stability Check', finding: 'Daily sales variance is less than 5%. Extremely predictable demand pattern.', status: 'info' },
            { agent: 'Inventory Agent', role: 'Stock Level Check', finding: 'Current stock of 22 units is optimal for the next 48 hours.', status: 'success' }
          ]
        }
      },
      {
        id: 'cbd-chips',
        name: 'Sea Salt Potato Chips',
        category: 'Snack',
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
        recommendationDetails: 'Hold current stock. Salty snacks experience lower velocity in office buildings during summer, as workers prefer refreshing beverages and cold snacks.',
        whyDecided: {
          title: 'Low Summer Snack Velocity',
          description: 'Potato chips have low priority during hot weeks. Keep current stock levels and do not replenish to save physical slots for high-demand beverages.',
          sources: [
            { agent: 'Sales Analyst Agent', role: 'Seasonal Analysis', finding: 'Snack categories drop 18% in sales volume when outdoor temperature exceeds 30°C.', status: 'info' }
          ]
        }
      },
      {
        id: 'cbd-chocolate',
        name: 'Premium Chocolate Bar',
        category: 'Snack',
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
          inventoryRisk: 20, // high risk of melting/expiry
          marketTrend: 22
        },
        weightedScore: 39,
        initialAction: 'Reduce',
        finalAction: 'Reduce',
        recommendationDetails: 'Reduce inventory allocation by 60%. High risk of chocolate melting due to cabinet door opening frequency in summer. Low turnover rate.',
        promotionDetails: '20% discount to accelerate clearance of near-expiry batch.',
        whyDecided: {
          title: 'Melting Hazard & Expiry Clearance',
          description: 'Chocolate sales have collapsed due to seasonal preferences. Furthermore, inventory reports show this batch has a 7-day expiration threshold remaining.',
          sources: [
            { agent: 'Inventory Agent', role: 'Quality Risk', finding: 'Cabinet internal temperature fluctuation during peak usage poses a melting risk to chocolate. Expiration in 7 days.', status: 'warning' },
            { agent: 'CRM Agent', role: 'Feedback Analysis', finding: 'Zero positive social mentions or purchases of heavy chocolate snacks in the office segment this week.', status: 'info' },
            { agent: 'CEO Decision', role: 'Risk Mitigation', finding: 'Enforce a 20% discount immediately to clear the remaining 14 bars and reallocate slots to Cold Brew.', status: 'warning' }
          ]
        }
      }
    ],
    agentLogs: [
      { id: 'cbd-l1', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '08:00:01', message: 'Initializing analysis for Beijing CBD Guomao Smart Cabinet. Activating Office Worker Behavior Skill...', type: 'info', sceneIndex: 0 },
      { id: 'cbd-l2', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '08:00:03', message: 'Assigning tasks: Sales Analyst (Historical Sales), Trend Scout (External Signals), CRM Agent (Customer Feedback), Inventory Agent (Stock Levels).', type: 'info', sceneIndex: 0 },
      
      { id: 'cbd-l3', agentName: 'Sales Analyst Agent', agentRole: 'Data Analyst', avatar: '📊', timestamp: '08:00:12', message: 'Scanning historical sales: Analyzed 35,000 similar office building vending machines over 3 summer seasons.', type: 'info', sceneIndex: 1 },
      { id: 'cbd-l4', agentName: 'Sales Analyst Agent', agentRole: 'Data Analyst', avatar: '📊', timestamp: '08:00:15', message: 'Identified top-performing category: Cold Brew Coffee and Sugar-Free Hydration represent 64% of total office revenue.', type: 'success', sceneIndex: 1 },
      { id: 'cbd-l5', agentName: 'Sales Analyst Agent', agentRole: 'Data Analyst', avatar: '📊', timestamp: '08:00:18', message: 'Alert: SKU "Premium Chocolate Bar" has a turnover rate of only 0.1 units/day, well below the efficiency threshold.', type: 'warning', sceneIndex: 1 },
      
      { id: 'cbd-l6', agentName: 'Trend Scout Agent', agentRole: 'Trend Scout', avatar: '🔍', timestamp: '08:00:22', message: 'Fetching external signals: Weather API reports 35°C high for Beijing tomorrow. UV index: Extreme.', type: 'info', sceneIndex: 2 },
      { id: 'cbd-l7', agentName: 'Trend Scout Agent', agentRole: 'Trend Scout', avatar: '🔍', timestamp: '08:00:25', message: 'Social media crawler: "Heatwave survival", "cold brew", and "electrolyte water" are trending in Beijing business districts (+140% surge).', type: 'success', sceneIndex: 2 },
      { id: 'cbd-l8', agentName: 'Trend Scout Agent', agentRole: 'Trend Scout', avatar: '🔍', timestamp: '08:00:28', message: 'Detected local gym expansion: Two premium fitness centers opened within 200m of Guomao Tower B. High interest in natural isotonic drinks.', type: 'success', sceneIndex: 2 },
      
      { id: 'cbd-l9', agentName: 'CRM Agent', agentRole: 'Customer Relations', avatar: '💬', timestamp: '08:00:32', message: 'Processing customer feedback: 14 app pings and QR-code feedback submissions reported "out of stock" for Cold Brew Coffee.', type: 'warning', sceneIndex: 3 },
      { id: 'cbd-l10', agentName: 'Inventory Agent', agentRole: 'Logistics', avatar: '📦', timestamp: '08:00:35', message: 'Checking cabinet inventory: Cold Brew Coffee is down to 5 bottles (12% capacity). Stockout imminent.', type: 'warning', sceneIndex: 3 },
      { id: 'cbd-l11', agentName: 'Inventory Agent', agentRole: 'Logistics', avatar: '📦', timestamp: '08:00:38', message: 'Quality alert: Chocolate Bar batch expires in 7 days. Cabinet door openings spike internal humidity. Recommend immediate markdown.', type: 'warning', sceneIndex: 3 },
      
      { id: 'cbd-l12', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '08:00:42', message: 'Compiling AI Decision Matrix. Calculating weighted scores based on: Sales (30%), Demand (20%), Margin (20%), Skill (15%), Risk (10%), Trend (5%).', type: 'info', sceneIndex: 4 },
      { id: 'cbd-l13', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '08:00:45', message: 'Matrix sorted: Electrolyte Water (93) and Cold Brew (92) mapped to INCREASE. Chocolate (39) mapped to REDUCE. Coconut Water (81) mapped to TEST.', type: 'success', sceneIndex: 4 }
    ]
  },
  {
    id: 'university-campus',
    name: 'University Campus Cabinet',
    subtitle: 'Student lifestyle and late-night convenience station',
    location: 'Zhejiang University Campus, Dormitory Area 3',
    loadedSkill: 'Campus Calendar Skill',
    skillIcon: 'GraduationCap',
    avatar: '🎓',
    description: 'Serving Gen-Z students with late-night study habits and highly price-sensitive purchasing. Driven by exam schedules, gaming peaks, and campus social trends.',
    metrics: {
      dailySales: '¥2,890',
      activeUsers: '620/day',
      stockLevel: '82%',
      efficiency: '89.5%'
    },
    analyzePoints: [
      'Late-night peak purchasing (10:00 PM - 2:00 AM)',
      'High caffeine and quick carb snack preferences',
      'Price sensitivity and group buying behavior',
      'Campus calendar: Upcoming final exam week'
    ],
    products: [
      {
        id: 'uni-energy',
        name: 'Taurine Energy Drink',
        category: 'Functional Drink',
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
        recommendationDetails: 'Urgently replenish to max capacity. Exam week is starting, and historical sales show a 120% surge in energy drinks between 11 PM and 2 AM.',
        replenishQty: 44,
        whyDecided: {
          title: 'Exam Season Cramming Surge',
          description: 'Students are preparing for final exams. Late-night study sessions in the dormitories drive massive demand for high-caffeine energy drinks.',
          sources: [
            { agent: 'Scenario Skill Agent', role: 'Campus Calendar', finding: 'Final exams start next Monday. Library hours extended to 24/7. High-caffeine demand peak active.', status: 'success' },
            { agent: 'CRM Agent', role: 'Feedback Analysis', finding: 'Dozens of students requested cheaper energy options. Current stock (6 units) will trigger a complete stockout tonight.', status: 'warning' },
            { agent: 'Sales Analyst Agent', role: 'Time-of-Day Study', finding: 'Late-night sales (10 PM - 2 AM) account for 68% of total energy drink sales in dormitory locations.', status: 'info' }
          ]
        }
      },
      {
        id: 'uni-noodles',
        name: 'Spicy Cup Noodles',
        category: 'Instant Food',
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
        recommendationDetails: 'Increase stock levels. Instant food is the primary night snack for students. Current stock is critically low at 13%.',
        replenishQty: 26,
        whyDecided: {
          title: 'Late-Night Study Comfort Food',
          description: 'Spicy noodles represent the absolute favorite snack for students studying late or gaming. High turnover rates and low price make it highly attractive.',
          sources: [
            { agent: 'Sales Analyst Agent', role: 'Turnover Rate', finding: 'Cup noodles sell out completely every Friday and Saturday night. Highly predictable student behavior.', status: 'success' },
            { agent: 'Inventory Agent', role: 'Stock Warning', finding: 'Only 4 cups left in the cabinet. Will stock out before midnight.', status: 'warning' }
          ]
        }
      },
      {
        id: 'uni-milktea',
        name: 'Taro Milk Tea (Canned)',
        category: 'Sweet Drink',
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
        recommendationDetails: 'Introduce a trial batch of canned Taro Milk Tea. Social trends among students show high interest in "aesthetic sweet drinks" for study breaks.',
        replenishQty: 15,
        whyDecided: {
          title: 'Gen-Z Sweet Comfort Trend',
          description: 'Taro Milk Tea is trending heavily on campus social media. Offering an affordable canned option captures sweet drink cravings without premium cafe prices.',
          sources: [
            { agent: 'Trend Scout Agent', role: 'Social Listening', finding: 'Taro and milk tea flavor profiles are trending +85% in campus-related student forum posts.', status: 'success' },
            { agent: 'Scenario Skill Agent', role: 'Gen-Z Persona', finding: 'High affinity for sweet, photogenic comfort food among female dorm residents.', status: 'info' }
          ]
        }
      },
      {
        id: 'uni-soda',
        name: 'Fizzy Lemon Soda',
        category: 'Soda',
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
        recommendationDetails: 'Hold stock. Soda sales are stable and stock is at 72%. No immediate replenishment required.',
        whyDecided: {
          title: 'Stable Soda Demand',
          description: 'Lemon Soda is a cheap, reliable SKU. Current stock levels are perfect to cover the next 3 days.',
          sources: [
            { agent: 'Inventory Agent', role: 'Capacity Check', finding: '18 units in stock is sufficient. No risk of stockout or expiration.', status: 'success' }
          ]
        }
      },
      {
        id: 'uni-cookies',
        name: 'Chocolate Cookies',
        category: 'Snack',
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
        recommendationDetails: 'No action. Cookies are performing adequately as mid-afternoon study snacks.',
        whyDecided: {
          title: 'Adequate Snack Performance',
          description: 'Chocolate cookies maintain moderate but steady sales. Current inventory is healthy.',
          sources: [
            { agent: 'Sales Analyst Agent', role: 'Velocity Check', finding: 'Steady sales of 2-3 units per day. No replenishment required today.', status: 'info' }
          ]
        }
      },
      {
        id: 'uni-salad',
        name: 'Premium Organic Salad',
        category: 'Fresh Food',
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
          inventoryRisk: 10, // high risk of waste/expiry
          marketTrend: 45
        },
        weightedScore: 41,
        initialAction: 'Reduce',
        finalAction: 'Reduce',
        recommendationDetails: 'Reduce organic salad stock by 60%. Price point is too high for the typical student budget, leading to high spoilage rates (fresh food 2-day shelf life).',
        promotionDetails: '15% discount for students after 9:00 PM to clear current stock.',
        whyDecided: {
          title: 'High Price Point Spoilage Risk',
          description: 'With a high price of ¥22, this salad fails to attract students who prefer cheaper meals. The 2-day shelf life poses extreme inventory waste risk.',
          sources: [
            { agent: 'Inventory Agent', role: 'Spoilage Alert', finding: '3 out of 8 salads in stock expire in 24 hours. Spoilage rate for fresh salads is currently 35% in this cabinet.', status: 'warning' },
            { agent: 'CRM Agent', role: 'Price Analysis', finding: 'Student feedback indicates any meal replacement above ¥15 experiences a 70% drop-off in purchase intent.', status: 'warning' },
            { agent: 'CEO Decision', role: 'Inventory Optimization', finding: 'Enact a "Late Night Healthy Markdown" (15% off after 9 PM) to clear stock, and reduce future slot allocation.', status: 'success' }
          ]
        }
      }
    ],
    agentLogs: [
      { id: 'uni-l1', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '14:20:01', message: 'Initializing analysis for Zhejiang University Campus Smart Cabinet. Activating Campus Calendar Skill...', type: 'info', sceneIndex: 0 },
      { id: 'uni-l2', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '14:20:03', message: 'Assigning research tasks. Activating Campus Calendar tracking: Exam period detection active.', type: 'info', sceneIndex: 0 },
      
      { id: 'uni-l3', agentName: 'Sales Analyst Agent', agentRole: 'Data Analyst', avatar: '📊', timestamp: '14:20:12', message: 'Scanning historical sales: Checked 18,000 campus vending machines. Late-night convenience buying spikes during exam weeks.', type: 'info', sceneIndex: 1 },
      { id: 'uni-l4', agentName: 'Sales Analyst Agent', agentRole: 'Data Analyst', avatar: '📊', timestamp: '14:20:15', message: 'Identified late-night peak: 10 PM - 2 AM accounts for 58% of total daily revenue. Energy drinks and hot noodles represent 80% of these transactions.', type: 'success', sceneIndex: 1 },
      
      { id: 'uni-l5', agentName: 'Trend Scout Agent', agentRole: 'Trend Scout', avatar: '🔍', timestamp: '14:20:22', message: 'Checking campus signals: Zhejiang University final exam schedule verified. Exams run from next Monday to Friday.', type: 'success', sceneIndex: 2 },
      { id: 'uni-l6', agentName: 'Trend Scout Agent', agentRole: 'Trend Scout', avatar: '🔍', timestamp: '14:20:25', message: 'Social crawler: Campus forums show massive discussions on "all-nighters", "caffeine fuel", and "study snacks" (+210% surge).', type: 'success', sceneIndex: 2 },
      
      { id: 'uni-l7', agentName: 'CRM Agent', agentRole: 'Customer Relations', avatar: '💬', timestamp: '14:20:32', message: 'Processing student feedback: Multiple complaints that energy drinks run out by midnight in dorm area 3.', type: 'warning', sceneIndex: 3 },
      { id: 'uni-l8', agentName: 'Inventory Agent', agentRole: 'Logistics', avatar: '📦', timestamp: '14:20:35', message: 'Inventory scan: Taurine Energy Drink down to 6 bottles. Spicy Cup Noodles down to 4 cups. Stockouts imminent before midnight.', type: 'warning', sceneIndex: 3 },
      { id: 'uni-l9', agentName: 'Inventory Agent', agentRole: 'Logistics', avatar: '📦', timestamp: '14:20:38', message: 'Spoilage alert: Premium Organic Salad (¥22) has 3 units expiring tomorrow. Spoilage rate is 35% due to student price resistance.', type: 'warning', sceneIndex: 3 },
      
      { id: 'uni-l10', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '14:20:42', message: 'Compiling AI Decision Matrix. Weight allocations: Sales (30%), Demand (20%), Margin (20%), Skill (15%), Risk (10%), Trend (5%).', type: 'info', sceneIndex: 4 },
      { id: 'uni-l11', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '14:20:45', message: 'Matrix compiled: Taurine Energy Drink (94) and Spicy Noodles (91) mapped to INCREASE. Organic Salad (41) mapped to REDUCE. Taro Milk Tea (85) mapped to TEST.', type: 'success', sceneIndex: 4 }
    ]
  },
  {
    id: 'olympic-park',
    name: 'Olympic Park Smart Cabinet',
    subtitle: 'High-volume sports and outdoor leisure hub',
    location: 'Beijing Olympic Forest Park, South Gate Plaza',
    loadedSkill: 'Weather & Event Trigger Skill',
    skillIcon: 'CloudSun',
    avatar: '🏟️',
    description: 'Serving tourists, families, and high-activity runners. Sales are heavily dependent on weather forecasts, weekend crowds, and local park athletic events.',
    metrics: {
      dailySales: '¥4,150',
      activeUsers: '750/day',
      stockLevel: '71%',
      efficiency: '91.8%'
    },
    analyzePoints: [
      'Weekend tourist and runner flow spikes (8:00 AM - 6:00 PM)',
      'Large-volume hydration and mineral replenishment preference',
      'Weather-triggered demand shifts (temperature, sunshine)',
      'Scheduled park events (marathons, family runs, festivals)'
    ],
    products: [
      {
        id: 'oly-water',
        name: '1L Mineral Water (Sport Cap)',
        category: 'Water',
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
        recommendationDetails: 'Urgently replenish to max capacity. A sunny weekend (+28°C) and a local 10k fun run scheduled on Sunday will trigger an estimated 250% demand surge.',
        replenishQty: 72,
        whyDecided: {
          title: 'Sunny Weekend + 10K Running Event',
          description: 'High physical activity in hot weather drives massive demand for large-format water. The upcoming 10k run makes this SKU the absolute critical priority.',
          sources: [
            { agent: 'Scenario Skill Agent', role: 'Weather & Event Skill', finding: '10K Fun Run scheduled Sunday morning starting at South Gate. High temperature: 28°C, clear skies.', status: 'success' },
            { agent: 'Sales Analyst Agent', role: 'Event Correlation', finding: 'Historical sales during similar running events show water categories sell out 4 hours before the event ends.', status: 'success' },
            { agent: 'Inventory Agent', role: 'Stock Alert', finding: 'Current stock is only 8 bottles (10% capacity). Urgent replenishment needed before Saturday morning.', status: 'warning' }
          ]
        }
      },
      {
        id: 'oly-sports',
        name: 'Isotonic Sports Drink',
        category: 'Functional Drink',
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
        recommendationDetails: 'Increase inventory levels. Sports drinks are highly favored by runners post-workout. High profit margin of 60% makes this SKU a key revenue driver.',
        replenishQty: 50,
        whyDecided: {
          title: 'Post-Workout Isotonic Replenishment',
          description: 'Runners in Olympic Park prefer isotonic drinks over regular soda for electrolyte recovery. High margin and high volume justify large slot allocation.',
          sources: [
            { agent: 'Trend Scout Agent', role: 'Micro-demographics', finding: 'Running activity in Olympic Park has increased 25% this season. High search volume for muscle recovery.', status: 'success' },
            { agent: 'CRM Agent', role: 'Feedback Analysis', finding: 'Runners requested colder options and larger sports caps in the app feedback form.', status: 'info' }
          ]
        }
      },
      {
        id: 'oly-sorbet',
        name: 'Fruit Sorbet Ice Pop',
        category: 'Ice Cream',
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
          inventoryRisk: 50, // melting risk in extreme heat
          marketTrend: 92
        },
        weightedScore: 85,
        initialAction: 'Maintain',
        finalAction: 'Test',
        recommendationDetails: 'Replenish and test an expanded ice pop selection. Sunny weather and family picnic crowds on weekends drive high-margin impulse purchases for children.',
        replenishQty: 15,
        whyDecided: {
          title: 'Weekend Family Picnic Impulse Buy',
          description: 'Ice cream is a high-margin weekend favorite for families visiting the park. The sunny weather forecast makes this a prime candidate for a trial expansion.',
          sources: [
            { agent: 'Trend Scout Agent', role: 'Weather Forecast', finding: 'Sunny Saturday forecast with 85% solar radiation index. Perfect conditions for frozen treat impulse buys.', status: 'success' },
            { agent: 'Scenario Skill Agent', role: 'Persona Alignment', finding: 'High weekend concentration of families with children. Ice pops represent premium margin (60%).', status: 'success' }
          ]
        }
      },
      {
        id: 'oly-popcorn',
        name: 'Salted Popcorn Bag',
        category: 'Snack',
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
        recommendationDetails: 'Maintain current inventory. Popcorn performs steadily as a family snack during weekend walks. Current stock levels are sufficient.',
        whyDecided: {
          title: 'Steady Family Leisure Snack',
          description: 'Popcorn is a stable seller for leisure park visitors. Current stock of 12 units is adequate for the weekend.',
          sources: [
            { agent: 'Sales Analyst Agent', role: 'Leisure Trends', finding: 'Steady sales of 4-5 bags per weekend day. Highly correlated with family group presence.', status: 'info' }
          ]
        }
      },
      {
        id: 'oly-fruit',
        name: 'Fresh Sliced Fruit Cup',
        category: 'Fresh Food',
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
          inventoryRisk: 40, // short shelf-life
          marketTrend: 65
        },
        weightedScore: 66,
        initialAction: 'Maintain',
        finalAction: 'Maintain',
        recommendationDetails: 'Hold stock. Fresh fruit cups perform well on sunny afternoons but have a 24-hour shelf life. Do not over-replenish to avoid waste.',
        whyDecided: {
          title: 'High Spoilage Fresh Fruit Care',
          description: 'Fresh fruit is popular but highly perishable. Keep stock tight to ensure complete turnover within a single day.',
          sources: [
            { agent: 'Inventory Agent', role: 'Shelf Life Check', finding: 'Fresh fruit cups must be sold within 24 hours. Current stock of 6 is safe but do not add more.', status: 'info' }
          ]
        }
      },
      {
        id: 'oly-hotcoffee',
        name: 'Canned Hot Coffee',
        category: 'Coffee',
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
        recommendationDetails: 'Urgently reduce hot coffee inventory. Zero demand in summer weather. Reallocate 80% of these slots to 1L Mineral Water to avoid lost sales.',
        promotionDetails: 'Clear stock or store in warehouse for autumn season.',
        whyDecided: {
          title: 'Seasonal Temperature Mismatch',
          description: 'Hot coffee experiences near-zero sales when outdoor temperatures exceed 25°C. Reallocating these slots to water is critical to maximize revenue.',
          sources: [
            { agent: 'Sales Analyst Agent', role: 'Seasonal Performance', finding: 'Hot coffee daily sales dropped from 8.5 units in winter to 0.1 units in summer at this location.', status: 'warning' },
            { agent: 'Scenario Skill Agent', role: 'Weather Alignment', finding: 'Hot drinks are incompatible with high physical activity park visitors in sunny weather.', status: 'warning' },
            { agent: 'CEO Decision', role: 'Slot Reallocation', finding: 'Reallocate 15 slots of Canned Hot Coffee directly to 1L Mineral Water, increasing water capacity to 95 units.', status: 'success' }
          ]
        }
      }
    ],
    agentLogs: [
      { id: 'oly-l1', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '06:30:01', message: 'Initializing analysis for Beijing Olympic Forest Park Smart Cabinet. Activating Weather & Event Trigger Skill...', type: 'info', sceneIndex: 0 },
      { id: 'oly-l2', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '06:30:03', message: 'Assigning research tasks. Scanning calendar for park events and real-time weather forecasts.', type: 'info', sceneIndex: 0 },
      
      { id: 'oly-l3', agentName: 'Sales Analyst Agent', agentRole: 'Data Analyst', avatar: '📊', timestamp: '06:30:12', message: 'Scanning historical sales: Checked 12,000 park vending machines. Sales are 4.2x higher on sunny weekends compared to weekdays.', type: 'info', sceneIndex: 1 },
      { id: 'oly-l4', agentName: 'Sales Analyst Agent', agentRole: 'Data Analyst', avatar: '📊', timestamp: '06:30:15', message: 'Category alert: Large-volume mineral water and sports drinks make up 72% of weekend sales volume.', type: 'success', sceneIndex: 1 },
      
      { id: 'oly-l5', agentName: 'Trend Scout Agent', agentRole: 'Trend Scout', avatar: '🔍', timestamp: '06:30:22', message: 'Fetching weather forecast: Sunny weekend, 28°C high. UV index: High. Wind speed: Low.', type: 'success', sceneIndex: 2 },
      { id: 'oly-l6', agentName: 'Trend Scout Agent', agentRole: 'Trend Scout', avatar: '🔍', timestamp: '06:30:25', message: 'Event database query: "10K Olympic Park Fun Run" scheduled for Sunday morning. Estimated 3,000 participants.', type: 'success', sceneIndex: 2 },
      
      { id: 'oly-l7', agentName: 'CRM Agent', agentRole: 'Customer Relations', avatar: '💬', timestamp: '06:30:32', message: 'Processing runner feedback: Requesting larger bottle sizes (1L+) and sports caps for easier drinking during running.', type: 'info', sceneIndex: 3 },
      { id: 'oly-l8', agentName: 'Inventory Agent', agentRole: 'Logistics', avatar: '📦', timestamp: '06:30:35', message: 'Inventory scan: 1L Mineral Water down to 8 bottles. Isotonic Sports Drink down to 10 bottles. Cabinet will stock out by 9 AM Saturday.', type: 'warning', sceneIndex: 3 },
      { id: 'oly-l9', agentName: 'Inventory Agent', agentRole: 'Logistics', avatar: '📦', timestamp: '06:30:38', message: 'Dead stock alert: Canned Hot Coffee has 15 units in stock. Zero sales in the last 14 days.', type: 'warning', sceneIndex: 3 },
      
      { id: 'oly-l10', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '06:30:42', message: 'Compiling AI Decision Matrix. Weight allocations: Sales (30%), Demand (20%), Margin (20%), Skill (15%), Risk (10%), Trend (5%).', type: 'info', sceneIndex: 4 },
      { id: 'oly-l11', agentName: 'CEO Agent', agentRole: 'Director', avatar: '🤖', timestamp: '06:30:45', message: 'Matrix compiled: 1L Mineral Water (92) and Isotonic Drink (94) mapped to INCREASE. Hot Coffee (26) mapped to REDUCE. Fruit Sorbet (85) mapped to TEST.', type: 'success', sceneIndex: 4 }
    ]
  }
];

// 因子权重（双语）
export const FACTOR_WEIGHTS_ZH: FactorWeight[] = [
  { name: '销售表现', key: 'salesPerformance', weight: 30, color: '#3b82f6', description: '历史流速与 SKU 周转率' },
  { name: '顾客需求', key: 'customerDemand', weight: 20, color: '#10b981', description: '直接反馈、请求与品类满意度' },
  { name: '利润空间', key: 'profitMargin', weight: 20, color: '#8b5cf6', description: '单件净利贡献' },
  { name: '场景匹配', key: 'scenarioMatch', weight: 15, color: '#f59e0b', description: '与地域客群画像的契合度' },
  { name: '库存风险', key: 'inventoryRisk', weight: 10, color: '#ef4444', description: '保质期缓冲与缺货/融化隐患' },
  { name: '市场趋势', key: 'marketTrend', weight: 5, color: '#06b6d4', description: '区域社媒搜索热度与宏观信号' }
];

/** 按当前语言返回场景数据 */
export function getScenarios(lang: Lang): Scenario[] {
  return lang === 'zh' ? SCENARIOS_ZH : SCENARIOS_EN;
}

/** 按当前语言返回因子权重 */
export function getFactorWeights(lang: Lang): FactorWeight[] {
  return lang === 'zh' ? FACTOR_WEIGHTS_ZH : FACTOR_WEIGHTS_EN;
}
