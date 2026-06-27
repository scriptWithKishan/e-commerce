"use client";

import React, { useState, useRef } from "react";
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  Star, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Plus
} from "lucide-react";

// ==========================================
// TYPES & MOCK DATA
// ==========================================

interface RevenuePoint {
  label: string;
  value: number;
  date: string;
}

// TODO: Replace with database fetch using Prisma
const weeklyRevenueData: RevenuePoint[] = [
  { label: "Mon", value: 15200, date: "June 08, 2026" },
  { label: "Tue", value: 18400, date: "June 09, 2026" },
  { label: "Wed", value: 14100, date: "June 10, 2026" },
  { label: "Thu", value: 22800, date: "June 11, 2026" },
  { label: "Fri", value: 19500, date: "June 12, 2026" },
  { label: "Sat", value: 25600, date: "June 13, 2026" },
  { label: "Sun", value: 21200, date: "June 14, 2026" },
];

// TODO: Replace with database fetch using Prisma
const monthlyRevenueData: RevenuePoint[] = [
  { label: "Week 1", value: 28500, date: "June Week 1" },
  { label: "Week 2", value: 34200, date: "June Week 2" },
  { label: "Week 3", value: 41800, date: "June Week 3" },
  { label: "Week 4", value: 38200, date: "June Week 4" },
];

// TODO: Replace with database fetch using Prisma
const ordersPerDayData = [
  { label: "Mon", value: 45, date: "June 08" },
  { label: "Tue", value: 58, date: "June 09" },
  { label: "Wed", value: 39, date: "June 10" },
  { label: "Thu", value: 65, date: "June 11" },
  { label: "Fri", value: 72, date: "June 12" },
  { label: "Sat", value: 94, date: "June 13" },
  { label: "Sun", value: 61, date: "June 14" },
];

// TODO: Replace with database fetch using Prisma
const salesByCategoryData = [
  { name: "Electronics", value: 48500, percentage: 39, color: "bg-indigo-600", stroke: "#4f46e5" },
  { name: "Fashion", value: 32300, percentage: 26, color: "bg-blue-500", stroke: "#3b82f6" },
  { name: "Home & Living", value: 24900, percentage: 20, color: "bg-emerald-500", stroke: "#10b981" },
  { name: "Beauty & Personal Care", value: 18800, percentage: 15, color: "bg-amber-500", stroke: "#f59e0b" },
];

// TODO: Replace with database fetch using Prisma
const monthlyGrowthData = [
  { month: "Jan", revenue: 85000, rate: 4.8 },
  { month: "Feb", revenue: 92000, rate: 8.2 },
  { month: "Mar", revenue: 104000, rate: 13.0 },
  { month: "Apr", revenue: 110000, rate: 5.7 },
  { month: "May", revenue: 118000, rate: 7.2 },
  { month: "Jun", revenue: 124500, rate: 5.5 },
];

// TODO: Replace with database query or dynamic trigger
interface AttentionItem {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  desc: string;
  actionLabel: string;
}

const initialAttentionItems: AttentionItem[] = [
  {
    id: "attn-1",
    type: "critical",
    title: "3 Orders Pending Shipment",
    desc: "Shipment SLA deadline is in 4 hours. Ship now to avoid penalties.",
    actionLabel: "Fulfill Orders",
  },
  {
    id: "attn-2",
    type: "warning",
    title: "2 Products Out of Stock",
    desc: "'Minimalist Leather Wallet' and 'Bamboo Toothbrush' hit 0 inventory.",
    actionLabel: "Restock Now",
  },
  {
    id: "attn-3",
    type: "info",
    title: "12 Products Pending Approval",
    desc: "Verification team is reviewing your latest additions.",
    actionLabel: "View Details",
  },
  {
    id: "attn-4",
    type: "info",
    title: "Average Rating Adjusted",
    desc: "Customer review rating shifted to 4.8. 2 new feedback details available.",
    actionLabel: "Read Reviews",
  },
];

// TODO: Replace with user database settings/checklists
interface NextAction {
  id: string;
  text: string;
  impact: string;
  completed: boolean;
}

const initialNextActions: NextAction[] = [
  {
    id: "action-1",
    text: "Optimize SEO keywords for 'Handmade Ceramic Planter'",
    impact: "+15% views",
    completed: false,
  },
  {
    id: "action-2",
    text: "Respond to customer inquiry regarding bulk discount on order #2881",
    impact: "+₹4,500 potential sale",
    completed: false,
  },
  {
    id: "action-3",
    text: "Create a 10% coupon for repeat buyers to boost loyalty",
    impact: "+8% repeat customer rate",
    completed: false,
  },
  {
    id: "action-4",
    text: "Upload 2 missing high-res images for 'Bamboo Tumbler'",
    impact: "Speeds up admin approval",
    completed: false,
  },
];

export default function DashboardPage() {
  // States for interactive components
  const [revenuePeriod, setRevenuePeriod] = useState<"weekly" | "monthly">("weekly");
  const [hoveredRevenueIdx, setHoveredRevenueIdx] = useState<number | null>(null);
  const [hoveredRevenueCoords, setHoveredRevenueCoords] = useState<{ x: number; y: number } | null>(null);
  
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);
  const [hoveredBarCoords, setHoveredBarCoords] = useState<{ x: number; y: number } | null>(null);

  const [hoveredCategoryIdx, setHoveredCategoryIdx] = useState<number | null>(null);
  
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>(initialAttentionItems);
  const [nextActions, setNextActions] = useState<NextAction[]>(initialNextActions);

  const revenueSvgRef = useRef<SVGSVGElement | null>(null);
  const barSvgRef = useRef<SVGSVGElement | null>(null);

  // Toggle Action items
  const toggleAction = (id: string) => {
    setNextActions(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  // Dismiss Attention item
  const dismissAttention = (id: string) => {
    setAttentionItems(prev => prev.filter(item => item.id !== id));
  };

  // Helper formatting function
  const formatRupees = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // ==========================================
  // CHART COMPUTATIONS (SVG PATHS & COORDS)
  // ==========================================
  
  // 1. Line Chart Calculations (Revenue Trend)
  const currentRevenueData = revenuePeriod === "weekly" ? weeklyRevenueData : monthlyRevenueData;
  const revenueValues = currentRevenueData.map(d => d.value);
  const maxRevenue = Math.max(...revenueValues, 40000) * 1.15; // padding top
  const minRevenue = Math.min(...revenueValues, 0) * 0.85;

  const svgWidth = 550;
  const svgHeight = 220;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const revenuePoints = currentRevenueData.map((d, i) => {
    const x = paddingLeft + (i / (currentRevenueData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - minRevenue) / (maxRevenue - minRevenue)) * chartHeight;
    return { x, y, label: d.label, value: d.value, date: d.date };
  });

  // SVG path generation
  let linePath = "";
  let areaPath = "";
  if (revenuePoints.length > 0) {
    // Generate linear/crisp path
    linePath = `M ${revenuePoints[0].x} ${revenuePoints[0].y} ` + 
      revenuePoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");

    areaPath = `${linePath} L ${revenuePoints[revenuePoints.length - 1].x} ${paddingTop + chartHeight} L ${revenuePoints[0].x} ${paddingTop + chartHeight} Z`;
  }

  // Handle revenue chart mouse interactions
  const handleRevenueMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!revenueSvgRef.current) return;
    const rect = revenueSvgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Scale factor to map clientX coordinates back to SVG viewBox coordinates
    const scaleX = svgWidth / rect.width;
    const svgMouseX = mouseX * scaleX;

    // Find closest index
    let closestIdx = 0;
    let minDiff = Infinity;
    revenuePoints.forEach((p, idx) => {
      const diff = Math.abs(p.x - svgMouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoveredRevenueIdx(closestIdx);
    
    // Position HTML tooltip relative to container (percentages or absolute client coordinates)
    const activePoint = revenuePoints[closestIdx];
    const tooltipX = (activePoint.x / svgWidth) * 100;
    const tooltipY = (activePoint.y / svgHeight) * 100;
    setHoveredRevenueCoords({ x: tooltipX, y: tooltipY });
  };

  // 2. Bar Chart Calculations (Orders Trend)
  const barValues = ordersPerDayData.map(d => d.value);
  const maxBarVal = Math.max(...barValues, 10) * 1.15;
  
  const barSvgWidth = 550;
  const barSvgHeight = 220;
  const barPaddingLeft = 45;
  const barPaddingRight = 15;
  const barPaddingTop = 25;
  const barPaddingBottom = 35;

  const barChartWidth = barSvgWidth - barPaddingLeft - barPaddingRight;
  const barChartHeight = barSvgHeight - barPaddingTop - barPaddingBottom;
  
  const totalBars = ordersPerDayData.length;
  const barSpacing = 16;
  const individualBarWidth = (barChartWidth - (barSpacing * (totalBars - 1))) / totalBars;

  const barPoints = ordersPerDayData.map((d, i) => {
    const x = barPaddingLeft + i * (individualBarWidth + barSpacing);
    const height = (d.value / maxBarVal) * barChartHeight;
    const y = barPaddingTop + barChartHeight - height;
    return { x, y, width: individualBarWidth, height, label: d.label, value: d.value, date: d.date };
  });

  const handleBarMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>, idx: number) => {
    setHoveredBarIdx(idx);
    const point = barPoints[idx];
    const tooltipX = ((point.x + point.width / 2) / barSvgWidth) * 100;
    const tooltipY = (point.y / barSvgHeight) * 100;
    setHoveredBarCoords({ x: tooltipX, y: tooltipY });
  };

  // 3. Donut Chart Calculations (Category-wise Sales)
  let accumulatedPercent = 0;
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~314.16

  const donutSegments = salesByCategoryData.map((cat, idx) => {
    const strokeDasharray = `${(cat.percentage * circumference) / 100} ${circumference}`;
    const strokeDashoffset = `${((100 - accumulatedPercent) * circumference) / 100}`;
    accumulatedPercent += cat.percentage;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // 4. Monthly Growth Chart Coordinates (Growth Trend Area Chart)
  const growthRates = monthlyGrowthData.map(d => d.rate);
  const maxGrowth = Math.max(...growthRates, 15);
  const minGrowth = Math.min(...growthRates, 0);

  const growthPoints = monthlyGrowthData.map((d, i) => {
    const x = 50 + (i / (monthlyGrowthData.length - 1)) * 450;
    const y = 25 + 130 - ((d.rate - minGrowth) / (maxGrowth - minGrowth)) * 130;
    return { x, y, month: d.month, rate: d.rate, revenue: d.revenue };
  });

  let growthLinePath = "";
  let growthAreaPath = "";
  if (growthPoints.length > 0) {
    growthLinePath = `M ${growthPoints[0].x} ${growthPoints[0].y} ` + 
      growthPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
    growthAreaPath = `${growthLinePath} L ${growthPoints[growthPoints.length - 1].x} 155 L ${growthPoints[0].x} 155 Z`;
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-50/50 pb-16">
      {/* Container wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ==========================================
            HEADER & STORE BANNER
            ========================================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, Kishan! 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Heres a breakdown of your business for <span className="font-semibold text-slate-700">June 12, 2026</span>.
            </p>
          </div>
          <div className="flex items-center gap-x-3 self-start md:self-center">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Store Status</span>
              <span className="text-sm font-bold text-slate-800">Approved & Active</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
            <button className="bg-black hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95 cursor-pointer border-none">
              <Plus size={14} /> Add Product
            </button>
          </div>
        </div>

        {/* ==========================================
            TOP OF FOLD: SUMMARY CARDS (₹1,24,500 ASCII Grid)
            ========================================== */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>Key Metrics Summary</span>
            <span className="h-px bg-slate-200 flex-1"></span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {/* CARD 1: Revenue (Top Fold 1) */}
            <div className="bg-white hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-white border border-slate-100 hover:border-indigo-100 hover:shadow-md rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Revenue</span>
                <div className="p-2 bg-indigo-55 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-slate-900 leading-none">₹1,24,500</h3>
                <div className="flex items-center gap-1 mt-2 text-emerald-600">
                  <ArrowUpRight size={14} />
                  <span className="text-xs font-bold">+12.4%</span>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">vs last month</span>
                </div>
              </div>
            </div>

            {/* CARD 2: Orders (Top Fold 2) */}
            <div className="bg-white hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-white border border-slate-100 hover:border-blue-100 hover:shadow-md rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Orders</span>
                <div className="p-2 bg-blue-55 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <ShoppingBag size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-slate-900 leading-none">432</h3>
                <div className="flex items-center gap-1 mt-2 text-emerald-600">
                  <ArrowUpRight size={14} />
                  <span className="text-xs font-bold">+8.2%</span>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">vs last week</span>
                </div>
              </div>
            </div>

            {/* CARD 3: Products (Top Fold 3) */}
            <div className="bg-white hover:bg-gradient-to-br hover:from-emerald-50/50 hover:to-white border border-slate-100 hover:border-emerald-100 hover:shadow-md rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Products</span>
                <div className="p-2 bg-emerald-55 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Package size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-slate-900 leading-none">67</h3>
                <div className="flex items-center gap-1 mt-2 text-slate-500">
                  <span className="text-xs font-bold">+3</span>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">added this week</span>
                </div>
              </div>
            </div>

            {/* CARD 4: Pending Products (Top Fold 4) */}
            <div className="bg-white hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-white border border-slate-100 hover:border-amber-100 hover:shadow-md rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pending</span>
                <div className="p-2 bg-amber-55 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                  <Clock size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-slate-900 leading-none">12</h3>
                <div className="flex items-center gap-1 mt-2 text-amber-600 font-semibold">
                  <AlertTriangle size={12} className="inline mr-1" />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Needs Review</span>
                </div>
              </div>
            </div>

            {/* CARD 5: Average Rating */}
            <div className="bg-white hover:bg-gradient-to-br hover:from-rose-50/50 hover:to-white border border-slate-100 hover:border-rose-100 hover:shadow-md rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Avg Rating</span>
                <div className="p-2 bg-rose-55 text-rose-500 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                  <Star size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-slate-900 leading-none">4.8 <span className="text-xs font-normal text-slate-400">/ 5.0</span></h3>
                <div className="flex items-center gap-0.5 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < 4 ? "#f59e0b" : "none"} stroke={i < 4 ? "#f59e0b" : "#cbd5e1"} className="inline" />
                  ))}
                  <span className="text-[10px] text-slate-400 font-semibold ml-1">98 reviews</span>
                </div>
              </div>
            </div>

            {/* CARD 6: Total Customers */}
            <div className="bg-white hover:bg-gradient-to-br hover:from-teal-50/50 hover:to-white border border-slate-100 hover:border-teal-100 hover:shadow-md rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500" />
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Customers</span>
                <div className="p-2 bg-teal-55 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                  <Users size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-slate-900 leading-none">1,245</h3>
                <div className="flex items-center gap-1 mt-2 text-emerald-600">
                  <ArrowUpRight size={14} />
                  <span className="text-xs font-bold">+15.6%</span>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">MoM growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            MAIN SECTIONS (2-COLUMN GRID)
            ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2/3 COLUMN: PERFORMANCE TRENDS & CHARTS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SECTION HEADER */}
            <div className="flex justify-between items-end border-b border-slate-200/60 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">How my business is performing</h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time performance analytics of store sales and order flow.</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                <TrendingUp size={12} /> Live Sync
              </span>
            </div>

            {/* CHART 1: REVENUE TREND (LINE CHART) */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow duration-300 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Daily Revenue</h3>
                  <p className="text-xs text-slate-400">Trend of gross transactional value over time.</p>
                </div>
                
                {/* Weekly/Monthly Toggle Pill */}
                <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center border border-slate-200/50">
                  <button 
                    onClick={() => { setRevenuePeriod("weekly"); setHoveredRevenueIdx(null); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                      revenuePeriod === "weekly" 
                        ? "bg-white text-indigo-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => { setRevenuePeriod("monthly"); setHoveredRevenueIdx(null); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                      revenuePeriod === "monthly" 
                        ? "bg-white text-indigo-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Chart SVG wrapper */}
              <div className="relative h-60 w-full" onMouseLeave={() => { setHoveredRevenueIdx(null); setHoveredRevenueCoords(null); }}>
                <svg
                  ref={revenueSvgRef}
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full select-none"
                  onMouseMove={handleRevenueMouseMove}
                >
                  <defs>
                    {/* Linear Gradient for Line Fill */}
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                    </linearGradient>
                    
                    {/* Path stroke glow filter */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4f46e5" floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = paddingTop + ratio * chartHeight;
                    const val = maxRevenue - ratio * (maxRevenue - minRevenue);
                    return (
                      <g key={i} className="opacity-45">
                        <line 
                          x1={paddingLeft} 
                          y1={y} 
                          x2={svgWidth - paddingRight} 
                          y2={y} 
                          stroke="#cbd5e1" 
                          strokeWidth="1" 
                          strokeDasharray="4,4"
                        />
                        <text 
                          x={paddingLeft - 8} 
                          y={y + 4} 
                          textAnchor="end" 
                          fill="#64748b" 
                          className="text-[9px] font-bold font-sans"
                        >
                          {val >= 1000 ? `₹${(val / 1000).toFixed(1)}k` : `₹${val.toFixed(0)}`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fill path */}
                  {areaPath && (
                    <path 
                      d={areaPath} 
                      fill="url(#revenueGradient)" 
                      className="transition-all duration-500 ease-in-out"
                    />
                  )}

                  {/* SVG line path */}
                  {linePath && (
                    <path 
                      d={linePath} 
                      fill="none" 
                      stroke="#4f46e5" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                      className="transition-all duration-500 ease-in-out"
                    />
                  )}

                  {/* X Axis Labels */}
                  {revenuePoints.map((p, i) => (
                    <g key={i}>
                      <text
                        x={p.x}
                        y={svgHeight - 12}
                        textAnchor="middle"
                        fill="#64748b"
                        className="text-[10px] font-bold"
                      >
                        {p.label}
                      </text>
                      {/* Vertical ticks */}
                      <line 
                        x1={p.x} 
                        y1={paddingTop + chartHeight} 
                        x2={p.x} 
                        y2={paddingTop + chartHeight + 4} 
                        stroke="#cbd5e1" 
                        strokeWidth="1" 
                      />
                    </g>
                  ))}

                  {/* Hover interactive markers */}
                  {hoveredRevenueIdx !== null && revenuePoints[hoveredRevenueIdx] && (
                    <g>
                      {/* Vertical line indicator */}
                      <line
                        x1={revenuePoints[hoveredRevenueIdx].x}
                        y1={paddingTop}
                        x2={revenuePoints[hoveredRevenueIdx].x}
                        y2={paddingTop + chartHeight}
                        stroke="#818cf8"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                      />
                      {/* Outer pulsing ring */}
                      <circle
                        cx={revenuePoints[hoveredRevenueIdx].x}
                        cy={revenuePoints[hoveredRevenueIdx].y}
                        r="8"
                        fill="#818cf8"
                        className="opacity-25"
                      />
                      {/* Inner dot */}
                      <circle
                        cx={revenuePoints[hoveredRevenueIdx].x}
                        cy={revenuePoints[hoveredRevenueIdx].y}
                        r="4"
                        fill="#4f46e5"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}
                </svg>

                {/* Interactive HTML Tooltip (glowing and positioned absolutely over container) */}
                {hoveredRevenueIdx !== null && hoveredRevenueCoords && revenuePoints[hoveredRevenueIdx] && (
                  <div
                    style={{
                      left: `${hoveredRevenueCoords.x}%`,
                      top: `${hoveredRevenueCoords.y - 12}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-[11px] rounded-xl px-3.5 py-2 shadow-xl border border-slate-800 z-10 pointer-events-none transition-all duration-150 flex flex-col gap-0.5 whitespace-nowrap min-w-[110px]"
                  >
                    <span className="text-[9px] text-slate-400 font-semibold">{revenuePoints[hoveredRevenueIdx].date}</span>
                    <span className="font-extrabold text-sm">{formatRupees(revenuePoints[hoveredRevenueIdx].value)}</span>
                  </div>
                )}
              </div>

              {/* Data loading note for database integration */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <AlertCircle size={10} />
                  <span>Showing simulated transactions.</span>
                </span>
                <span className="font-semibold text-slate-500 italic">
                  {/* // TODO: Fetch daily transaction rows using Prisma */}
                </span>
              </div>
            </div>

            {/* CHART 2 & 3: GRID OF TWO CHARTS (ORDERS TREND & MONTHLY GROWTH) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CHART 2: ORDERS TREND (BAR CHART) */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow duration-300 relative">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Orders Trend</h3>
                  <p className="text-[11px] text-slate-400">Volume of daily placed customer orders.</p>
                </div>

                <div className="relative h-48 w-full" onMouseLeave={() => { setHoveredBarIdx(null); setHoveredBarCoords(null); }}>
                  <svg
                    ref={barSvgRef}
                    viewBox={`0 0 ${barSvgWidth} ${barSvgHeight}`}
                    className="w-full h-full select-none"
                  >
                    {/* Horizontal Grid lines */}
                    {[0, 0.33, 0.66, 1].map((ratio, i) => {
                      const y = barPaddingTop + ratio * barChartHeight;
                      const val = maxBarVal - ratio * maxBarVal;
                      return (
                        <g key={i} className="opacity-45">
                          <line 
                            x1={barPaddingLeft} 
                            y1={y} 
                            x2={barSvgWidth - barPaddingRight} 
                            y2={y} 
                            stroke="#cbd5e1" 
                            strokeWidth="1" 
                            strokeDasharray="4,4"
                          />
                          <text 
                            x={barPaddingLeft - 8} 
                            y={y + 4} 
                            textAnchor="end" 
                            fill="#64748b" 
                            className="text-[9px] font-bold"
                          >
                            {val.toFixed(0)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars */}
                    {barPoints.map((p, idx) => (
                      <g key={idx}>
                        {/* Interactive invisible full-height rect for easier hover detection */}
                        <rect
                          x={p.x - barSpacing/2}
                          y={barPaddingTop}
                          width={p.width + barSpacing}
                          height={barChartHeight}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseMove={(e) => handleBarMouseMove(e, idx)}
                        />
                        {/* Rounded visual bar */}
                        <rect
                          x={p.x}
                          y={p.y}
                          width={p.width}
                          height={p.height}
                          rx="4"
                          fill={hoveredBarIdx === idx ? "#2563eb" : "#3b82f6"}
                          className="transition-all duration-200 fill-blue-500 hover:fill-blue-600"
                        />
                      </g>
                    ))}

                    {/* X Axis Labels */}
                    {barPoints.map((p, i) => (
                      <text
                        key={i}
                        x={p.x + p.width / 2}
                        y={barSvgHeight - 12}
                        textAnchor="middle"
                        fill="#64748b"
                        className="text-[10px] font-bold"
                      >
                        {p.label}
                      </text>
                    ))}
                  </svg>

                  {/* Bar Chart Tooltip */}
                  {hoveredBarIdx !== null && hoveredBarCoords && barPoints[hoveredBarIdx] && (
                    <div
                      style={{
                        left: `${hoveredBarCoords.x}%`,
                        top: `${hoveredBarCoords.y - 12}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-[10px] rounded-xl px-2.5 py-1.5 shadow-xl border border-slate-800 z-10 pointer-events-none whitespace-nowrap"
                    >
                      <span className="font-extrabold">{barPoints[hoveredBarIdx].value} orders</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[9px] text-slate-400 italic">
                  <span>{/* // TODO: Count rows by Order.createdAt */}</span>
                </div>
              </div>

              {/* CHART 3: MONTHLY GROWTH CHART */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow duration-300 relative">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Monthly Growth</h3>
                  <p className="text-[11px] text-slate-400">MoM revenue growth rate percentage.</p>
                </div>

                <div className="relative h-48 w-full">
                  <svg
                    viewBox="0 0 550 220"
                    className="w-full h-full select-none"
                  >
                    <defs>
                      <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.33, 0.66, 1].map((ratio, i) => {
                      const y = 25 + ratio * 130;
                      const val = maxGrowth - ratio * (maxGrowth - minGrowth);
                      return (
                        <g key={i} className="opacity-45">
                          <line x1="50" y1={y} x2="520" y2={y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,4" />
                          <text x="42" y={y + 4} textAnchor="end" fill="#64748b" className="text-[9px] font-bold">
                            {val.toFixed(1)}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Area path */}
                    {growthAreaPath && (
                      <path d={growthAreaPath} fill="url(#growthGradient)" />
                    )}

                    {/* Line path */}
                    {growthLinePath && (
                      <path d={growthLinePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                    )}

                    {/* Dots & Labels */}
                    {growthPoints.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="3" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                        <text
                          x={p.x}
                          y={p.y - 8}
                          textAnchor="middle"
                          fill="#0f766e"
                          className="text-[9px] font-extrabold"
                        >
                          {p.rate}%
                        </text>
                        <text
                          x={p.x}
                          y="172"
                          textAnchor="middle"
                          fill="#64748b"
                          className="text-[10px] font-bold"
                        >
                          {p.month}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[9px] text-slate-400 italic">
                  <span>
                    {/* // TODO: Calculate monthly sum percent delta */}
                    </span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT 1/3 COLUMN: ATTENTION, ACTIONS, & CATEGORY SPLIT */}
          <div className="space-y-8">
            
            {/* ==========================================
                DONUT CHART: CATEGORY WISE SALES
                ========================================== */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow duration-300 relative">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-800">Category-wise Sales</h3>
                <p className="text-xs text-slate-400">Total gross share split by item class.</p>
              </div>

              {/* Donut graphic */}
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center my-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                    {donutSegments.map((segment, idx) => (
                      <circle
                        key={idx}
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={segment.stroke}
                        strokeWidth={strokeWidth}
                        strokeDasharray={segment.strokeDasharray}
                        strokeDashoffset={segment.strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-300 cursor-pointer hover:stroke-[16px]"
                        onMouseEnter={() => setHoveredCategoryIdx(idx)}
                        onMouseLeave={() => setHoveredCategoryIdx(null)}
                      />
                    ))}
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    {hoveredCategoryIdx !== null ? (
                      <>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {salesByCategoryData[hoveredCategoryIdx].name.split(" ")[0]}
                        </span>
                        <span className="text-sm font-extrabold text-slate-800 leading-none mt-0.5">
                          {salesByCategoryData[hoveredCategoryIdx].percentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Sales</span>
                        <span className="text-sm font-extrabold text-slate-800 leading-none mt-0.5">₹1.24L</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Legends */}
                <div className="flex-1 space-y-2.5 self-center w-full">
                  {salesByCategoryData.map((cat, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-1 rounded-lg transition-colors duration-150 ${
                        hoveredCategoryIdx === idx ? "bg-slate-50" : ""
                      }`}
                      onMouseEnter={() => setHoveredCategoryIdx(idx)}
                      onMouseLeave={() => setHoveredCategoryIdx(null)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`}></span>
                        <span className="text-xs text-slate-600 font-semibold truncate max-w-[110px]">{cat.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 ml-2">{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[9px] text-slate-400 italic">
                <span>{/* // TODO: Map Category schema relations to Product entries */}</span>
              </div>
            </div>

            {/* ==========================================
                WHAT NEEDS ATTENTION TODAY
                ========================================== */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow duration-300">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-800">What needs attention today</h3>
                <p className="text-xs text-slate-400">Critical tasks and warnings requiring immediate focus.</p>
              </div>

              <div className="space-y-3.5">
                {attentionItems.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={24} />
                    <p className="text-xs font-bold text-slate-600">All caught up!</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Nothing needs critical attention.</p>
                  </div>
                ) : (
                  attentionItems.map((item) => (
                    <div 
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-3 relative ${
                        item.type === "critical"
                          ? "bg-rose-50/50 border-rose-100 hover:border-rose-200"
                          : item.type === "warning"
                          ? "bg-amber-50/40 border-amber-100 hover:border-amber-200"
                          : "bg-slate-50/70 border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          item.type === "critical"
                            ? "bg-rose-100 text-rose-700"
                            : item.type === "warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-200 text-slate-700"
                        }`}>
                          {item.type === "critical" ? (
                            <AlertCircle size={14} />
                          ) : (
                            <AlertTriangle size={14} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 leading-tight truncate">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons footer */}
                      <div className="flex items-center justify-between border-t border-slate-200/50 pt-2.5 mt-0.5">
                        <button className="text-[10px] font-bold text-slate-600 hover:text-slate-800 hover:underline cursor-pointer border-none bg-transparent">
                          {item.actionLabel}
                        </button>
                        <button 
                          onClick={() => dismissAttention(item.id)}
                          className="text-[9px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ==========================================
                WHAT ACTIONS SHOULD I TAKE NEXT
                ========================================== */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow duration-300">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-800">What actions should I take next</h3>
                <p className="text-xs text-slate-400">Actionable list to optimize sales and operations.</p>
              </div>

              <div className="space-y-3">
                {nextActions.map((action) => (
                  <div 
                    key={action.id}
                    className={`p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                      action.completed 
                        ? "bg-slate-50/50 border-slate-200/40 opacity-60" 
                        : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
                    }`}
                  >
                    {/* Custom Checkbox */}
                    <button 
                      onClick={() => toggleAction(action.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-all duration-150 ${
                        action.completed 
                          ? "bg-indigo-600 border-indigo-600 text-white" 
                          : "border-slate-300 hover:border-indigo-500 bg-white"
                      }`}
                    >
                      {action.completed && (
                        <svg className="w-2.5 h-2.5 stroke-[3] stroke-current" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-snug text-slate-800 ${
                        action.completed ? "line-through text-slate-400" : ""
                      }`}>
                        {action.text}
                      </p>
                      <span className="inline-block text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1">
                        Impact: {action.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}