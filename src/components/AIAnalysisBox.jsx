import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

const AIAnalysisBox = ({ isAnalyzing, result, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      {isAnalyzing ? (
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-pulse flex items-center justify-center">
              <Zap size={40} className="text-primary animate-bounce" />
            </div>
            <motion.div 
              className="absolute inset-0 border-glow rounded-full shadow-[0_0_15px_#39FF14]"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <h3 className="text-2xl font-bold mb-2">Deep Neural Analysis...</h3>
          <p className="text-text-secondary text-sm animate-pulse">Scanning 14,202 linguistic markers against baseline</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-status-safe" />
              Analysis Complete
            </h3>
            <button 
              onClick={onReset}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
            >
              <RefreshCcw size={14} /> New Analysis
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/50 rounded-2xl p-6 border border-white/50 text-center">
              <p className="text-xs text-text-muted uppercase font-bold mb-2">Style Match</p>
              <div className="text-4xl font-bold text-primary">{result.styleScore}%</div>
              <p className="text-[10px] text-text-secondary mt-1">High Consistency</p>
            </div>
            
            <div className="bg-white/50 rounded-2xl p-6 border border-white/50 text-center">
              <p className="text-xs text-text-muted uppercase font-bold mb-2">Integrity Risk</p>
              <div className="text-4xl font-bold text-status-safe">{result.riskScore}%</div>
              <p className="text-[10px] text-text-secondary mt-1">Low deviation detected</p>
            </div>

            <div className="bg-white/50 rounded-2xl p-6 border border-white/50 text-center">
              <p className="text-xs text-text-muted uppercase font-bold mb-2">AI Probability</p>
              <div className="text-4xl font-bold text-status-safe">{result.aiProbability}%</div>
              <p className="text-[10px] text-text-secondary mt-1">Likely Human Written</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
            <AlertCircle size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-bold">Linguistic Fingerprint Verified</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                The submission aligns with the student's previous 12 assignments. No significant stylistic drift detected in sentence complexity or vocabulary breadth.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIAnalysisBox;
