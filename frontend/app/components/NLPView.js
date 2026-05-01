'use client';

/**
 * PeopleGraph — Manglish NLP Engine
 * ==================================
 * Process unstructured Malaysian text for immediate business decisions.
 */

import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

const manglishDict = {
  'budak': 'staff/workers',
  'mc': 'medical leave',
  'harini': 'today',
  'semalam': 'yesterday',
  'tak': 'not',
  'jalan': 'moving/working',
  'lagi': 'yet/again',
  'gila': 'crazy',
  'babi': '(intensifier/slang)',
  'byk': 'a lot of',
  'sbb': 'because of',
  'camne': 'how to handle',
  'macamana': 'how to handle',
  'ni': 'this',
  'jap': 'briefly/wait',
  'setel': 'resolved/settled',
  'lambat': 'late',
  'dah': 'already',
  'full': 'at capacity',
};

const HighlightedText = ({ text }) => {
  const words = text.split(/(\s+)/); 
  return (
    <p className="text-slate-300 text-sm italic leading-relaxed">
      {words.map((word, index) => {
        const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
        const translation = manglishDict[cleanWord];
        if (translation) {
          return (
            <span key={index} className="relative group/word inline-block cursor-help">
              <span className="text-purple-400 border-b border-dashed border-purple-500/50 bg-purple-500/10 px-0.5 rounded">
                {word}
              </span>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-800 border border-slate-600 text-xs text-slate-200 rounded opacity-0 group-hover/word:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                Normalized: <span className="font-bold text-emerald-400">{translation}</span>
              </span>
            </span>
          );
        }
        return <span key={index}>{word}</span>;
      })}
    </p>
  );
};

export default function NLPView() {
  const { setActiveView } = useNavigation();

  const [discoveredFlags] = useState([
    {
      id: 1,
      threat: 'CRITICAL',
      department: 'Warehouse & Logistics',
      issue: '3 Staff Absent (MC) + High Raya Volume backlog. J&T processing halted.',
      action: 'Deploy 2 Temp Staff',
      targetTab: 'simulation', // Routes to Digital Twin
      source: 'Logistics WhatsApp Group • 04:00 PM',
      raw: 'Boss, budak warehouse 3 orang MC harini. Barang J&T semalam tak jalan lagi. Gila babi byk order masuk sbb Raya. Camne ni?',
    },
    {
      id: 2,
      threat: 'WARNING',
      department: 'Admin & Finance',
      issue: 'Unstructured logs contradict official overtime claims. 14.0h mismatch detected.',
      action: 'Audit OT Claim',
      targetTab: 'anomaly', // Routes to Anomaly Detector
      source: 'Admin Ops Chat • Uploaded Just Now',
      raw: 'Ahmad kata dia setel waybill printer semalam sampai tengah malam, tapi tak nampak chat pun?',
    },
    {
      id: 3,
      threat: 'INFO',
      department: 'Marketing',
      issue: 'Low designer utilization detected in off-season. Opportunity to reduce fixed overhead.',
      action: 'Setup Freelance Escrow',
      targetTab: 'blockchain', // Routes to Escrow Ledger
      source: 'Creative Team Chat • Uploaded 2h ago',
      raw: 'Boss, designer kita rileks jap sbb takde campaign baru bulan ni. Rehat jap la.',
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
      
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400">Logs Processed (7 Days):</span>
              <span className="text-white font-semibold ml-2">1,248</span>
            </div>
            <div>
              <span className="text-slate-400">Primary Sentiment:</span>
              <span className="text-amber-400 font-semibold ml-2">High Stress (Logistics)</span>
            </div>
            <div>
              <span className="text-slate-400">Unresolved Flags:</span>
              <span className="text-red-400 font-semibold ml-2">{discoveredFlags.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1" style={{ scrollbarWidth: 'thin' }}>
        <div className="flex flex-col gap-6">
          {discoveredFlags.map((msg) => (
            <div key={msg.id} className="bg-[#16161e] border border-gray-800 rounded-3xl p-5 shadow-sm animate-fadeInUp">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                <span className={`font-bold px-3 py-1 rounded-full text-xs border ${
                  msg.threat === 'CRITICAL' 
                    ? 'bg-red-900/50 text-red-400 border-red-500/30' 
                    : msg.threat === 'WARNING'
                    ? 'bg-amber-900/50 text-amber-400 border-amber-500/30'
                    : 'bg-blue-900/50 text-blue-400 border-blue-500/30'
                }`}>
                  🚨 {msg.threat}: {msg.department}
                </span>
                <button 
                  onClick={() => setActiveView(msg.targetTab)}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-4 py-2 rounded-lg transition-colors font-semibold shadow-lg shadow-purple-900/20"
                >
                  {msg.action}
                </button>
              </div>

              <div className="mb-5">
                <p className="text-white text-base font-semibold leading-7">
                  Core Issue: {msg.issue}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Captured Raw Evidence ({msg.source})</p>
                <div className="bg-[#0d0d12] p-3 rounded text-gray-400 text-sm italic group/box">
                  <HighlightedText text={msg.raw} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}