import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, AlertTriangle, ChevronRight, Download } from 'lucide-react';
import Modal from '../../components/Modal';

const ASSIGNMENTS = [
  { id: 1, title: 'Research Paper #3', course: 'CS-302', due: '2026-05-02', submissions: 28, flagged: 3, status: 'Active' },
  { id: 2, title: 'Ethics Case Study', course: 'PHIL-201', due: '2026-04-28', submissions: 22, flagged: 0, status: 'Closed' },
  { id: 3, title: 'Algorithm Analysis', course: 'CS-401', due: '2026-05-10', submissions: 10, flagged: 1, status: 'Active' },
  { id: 4, title: 'Database Design Report', course: 'CS-302', due: '2026-05-15', submissions: 5, flagged: 0, status: 'Active' },
  { id: 5, title: 'Mid-Term Essay', course: 'ARTS-105', due: '2026-04-20', submissions: 35, flagged: 5, status: 'Closed' },
];

const Assignments = () => {
  const [selected, setSelected] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = () => {
    setReportGenerated(false);
    setShowReportModal(true);
    setTimeout(() => setReportGenerated(true), 500);
  };

  return (
    <>
      <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
        <p className="text-text-secondary mt-1">Monitor all active and closed assignment submissions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Assignments', value: ASSIGNMENTS.filter(a => a.status === 'Active').length, color: 'text-status-safe' },
          { label: 'Total Submissions', value: ASSIGNMENTS.reduce((s, a) => s + a.submissions, 0), color: 'text-primary' },
          { label: 'Flagged Entries', value: ASSIGNMENTS.reduce((s, a) => s + a.flagged, 0), color: 'text-status-high' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
            <h3 className={`text-4xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className={`grid gap-8 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6">All Assignments</h3>
          <div className="space-y-3">
            {ASSIGNMENTS.map((a, idx) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelected(a.id === selected?.id ? null : a)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5
                  ${selected?.id === a.id
                    ? 'bg-primary/5 border-primary/30 shadow-neon-glow'
                    : 'bg-white/40 border-white/50 hover:bg-white/60'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center
                      ${a.status === 'Active' ? 'bg-status-safe/10' : 'bg-text-muted/10'}`}>
                      <FileText size={16} className={a.status === 'Active' ? 'text-status-safe' : 'text-text-muted'} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{a.title}</p>
                      <p className="text-[10px] text-text-muted">{a.course} · Due {a.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-xs font-bold">{a.submissions} subs</p>
                      {a.flagged > 0 && (
                        <p className="text-[10px] text-status-high font-bold">{a.flagged} flagged</p>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-text-muted" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 sticky top-8 h-fit"
          >
            <h3 className="text-xl font-bold mb-2">{selected.title}</h3>
            <p className="text-xs text-text-muted mb-8">{selected.course} · Due {selected.due}</p>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl">
                <span className="text-sm text-text-secondary">Total Submissions</span>
                <span className="font-bold text-primary">{selected.submissions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl">
                <span className="text-sm text-text-secondary">Flagged</span>
                <span className="font-bold text-status-high">{selected.flagged}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl">
                <span className="text-sm text-text-secondary">Status</span>
                <span className={`font-bold text-sm ${selected.status === 'Active' ? 'text-status-safe' : 'text-text-muted'}`}>{selected.status}</span>
              </div>
            </div>

            <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4">Analysis Timeline</h4>
            <div className="relative pl-6 space-y-5">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-primary/20"></div>
              {[
                { label: 'Assignment Published', note: 'Faculty uploaded brief', icon: CheckCircle2, color: '#22C55E' },
                { label: 'Submission Window Open', note: `${selected.submissions} students submitted`, icon: Clock, color: '#7CFC00' },
                { label: 'AI Analysis Run', note: `${selected.flagged} anomalies detected`, icon: AlertTriangle, color: selected.flagged > 0 ? '#FACC15' : '#22C55E' },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[1.35rem] top-1 w-4 h-4 rounded-full bg-white border-2 z-10"
                    style={{ borderColor: step.color }}>
                    <step.icon size={8} style={{ color: step.color, margin: '2px' }} />
                  </div>
                  <p className="text-sm font-bold">{step.label}</p>
                  <p className="text-xs text-text-secondary">{step.note}</p>
                </div>
              ))}
            </div>

            <button onClick={handleGenerateReport} className="w-full btn-3d mt-8 py-3">Generate Report</button>
          </motion.div>
        )}
      </div>

      {/* Assignment Report Modal */}
      {selected && (
        <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title={`Assignment Report — ${selected.title}`} wide>
          {!reportGenerated ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-text-secondary font-medium animate-pulse">Compiling submission metrics...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-status-safe/10 border border-status-safe/20 rounded-xl">
                <CheckCircle2 className="text-status-safe" size={20} />
                <p className="font-bold text-status-safe">Report generated successfully.</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[['Total Submissions', selected.submissions], ['Flagged Entries', selected.flagged], ['Status', selected.status]].map(([label, val]) => (
                  <div key={label} className="p-4 bg-white/50 border border-white/50 rounded-xl">
                    <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">{label}</p>
                    <p className="text-2xl font-bold text-text-primary">{val}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white/40 border border-white/50 rounded-xl">
                <h4 className="font-bold mb-3">Integrity Highlights</h4>
                <p className="text-sm text-text-secondary py-1 border-b border-white/30">Average Integrity Score: 87.5%</p>
                <p className="text-sm text-text-secondary py-1 border-b border-white/30">AI Probability Avg: 12%</p>
                <p className="text-sm text-text-secondary py-1">Writing Style Drift: Detected in {selected.flagged} submissions</p>
              </div>
              <button
                onClick={() => {
                  const content = `Assignment Report: ${selected.title}\nCourse: ${selected.course}\nDue Date: ${selected.due}\nSubmissions: ${selected.submissions}\nFlagged: ${selected.flagged}\nStatus: ${selected.status}`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = `Report_${selected.title.replace(/ /g, '_')}.txt`; a.click();
                }}
                className="btn-3d w-full py-3 flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download Assignment Report (.txt)
              </button>
            </div>
          )}
        </Modal>
      )}
      </div>
    </>
  );
};

export default Assignments;
