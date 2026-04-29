import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
} from 'chart.js';
import { Radar, Line, Scatter } from 'react-chartjs-2';
import { BrainCircuit, Activity, Clock, ShieldAlert, AlertTriangle, TrendingUp, Cpu } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

/* ─── DUMMY DATA ───────────────────────────────────────────── */
const performanceData = [
  { id: 1, name: 'Assign 1', mark: 40 },
  { id: 2, name: 'Assign 2', mark: 42 },
  { id: 3, name: 'Assign 3', mark: 45 },
  { id: 4, name: 'Mid-Term', mark: 48 },
  { id: 5, name: 'Assign 4', mark: 90, isAnomaly: true },
  { id: 6, name: 'Final', mark: 92 },
];

const submissionData = [
  { name: 'Assign 1', timeOffset: -48 }, 
  { name: 'Assign 2', timeOffset: -24 },
  { name: 'Assign 3', timeOffset: -2 },
  { name: 'Assign 4', timeOffset: 5 },    
  { name: 'Mid-Term', timeOffset: -1 },
];

/* ─── MAIN COMPONENT ───────────────────────────────────────── */

const StudentAnalytics = () => {
  const [compareA, setCompareA] = useState('Assignment 1');
  const [compareB, setCompareB] = useState('Assignment 5');

  // ChartJS Data Configurations
  const radarDataChart = {
    labels: ['Vocab Complexity', 'Sentence Length', 'Syntax Similarity', 'Passive Voice', 'Citation Density'],
    datasets: [
      {
        label: compareA,
        data: [45, 50, 40, 30, 20],
        backgroundColor: 'rgba(136, 136, 136, 0.2)',
        borderColor: 'rgba(136, 136, 136, 1)',
        borderWidth: 2,
      },
      {
        label: compareB,
        data: [92, 85, 88, 15, 90],
        backgroundColor: 'rgba(124, 252, 0, 0.3)',
        borderColor: 'rgba(124, 252, 0, 1)',
        borderWidth: 2,
      },
    ],
  };

  const lineDataChart = {
    labels: performanceData.map(d => d.name),
    datasets: [
      {
        label: 'Marks',
        data: performanceData.map(d => d.mark),
        borderColor: '#7CFC00',
        backgroundColor: '#7CFC00',
        pointBackgroundColor: performanceData.map(d => d.isAnomaly ? '#EF4444' : '#7CFC00'),
        pointBorderColor: '#fff',
        pointRadius: performanceData.map(d => d.isAnomaly ? 6 : 4),
        pointHoverRadius: 8,
        tension: 0.4
      }
    ]
  };

  const scatterDataChart = {
    datasets: [
      {
        label: 'Hours from Deadline',
        data: submissionData.map((d, index) => ({
          x: index,
          y: d.timeOffset,
          name: d.name
        })),
        backgroundColor: submissionData.map(d => d.timeOffset > 0 ? '#EF4444' : '#22C55E'),
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const scatterOptions = {
    scales: {
      x: {
        type: 'category',
        labels: submissionData.map(d => d.name),
        grid: { display: false }
      },
      y: {
        title: { display: true, text: 'Hours (0 = Deadline)' },
        min: -72,
        max: 24
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw.y;
            return `${Math.abs(val)} hours ${val > 0 ? 'Late' : 'Early'}`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BrainCircuit className="text-primary" size={32} />
          Student Analytics & NLP Engine
        </h2>
        <p className="text-text-secondary mt-2">Deep forensic analysis of linguistic drift and behavioral anomalies.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. LONGITUDINAL COMPARISON ENGINE */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><Activity size={18} className="text-primary"/> Longitudinal Comparison</h3>
            <div className="flex items-center gap-2 text-sm">
              <select value={compareA} onChange={(e) => setCompareA(e.target.value)} className="bg-white/50 border border-white/50 rounded-lg px-2 py-1 outline-none font-medium">
                <option>Assignment 1</option>
                <option>Semester 1</option>
              </select>
              <span className="text-text-muted font-bold">vs</span>
              <select value={compareB} onChange={(e) => setCompareB(e.target.value)} className="bg-white/50 border border-white/50 rounded-lg px-2 py-1 outline-none font-medium">
                <option>Assignment 5</option>
                <option>Semester 3</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] relative">
            <Radar data={radarDataChart} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 100 } } }} />
            
            {/* Anomaly Alert */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-0 right-0 bg-status-high/10 border border-status-high/30 text-status-high px-3 py-2 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <ShieldAlert size={16} className="animate-pulse" />
              <div className="text-[10px] font-bold leading-tight">
                Sudden Style Change<br/>AI Tone Detected
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4. NLP WRITING STYLE ANALYSIS BOX */}
        <div className="glass-card p-6 border-primary/30 shadow-[0_0_30px_rgba(124,252,0,0.05)] flex flex-col">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-6"><Cpu size={18} className="text-primary"/> NLP Writing Style Analysis</h3>
          
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Human Probability</span>
                <span>12%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '12%' }} className="h-full bg-text-muted rounded-full" transition={{ duration: 1 }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-primary flex items-center gap-1"><BrainCircuit size={14} /> AI Probability</span>
                <span className="text-primary">88%</span>
              </div>
              <div className="h-3 bg-primary/20 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '88%' }} 
                  className="h-full bg-primary rounded-full relative overflow-hidden" 
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
                </motion.div>
              </div>
            </div>

            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Forensic Insights</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <TrendingUp className="text-status-high shrink-0 mt-0.5" size={16} />
                  <span>Student's vocabulary complexity increased by <strong className="text-status-high">400%</strong> between Assignment 2 and 4.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="text-status-medium shrink-0 mt-0.5" size={16} />
                  <span>Transition words (e.g., "Furthermore", "Consequently") usage mirrors GPT-4 base patterns.</span>
                </li>
              </ul>
            </div>
            
            <div className="text-xs text-text-muted font-mono mt-auto pt-4 border-t border-white/40">
              Data points: 4 Assignments, 2 Exams, 14,205 words processed.
            </div>
          </div>
        </div>

        {/* 2. PERFORMANCE TRACKING */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-6"><TrendingUp size={18} className="text-primary"/> Performance Trend Analysis</h3>
          <div className="h-[250px] w-full">
            <Line data={lineDataChart} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }} />
          </div>
        </div>

        {/* 3. SUBMISSION BEHAVIOR */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><Clock size={18} className="text-primary"/> Submission Behavior & Timing</h3>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-status-safe" /> Normal / Early</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-status-high" /> Late / Anomalous</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 h-[200px]">
              <Scatter data={scatterDataChart} options={{ ...scatterOptions, responsive: true, maintainAspectRatio: false }} />
            </div>
            
            <div className="w-full md:w-64 bg-status-high/5 border border-status-high/20 rounded-xl p-4 flex flex-col justify-center">
              <h4 className="text-xs font-bold uppercase tracking-widest text-status-high mb-2 flex items-center gap-1">
                <AlertTriangle size={14} /> Collusion Warning
              </h4>
              <p className="text-sm font-medium text-text-primary">Same-Time Submission Cluster detected on <strong>Assign 4</strong>.</p>
              <p className="text-xs text-text-secondary mt-2">Submitted within 45 seconds of <span className="font-mono bg-white px-1 rounded">ID-2024-118</span>.</p>
              <button className="mt-4 text-xs font-bold text-white bg-status-high py-2 rounded-lg w-full hover:bg-status-high/90 transition-colors">
                Investigate Ring
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentAnalytics;
