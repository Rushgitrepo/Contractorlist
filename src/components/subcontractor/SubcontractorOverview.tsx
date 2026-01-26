import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  MessageSquare,
  Briefcase,
  Plus,
  Search,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Building2,
  SearchCode,
  Eye,
  Target,
  MapPin,
  DollarSign
} from 'lucide-react';
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { scDashboardService } from '@/services/scDashboardService';
import { useToast } from '@/hooks/use-toast';

const SubcontractorOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('All');

  // Persistence Data
  const [bids, setBids] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);

  // Real-time data state
  const [realTimeStats, setRealTimeStats] = useState({
    winRate: 0,
    activeBids: 0,
    profileViews: 0,
    revenueYTD: 0
  });

  useEffect(() => {
    setBids(scDashboardService.getBids());
    setDeployments(scDashboardService.getDeployments());
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        winRate: Math.min(30, prev.winRate + Math.random() * 0.1),
        activeBids: prev.activeBids + (Math.random() > 0.8 ? 1 : 0),
        profileViews: prev.profileViews + Math.floor(Math.random() * 3),
        revenueYTD: prev.revenueYTD + Math.floor(Math.random() * 500)
      }));
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  const stats = [
    {
      title: 'Win Rate',
      value: `${realTimeStats.winRate.toFixed(1)}%`,
      subtext: 'SIGNAL STRENGTH: HIGH',
      icon: TrendingUp,
      progress: 75,
      color: '#EAB308', // Yellow
      textColor: 'text-yellow-400'
    },
    {
      title: 'Active Bids',
      value: bids.length.toString(),
      subtext: 'PENDING TRANSMISSIONS',
      icon: Clock,
      progress: 45,
      color: '#3b82f6', // Blue
      textColor: 'text-blue-400'
    },
    {
      title: 'Profile Views',
      value: (realTimeStats.profileViews / 1000).toFixed(1) + 'k',
      subtext: 'INCOMING SIGNALS',
      icon: Eye,
      progress: 88,
      color: '#10b981', // Emerald
      textColor: 'text-emerald-400'
    },
    {
      title: 'Revenue YTD',
      value: `$${(bids.reduce((acc, b) => acc + b.budgetValue, 0) / 1000).toFixed(0)}k`,
      subtext: 'CAPITAL SECURED',
      icon: DollarSign,
      progress: 62,
      color: '#a855f7', // Purple
      textColor: 'text-purple-400'
    }
  ];

  const rawProjects: any[] = [];

  const filteredProjects = useMemo(() => {
    if (activeTab === 'All') return rawProjects;
    if (activeTab === 'Hot') return rawProjects.filter(p => p.status === 'Hot');
    if (activeTab === 'Near Me') return rawProjects.filter(p => p.isNear);
    return rawProjects;
  }, [activeTab]);

  return (
    <div className="flex h-full w-full flex-col bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-white transition-all duration-300 overflow-hidden font-sans">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-yellow-400/5 dark:bg-yellow-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-400/5 dark:bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-yellow-400 text-black font-bold uppercase text-[9px] tracking-widest border-none px-2.5 py-0.5">Sub Terminal</Badge>
                <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">MISSION STATUS: OPERATIONAL</span>
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-none uppercase">
                Sub Contractor Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-xs mt-2 max-w-lg uppercase tracking-wide">Execute your bids and stabilize your revenue stream.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-10 px-5 border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all" onClick={() => navigate('/subcontractor-dashboard/find-projects')}>
                <SearchCode className="w-4 h-4 mr-2" /> Find Missions
              </Button>
              <Button className="h-10 px-6 bg-black dark:bg-yellow-500 text-white dark:text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-yellow-500/10" onClick={() => navigate('/subcontractor-dashboard/bid-management')}>
                <Plus className="w-4 h-4 mr-2" /> New Proposal
              </Button>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 shadow-sm group-hover:bg-yellow-400 transition-colors">
                    <stat.icon className="w-4 h-4 text-gray-600 dark:text-yellow-500 group-hover:text-black" />
                  </div>
                  <div className="w-9 h-9">
                    <CircularProgressbar
                      value={stat.progress}
                      styles={buildStyles({
                        pathColor: stat.progress > 0 ? stat.color : '#e2e8f0',
                        trailColor: 'transparent',
                        strokeLinecap: 'round'
                      })}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
                  <p className="text-xl font-bold tracking-tight mb-1 tubular-nums font-mono">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-tighter", index % 2 === 0 ? "bg-yellow-400/10 text-yellow-600" : "bg-blue-400/10 text-blue-600")}>
                      {stat.subtext}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Target Signals Area */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold tracking-tight flex items-center gap-2.5 uppercase text-gray-800 dark:text-white">
                  <Target className="w-5 h-5 text-yellow-500" />
                  Target Signals
                </h3>
                <div className="flex gap-2 bg-gray-100 dark:bg-black/30 p-1 rounded-lg border border-gray-200 dark:border-white/5 font-mono">
                  {['All', 'Hot', 'Near Me'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn("px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all", activeTab === tab ? "bg-white dark:bg-[#1c1e24] shadow-sm text-yellow-600" : "text-gray-400 hover:text-black")}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((prj) => (
                    <div
                      key={prj.id}
                      onClick={() => navigate('/subcontractor-dashboard/find-projects')}
                      className="group bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 rounded-xl p-4 transition-all hover:bg-gray-50 dark:hover:bg-white/[0.02] hover:shadow-md cursor-pointer shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row gap-5">
                        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 dark:bg-black/20 text-yellow-500 font-bold border border-gray-100 dark:border-white/5 shadow-sm">
                          <span className="text-[9px] font-bold">{prj.trade.toUpperCase().slice(0, 3)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-widest">{prj.id}</span>
                                <span className="text-gray-300 dark:text-gray-700">•</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{prj.gc}</span>
                              </div>
                              <h4 className="text-base font-bold tracking-tight mb-2 group-hover:text-yellow-600 transition-colors uppercase">{prj.title}</h4>
                            </div>
                            <div className="text-right">
                              <p className="text-base font-bold text-gray-900 dark:text-white font-mono">{prj.budget}</p>
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Est Value</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                              <MapPin className="w-3.5 h-3.5 text-yellow-500" /> {prj.location}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                              <Clock className="w-3.5 h-3.5 text-yellow-500" /> Due {prj.dueDate}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-[8px] font-bold uppercase tracking-widest">Match</span>
                                <span className="text-[8px] font-bold text-yellow-600 tabular-nums">{prj.aiMatch}%</span>
                              </div>
                              <div className="w-full bg-gray-100 dark:bg-black/20 h-1 rounded-full overflow-hidden">
                                <div className="bg-yellow-400 h-full transition-all duration-1000" style={{ width: `${prj.aiMatch}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Card className="p-20 text-center bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-xl">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">No Matches Logged</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Reset filters to recovery signals.</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcontractorOverview;