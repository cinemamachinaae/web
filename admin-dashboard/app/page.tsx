import React from "react";
import { 
  Users, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Settings
} from "lucide-react";
import prisma from "@/lib/db";

type DashboardLogStatus = "PASS" | "FAIL" | "WARNING";

interface DashboardLog {
  id: string;
  date: Date;
  testName: string;
  resultStatus: DashboardLogStatus;
  details: string | null;
}

function normalizeResultStatus(status: string): DashboardLogStatus {
  if (status === "PASS" || status === "FAIL" || status === "WARNING") return status;
  return "WARNING";
}

async function getDashboardData() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const rawLogs = await prisma.verificationLog.findMany({
    orderBy: { date: 'desc' },
    take: 4
  });

  const logs: DashboardLog[] = rawLogs.map((log: any) => ({
    id: String(log.id),
    date: log.date,
    testName: log.testName,
    resultStatus: normalizeResultStatus(log.resultStatus),
    details: log.details
  }));
  
  const stats = await prisma.analyticsSnapshot.findFirst({
    orderBy: { snapshotDate: 'desc' }
  });
  
  return { settings, logs, stats };
}

export default async function OverviewPage() {
  const { settings, logs, stats } = await getDashboardData();

  const dashboardStats = [
    { name: "Total Visitors", value: stats?.visitorsCount?.toLocaleString() ?? "0", change: "+12.5%", trend: "up", icon: Users },
    { name: "Page Views", value: stats?.pageViews?.toLocaleString() ?? "0", change: "+18.2%", trend: "up", icon: Eye },
    { name: "CTR", value: "4.2%", change: "-2.1%", trend: "down", icon: MousePointerClick },
    { name: "Conv. Rate", value: `${stats?.conversionRate ?? 0}%`, change: "+0.4%", trend: "up", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Executive Overview</h2>
          <p className="text-sm text-foreground/50">Monitoring {settings?.title ?? "Cinema Machina"} performance.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bronze/10 border border-bronze/20">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-bronze uppercase tracking-widest">Live: Production</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="admin-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-bronze/10 transition-colors group-hover:text-bronze/20">
              <stat.icon size={48} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/40">{stat.name}</span>
                <stat.icon size={16} className="text-bronze" />
              </div>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white tracking-tighter">{stat.value}</h3>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 admin-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">Recent Verification Logs</h3>
            <button className="text-xs font-bold text-bronze hover:text-bronze-light flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="space-y-4">
            {logs.map((log: DashboardLog) => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-md bg-white/[0.02] border border-white/[0.03] hover:border-bronze/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    log.resultStatus === "PASS" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  }`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{log.testName}</h4>
                    <p className="text-xs text-foreground/40">{new Date(log.date).toLocaleDateString()} &bull; {log.details}</p>
                  </div>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded tracking-tighter ${
                   log.resultStatus === "PASS" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                }`}>
                  {log.resultStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Info */}
        <div className="admin-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">Brand Identity</h3>
            <Settings size={16} className="text-bronze" />
          </div>
          <div className="space-y-6">
             <div className="p-4 rounded bg-white/[0.02] border border-white/[0.03] space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-foreground/30">Primary Email</p>
                  <p className="text-sm text-white font-medium">{settings?.contactEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-foreground/30">Support Phone</p>
                  <p className="text-sm text-white font-medium">{settings?.phoneNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-foreground/30">Primary Accent</p>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{ backgroundColor: settings?.primaryBronze ?? '#E2C19B' }}></div>
                    <p className="text-sm text-white font-mono">{settings?.primaryBronze}</p>
                  </div>
                </div>
             </div>

            <div className="pt-4 p-4 rounded bg-bronze/5 border border-bronze/10 flex items-start gap-3">
              <AlertCircle size={16} className="text-bronze shrink-0 mt-0.5" />
              <p className="text-[11px] text-bronze/80 leading-relaxed">
                Site Settings are currently managed and tracked. Any changes made in the dashboard will reflect globally across the public site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
