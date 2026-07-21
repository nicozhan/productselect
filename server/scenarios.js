// server/scenarios.js
// 预设无人零售场景：评委/用户点开即体验，无需自己准备数据。
// 每个场景自带样例销售 CSV 与环境输入，结构与应用表单输入一致。

export const scenarios = [
  {
    id: 'office',
    name: '国贸写字楼大堂柜',
    icon: '🏢',
    tagline: 'CBD 上班族的早八续命站',
    deviceId: 'VM-CMD-001',
    location: '北京国贸三期写字楼大堂',
    city: '北京',
    weather: { temp: 28, rain: 0, humidity: 45 },
    event: '无',
    holiday: false,
    demographics: { genderRatio: '女性 58%', ageRange: '25-40 岁' },
    inventoryNotes: '三明治/酸奶当日库存有限，临期需优先清。',
    salesData: `商品,昨日销量,周销量,单价,单位利润,库存,保质期天数
美式咖啡,62,430,12,5.5,30,2
拿铁,48,330,15,6,25,2
农夫山泉,40,280,2,0.5,180,365
三明治,35,240,14,6,20,1
酸奶,28,190,8,3,40,14
红牛,22,150,6,2,60,365
东方树叶,18,120,5,1.5,50,365
魔爪,15,98,7,2.5,45,365`
  },
  {
    id: 'campus',
    name: '浙江大学紫金港校区',
    icon: '🎓',
    tagline: '求是园里的深夜补给站',
    deviceId: 'VM-EDU-007',
    location: '浙江大学紫金港校区宿舍区及周边',
    city: '杭州',
    weather: { temp: 26, rain: 0, humidity: 60 },
    event: '无',
    holiday: false,
    demographics: { genderRatio: '男女各半', ageRange: '18-24 岁' },
    inventoryNotes: '期末/假期客流波动大，泡面与零食周转快，注意临期清货。',
    salesData: `商品,昨日销量,周销量,单价,单位利润,库存,保质期天数
可乐,55,388,3,0.6,120,180
薯片,48,330,6,2,80,120
泡面,52,360,5,1.5,90,180
矿泉水,44,300,2,0.5,200,365
火腿肠,30,210,4,1.2,70,90
巧克力,26,180,8,3,50,300
功能饮料,24,165,6,2,60,365
酸奶,20,140,8,3,40,14`
  },
  {
    id: 'gym',
    name: '深圳BYD工厂',
    icon: '🏭',
    tagline: '码农练后补给站',
    deviceId: 'VM-GYM-012',
    location: '深圳BYD工厂',
    city: '深圳',
    weather: { temp: 29, rain: 0, humidity: 65 },
    event: '无',
    holiday: false,
    demographics: { genderRatio: '男性 70%', ageRange: '22-40 岁' },
    inventoryNotes: '产线轮班节奏固定，午后与夜班能量补给需求集中，饮用水与功能饮料周转快。',
    salesData: `商品,昨日销量,周销量,单价,单位利润,库存,保质期天数
矿泉水,70,490,2,0.5,250,365
功能饮料,46,320,6,2,80,365
蛋白棒,38,260,12,5,45,180
运动饮料,40,280,8,3,70,365
黑咖啡,34,230,6,2,40,120
香蕉,30,210,3,1,25,3
电解质水,28,190,10,4,55,365
巧克力,24,160,8,3,50,300
能量胶,20,140,15,6,30,365
鸡胸肉,18,120,13,4,20,7`
  },
  {
    id: 'metro',
    name: '奥林匹克公园(鸟巢站)',
    icon: '🚇',
    tagline: '观赛游园的 30 秒补给',
    deviceId: 'VM-MET-021',
    location: '北京奥林匹克公园地铁站（8/15 号线，鸟巢与水立方之间）',
    city: '北京',
    weather: { temp: 25, rain: 5, humidity: 55 },
    event: '无',
    holiday: false,
    demographics: { genderRatio: '游客与通勤混合', ageRange: '全年龄段' },
    inventoryNotes: '旅游旺季矿泉水与冷饮需求高，雨季备好湿巾。',
    salesData: `商品,昨日销量,周销量,单价,单位利润,库存,保质期天数
矿泉水,70,490,2,0.5,250,365
咖啡,45,310,12,5,40,2
面包,38,260,6,2.5,35,2
牛奶,30,200,5,1.5,50,7
果汁,26,180,8,3,45,21
口香糖,24,160,4,2,90,540
湿巾,20,140,3,1.5,80,365
雨伞,5,35,15,5,15,365`
  },
  {
    id: 'sanlitun',
    name: '三里屯 SO·HO 酒吧街柜',
    icon: '🌃',
    tagline: '夜经济里的微醺补给',
    deviceId: 'VM-SLT-033',
    location: '三里屯 SO·HO 露天广场',
    city: '北京',
    weather: { temp: 32, rain: 0, humidity: 40 },
    event: '周末酒吧聚会高峰',
    holiday: false,
    demographics: { genderRatio: '女性 67%', ageRange: '20-35 岁' },
    inventoryNotes: '无糖/低卡品类动销快，注意及时补。',
    salesData: `商品,昨日销量,周销量,单价,单位利润,库存,保质期天数
苏打水,58,400,6,2.5,90,365
无糖饮料,52,360,7,3,80,365
蛋白棒,30,210,12,5,40,180
可乐,44,300,3,0.6,100,180
啤酒,48,330,9,3,60,180
薯片,40,280,6,2,70,120
矿泉水,50,340,2,0.5,200,365
气泡水,36,250,8,3,55,365`
  }
];

export function getScenario(id) {
  return scenarios.find(s => s.id === id) || null;
}
