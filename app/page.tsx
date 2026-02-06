'use client';
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line
} from 'recharts';

// --- TYPES & INTERFACES ---

interface HistoryPoint {
  day: number;
  equity: number;
  balance: number;
}

interface Trader {
  id: number;
  name: string;
  strategy: string;
  risk: 'High' | 'Medium' | 'Low';
  roi: number;
  drawdown: number;
  age: string;
  balance: number;
  profit: number;
  winRate: number;
  tags: string[];
  history: HistoryPoint[];
}

interface MonthlyData {
  month: string;
  val: number;
}

// --- MOCK DATA ---

const MOCK_TRADERS: Trader[] = [
  {
    id: 1,
    name: "Alpha Scalper Pro",
    strategy: "Scalping",
    risk: "High",
    roi: 45.2,
    drawdown: 12.4,
    age: "320 Hari",
    balance: 25400,
    profit: 11480,
    winRate: 68,
    tags: ["Agresif", "Short-term"],
    history: Array.from({ length: 30 }, (_, i) => ({ 
      day: i + 1, 
      equity: 10000 + (Math.random() * 5000) + (i * 200), 
      balance: 10000 + (i * 180) 
    }))
  },
  {
    id: 2,
    name: "Blue Chip Conservative",
    strategy: "Conservative",
    risk: "Low",
    roi: 8.5,
    drawdown: 3.2,
    age: "1.5 Tahun",
    balance: 150200,
    profit: 12770,
    winRate: 82,
    tags: ["Konservatif", "Long-term"],
    history: Array.from({ length: 30 }, (_, i) => ({ 
      day: i + 1, 
      equity: 140000 + (Math.random() * 1000) + (i * 100), 
      balance: 140000 + (i * 95) 
    }))
  },
  {
    id: 3,
    name: "Steady Flow Swing",
    strategy: "Moderate",
    risk: "Medium",
    roi: 15.1,
    drawdown: 7.5,
    age: "210 Hari",
    balance: 42000,
    profit: 6340,
    winRate: 55,
    tags: ["Swing", "Trend"],
    history: Array.from({ length: 30 }, (_, i) => ({ 
      day: i + 1, 
      equity: 35000 + (Math.random() * 2000) + (i * 150), 
      balance: 35000 + (i * 140) 
    }))
  },
];

const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Jan', val: 4.5 }, { month: 'Feb', val: -1.2 }, { month: 'Mar', val: 8.4 },
  { month: 'Apr', val: 3.1 }, { month: 'Mei', val: 2.2 }, { month: 'Jun', val: -0.5 },
  { month: 'Jul', val: 5.0 }, { month: 'Agu', val: 6.2 }, { month: 'Sep', val: -2.1 },
  { month: 'Okt', val: 4.8 }, { month: 'Nov', val: 3.5 }, { month: 'Des', val: 1.2 },
];

// --- COMPONENTS ---

interface BadgeProps {
  children: React.ReactNode;
  variant: Trader['risk'] | 'Default';
}

const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Low: "bg-green-100 text-green-700 border-green-200",
    Default: "bg-slate-100 text-slate-700 border-slate-200"
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[variant] || styles.Default}`}>
      {children}
    </span>
  );
};

const HeatmapCell: React.FC<{ value: number }> = ({ value }) => (
  <div className={`flex flex-col items-center justify-center p-2 rounded-md ${value > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
    <span className="text-sm font-bold">{value > 0 ? `+${value}%` : `${value}%`}</span>
  </div>
);

interface AccountDetailProps {
  account: Trader;
  onBack: () => void;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ account, onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      {/* Header Detail */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{account.name}</h2>
            <div className="flex gap-2 mt-1">
              <Badge variant={account.risk}>{account.risk} Risk</Badge>
              <span className="text-sm text-slate-400 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Terdaftar: {account.age}
              </span>
            </div>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-200">
          Investasi Sekarang
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total ROI", val: `+${account.roi}%`, icon: TrendingUp, color: "text-green-600" },
          { label: "Max Drawdown", val: `${account.drawdown}%`, icon: ShieldCheck, color: "text-red-600" },
          { label: "Win Rate", val: `${account.winRate}%`, icon: Activity, color: "text-blue-600" },
          { label: "Profit Faktor", val: "1.85", icon: BarChart3, color: "text-purple-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Kurva Equity & Balance
            </h3>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Equity</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-300 rounded-full"></div> Balance</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={account.history}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="equity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
                <Line type="monotone" dataKey="balance" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" /> Performa Bulanan
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {MONTHLY_DATA.map((data, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block text-center">{data.month}</span>
                <HeatmapCell value={data.val} />
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Saldo Akun</span>
              <span className="font-bold text-slate-800">${account.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-slate-500">Total Profit</span>
              <span className="font-bold text-green-600">+${account.profit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LeaderboardProps {
  onSelectAccount: (account: Trader) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onSelectAccount }) => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filteredTraders = useMemo(() => {
    return MOCK_TRADERS.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || t.strategy === filter || t.risk === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cari strategi atau trader..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {['All', 'Conservative', 'Moderate', 'Scalping'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Trader / Strategi</div>
          <div className="text-center">Risiko</div>
          <div className="text-center">ROI %</div>
          <div className="text-center">Drawdown</div>
          <div className="text-center">Umur Akun</div>
          <div className="text-right">Aksi</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-slate-100">
          {filteredTraders.map((trader) => (
            <div 
              key={trader.id} 
              className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 md:items-center hover:bg-slate-50/50 transition-colors cursor-pointer group"
              onClick={() => onSelectAccount(trader)}
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {trader.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{trader.name}</h4>
                  <p className="text-xs text-slate-400">{trader.strategy}</p>
                </div>
              </div>
              <div className="text-center flex md:block items-center justify-between">
                <span className="md:hidden text-xs text-slate-400 uppercase font-bold">Risk</span>
                <Badge variant={trader.risk}>{trader.risk}</Badge>
              </div>
              <div className="text-center flex md:block items-center justify-between">
                <span className="md:hidden text-xs text-slate-400 uppercase font-bold">ROI</span>
                <span className="font-bold text-green-600">+{trader.roi}%</span>
              </div>
              <div className="text-center flex md:block items-center justify-between">
                <span className="md:hidden text-xs text-slate-400 uppercase font-bold">Drawdown</span>
                <span className="font-bold text-slate-700">{trader.drawdown}%</span>
              </div>
              <div className="text-center flex md:block items-center justify-between">
                <span className="md:hidden text-xs text-slate-400 uppercase font-bold">Age</span>
                <span className="text-sm text-slate-500">{trader.age}</span>
              </div>
              <div className="text-right">
                <button className="text-blue-600 font-bold text-sm flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform">
                  Detail <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [selectedAccount, setSelectedAccount] = useState<Trader | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-8">
      {/* Sidebar Simbolis & Container Utama */}
      <div className="max-w-7xl mx-auto">
        
        {/* Navbar */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              {/* <Zap className="text-white w-6 h-6 fill-current" /> */}
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">Arslan<span className="text-blue-600">Invest</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">Halo, Arslan!</span>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 rounded font-bold">INVESTOR TIER 1</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arslan" alt="User Profile" />
            </div>
          </div>
        </header>

        {/* Content View */}
        <main>
          {!selectedAccount ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-800">Marketplace Strategi</h2>
                <p className="text-slate-500 mt-1">Pilih trader terbaik dengan manajemen risiko yang sesuai dengan profil Anda.</p>
              </div>
              <Leaderboard onSelectAccount={setSelectedAccount} />
            </>
          ) : (
            <AccountDetail 
              account={selectedAccount} 
              onBack={() => setSelectedAccount(null)} 
            />
          )}
        </main>

        <footer className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>© 2024 ArslanInvest SaaS Platform. Past performance is not indicative of future results.</p>
        </footer>
      </div>
    </div>
  );
}