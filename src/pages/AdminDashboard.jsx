import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { AlertCircle, TrendingDown, Users, Target, Search, Download, CheckCircle2, X, ShieldAlert } from 'lucide-react';
import RiskHeatmap from '../components/RiskHeatmap';
import UserManagement from './admin/UserManagement';
import Settings from './admin/Settings';
import Modal from '../components/Modal';

const AdminDashboard = ({ activePage, setActivePage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAllFacultyModal, setShowAllFacultyModal] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [heatmapHorizon, setHeatmapHorizon] = useState('semester');
  const [heatmapIntensity, setHeatmapIntensity] = useState('drift');
  const [trendData, setTrendData] = useState([]);
  const [radarStats, setRadarStats] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  // STATE FOR REAL DATABASE DATA
  const [liveStats, setLiveStats] = useState({
    avg_integrity: "88.4%",
    total_analyzed: "12,400",
    high_risk_alerts: "42",
    writing_drift: "18.2%"
  });
  const [alerts, setAlerts] = useState([]);

  // FETCH FROM FLASK ON LOAD
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://127.0.0.1:5000/api/admin/live-stats')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setLiveStats(data);
      })
      .catch(err => console.error("Failed to fetch live stats", err));

    fetch('http://127.0.0.1:5000/api/admin/alerts', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAlerts(data);
      })
      .catch(err => console.error("Failed to fetch alerts", err));

    fetch('http://127.0.0.1:5000/api/admin/analytics/trends', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTrendData(data);
      })
      .catch(err => console.error("Failed to fetch trends", err));

    fetch('http://127.0.0.1:5000/api/admin/analytics/radar', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRadarStats(data))
      .catch(err => console.error("Failed to fetch radar stats", err));

    fetch('http://127.0.0.1:5000/api/admin/users?role=faculty', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setFacultyList(data))
      .catch(err => console.error("Failed to fetch faculty list", err));
  }, []);

  const handleGenerateReport = () => {
    setReportGenerated(false);
    setShowReportModal(true);
    setTimeout(() => setReportGenerated(true), 600);
  };

  const filteredFaculty = facultyList.filter(f =>
    (f.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.department || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Route to sub-pages
  if (activePage === 'users') return <UserManagement />;
  if (activePage === 'settings') return <Settings />;
  if (activePage === 'heatmap') return (
    <div className="flex gap-8 pb-12">
      <div className="flex-1 space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Risk Heatmap</h2>
          <p className="text-text-secondary mt-1">Linguistic drift heatmap across all departments and weeks.</p>
        </header>
        <RiskHeatmap horizon={heatmapHorizon} intensity={heatmapIntensity} />
      </div>

      {/* Dedicated Heatmap Sidebar */}
      <div className="w-80 shrink-0 space-y-6">
        <div className="glass-card p-6 border-l-4 border-status-high">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Heatmap Controls</h3>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase mb-2 block">Intensity View</label>
              <select
                value={heatmapIntensity}
                onChange={(e) => setHeatmapIntensity(e.target.value)}
                className="w-full bg-white/50 border border-white/50 rounded-lg p-2 text-xs outline-none"
              >
                <option value="drift">Writing Drift %</option>
                <option value="ai">AI Probability</option>
                <option value="syntax">Syntax Complexity</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase mb-2 block">Time Horizon</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setHeatmapHorizon('last4')}
                  className={`text-[10px] font-bold py-2 rounded-lg transition-all ${heatmapHorizon === 'last4' ? 'bg-primary text-black shadow-neon-glow' : 'bg-white/40 text-text-muted border border-white/50'}`}
                >
                  Last 4 Weeks
                </button>
                <button
                  onClick={() => setHeatmapHorizon('semester')}
                  className={`text-[10px] font-bold py-2 rounded-lg transition-all ${heatmapHorizon === 'semester' ? 'bg-primary text-black shadow-neon-glow' : 'bg-white/40 text-text-muted border border-white/50'}`}
                >
                  Semester
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4">Risk Legend</h3>
          <div className="space-y-3">
            {[
              { label: 'Critical Drift (>40%)', color: 'bg-status-high' },
              { label: 'Moderate Anomaly (20-40%)', color: 'bg-status-medium' },
              { label: 'Standard Deviation (<20%)', color: 'bg-status-safe' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-[10px] font-medium text-text-secondary">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
          <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-2">
            <ShieldAlert size={14} /> Analytics Engine
          </h4>
          <p className="text-[10px] text-text-secondary leading-relaxed">
            Heatmap colors are calculated using the <strong>Standard Deviation Baseline</strong> of department-wide linguistic markers over the last 180 days.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex gap-8 pb-12">
        <div className="flex-1 space-y-8">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Executive Overview</h2>
              <p className="text-text-secondary mt-1">Global integrity metrics and department performance.</p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search departments or faculty..."
                  className="bg-white/50 border border-white/50 rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/30 outline-none w-64 transition-all"
                />
              </div>
              <button onClick={handleGenerateReport} className="btn-3d px-6 py-2 flex items-center gap-2">
                <Download size={16} />
                Generate Report
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Avg Integrity Score', value: liveStats.avg_integrity, trend: '+2.1%', icon: Target },
              { label: 'Total Analyzed', value: liveStats.total_analyzed, trend: '+12%', icon: Users },
              { label: 'High Risk Alerts', value: liveStats.high_risk_alerts, trend: '-14%', icon: AlertCircle, color: '#EF4444' },
              { label: 'Writing Drift %', value: liveStats.writing_drift, trend: '+0.5%', icon: TrendingDown },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover-glow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="text-primary" size={20} style={{ color: stat.color }} />
                  </div>
                  <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-status-safe' : 'text-status-high'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Global Analytics Graph */}
            <div className="lg:col-span-2 glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Integrity Performance Trend</h3>
                <select className="bg-transparent border border-white/50 rounded-lg px-3 py-1 text-sm outline-none">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7CFC00" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#7CFC00" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} dx={-10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#7CFC00' }}
                      />
                      <Area type="monotone" dataKey="drift_avg" stroke="#7CFC00" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-muted text-xs italic">Loading trend data...</div>
                )}
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="glass-card p-8 border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <TrendingDown size={20} />
                <h3 className="text-xl font-bold text-text-primary">AI Insights</h3>
              </div>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {alerts.length > 0 ? alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-xl border ${alert.level === 'critical' ? 'bg-status-high/5 border-status-high/10' : 'bg-status-medium/5 border-status-medium/10'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${alert.level === 'critical' ? 'text-status-high' : 'text-status-medium'}`}>
                      {alert.level === 'critical' ? 'Critical Alert' : 'System Warning'}
                    </span>
                    <p className="text-sm font-semibold text-text-primary mb-1">{alert.title}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{alert.description}</p>
                    <p className="text-[9px] text-text-muted mt-2 font-bold uppercase">{alert.time}</p>
                  </div>
                )) : (
                  <div className="py-10 text-center text-text-muted text-xs italic">
                    No active risk alerts detected in current submissions.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Faculty Directory Section */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Faculty Management Directory</h3>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                {facultyList.length} Users Enrolled
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFaculty.map((faculty, idx) => (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="p-4 bg-white/40 border border-white/50 rounded-xl flex items-center gap-4 hover:bg-white/60 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${faculty.status === 'Active' ? 'bg-status-safe shadow-[0_0_8px_#22C55E]' : 'bg-text-muted'}`}></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{faculty.full_name}</h4>
                    <p className="text-[10px] text-text-muted truncate">{faculty.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-text-primary">{faculty.status}</p>
                    <p className="text-[9px] text-text-muted">{faculty.last_login}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Risk Heatmap (Rounded Pills) */}
            <div className="lg:col-span-2">
              <RiskHeatmap />
            </div>

            {/* Peer Comparison Radar */}
            <div className="glass-card p-8 radar-chart">
              <h3 className="text-xl font-bold mb-8">Metric Distribution</h3>
              <div className="h-[300px] w-full">
                {radarStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarStats}>
                      <PolarGrid stroke="rgba(0,0,0,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name="System Avg" dataKey="A" stroke="#7CFC00" fill="#7CFC00" fillOpacity={0.5} />
                      <Radar name="Current Dept" dataKey="B" stroke="#22C55E" fill="#22C55E" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-muted text-xs italic">Loading metrics...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Admin User Sidebar (Active Faculty View) */}
        <div className="w-80 space-y-6">
          <div className="glass-card p-6 border-glow shadow-neon-glow bg-primary/[0.02]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Active Faculty Hub</h3>
            <div className="space-y-4">
              {facultyList.filter(f => f.status === 'Active').slice(0, 8).map((active, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                      {active.full_name?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-status-safe border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{active.full_name}</p>
                    <p className="text-[10px] text-status-safe font-medium">Monitoring...</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAllFacultyModal(true)}
              className="w-full mt-6 py-2 text-[11px] font-bold text-primary hover:underline transition-all"
            >
              View All {facultyList.filter(f => f.status === 'Active').length} Active Sessions
            </button>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4">System Capacity</h3>
            <div className="space-y-4">
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[72%]"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-text-secondary">
                <span>ACTIVE USERS: {facultyList.length + 1}</span>
                <span>72% CAPACITY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="System Integrity Report" wide>
        {!reportGenerated ? (
          <div className="flex flex-col items-center py-12 gap-4">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-text-secondary font-medium animate-pulse">Compiling report data across all departments...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-status-safe/10 border border-status-safe/20 rounded-xl">
              <CheckCircle2 className="text-status-safe" size={20} />
              <p className="font-bold text-status-safe">Report generated successfully — {new Date().toLocaleDateString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['Total Students Analyzed', '12,400'], ['High-Risk Submissions', '42'], ['Avg Integrity Score', '88.4%'], ['Writing Drift Avg', '18.2%'], ['AI-Flagged Entries', '127'], ['Departments Covered', '8']].map(([label, val]) => (
                <div key={label} className="p-4 bg-white/50 border border-white/50 rounded-xl">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">{label}</p>
                  <p className="text-2xl font-bold text-text-primary">{val}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white/40 border border-white/50 rounded-xl">
              <h4 className="font-bold mb-3">Department Summary</h4>
              {['CSE — Avg Score: 85.2% — 3 High-Risk', 'ECE — Avg Score: 90.1% — 0 High-Risk', 'MECH — Avg Score: 78.4% — 8 High-Risk', 'ARTS — Avg Score: 92.0% — 1 High-Risk'].map((line, i) => (
                <p key={i} className="text-sm text-text-secondary py-1 border-b border-white/30 last:border-0">{line}</p>
              ))}
            </div>
            <button
              onClick={() => {
                const blob = new Blob([`LABIA System Report\nGenerated: ${new Date()}\n\nTotal Analyzed: 12,400\nHigh-Risk: 42\nAvg Score: 88.4%\nDrift: 18.2%`], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'LABIA_Report.txt'; a.click();
              }}
              className="btn-3d w-full py-3 flex items-center justify-center gap-2"
            >
              <Download size={18} /> Download Report (.txt)
            </button>
          </div>
        )}
      </Modal>

      {/* View All Faculty Modal */}
      <Modal isOpen={showAllFacultyModal} onClose={() => setShowAllFacultyModal(false)} title={`Active Faculty Sessions (${facultyList.filter(f => f.status === 'Active').length})`} wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFaculty.slice(0, 6).map((f) => (
            <div key={f.id} className="flex items-center justify-between p-4 bg-white/40 border border-white/50 rounded-xl hover:bg-white/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                  {f.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm text-text-primary">{f.full_name}</p>
                  <p className="text-[10px] text-text-muted">{f.department || 'N/A'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${f.status === 'Active' ? 'bg-status-safe/10 text-status-safe' : 'bg-text-muted/10 text-text-muted'}`}>
                  {f.status}
                </div>
                <p className="text-[10px] text-text-muted">ID: {f.id}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default AdminDashboard;
