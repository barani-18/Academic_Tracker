import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, Clock, FileText, Search, BookOpen, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';

const StudentDashboard = ({ activePage }) => {
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api').replace(/\/$/, '');
  const [profile, setProfile] = useState({ name: 'Loading...', studentId: '...' });
  const [courses, setCourses] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Profile
        const profRes = await fetch(`${API_BASE}/student/profile`, { headers });
        if (profRes.ok) setProfile(await profRes.json());

        // Courses
        const courseRes = await fetch(`${API_BASE}/student/courses`, { headers });
        if (courseRes.ok) {
            const data = await courseRes.json();
            setCourses(data);
            if (data.length > 0) setSelectedCourse(data[0].id);
        }

        // History
        const histRes = await fetch(`${API_BASE}/student/history`, { headers });
        if (histRes.ok) setSubmissions(await histRes.json());
      } catch (err) {
        console.error("Failed to fetch student data", err);
      }
    };
    fetchData();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = async () => {
    if (!fileName) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      // For now, mapping course text to assignment_id 1 just to simulate submission. 
      // In a real app we'd fetch actual assignment IDs.
      const res = await fetch(`${API_BASE}/student/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          assignment_id: 1, // Mock assignment ID
          title: fileName,
          text_content: "This is a simulated file submission content for " + fileName
        })
      });
      
      setIsSubmitting(false);
      
      if (res.ok) {
        setShowSuccessModal(true);
        // Refresh history
        const historyRes = await fetch('http://127.0.0.1:5000/api/student/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (historyRes.ok) {
          const data = await historyRes.json();
          setSubmissions(data);
        }
        setFileName('');
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (activePage === 'settings') {
    return (
      <div className="flex flex-col h-full space-y-8 pb-12">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Student Settings</h2>
          <p className="text-text-secondary mt-1">Manage your account preferences and notifications.</p>
        </header>
        <div className="glass-card p-8 max-w-2xl">
          <h3 className="text-xl font-bold mb-6">Profile Information</h3>
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-text-muted">Full Name</label><p className="font-medium">{profile.name}</p></div>
            <div><label className="text-xs font-bold text-text-muted">Student ID</label><p className="font-medium">{profile.studentId}</p></div>
            <div><label className="text-xs font-bold text-text-muted">Email</label><p className="font-medium">{profile.email}</p></div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20">
            <h3 className="text-xl font-bold mb-4">Notifications</h3>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
              <span>Email me when integrity analysis is complete</span>
            </label>
          </div>
          <button className="btn-3d px-8 py-3 mt-8">Save Preferences</button>
        </div>
      </div>
    );
  }

  if (activePage === 'history') {
    return (
      <div className="space-y-8 pb-12">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Full Submission History</h2>
          <p className="text-text-secondary mt-1">Review all your past submissions and their AI-generated risk profiles.</p>
        </header>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Assignment</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Course</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Integrity Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Risk</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length > 0 ? (
                submissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-white/20 hover:bg-white/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <FileText size={16} className="text-primary" />
                        </div>
                        <span className="font-bold text-sm">{sub.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">{sub.course}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(sub.submitted_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${sub.status === 'Analyzed' ? 'bg-status-safe' : 'bg-status-medium animate-pulse'}`} />
                        <span className="text-xs font-bold">{sub.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${sub.risk === 'Safe' ? 'bg-status-safe/10 text-status-safe' : sub.risk === 'Medium' ? 'bg-status-medium/10 text-status-medium' : 'bg-status-high/10 text-status-high'}`}>
                        {sub.risk}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-muted italic">
                    No submissions found in your history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 pb-12">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Student Portal</h2>
            <p className="text-text-secondary mt-1">Submit your assignments for integrity analysis and review past submissions.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/40 border border-white/50 px-4 py-2 rounded-xl">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
              {profile.name?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm">{profile.name}</p>
              <p className="text-[10px] text-text-muted font-mono">{profile.studentId}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Portal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Upload className="text-primary" size={20} /> New Assignment Submission
              </h3>
              
              <div className="mb-6 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Select Course</label>
                <select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.name} ({course.instructor})
                    </option>
                  ))}
                </select>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl transition-all duration-300 relative overflow-hidden
                  ${dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-primary/20 bg-primary/[0.02]'}`}
              >
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${dragging ? 'bg-primary/30 scale-110' : 'bg-primary/10'}`}>
                    <FileText size={28} className="text-primary" />
                  </div>
                  
                  {fileName ? (
                    <div className="space-y-4">
                      <p className="text-lg text-primary font-bold">📄 {fileName}</p>
                      <p className="text-text-secondary text-sm">File ready for submission.</p>
                      <button 
                        onClick={() => setFileName('')} 
                        className="text-xs text-status-high hover:underline font-bold uppercase"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold mb-2">Drag & Drop Your File Here</h3>
                      <p className="text-text-secondary text-sm mb-6 max-w-md">
                        Please upload your assignment in PDF, DOCX, or TXT format. Ensure your work is final before submitting.
                      </p>
                      <label className="cursor-pointer px-6 py-2 rounded-xl border border-primary/30 text-primary font-bold hover:bg-primary/10 transition-all text-sm shadow-sm inline-block">
                        Browse Files
                        <input type="file" className="hidden" onChange={e => setFileName(e.target.files[0]?.name || '')} />
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSubmit} 
                  disabled={!fileName || isSubmitting}
                  className={`btn-3d px-10 py-3 text-sm flex items-center gap-2 ${(!fileName || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Encrypting & Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> Submit to Analysis Lab
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-status-medium/5 border border-status-medium/20 rounded-xl flex gap-3 text-status-medium">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold mb-1">Academic Integrity Notice</p>
                <p className="opacity-90 leading-relaxed">By submitting this assignment, you confirm that this is your original work. All submissions are automatically processed by our Longitudinal Behavioral Integrity Analytics engine.</p>
              </div>
            </div>
          </div>

          {/* Submission History Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 h-full">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
                <Clock size={16} /> Recent Submissions
              </h3>
              
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={sub.id} 
                    className="p-4 bg-white/40 border border-white/50 rounded-xl hover:bg-white/60 transition-colors cursor-default"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                        {sub.course || 'Course'}
                      </span>
                      <span className="text-[10px] text-text-muted font-medium">
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-text-primary leading-tight mb-3 line-clamp-1" title={sub.title}>
                      {sub.title}
                    </p>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-white/30">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Pending Analysis' ? 'bg-status-medium animate-pulse' : 'bg-status-safe'}`} />
                        <span className="text-[10px] font-bold text-text-secondary">{sub.status}</span>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider
                        ${sub.risk === 'Safe' ? 'text-status-safe' : sub.risk === 'Medium' ? 'text-status-medium' : 'text-text-muted'}`}>
                        {sub.risk === 'Pending' ? '...' : `${sub.risk} RISK`}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-2 text-xs font-bold text-primary hover:underline transition-all">
                View All Submission History
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Submission Successful">
        <div className="py-6 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-status-safe/10 rounded-full flex items-center justify-center border border-status-safe/20 mb-2">
            <CheckCircle2 size={40} className="text-status-safe" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">Assignment Received</h3>
          <p className="text-text-secondary text-sm max-w-sm">
            Your assignment has been securely transmitted to the Faculty Analysis Lab. You can track its status in your submission history.
          </p>
          <button onClick={() => setShowSuccessModal(false)} className="btn-3d w-full mt-6 py-3">
            Return to Dashboard
          </button>
        </div>
      </Modal>
    </>
  );
};

export default StudentDashboard;
