'use client';

/**
 * PeopleGraph — Freelance & Temp Escrow Ledger
 * ==============================================
 * Smart contract milestone payments for flexible workforce.
 */

import { useState, useMemo } from 'react';

const initialContracts = [
  {
    id: 'ESC-1042',
    worker: 'Sarah Wong (Graphic Designer)',
    amount: 3000,
    status: 'escrowed',
    milestone: 'Deliver Q4 Marketing Assets (Drafts)',
    created: '2024-03-15',
    expires: '2024-03-22',
  },
  {
    id: 'ESC-1043',
    worker: 'Agensi Pekerjaan Boleh (Raya Temp Packers - 2 Pax)',
    amount: 3600,
    status: 'escrowed',
    milestone: '14 Days Warehouse Fulfillment',
    created: '2024-03-12',
    expires: '2024-03-26',
  },
  {
    id: 'ESC-1044',
    worker: 'Jason Lee (IT Contractor)',
    amount: 5000,
    status: 'released',
    milestone: 'POS System Migration',
    created: '2024-03-10',
    expires: '2024-04-10',
    completedAt: '2024-03-20',
  },
  {
    id: 'ESC-1045',
    worker: 'Ahmad bin Ismail (Freelance Copywriter)',
    amount: 1500,
    status: 'disputed',
    milestone: 'Raya Campaign Social Media Copy',
    created: '2024-03-16',
    expires: '2024-03-20',
  },
  {
    id: 'ESC-1046',
    worker: 'TechFix Solutions (Network Setup)',
    amount: 8200,
    status: 'escrowed',
    milestone: 'Branch Office Wi-Fi Migration',
    created: '2024-03-18',
    expires: '2024-04-05',
  }
];

export default function BlockchainView() {
  // Core Data State
  const [contracts, setContracts] = useState(initialContracts);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  // New Contract Form State
  const [newContract, setNewContract] = useState({
    worker: '',
    role: '',
    amount: '',
    milestone: ''
  });

  const statusConfig = {
    escrowed: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'ESCROWED' },
    released: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'RELEASED' },
    disputed: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'DISPUTED' },
  };

  // --- ACTIONS ---

  const handleRelease = (id) => {
    setContracts(prev => prev.map(contract => {
      if (contract.id === id) {
        return { 
          ...contract, 
          status: 'released', 
          completedAt: new Date().toISOString().split('T')[0] 
        };
      }
      return contract;
    }));
  };

  const handleDispute = (id) => {
    setContracts(prev => prev.map(contract => {
      if (contract.id === id) {
        return { ...contract, status: 'disputed' };
      }
      return contract;
    }));
  };

  const handleCreateContract = (e) => {
    e.preventDefault();
    
    // Generate a random ID for the mock
    const randomId = `ESC-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date();
    const expires = new Date(today);
    expires.setDate(today.getDate() + 14); // Default to 14 days expiration

    const contractToAdd = {
      id: randomId,
      worker: `${newContract.worker} (${newContract.role})`,
      amount: parseFloat(newContract.amount),
      status: 'escrowed',
      milestone: newContract.milestone,
      created: today.toISOString().split('T')[0],
      expires: expires.toISOString().split('T')[0]
    };

    // Add to top of list
    setContracts(prev => [contractToAdd, ...prev]);
    
    // Reset form and close modal
    setNewContract({ worker: '', role: '', amount: '', milestone: '' });
    setIsModalOpen(false);
    setCurrentPage(1); // Jump back to first page to see the new contract
  };

  // --- DERIVED DATA (Calculated automatically when state changes) ---

  const totalEscrowed = useMemo(() => 
    contracts.filter(c => c.status === 'escrowed').reduce((s, c) => s + c.amount, 0)
  , [contracts]);

  const activeContracts = useMemo(() => 
    contracts.filter(c => c.status === 'escrowed').length
  , [contracts]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = 
        contract.worker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.milestone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Freelance & Temp Escrow Ledger</h1>
        <p className="text-slate-400">Smart contract milestone payments for flexible workforce</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all">
          <p className="text-xs text-slate-400 uppercase tracking-wider">TOTAL FUNDS ESCROWED</p>
          <p className="text-3xl font-bold text-amber-400 mt-2">RM {totalEscrowed.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>
          <p className="relative text-xs text-slate-400 uppercase tracking-wider">OVERHEAD SAVED (YTD)</p>
          <p className="relative text-3xl font-bold text-white mt-2">RM 15,000</p>
          <p className="relative text-xs text-slate-400 mt-1">Vs. full-time equivalent payroll</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all">
          <p className="text-xs text-slate-400 uppercase tracking-wider">ACTIVE CONTRACTS</p>
          <p className="text-3xl font-bold text-white mt-2">{activeContracts}</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full flex gap-4">
          <input
            type="text"
            placeholder="Search contracts or IDs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-3 rounded-xl text-sm bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:border-purple-500 focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 rounded-xl text-sm bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="escrowed">Escrowed</option>
            <option value="released">Released</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(139,92,246,0.2)]"
        >
          + Create Escrow Contract
        </button>
      </div>

      {/* Modern Data Grid */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-black/20 border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="p-4 font-semibold">Contract / Talent</th>
              <th className="p-4 font-semibold">Milestone</th>
              <th className="p-4 font-semibold">Timeline</th>
              <th className="p-4 font-semibold">Value & Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedContracts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400 text-sm">
                  No contracts found matching your filters.
                </td>
              </tr>
            ) : (
              paginatedContracts.map((contract) => {
                const cfg = statusConfig[contract.status];
                const workerParts = contract.worker.split(' (');
                const name = workerParts[0];
                const role = workerParts[1] ? workerParts[1].replace(')', '') : 'Independent Contractor';

                return (
                  <tr key={contract.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white">{name}</p>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-400 border border-slate-700">
                          {contract.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{role}</p>
                    </td>

                    <td className="p-4 align-top">
                      <p className="text-sm text-slate-300 max-w-xs truncate" title={contract.milestone}>
                        {contract.milestone}
                      </p>
                    </td>

                    <td className="p-4 align-top">
                      <p className="text-xs text-slate-400">
                        Created: <span className="text-slate-300">{contract.created}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Expires: <span className="text-slate-300">{contract.expires}</span>
                      </p>
                    </td>

                    <td className="p-4 align-top">
                      <p className="text-sm font-bold text-white mb-1">
                        RM {contract.amount.toLocaleString()}
                      </p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${cfg.bg} ${cfg.text} border border-current`}>
                        {cfg.label}
                      </span>
                    </td>

                    <td className="p-4 align-top text-right">
                      {contract.status === 'escrowed' && (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleRelease(contract.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          >
                            Release
                          </button>
                          <button 
                            onClick={() => handleDispute(contract.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            Dispute
                          </button>
                        </div>
                      )}
                      {contract.status === 'released' && (
                        <div className="flex items-center justify-end gap-1.5 mt-1">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs font-semibold text-emerald-400">Cleared</span>
                        </div>
                      )}
                      {contract.status === 'disputed' && (
                        <div className="flex items-center justify-end gap-1.5 mt-1">
                          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-xs font-semibold text-red-400">Under Review</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-black/20 border-t border-white/10 p-4 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-white">{filteredContracts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredContracts.length)}</span> of <span className="font-semibold text-white">{filteredContracts.length}</span> Contracts
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- CREATE CONTRACT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeInUp">
            <h2 className="text-xl font-bold text-white mb-4">New Escrow Contract</h2>
            
            <form onSubmit={handleCreateContract} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Talent Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={newContract.worker}
                  onChange={(e) => setNewContract({...newContract, worker: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Role / Service</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Graphic Designer"
                  value={newContract.role}
                  onChange={(e) => setNewContract({...newContract, role: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Escrow Amount (RM)</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  placeholder="e.g. 5000"
                  value={newContract.amount}
                  onChange={(e) => setNewContract({...newContract, amount: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Milestone Deliverable</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Complete Website Redesign"
                  value={newContract.milestone}
                  onChange={(e) => setNewContract({...newContract, milestone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 border border-transparent transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20"
                >
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}