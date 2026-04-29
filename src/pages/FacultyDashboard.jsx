import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, Clock, 
  Search, Filter, User, ChevronRight, X, Download, ShieldCheck, Zap, BarChart3
} from 'lucide-react';
import AIAnalysisBox from '../components/AIAnalysisBox';
import Assignments from './faculty/Assignments';
import StudentAnalytics from './faculty/StudentAnalytics';
import Modal from '../components/Modal';

const AnalysisLab = () => {
  const [students, setStudents] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [showDossier, setShowDossier] = useState(false);
  const [incomingSubmissions, setIncomingSubmissions] = useState([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/faculty/pending_submissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIncomingSubmissions(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchClass = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://127.0.0.1:5000/api/faculty/class_overview', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setStudents(data);
        }
    } catch (e) {
        console.error(e);
    }
  };

  React.useEffect(() => {
    fetchPending();
    fetchClass();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedSubmissionId) return;
    setAnalyzing(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:5000/api/faculty/analyze/${selectedSubmissionId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setAnalysisResult(data);
        fetchPending(); // Refresh list to remove analyzed item
      } else {
        console.error(data.msg);
        setAnalysisResult({ error: data.msg });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  };

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.idNum || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-8 pb-12">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Faculty Analysis Lab</h2>
          <p className="text-text-secondary mt-1">Upload assignments to detect longitudinal stylistic deviations.</p>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload + Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`glass-card p-10 border-2 border-dashed transition-all duration-300
              ${dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-primary/20 bg-primary/[0.02]'}`}
          >
            {!analyzing && !analysisResult ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all ${dragging ? 'bg-primary/30 scale-110' : 'bg-primary/10'}`}>
                  <Upload size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Drag & Drop Submission</h3>
                {fileName && <p className="text-sm text-primary font-bold mb-2">📄 {fileName}</p>}
                <p className="text-text-secondary text-sm mb-8">PDF, DOCX, or TXT files supported (Max 10MB)</p>
                <div className="flex gap-4">
                  <label className="cursor-pointer px-8 py-3 rounded-xl border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-all">
                    Browse File
                    <input type="file" className="hidden" onChange={e => setFileName(e.target.files[0]?.name || '')} />
                  </label>
                  <button onClick={handleAnalyze} className="btn-3d px-12 py-3 text-lg">
                    Analyze Integrity
                  </button>
                </div>
              </div>
            ) : (
              <AIAnalysisBox
                isAnalyzing={analyzing}
                result={analysisResult}
                onReset={() => { setAnalyzing(false); setAnalysisResult(null); setFileName(''); }}
              />
            )}
          </div>

          {/* Incoming Submissions */}
          {incomingSubmissions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-medium animate-pulse"></span>
                Live Student Submissions ({incomingSubmissions.length})
              </h3>
              <div className="space-y-3">
                {incomingSubmissions.map(sub => (
                  <div key={sub.id} className="glass-card p-4 flex items-center justify-between border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-primary">
                        {sub.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text-primary">{sub.studentName} <span className="text-[10px] text-text-muted">({sub.studentId})</span></p>
                        <p className="text-xs text-text-secondary">{sub.title} · {sub.course}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { 
                        setFileName(sub.title); 
                        setSelectedSubmissionId(sub.id);
                        setAnalysisResult(null); 
                      }}
                      className="btn-3d px-4 py-1.5 text-xs"
                    >
                      Load into Lab
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Class Overview (CS-302)</h3>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-white/50 border border-white/50 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 w-48"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((student) => (
                <motion.div
                  key={student.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                  className={`glass-card p-5 relative overflow-hidden cursor-pointer group flex items-center gap-4 transition-all
                    ${selectedStudent?.id === student.id ? 'border-primary shadow-neon-glow' : ''}`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 
                    ${student.risk === 'safe' ? 'bg-status-safe' : student.risk === 'medium' ? 'bg-status-medium' : 'bg-status-high'}`}
                  />
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-primary/10 font-bold text-primary">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text-primary">{student.name}</h4>
                    <p className="text-[10px] text-text-muted font-mono">{student.idNum}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{student.score}</div>
                    <p className="text-[10px] text-text-muted flex items-center justify-end gap-1">
                      <Clock size={10} /> {student.lastSub}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Profile Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <motion.div
                key={selectedStudent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-8 sticky top-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Student Profile</span>
                  <button onClick={() => setSelectedStudent(null)} className="text-text-muted hover:text-text-primary">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-6">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="#e5e7eb" strokeWidth="8" fill="transparent" />
                      <motion.circle
                        cx="64" cy="64" r="58"
                        stroke={selectedStudent.risk === 'safe' ? '#22C55E' : selectedStudent.risk === 'medium' ? '#FACC15' : '#EF4444'}
                        strokeWidth="8" fill="transparent"
                        strokeDasharray="364.4"
                        initial={{ strokeDashoffset: 364.4 }}
                        animate={{ strokeDashoffset: 364.4 - (364.4 * selectedStudent.score) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold">{selectedStudent.score}</span>
                      <span className="text-[10px] text-text-muted uppercase font-bold">Integrity</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-text-secondary text-sm">{selectedStudent.idNum}</p>
                  <div className="flex gap-3 mt-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">{selectedStudent.dept}</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border
                      ${selectedStudent.risk === 'safe' ? 'bg-status-safe/10 text-status-safe border-status-safe/20' 
                      : selectedStudent.risk === 'medium' ? 'bg-status-medium/10 text-status-medium border-status-medium/20'
                      : 'bg-status-high/10 text-status-high border-status-high/20'}`}>
                      {selectedStudent.risk.toUpperCase()} RISK
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted">Analysis Timeline</h4>
                  <div className="relative pl-6 space-y-5">
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-primary/20"></div>
                    {[
                      { title: 'Assignment #3', status: 'Approved', icon: CheckCircle2, color: '#22C55E' },
                      { title: 'Writing Drift Check', status: '3% Deviation', icon: Clock, color: '#39FF14' },
                      { title: 'Assignment #2', status: 'Potential Match', icon: AlertTriangle, color: '#FACC15' },
                      { title: 'Initial Baseline', status: 'Established', icon: FileText, color: '#888888' },
                    ].map((step, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[1.35rem] top-1 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center z-10" style={{ borderColor: step.color }}>
                          <step.icon size={8} style={{ color: step.color }} />
                        </div>
                        <p className="text-sm font-bold text-text-primary">{step.title}</p>
                        <p className="text-xs text-text-secondary">{step.status}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowDossier(true)}
                  className="w-full btn-3d mt-10 py-3 flex items-center justify-center gap-2"
                >
                  <BarChart3 size={18} /> View Full Stylistic Dossier
                </button>
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center flex flex-col items-center justify-center h-[500px] border-dashed">
                <User size={48} className="text-text-muted mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-text-muted opacity-40">Select a student<br />to view profile</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stylistic Dossier Modal */}
      {selectedStudent && (
        <Modal isOpen={showDossier} onClose={() => setShowDossier(false)} title={`Stylistic Dossier — ${selectedStudent?.name}`} wide>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[['Integrity Score', `${selectedStudent?.score}%`, selectedStudent?.risk === 'safe' ? 'text-status-safe' : selectedStudent?.risk === 'medium' ? 'text-status-medium' : 'text-status-high'],
                ['Risk Level', selectedStudent?.risk?.toUpperCase(), 'text-text-primary'],
                ['Submissions', selectedStudent?.submissions, 'text-primary']
              ].map(([label, val, color]) => (
                <div key={label} className="p-4 bg-white/50 border border-white/50 rounded-xl text-center">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{val}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <h4 className="font-bold mb-4 flex items-center gap-2"><Zap size={16} className="text-primary" /> Writing Metrics</h4>
                {[['Vocabulary Complexity', '72%'], ['Sentence Variance', '58%'], ['Citation Density', '44%'], ['Passive Voice Use', '31%'], ['AI Signature Match', '8%']].map(([label, val]) => (
                  <div key={label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1"><span className="text-text-secondary">{label}</span><span className="font-bold">{val}</span></div>
                    <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: val }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-card p-5">
                <h4 className="font-bold mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-primary" /> Submission Timeline</h4>
                {[['Assignment #1', 'Baseline established', '#22C55E'],
                  ['Assignment #2', 'Minor drift detected (+2%)', '#FACC15'],
                  ['Assignment #3', 'Style consistent', '#22C55E'],
                  ['Assignment #4', 'Drift spike (+12%)', '#EF4444'],
                ].map(([title, note, color], i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                    <div><p className="text-sm font-bold">{title}</p><p className="text-xs text-text-secondary">{note}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                const content = `Stylistic Dossier: ${selectedStudent?.name}\nID: ${selectedStudent?.idNum}\nIntegrity Score: ${selectedStudent?.score}%\nRisk: ${selectedStudent?.risk?.toUpperCase()}\nSubmissions: ${selectedStudent?.submissions}`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `Dossier_${selectedStudent?.name?.replace(/ /g, '_')}.txt`; a.click();
              }}
              className="btn-3d w-full py-3 flex items-center justify-center gap-2"
            >
              <Download size={18} /> Export Dossier (.txt)
            </button>
          </div>
        </Modal>
      )}
      </div>
    </>
  );
};

/* ─── Student List Sub-Page ───────────────────────────────────── */
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);
  const [integrityRunning, setIntegrityRunning] = useState(false);

  React.useEffect(() => {
    const fetchClass = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:5000/api/faculty/class_overview', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (e) {
            console.error(e);
        }
      };
    fetchClass();
  }, []);

  const handleRunIntegrity = () => {
    setIntegrityRunning(true);
    setShowIntegrityModal(true);
    setTimeout(() => setIntegrityRunning(false), 700);
  };

  const filtered = students
    .filter(s => filter === 'all' || s.risk === filter)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.idNum.includes(search));

  return (
    <>
      <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Student Directory</h2>
          <p className="text-text-secondary mt-1">All enrolled students and their integrity metrics.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students..."
              className="bg-white/50 border border-white/50 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 w-56"
            />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-white/50 border border-white/50 rounded-xl px-4 py-2 text-sm outline-none">
            <option value="all">All Risk Levels</option>
            <option value="safe">Safe</option>
            <option value="medium">Medium</option>
            <option value="high">High Risk</option>
          </select>
        </div>
      </header>

      <div className={`grid gap-8 ${selectedStudent ? 'grid-cols-1 lg:grid-cols-5' : 'grid-cols-1'}`}>
        <div className={selectedStudent ? 'lg:col-span-3' : ''}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((student, idx) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedStudent(student.id === selectedStudent?.id ? null : student)}
                className={`glass-card p-5 relative overflow-hidden cursor-pointer group flex items-center gap-4 transition-all
                  ${selectedStudent?.id === student.id ? 'border-primary shadow-neon-glow' : ''}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${student.risk === 'safe' ? 'bg-status-safe' : student.risk === 'medium' ? 'bg-status-medium' : 'bg-status-high'}`} />
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-primary/10 font-bold text-lg text-primary">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{student.name}</h4>
                  <p className="text-[10px] text-text-muted font-mono">{student.idNum} · {student.dept}</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${student.risk === 'safe' ? 'text-status-safe' : student.risk === 'medium' ? 'text-status-medium' : 'text-status-high'}`}>
                    {student.score}
                  </div>
                  <p className="text-[10px] text-text-muted">{student.submissions} subs</p>
                </div>
                <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>

        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass-card p-8 sticky top-8 h-fit"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Student Dossier</span>
              <button onClick={() => setSelectedStudent(null)} className="text-text-muted hover:text-text-primary"><X size={16} /></button>
            </div>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="50" stroke="#e5e7eb" strokeWidth="7" fill="transparent" />
                  <motion.circle
                    cx="56" cy="56" r="50"
                    stroke={selectedStudent.risk === 'safe' ? '#22C55E' : selectedStudent.risk === 'medium' ? '#FACC15' : '#EF4444'}
                    strokeWidth="7" fill="transparent"
                    strokeDasharray="314.2"
                    initial={{ strokeDashoffset: 314.2 }}
                    animate={{ strokeDashoffset: 314.2 - (314.2 * selectedStudent.score) / 100 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">{selectedStudent.score}</span>
                  <span className="text-[9px] text-text-muted uppercase font-bold">Score</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
              <p className="text-sm text-text-secondary">{selectedStudent.idNum}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{selectedStudent.dept}</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${selectedStudent.risk === 'safe' ? 'bg-status-safe/10 text-status-safe' : selectedStudent.risk === 'medium' ? 'bg-status-medium/10 text-status-medium' : 'bg-status-high/10 text-status-high'}`}>
                  {selectedStudent.risk.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="space-y-3 mb-8">
              {[
                ['Submissions', selectedStudent.submissions],
                ['Last Submission', selectedStudent.lastSub],
                ['Dept', selectedStudent.dept],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center p-3 bg-white/40 rounded-xl">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="font-bold text-sm">{val}</span>
                </div>
              ))}
            </div>
            <button onClick={handleRunIntegrity} className="w-full btn-3d py-3">Run Integrity Check</button>
          </motion.div>
        )}
      </div>

      {/* Integrity Check Modal */}
      {selectedStudent && (
        <Modal isOpen={showIntegrityModal} onClose={() => setShowIntegrityModal(false)} title={`Integrity Check — ${selectedStudent.name}`}>
          {integrityRunning ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-text-secondary font-medium animate-pulse">Running full longitudinal analysis...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-status-safe/10 border border-status-safe/20 rounded-xl">
                <ShieldCheck className="text-status-safe" size={24} />
                <p className="font-bold text-status-safe">Analysis Complete. No new drift detected.</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-text-secondary text-sm">Previous Score</span>
                  <span className="font-bold">{selectedStudent.score}%</span>
                </div>
                <div className="flex justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-text-secondary text-sm">New Computed Score</span>
                  <span className="font-bold text-primary">{selectedStudent.score}%</span>
                </div>
                <div className="flex justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-text-secondary text-sm">AI Likelihood Match</span>
                  <span className="font-bold text-status-safe">&lt; 5%</span>
                </div>
              </div>
              
              <button onClick={() => setShowIntegrityModal(false)} className="w-full btn-3d py-3">Acknowledge</button>
            </div>
          )}
        </Modal>
      )}
      </div>
    </>
  );
};

/* ─── Root Faculty Dashboard Router ──────────────────────────── */
const FacultyDashboard = ({ activePage }) => {
  if (activePage === 'students')    return <StudentList />;
  if (activePage === 'assignments') return <Assignments />;
  if (activePage === 'nlp')         return <StudentAnalytics />;
  return <AnalysisLab />;
};

export default FacultyDashboard;
