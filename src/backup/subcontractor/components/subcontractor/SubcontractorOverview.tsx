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
  DollarSign,
  LifeBuoy
} from 'lucide-react';

const formatBudget = (budget: any) => {
  if (typeof budget === 'number') return `$${(budget / 1000).toFixed(0)}k`;
  return budget || '$0k';
};
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
  const [activeTab, setActiveTab] = useState('All');

  // Persistence Data
  const [bids, setBids] = useState<any[]>([]);
  // Placeholder for real projects data - will be replaced with real hook/fetch later
  const rawProjects: any[] = [];

  useEffect(() => {
    setBids(scDashboardService.getBids());
  }, []);

  const stats = [
    {
      title: 'Win Rate',
      value: `0.0%`,
      subtext: 'Market Position: Strong',
      icon: TrendingUp,
      isActive: true,
      bgColor: 'bg-accent/10 dark:bg-accent/20',
      iconColor: 'text-accent',
      borderColor: 'border-accent/20 dark:border-accent/30'
    },
    {
      title: 'Active Bids',
      value: bids.length.toString(),
      subtext: 'Bids Pending Review',
      icon: Clock,
      isActive: false,
      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      iconColor: 'text-gray-400 dark:text-gray-500',
      borderColor: 'border-gray-200 dark:border-gray-700'
    },
    {
      title: 'Contracted Value',
      value: `$0k`,
      subtext: 'Revenue YTD',
      icon: DollarSign,
      isActive: false,
      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      iconColor: 'text-gray-400 dark:text-gray-500',
      borderColor: 'border-gray-200 dark:border-gray-700'
    }
  ];

  const filteredProjects = useMemo(() => {
    if (activeTab === 'All') return rawProjects;
    if (activeTab === 'Hot') return rawProjects.filter(p => p.status === 'Hot');
    if (activeTab === 'Near Me') return rawProjects.filter(p => p.isNear);
    return rawProjects;
  }, [activeTab]);

  return (
    <div className="p-6 md:p-8 min-h-full bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-white space-y-8 transition-colors duration-300">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-accent/10 text-accent border-accent/20 font-medium uppercase text-[10px] tracking-wider px-2.5 py-0.5 shadow-sm">
              Subcontractor Profile
            </Badge>
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-widest">
                Account Status: Active
              </span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
            Subcontractor Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-3 max-w-lg leading-relaxed">
            Manage your project pipeline and track bid performance.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-11 px-6 border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-xl font-semibold text-xs transition-all duration-200"
            onClick={() => navigate('/subcontractor-dashboard/find-projects')}
          >
            <SearchCode className="w-4 h-4 mr-2" /> Find Projects
          </Button>
          <Button
            className="h-11 px-7 bg-accent text-accent-foreground font-semibold text-xs rounded-xl transition-all shadow-sm"
            onClick={() => navigate('/subcontractor-dashboard/bid-management')}
          >
            <Plus className="w-4 h-4 mr-2" /> New Bid
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`group relative rounded-2xl p-5 bg-white dark:bg-[#1c1e24] border ${stat.borderColor} hover:border-accent/40 dark:hover:border-accent/30 transition-all duration-300 cursor-pointer hover:shadow-md ${stat.isActive ? 'shadow-md shadow-accent/10 dark:shadow-accent/20' : 'shadow-sm'}`}
          >
            {stat.isActive && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-2xl pointer-events-none"></div>
            )}

            <div className="relative z-10">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} ${stat.borderColor} border mb-4 transition-all duration-300`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor} transition-colors`} />
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {stat.title}
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1.5 tubular-nums">
                  {stat.value}
                </div>
                <p className={`text-[10px] font-medium uppercase tracking-wider ${stat.isActive ? 'text-accent' : 'text-gray-400 dark:text-gray-500'}`}>
                  {stat.subtext}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Opportunities Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2.5 text-gray-800 dark:text-white">
              <Target className="w-5 h-5 text-accent" />
              Project Opportunities
            </h3>
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-lg border border-gray-200 dark:border-white/10 whitespace-nowrap overflow-x-auto scrollbar-hide">
              {['All', 'Hot', 'Near Me'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
                    activeTab === tab
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((prj) => (
                <div
                  key={prj.id}
                  onClick={() => navigate('/subcontractor-dashboard/find-projects')}
                  className="group relative rounded-xl p-5 bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          <span className="text-accent">{prj.id}</span>
                          <span className="text-gray-300 dark:text-gray-700">•</span>
                          <span className="truncate">{prj.gc}</span>
                        </div>
                        <h4 className="text-base font-bold tracking-tight mb-2 group-hover:text-accent transition-colors leading-tight line-clamp-2">
                          {prj.title}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-bold text-gray-900 dark:text-white font-mono">{formatBudget(prj.budget)}</p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider text-right">Est. Value</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500 uppercase tracking-tight">
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" /> <span className="truncate">{prj.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500 uppercase tracking-tight">
                          <Clock className="w-3.5 h-3.5 text-accent shrink-0" /> <span>Due {prj.dueDate}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Match Accuracy</span>
                          <span className="text-[10px] font-bold text-accent tabular-nums">{prj.aiMatch}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-black/20 h-1 rounded-full overflow-hidden">
                          <div className="bg-accent h-full transition-all duration-700" style={{ width: `${prj.aiMatch}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-white dark:bg-[#1c1e24] rounded-2xl border border-dashed border-gray-200 dark:border-white/10 shadow-sm transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 dark:bg-black/20 mb-6">
                  <Target className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white uppercase tracking-tight mb-2">No Matching Projects Found</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm max-w-xs mx-auto mb-8">
                  Adjust your search filters or update your trade profile to see more relevant opportunities.
                </p>
                <Button
                  onClick={() => navigate('/subcontractor-dashboard/find-projects')}
                  className="bg-accent text-accent-foreground font-bold uppercase text-[11px] tracking-widest px-8"
                >
                  Browse Projects
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Support Card - Mirroring GC's density */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none transition-all"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6 flex items-center gap-2.5">
              <LifeBuoy className="w-4 h-4 text-accent" /> Support Center
            </h3>
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                Need assistance with your account or bid management?
              </p>
              <Button
                variant="outline"
                className="w-full h-11 border-gray-200 dark:border-white/10 dark:bg-black/20 font-bold text-[11px] uppercase tracking-widest rounded-xl"
                onClick={() => navigate('/subcontractor-dashboard/customer-support')}
              >
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubcontractorOverview;
