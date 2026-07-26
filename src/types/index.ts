export interface Scenario {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  loadedSkill: string;
  skillIcon: string;
  avatar: string;
  description: string;
  metrics: {
    dailySales: string;
    activeUsers: string;
    stockLevel: string;
    efficiency: string;
  };
  analyzePoints: string[];
  products: Product[];
  agentLogs: AgentLog[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  icon: string;
  currentStock: number;
  capacity: number;
  price: number;
  cost: number;
  // Scores out of 100
  scores: {
    salesPerformance: number; // 30%
    customerDemand: number;   // 20%
    profitMargin: number;     // 20%
    scenarioMatch: number;    // 15%
    inventoryRisk: number;    // 10% (100 means very safe / low risk)
    marketTrend: number;      // 5%
  };
  weightedScore: number;
  initialAction: 'Increase' | 'Maintain' | 'Reduce' | 'Test';
  finalAction: 'Increase' | 'Maintain' | 'Reduce' | 'Test';
  recommendationDetails: string;
  replenishQty?: number;
  promotionDetails?: string;
  whyDecided: {
    title: string;
    description: string;
    sources: {
      agent: string;
      role: string;
      finding: string;
      status: 'success' | 'warning' | 'info';
    }[];
  };
}

export interface AgentLog {
  id: string;
  agentName: string;
  agentRole: string;
  avatar: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  sceneIndex: number;
}

export interface FactorWeight {
  name: string;
  key: keyof Product['scores'];
  weight: number;
  color: string;
  description: string;
}
