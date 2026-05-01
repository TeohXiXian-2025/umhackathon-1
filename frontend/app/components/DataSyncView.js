'use client';

import { useState, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';

export default function DataSyncView() {
  const { setActiveView } = useNavigation();
  
  // Refs for hidden file inputs
  const structuredInputRef = useRef(null);
  const unstructuredInputRef = useRef(null);
  
  // Processing States: 'idle' | 'processing' | 'report'
  const [uploadState, setUploadState] = useState('idle');
  const [uploadedFile, setUploadedFile] = useState(null);

  // 'structured' | 'unstructured'
  const [reportType, setReportType] = useState(null); 

  // --- Handlers ---
  const handleStructuredClick = () => structuredInputRef.current?.click();
  const handleUnstructuredClick = () => unstructuredInputRef.current?.click();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setReportType(type);
    setUploadState('processing');

    // Simulate Upload and AI Parsing delay
    setTimeout(() => {
      setUploadState('report');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="animate-fadeInUp">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Data Ingestion & Audit Hub</h1>
          <p className="text-sm text-slate-400">Upload structured datasets or unstructured WhatsApp chat exports for AI processing.</p>
        </div>

        {/* Top Input Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Structured Data Upload Card */}
          <div className="bg-[#16161e] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-lg font-bold text-white">Structured Data Sync</h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">Sync batch CSV or Excel files (Attendance, Sales, Payroll) to update the Digital Twin.</p>

            <input 
              type="file" 
              ref={structuredInputRef} 
              onChange={(e) => handleFileChange(e, 'structured')} 
              accept=".csv, .xlsx, .json" 
              className="hidden" 
            />

            <div 
              onClick={handleStructuredClick}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all flex-1
                ${uploadState === 'processing' && reportType === 'structured'
                  ? 'border-blue-500/50 bg-blue-500/5' 
                  : 'border-white/10 hover:border-blue-500/50 hover:bg-white/5'}`}
            >
              {uploadState === 'processing' && reportType === 'structured' ? (
                <>
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-bold text-blue-400 mb-1">Mapping Columns...</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{uploadedFile?.name}</p>
                </>
              ) : uploadState === 'report' && reportType === 'structured' ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-emerald-400 mb-1">Upload Complete</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{uploadedFile?.name}</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">Upload CSV / Excel</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">SUPPORTS .CSV, .XLSX</p>
                </>
              )}
            </div>
          </div>

          {/* 2. WhatsApp Chat Audit Card */}
          <div className="bg-[#16161e] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h2 className="text-lg font-bold text-white">WhatsApp Chat Audit</h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">Upload a WhatsApp <code className="text-purple-300 bg-purple-900/30 px-1 py-0.5 rounded">_chat.txt</code> export. AI will filter noise and extract operational timelines.</p>

            <input 
              type="file" 
              ref={unstructuredInputRef} 
              onChange={(e) => handleFileChange(e, 'unstructured')} 
              accept=".txt" 
              className="hidden" 
            />

            <div 
              onClick={handleUnstructuredClick}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all flex-1
                ${uploadState === 'processing' && reportType === 'unstructured'
                  ? 'border-purple-500/50 bg-purple-500/5' 
                  : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'}`}
            >
              {uploadState === 'processing' && reportType === 'unstructured' ? (
                <>
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-bold text-purple-400 mb-1">AI NLP Extracting Context...</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{uploadedFile?.name}</p>
                </>
              ) : uploadState === 'report' && reportType === 'unstructured' ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-emerald-400 mb-1">Audit Complete</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{uploadedFile?.name}</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">Upload Chat Export</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">SUPPORTS .TXT EXPORTS</p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* --- INLINE REPORT SECTION --- */}
      {uploadState === 'report' && (
        <div className="pt-6 animate-fadeInUp border-t border-white/10 mt-8">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-white">AI Data Intake Report</h1>
            <span className="px-3 py-1 rounded border border-white/10 bg-white/5 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              SOURCE: {reportType === 'unstructured' ? 'MALLAM NLP TEXT ENGINE' : 'STRUCTURED DATA PARSER'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Parsed Summary Box */}
            <div className="bg-[#16161e] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <span>🎯</span> {reportType === 'unstructured' ? 'Extracted Important Points' : 'Parsed Document Summary'}
              </h3>
              
              <div className="space-y-4 flex-1">
                {reportType === 'unstructured' ? (
                  <>
                    <div className="bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
                      <span className="text-amber-500 mt-0.5">⚠️</span>
                      <p className="text-amber-500 font-semibold text-sm">J&T Logistics delay causing downstream warehouse bottleneck and idle staff.</p>
                    </div>
                    <div className="bg-red-950/20 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3">
                      <span className="text-red-500 mt-0.5">🚨</span>
                      <p className="text-red-500 font-semibold text-sm">Unplanned OT incurred due to late courier pickups.</p>
                    </div>
                    <div className="bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded-r-xl flex items-start gap-3">
                      <span className="text-blue-500 mt-0.5">ℹ️</span>
                      <p className="text-blue-500 font-semibold text-sm">Routine absences noted (Flat tire). Minimal operational impact.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-emerald-950/20 border-l-4 border-emerald-500 p-4 rounded-r-xl flex items-start gap-3">
                      <span className="text-emerald-500 mt-0.5">✅</span>
                      <p className="text-emerald-500 font-semibold text-sm">Successfully mapped 142 employee attendance records to database.</p>
                    </div>
                    <div className="bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
                      <span className="text-amber-500 mt-0.5">⚠️</span>
                      <p className="text-amber-500 font-semibold text-sm">Identified 3 overtime claims exceeding EA1955 statutory limits.</p>
                    </div>
                  </>
                )}
              </div>

              {/* Dynamic Action Button */}
              <button 
                onClick={() => setActiveView(reportType === 'unstructured' ? 'nlp' : 'anomaly')}
                className={`mt-6 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-colors ${
                  reportType === 'unstructured' ? 'text-purple-400' : 'text-blue-400'
                }`}
              >
                {reportType === 'unstructured' ? 'Review in NLP Engine' : 'Review in Anomaly Detector'}
              </button>
            </div>

            {/* Timeline / Events Box */}
            <div className="bg-[#16161e] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <span>📅</span> {reportType === 'unstructured' ? 'Detected Events & Timeline' : 'System Sync History'}
              </h3>

              <div className="pl-4 flex-1">
                {reportType === 'unstructured' ? (
                  <>
                    <div className="relative border-l-2 border-purple-900 pb-8 pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-purple-500 bg-[#16161e]"></div>
                      <span className="px-2 py-0.5 rounded bg-purple-900/30 text-[10px] text-purple-300 font-bold uppercase tracking-wider mb-2 inline-block">
                        DAY 1 (14:30)
                      </span>
                      <h4 className="text-white font-bold text-base mb-1">Courier Delay</h4>
                      <p className="text-slate-400 text-sm">J&T failed to arrive at scheduled time. Warehouse staff idle.</p>
                    </div>
                    <div className="relative border-l-2 border-red-900 pb-8 pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-red-500 bg-[#16161e]"></div>
                      <span className="px-2 py-0.5 rounded bg-red-900/30 text-[10px] text-red-300 font-bold uppercase tracking-wider mb-2 inline-block">
                        DAY 2 (20:00)
                      </span>
                      <h4 className="text-white font-bold text-base mb-1">Overtime Triggered</h4>
                      <p className="text-slate-400 text-sm">Staff forced to stay until 8 PM to complete delayed fulfillment.</p>
                    </div>
                  </>
                ) : (
                  <div className="relative border-l-2 border-blue-900 pb-8 pl-6">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-blue-500 bg-[#16161e]"></div>
                    <span className="px-2 py-0.5 rounded bg-blue-900/30 text-[10px] text-blue-300 font-bold uppercase tracking-wider mb-2 inline-block">
                      TODAY
                    </span>
                    <h4 className="text-white font-bold text-base mb-1">Batch Record Sync</h4>
                    <p className="text-slate-400 text-sm">File: {uploadedFile?.name || 'Dataset.csv'}</p>
                  </div>
                )}
                
                <div className="relative border-l-2 border-transparent pl-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-slate-700 bg-[#16161e]"></div>
                  <p className="text-xs text-slate-500 mt-1">End of Report</p>
                </div>
              </div>

              <button 
                onClick={() => setActiveView('dashboard')}
                className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-purple-900/20"
              >
                Return to Dashboard
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}