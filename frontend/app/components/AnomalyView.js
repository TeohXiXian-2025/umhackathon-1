'use client';

/**
 * PeopleGraph — Business Risk & Resolution Dashboard
 * ===================================================
 * Executive-level operational risk tracking with AI-driven
 * financial exposure and compliance monitoring.
 */

import React, { useState, useMemo } from 'react';

const mockThreats = [
  {
    id: 1,
    employee: 'Ahmad bin Ismail',
    dept: 'Warehouse',
    issue: 'OT Discrepancy',
    severity: 'high',
    impact: 'RM 1,200 Exposure',
    date: '2024-03-15',
    aiSummary: 'AI Analysis: Ahmad logged 14 hours OT over the weekend. This correlates directly with the manual waybill bottleneck delaying warehouse fulfillment.',
  },
  {
    id: 2,
    employee: 'Lee Wei Ming',
    dept: 'Warehouse',
    issue: 'OT Violation',
    severity: 'high',
    impact: 'Legal Compliance Risk',
    date: '2024-03-08',
    aiSummary: 'AI Analysis: Monthly OT exceeds 104-hour EA1955 cap: logged 118 hours. Immediate compliance review required to avoid statutory penalties.',
  },
  {
    id: 3,
    employee: 'Siti Aminah',
    dept: 'Sales',
    issue: 'Attendance Pattern',
    severity: 'medium',
    impact: 'RM 400 Exposure',
    date: '2024-03-12',
    aiSummary: 'AI Analysis: Clock-in at 08:59 every day for 30 consecutive days — statistically improbable. Potential attendance manipulation detected.',
  },
  {
    id: 4,
    employee: 'Nurul Huda',
    dept: 'Finance',
    issue: 'Unusual Claim',
    severity: 'low',
    impact: 'RM 150 Exposure',
    date: '2024-03-16',
    aiSummary: 'AI Analysis: Claim submitted for transport outside of normal working hours. Awaiting manager approval.',
  },
  {
    id: 5,
    employee: 'Raj Kumar',
    dept: 'Operations',
    issue: 'Missed Shifts',
    severity: 'medium',
    impact: 'RM 300 Exposure',
    date: '2024-03-18',
    aiSummary: 'AI Analysis: 2 consecutive no-call, no-show shifts. Productivity impact detected on operations floor.',
  }
];

export default function AnomalyView() {
  // Navigation & View States
  const [filter, setFilter] = useState('all'); // all | high | medium | low | resolved
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedThreat, setExpandedThreat] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Action States
  const [handledThreats, setHandledThreats] = useState([]);
  const [logModalData, setLogModalData] = useState(null);

  const severityConfig = {
    high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    resolved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  };

  // --- ACTION HANDLERS ---

  const handleWhatsApp = (threat) => {
    const phone = "60123456789"; 
    const firstName = threat.employee.split(' ')[0];
    const text = `Hi ${firstName}, the system flagged an issue regarding your recent logs (${threat.issue}). Let's discuss this today to sort it out.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleRejectOT = (threatId) => {
    setHandledThreats(prev => [...prev, threatId]);
    // If they resolve an item, clear it from being expanded so the UI feels snappy
    setExpandedThreat(null);
  };

  const handleViewLogs = (threat) => {
    setLogModalData(threat);
  };

  // --- DERIVED DATA & LOGIC ---

  const totalExposure = useMemo(() => {
    return mockThreats
      .filter(threat => !handledThreats.includes(threat.id))
      .reduce((sum, threat) => {
        const match = threat.impact.match(/[\d,]+/);
        if (match) {
          return sum + parseInt(match[0].replace(/,/g, ''), 10);
        }
        return sum; 
      }, 0);
  }, [handledThreats]);

  // NEW LOGIC: Separate Active vs Resolved
  const filteredThreats = useMemo(() => {
    return mockThreats.filter(threat => {
      const isHandled = handledThreats.includes(threat.id);
      
      const matchesSearch = 
        threat.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.dept.toLowerCase().includes(searchTerm.toLowerCase());
      
      // If we are looking at the "Resolved" tab, ONLY show handled items
      if (filter === 'resolved') {
        return matchesSearch && isHandled;
      }
      
      // Otherwise (All, High, Medium, Low), ONLY show UNHANDLED items
      const matchesSeverity = filter === 'all' || threat.severity === filter;
      return matchesSearch && !isHandled && matchesSeverity;
    });
  }, [searchTerm, filter, handledThreats]);

  const totalPages = Math.ceil(filteredThreats.length / itemsPerPage);
  const paginatedThreats = filteredThreats.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Operational Risk & Resolution Audit</h1>
        <p className="text-slate-400">AI-driven financial exposure and compliance tracking</p>
      </div>

      {/* KPI Cards - Expanded to 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">TOTAL ACTIVE THREATS</p>
          <p className="text-3xl font-bold text-white mt-2">
            {mockThreats.length - handledThreats.length}
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">HIGH SEVERITY</p>
          <p className="text-3xl font-bold text-red-400 mt-2">
            {mockThreats.filter(t => t.severity === 'high' && !handledThreats.includes(t.id)).length}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">RESOLVED (YTD)</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">
            {handledThreats.length}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-purple-500 rounded-t-xl"></div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">TOTAL FINANCIAL EXPOSURE</p>
          <p className="text-3xl font-bold text-white mt-2 transition-all">
            RM {totalExposure.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action Bar (Search & Filter) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search anomalies by name, dept, or issue..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              setExpandedThreat(null);
            }}
            className="w-full px-4 py-2.5 rounded-lg text-sm bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {/* Added 'Resolved' to the tabs */}
          {['all', 'high', 'medium', 'low', 'resolved'].map(f => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
                setExpandedThreat(null);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                filter === f
                  ? f === 'resolved' 
                    ? 'bg-emerald-600 text-white shadow-md' // Special green color for resolved tab
                    : 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Data Grid */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-black/40 border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="p-4 font-semibold w-24">Status</th>
              <th className="p-4 font-semibold">Employee & Dept</th>
              <th className="p-4 font-semibold">Flagged Issue</th>
              <th className="p-4 font-semibold text-right">Exposure</th>
              <th className="p-4 font-semibold text-center w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedThreats.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400 text-sm">
                  {filter === 'resolved' 
                    ? 'No resolved threats yet. Good luck!' 
                    : 'No anomalies found matching your criteria. All clear!'}
                </td>
              </tr>
            ) : (
              paginatedThreats.map(threat => {
                const isHandled = handledThreats.includes(threat.id);
                // If handled, use the resolved config. Otherwise, use its severity config.
                const cfg = isHandled ? severityConfig['resolved'] : severityConfig[threat.severity];
                const isExpanded = expandedThreat === threat.id;

                return (
                  <React.Fragment key={threat.id}>
                    {/* Main Row */}
                    <tr 
                      onClick={() => setExpandedThreat(isExpanded ? null : threat.id)}
                      className={`hover:bg-white/10 transition-colors cursor-pointer group ${isExpanded ? 'bg-white/5' : ''} ${isHandled ? 'opacity-70 bg-emerald-900/10' : ''}`}
                    >
                      <td className="p-4 align-middle">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {isHandled ? 'RESOLVED' : threat.severity}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <p className={`text-sm font-bold mb-0.5 ${isHandled ? 'text-emerald-100' : 'text-white'}`}>{threat.employee}</p>
                        <p className="text-xs text-slate-400">{threat.dept}</p>
                      </td>
                      <td className="p-4 align-middle">
                        <p className="text-sm text-slate-200 mb-0.5">{threat.issue}</p>
                        <p className="text-[10px] text-slate-500">{threat.date}</p>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <p className={`text-sm font-bold ${isHandled ? 'text-slate-500 line-through' : threat.severity === 'high' ? 'text-red-400' : threat.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'}`}>
                          {threat.impact}
                        </p>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <svg
                          className={`w-5 h-5 mx-auto text-slate-500 group-hover:text-white transition-transform duration-300 ${isExpanded ? 'rotate-180 text-purple-400' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </td>
                    </tr>

                    {/* Expanded Detail Sub-row */}
                    {isExpanded && (
                      <tr className="bg-black/30 border-b-2 border-purple-500/20">
                        <td colSpan="5" className="p-0">
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              
                              {/* AI Context Box */}
                              <div className="flex-1 bg-slate-900/80 border-l-4 border-purple-500 rounded-r-xl p-4 shadow-inner">
                                <div className="flex items-center gap-2 mb-2">
                                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">AI Forensic Analysis</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{threat.aiSummary}</p>
                              </div>

                              {/* Resolution Actions */}
                              <div className="flex flex-col justify-center gap-3 md:w-48 shrink-0">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleWhatsApp(threat); }}
                                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20"
                                >
                                  Message on WhatsApp
                                </button>
                                
                                {!isHandled && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleRejectOT(threat.id); }}
                                    className="w-full px-4 py-2 border border-red-500/50 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/10 transition-colors"
                                  >
                                    Mark as Resolved
                                  </button>
                                )}

                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleViewLogs(threat); }}
                                  className="w-full px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-700 hover:text-white transition-colors"
                                >
                                  View Full Logs
                                </button>
                              </div>

                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-black/40 border-t border-white/10 p-4 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-white">{filteredThreats.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredThreats.length)}</span> of <span className="font-semibold text-white">{filteredThreats.length}</span> Threats
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  setExpandedThreat(null);
                }}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  setExpandedThreat(null);
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- FORENSIC DATA LOG MODAL --- */}
      {logModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setLogModalData(null)}>
          <div 
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden animate-fadeInUp"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/20 text-purple-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Forensic Data Log</h2>
                  <p className="text-xs text-slate-400">Subject: <span className="font-semibold text-slate-300">{logModalData.employee}</span> | Event: {logModalData.date}</p>
                </div>
              </div>
              <button onClick={() => setLogModalData(null)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: Split Screen Comparison */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900">
              
              {/* Left Column: Official System Data */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Structured Data (Claimed)
                </h3>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 font-mono text-sm text-slate-300">
                  <p className="text-blue-400 mb-2 border-b border-slate-700 pb-2">payroll_system_export.csv</p>
                  <p><span className="text-slate-500">emp_id:</span> {logModalData.id}0042</p>
                  <p><span className="text-slate-500">date:</span> {logModalData.date}</p>
                  <p><span className="text-slate-500">clock_in:</span> 09:00:00 MYT</p>
                  <p><span className="text-slate-500">clock_out:</span> 23:00:00 MYT</p>
                  <p className="text-amber-400 font-bold mt-2"><span className="text-slate-500">ot_hours_claimed:</span> 14.0</p>
                  <p><span className="text-slate-500">status:</span> PENDING_APPROVAL</p>
                </div>
              </div>

              {/* Right Column: Unstructured Intercept Data */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Unstructured Data (Reality)
                </h3>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-sm text-slate-300">
                  <p className="text-purple-400 mb-2 border-b border-slate-700 pb-2 font-mono text-xs">whatsapp_group_intercept.json</p>
                  <div className="space-y-3 mt-3">
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-[10px] text-slate-500 mb-1">{logModalData.date} - 16:30 MYT</p>
                      <p className="text-slate-200">"{logModalData.employee.split(' ')[0]}: Boss, waybill printer jam lagi. Nak kena tunggu IT fix, kitorang lepak mamak jap."</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-[10px] text-slate-500 mb-1">{logModalData.date} - 21:15 MYT</p>
                      <p className="text-slate-200">"{logModalData.employee.split(' ')[0]}: Ok dah setel print, baru start packing ni."</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-black/20 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setLogModalData(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors border border-slate-600"
              >
                Close Audit Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}