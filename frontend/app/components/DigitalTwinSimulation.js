'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const BASE_DEPTS = [
  { id: 'sales', name: 'Sales & Marketing', color: '#8B5CF6', headcount: 4 },
  { id: 'warehouse', name: 'Warehouse & Logistics', color: '#10B981', headcount: 5 },
  { id: 'admin', name: 'Admin & Finance', color: '#F59E0B', headcount: 3 },
  { id: 'support', name: 'Client Success', color: '#3B82F6', headcount: 2 },
];

export default function DigitalTwinSimulation() {
  const canvasRef = useRef(null);
  
  const [selectedDept, setSelectedDept] = useState('sales');
  const [headcountAddition, setHeadcountAddition] = useState(1);
  const [avgSalary, setAvgSalary] = useState(5000);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 3-Strategy Decision Engine State
  const [selectedStrategy, setSelectedStrategy] = useState('hire'); 
  const [monthlyRetainer, setMonthlyRetainer] = useState(5000);
  const [upfrontSoftwareCost, setUpfrontSoftwareCost] = useState(15000);
  const [efficiencyGain, setEfficiencyGain] = useState(50);

  // Loading & Success States
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSimulatingManual, setIsSimulatingManual] = useState(false);
  const [manualSuccess, setManualSuccess] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoadingAI(true);
      setTimeout(() => {
        setDashboardData({
          department_split: {
            items: [
              { department_name: 'Sales & Marketing', employee_count: 4, revenue_rm: 245000 },
              { department_name: 'Warehouse & Logistics', employee_count: 5, revenue_rm: 0 },
              { department_name: 'Admin & Finance', employee_count: 3, revenue_rm: 0 },
              { department_name: 'Client Success', employee_count: 2, revenue_rm: 42000 }
            ]
          }
        });
        setIsLoadingAI(false);
      }, 500);
    };
    loadDashboardData();
  }, []);

  const isDominoWarning = selectedDept === 'sales' && selectedStrategy === 'hire' && headcountAddition >= 1 && !isOptimized;

  const strategyCalculations = useMemo(() => {
    const calculations = {};
    if (selectedStrategy === 'hire') {
      calculations.trueLaborCost = headcountAddition * avgSalary * 1.13;
      calculations.monthlyCost = calculations.trueLaborCost;
      calculations.breakEvenMonths = null; 
    } else if (selectedStrategy === 'outsource') {
      calculations.trueLaborCost = monthlyRetainer;
      calculations.monthlyCost = monthlyRetainer;
      calculations.breakEvenMonths = null; 
    } else if (selectedStrategy === 'automate') {
      calculations.upfrontCost = upfrontSoftwareCost;
      const currentDeptSalary = BASE_DEPTS.find(d => d.id === selectedDept)?.headcount * 5000 || 5000;
      const monthlySavings = currentDeptSalary * (efficiencyGain / 100);
      calculations.monthlySavings = monthlySavings;
      calculations.breakEvenMonths = upfrontSoftwareCost / monthlySavings;
      calculations.trueLaborCost = upfrontSoftwareCost; 
      calculations.monthlyCost = 0; 
    }
    return calculations;
  }, [selectedStrategy, headcountAddition, avgSalary, monthlyRetainer, upfrontSoftwareCost, efficiencyGain, selectedDept]);

  const strategyAlert = useMemo(() => {
    if (manualSuccess) {
      return {
        text: `✅ SCENARIO SAVED: Simulated changes applied to ${BASE_DEPTS.find(d => d.id === selectedDept)?.name} digital twin.`,
        tone: 'success',
        icon: '✨',
      };
    }

    if (selectedStrategy === 'hire') {
      if (isDominoWarning) {
        return {
          text: '⚠️ STATUTORY RISK: Adding sales capacity exceeds warehouse limits. Projected 4-day fulfillment lag.',
          tone: 'danger',
          icon: '🚨',
        };
      }
      return {
        text: `💼 HIRE STRATEGY: True labor cost RM ${strategyCalculations.trueLaborCost?.toLocaleString()} (includes 13% statutory).`,
        tone: 'info',
        icon: '👥',
      };
    } else if (selectedStrategy === 'outsource') {
      return {
        text: `🔄 OUTSOURCE STRATEGY: Monthly retainer RM ${monthlyRetainer.toLocaleString()}. SLA quality monitoring recommended.`,
        tone: 'warning',
        icon: '📋',
      };
    } else if (selectedStrategy === 'automate') {
      const breakEven = strategyCalculations.breakEvenMonths;
      const tone = breakEven <= 6 ? 'success' : breakEven <= 12 ? 'warning' : 'danger';
      return {
        text: `🤖 AUTOMATE STRATEGY: Break-even in ${breakEven?.toFixed(1)} months. ${efficiencyGain}% efficiency gain projected.`,
        tone,
        icon: '⚡',
      };
    }
    return null;
  }, [selectedStrategy, isDominoWarning, strategyCalculations, monthlyRetainer, efficiencyGain, manualSuccess, selectedDept]);

  const nodeTone = useMemo(() => {
    if (isOptimized) return { sales: 'normal', warehouse: 'healthyPulse', admin: 'normal', support: 'normal' };
    if (isDominoWarning) return { sales: 'salesBoost', warehouse: 'bottleneckPulse', admin: 'normal', support: 'normal' };
    return { sales: 'normal', warehouse: 'normal', admin: 'normal', support: 'normal' };
  }, [isDominoWarning, isOptimized]);

  const nodeStrategyStyle = useMemo(() => {
    const styles = {};
    BASE_DEPTS.forEach(dept => {
      if (dept.id === selectedDept) {
        if (selectedStrategy === 'hire') {
          styles[dept.id] = { radiusMultiplier: 1.3, strokeDasharray: 'none', filter: 'none' };
        } else if (selectedStrategy === 'outsource') {
          styles[dept.id] = { radiusMultiplier: 1.0, strokeDasharray: '5,5', filter: 'none' };
        } else if (selectedStrategy === 'automate') {
          styles[dept.id] = { radiusMultiplier: 1.0, strokeDasharray: 'none', filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' };
        }
      } else {
        styles[dept.id] = { radiusMultiplier: 1.0, strokeDasharray: 'none', filter: 'none' };
      }
    });
    return styles;
  }, [selectedDept, selectedStrategy]);

  const linkTension = useMemo(() => {
    const tensions = {};
    const links = [
      { source: 'sales', target: 'warehouse' },
      { source: 'sales', target: 'support' },
      { source: 'warehouse', target: 'admin' },
      { source: 'admin', target: 'support' },
    ];

    links.forEach(link => {
      const isBottleneck = selectedStrategy === 'hire' && selectedDept === 'sales' && link.source === 'sales' && link.target === 'warehouse';
      tensions[`${link.source}-${link.target}`] = {
        stroke: isBottleneck ? '#ef4444' : 'rgba(139,92,246,0.26)',
        strokeWidth: isBottleneck ? 4 : 2,
        strokeDasharray: isBottleneck ? 'none' : '7 5'
      };
    });

    return tensions;
  }, [selectedStrategy, selectedDept]);

  // HACKATHON MAGIC: Dynamic calculations for AI numbers AND text insights!
  const inspectorData = useMemo(() => {
    if (!dashboardData) return null;

    const baseHeadcountMap = { sales: 4, warehouse: 5, admin: 3, support: 2 };
    const baseProdMap = { sales: 88, warehouse: 74, admin: 92, support: 85 };
    const revenueMap = { sales: 245000, warehouse: 0, admin: 0, support: 42000 };

    const getSimHeadcount = (id) => baseHeadcountMap[id] + (selectedDept === id && selectedStrategy === 'hire' ? headcountAddition : 0);
    
    const getSimProd = (id) => {
      let prod = baseProdMap[id];
      if (selectedDept === id) {
        if (selectedStrategy === 'automate') {
          prod += efficiencyGain; 
        } else if (selectedStrategy === 'hire') {
          if (id === 'warehouse') prod += (headcountAddition * 5); 
          else prod -= (headcountAddition * 2); 
        } else if (selectedStrategy === 'outsource') {
          prod -= 4; 
        }
      }
      return Math.min(100, Math.max(0, prod));
    };

    const getSimRevenue = (id) => {
      let rev = revenueMap[id];
      if (selectedDept === id && selectedStrategy === 'hire') {
        if (id === 'sales') rev += (headcountAddition * 65000); 
        if (id === 'support') rev += (headcountAddition * 12000); 
      }
      return rev;
    };

    // Dynamic Status Text Generator
    const getSimStatus = (id, baseStatus) => {
      if (selectedDept !== id) return baseStatus;
      if (selectedStrategy === 'hire' && headcountAddition > 0) {
        if (id === 'warehouse') return headcountAddition >= 3 ? 'RESOLVED ✅' : 'RECOVERING 📈';
        if (id === 'sales') return 'OVERSTAFFED RISK ⚠️';
      }
      if (selectedStrategy === 'automate' && efficiencyGain > 0) return 'HIGH EFFICIENCY ⚡';
      return baseStatus;
    };

    // Dynamic Paragraph Generator
    const getSimInsight = (id, baseInsight) => {
      if (selectedDept !== id) return baseInsight;
      if (selectedStrategy === 'hire' && headcountAddition > 0) {
        if (id === 'warehouse') {
          return headcountAddition >= 3 
            ? `Fully staffed for Raya peak volume. Fulfillment capacity optimized to ${getSimProd('warehouse')}%.`
            : `Capacity improving. Still short ${3 - headcountAddition} head(s) to completely clear the Raya peak bottleneck.`;
        }
        if (id === 'sales') return `Adding sales headcount without fixing the warehouse bottleneck will increase refund rates.`;
      }
      if (selectedStrategy === 'automate' && efficiencyGain > 0) {
        return `Automation deployed. Productivity increased by ${efficiencyGain}% without adding recurring headcount costs.`;
      }
      return baseInsight;
    };

    const deptMap = {
      sales: { 
        title: 'Sales & Marketing', 
        baseHeadcount: baseHeadcountMap.sales,
        simHeadcount: getSimHeadcount('sales'),
        baseProductivity: baseProdMap.sales,
        simProductivity: getSimProd('sales'),
        revenue: revenueMap.sales, 
        simRevenue: getSimRevenue('sales'),
        status: getSimStatus('sales', 'PERFORMING'), 
        insight: getSimInsight('sales', 'Strong revenue driver. Limited by warehouse capacity during peak seasons.') 
      },
      warehouse: { 
        title: 'Warehouse & Logistics', 
        baseHeadcount: baseHeadcountMap.warehouse,
        simHeadcount: getSimHeadcount('warehouse'),
        baseProductivity: baseProdMap.warehouse,
        simProductivity: getSimProd('warehouse'),
        revenue: revenueMap.warehouse, 
        simRevenue: getSimRevenue('warehouse'),
        status: getSimStatus('warehouse', 'CRITICAL BOTTLENECK'), 
        insight: getSimInsight('warehouse', 'Fulfillment capped at 82%. Short 3 heads for Raya peak volume.') 
      },
      admin: { 
        title: 'Admin & Finance', 
        baseHeadcount: baseHeadcountMap.admin,
        simHeadcount: getSimHeadcount('admin'),
        baseProductivity: baseProdMap.admin,
        simProductivity: getSimProd('admin'),
        revenue: revenueMap.admin, 
        simRevenue: getSimRevenue('admin'),
        status: getSimStatus('admin', 'OPTIMAL'), 
        insight: getSimInsight('admin', 'Highest productivity. Supports operational efficiency.') 
      },
      support: { 
        title: 'Client Success', 
        baseHeadcount: baseHeadcountMap.support,
        simHeadcount: getSimHeadcount('support'),
        baseProductivity: baseProdMap.support,
        simProductivity: getSimProd('support'),
        revenue: revenueMap.support, 
        simRevenue: getSimRevenue('support'),
        status: getSimStatus('support', 'HEALTHY'), 
        insight: getSimInsight('support', 'Strong retention driver. Generating upsell revenue.') 
      },
    };

    return deptMap[selectedDept] || null;
  }, [selectedDept, dashboardData, selectedStrategy, headcountAddition, efficiencyGain]);

  const renderSimulation = useCallback(async () => {
    if (!canvasRef.current) return;

    const d3 = await import('d3');
    d3.select(canvasRef.current).selectAll('svg').remove();

    const rect = canvasRef.current.getBoundingClientRect();
    const width = rect.width || 700;
    const height = 500;

    const nodes = BASE_DEPTS.map((d) => ({
      ...d,
      radius: 30 + (d.headcount + (d.id === selectedDept && selectedStrategy === 'hire' ? headcountAddition : 0)) * 3.2,
      strategyStyle: nodeStrategyStyle[d.id],
    }));

    const links = [
      { source: 'sales', target: 'warehouse' },
      { source: 'sales', target: 'support' },
      { source: 'warehouse', target: 'admin' },
      { source: 'admin', target: 'support' },
    ].map(link => ({
      ...link,
      tension: linkTension[`${link.source}-${link.target}`]
    }));

    const svg = d3.select(canvasRef.current).append('svg').attr('width', width).attr('height', height);

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d) => d.id).distance(165))
      .force('charge', d3.forceManyBody().strength(-550))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius((d) => d.radius + 20));

    const link = svg.append('g').selectAll('line').data(links).join('line')
      .attr('stroke', (d) => d.tension.stroke)
      .attr('stroke-width', (d) => d.tension.strokeWidth)
      .attr('stroke-dasharray', (d) => d.tension.strokeDasharray);

    const node = svg.append('g').selectAll('g').data(nodes).join('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedDept(d.id);
        setIsOptimized(false);
        setManualSuccess(false);
      })
      .call(d3.drag()
        .on('start', (e) => { if (!e.active) simulation.alphaTarget(0.25).restart(); e.subject.fx = e.subject.x; e.subject.fy = e.subject.y; })
        .on('drag', (e) => { e.subject.fx = e.x; e.subject.fy = e.y; })
        .on('end', (e) => { if (!e.active) simulation.alphaTarget(0); e.subject.fx = null; e.subject.fy = null; })
      );

    node.append('circle').attr('class', 'ring').attr('r', (d) => (d.radius + 10) * d.strategyStyle.radiusMultiplier)
      .attr('fill', 'none').attr('stroke-width', 2.8).attr('stroke-opacity', 0.85)
      .attr('stroke', (d) => {
        const mode = nodeTone[d.id];
        if (mode === 'bottleneckPulse') return '#ef4444';
        if (mode === 'healthyPulse') return '#10b981';
        if (mode === 'salesBoost') return '#10b981';
        return d.color;
      })
      .attr('stroke-dasharray', (d) => d.strategyStyle.strokeDasharray).style('filter', (d) => d.strategyStyle.filter);

    node.append('circle').attr('r', (d) => d.radius * d.strategyStyle.radiusMultiplier).attr('fill', (d) => d.color)
      .attr('fill-opacity', 0.14).attr('stroke', (d) => d.color).attr('stroke-width', 2.2)
      .attr('stroke-dasharray', (d) => d.strategyStyle.strokeDasharray).style('filter', (d) => d.strategyStyle.filter);

    node.append('circle').attr('r', (d) => d.radius * 0.36 * d.strategyStyle.radiusMultiplier).attr('fill', (d) => d.color).attr('fill-opacity', 0.62);

    node.append('text').text((d) => d.id === selectedDept ? d.headcount + (selectedStrategy === 'hire' ? headcountAddition : 0) : d.headcount)
      .attr('y', 4).attr('text-anchor', 'middle').style('fill', '#ffffff').style('font-size', '13px').style('font-weight', '700').style('pointer-events', 'none');

    node.append('text').text((d) => d.name)
      .attr('y', (d) => d.radius + 18).attr('text-anchor', 'middle').style('fill', '#a8acc4').style('font-size', '10px').style('font-weight', '600').style('pointer-events', 'none');

    simulation.on('tick', () => {
      link.attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y).attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    let frame = 0;
    const pulse = () => {
      frame += 1;
      const factor = 0.78 + (Math.sin(frame / 8) + 1) * 0.12;
      node.selectAll('circle.ring').attr('stroke-opacity', (d) => {
        const mode = nodeTone[d.id];
        if (mode === 'bottleneckPulse' || mode === 'healthyPulse') return factor;
        return 0.45;
      });
      if (canvasRef.current) requestAnimationFrame(pulse);
    };
    requestAnimationFrame(pulse);

    setIsLoaded(true);
    return () => simulation.stop();
  }, [headcountAddition, nodeTone, selectedDept, linkTension, nodeStrategyStyle, selectedStrategy]);

  useEffect(() => {
    renderSimulation();
  }, [renderSimulation]);

  // AUTO-SOLVER logic: identifies the Warehouse bottleneck and fixes it with precisely +3 heads
  const handleAIOptimize = async () => {
    setIsLoadingAI(true);
    setManualSuccess(false);
    setTimeout(() => {
      setIsOptimized(true);
      setSelectedDept('warehouse');
      setSelectedStrategy('hire');
      setHeadcountAddition(3); // Sets exact headcount to trigger "RESOLVED" state
      setIsLoadingAI(false);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll up to see the resolved card
    }, 1500);
  };

  const handleSimulateManual = () => {
    setIsSimulatingManual(true);
    setManualSuccess(false);
    setTimeout(() => {
      setIsSimulatingManual(false);
      setManualSuccess(true);
      setTimeout(() => {
        setManualSuccess(false);
      }, 4000);
    }, 1200);
  };

  const handleManualChange = (setter) => (value) => {
    setIsOptimized(false);
    setManualSuccess(false);
    setter(value);
  };

  return (
    <div className="w-full space-y-6">
      <div className="px-6">
        <h1 className="text-3xl font-bold text-white">Digital Twin Command Center</h1>
        <p className="text-slate-400 mt-1">Real-time organizational bottleneck analysis & impact simulation</p>
      </div>

      {/* Main Graph Section */}
      <div className="bg-slate-900 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.22),transparent_65%)]" />
        
        {strategyAlert && (
          <div className={`absolute z-10 top-6 left-6 right-6 rounded-xl px-4 py-3 border text-sm font-medium transition-all duration-400 shadow-lg ${
            strategyAlert.tone === 'danger' ? 'bg-red-500/15 border-red-400/35 text-red-200' :
            strategyAlert.tone === 'warning' ? 'bg-amber-500/15 border-amber-400/35 text-amber-200' :
            strategyAlert.tone === 'success' ? 'bg-emerald-500/15 border-emerald-400/35 text-emerald-200' :
            'bg-blue-500/15 border-blue-400/35 text-blue-200'
          }`}>
            <span className="font-semibold mr-2">{strategyAlert.icon}</span>
            {strategyAlert.text}
          </div>
        )}

        <div
          ref={canvasRef}
          className="w-full rounded-xl border border-dashed border-white/10 h-[500px] relative transition-all duration-500 mt-2"
          style={{ background: 'rgba(15, 23, 42, 0.45)' }}
        >
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {inspectorData && (
          <div className="absolute top-24 right-6 bg-slate-800/95 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-lg z-20 max-w-sm space-y-4">
            <div>
              <h4 className="text-white font-bold text-lg">{inspectorData.title}</h4>
              <p className={`text-xs font-semibold uppercase tracking-wider mt-1 ${
                inspectorData.status.includes('BOTTLENECK') || inspectorData.status.includes('RISK') ? 'text-red-400' : 
                inspectorData.status.includes('OPTIMAL') || inspectorData.status.includes('RESOLVED') || inspectorData.status.includes('HEALTHY') ? 'text-emerald-400' :
                inspectorData.status.includes('RECOVERING') ? 'text-amber-400' :
                'text-purple-400'
              }`}>
                {inspectorData.status}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              
              {/* Headcount Block */}
              <div className="bg-slate-700/50 rounded-lg p-3 border border-white/5">
                <p className="text-xs text-slate-400 mb-1">Headcount</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {inspectorData.simHeadcount !== inspectorData.baseHeadcount ? (
                    <>
                      <span className="text-sm font-medium text-slate-400 line-through">{inspectorData.baseHeadcount}</span>
                      <span className="text-slate-500 text-[10px]">➔</span>
                      <span className="text-xl font-bold text-emerald-400">{inspectorData.simHeadcount}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-white">{inspectorData.baseHeadcount}</span>
                  )}
                </div>
              </div>

              {/* Productivity Block - Colored dynamically! */}
              <div className="bg-slate-700/50 rounded-lg p-3 border border-white/5">
                <p className="text-xs text-slate-400 mb-1">Productivity</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {inspectorData.simProductivity !== inspectorData.baseProductivity ? (
                    <>
                      <span className="text-sm font-medium text-slate-400 line-through">{inspectorData.baseProductivity}%</span>
                      <span className="text-slate-500 text-[10px]">➔</span>
                      <span className={`text-xl font-bold ${inspectorData.simProductivity < inspectorData.baseProductivity ? 'text-red-400' : 'text-blue-400'}`}>
                        {inspectorData.simProductivity}%
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-blue-400">{inspectorData.baseProductivity}%</span>
                  )}
                </div>
              </div>

              {/* Revenue Block - Dynamic! */}
              <div className="bg-slate-700/50 rounded-lg p-3 border border-white/5">
                <p className="text-xs text-slate-400 mb-1">Revenue</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {inspectorData.simRevenue !== inspectorData.revenue ? (
                    <>
                      <span className="text-sm font-medium text-slate-400 line-through">
                        {inspectorData.revenue > 0 ? `${(inspectorData.revenue / 1000).toFixed(0)}K` : '0'}
                      </span>
                      <span className="text-slate-500 text-[10px]">➔</span>
                      <span className={`text-xl font-bold ${inspectorData.simRevenue > inspectorData.revenue ? 'text-emerald-400' : 'text-red-400'}`}>
                        {`${(inspectorData.simRevenue / 1000).toFixed(0)}K`}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-emerald-400">
                      {inspectorData.revenue > 0 ? `RM ${(inspectorData.revenue / 1000).toFixed(0)}K` : '—'}
                    </span>
                  )}
                </div>
              </div>

            </div>
            <p className="text-sm text-slate-300 border-t border-white/10 pt-3">{inspectorData.insight}</p>
          </div>
        )}
      </div>

      {/* Control Panel Below... */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl backdrop-blur-md p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Department</label>
              <select
                value={selectedDept}
                onChange={(e) => handleManualChange(setSelectedDept)(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800/80 border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none transition-colors"
              >
                {BASE_DEPTS.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Action Strategy</label>
              <div className="flex rounded-lg bg-slate-800/80 border border-white/10 p-1.5 shadow-inner">
                {[
                  { id: 'hire', label: 'Hire', icon: '👥' },
                  { id: 'outsource', label: 'Outsource', icon: '🔄' },
                  { id: 'automate', label: 'Automate', icon: '🤖' }
                ].map(strategy => (
                  <button
                    key={strategy.id}
                    onClick={() => handleManualChange(setSelectedStrategy)(strategy.id)}
                    className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedStrategy === strategy.id
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{strategy.icon}</span>
                    <span className="hidden sm:inline">{strategy.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedStrategy === 'hire' && (
              <div className="space-y-5 pt-2">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Headcount Addition</span>
                    <span className="text-purple-400 font-bold">+{headcountAddition}</span>
                  </label>
                  <input type="range" min="1" max="10" value={headcountAddition} onChange={(e) => handleManualChange(setHeadcountAddition)(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Avg. Monthly Salary</span>
                    <span className="text-purple-400 font-bold">RM {avgSalary.toLocaleString()}</span>
                  </label>
                  <input type="range" min="1700" max="15000" step="100" value={avgSalary} onChange={(e) => handleManualChange(setAvgSalary)(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                </div>
              </div>
            )}

            {selectedStrategy === 'outsource' && (
              <div className="pt-2">
                <label className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Monthly Retainer</span>
                  <span className="text-purple-400 font-bold">RM {monthlyRetainer.toLocaleString()}</span>
                </label>
                <input type="range" min="1000" max="20000" step="500" value={monthlyRetainer} onChange={(e) => handleManualChange(setMonthlyRetainer)(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
              </div>
            )}

            {selectedStrategy === 'automate' && (
              <div className="space-y-5 pt-2">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Upfront Software Cost</span>
                    <span className="text-purple-400 font-bold">RM {upfrontSoftwareCost.toLocaleString()}</span>
                  </label>
                  <input type="range" min="1000" max="50000" step="1000" value={upfrontSoftwareCost} onChange={(e) => handleManualChange(setUpfrontSoftwareCost)(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                </div>
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Target Efficiency Gain</span>
                    <span className="text-purple-400 font-bold">{efficiencyGain}%</span>
                  </label>
                  <input type="range" min="5" max="100" step="5" value={efficiencyGain} onChange={(e) => handleManualChange(setEfficiencyGain)(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center items-center p-6 bg-slate-800/60 rounded-xl border border-white/5 shadow-inner">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Strategy Impact Analysis</h3>
            
            <div className="w-full grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">True Labor Cost</p>
                <p className="text-2xl font-bold text-amber-400 mb-1">RM {strategyCalculations.trueLaborCost?.toLocaleString() || '0'}</p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {selectedStrategy === 'hire' ? 'Includes 13% statutory' : selectedStrategy === 'outsource' ? 'Monthly retainer' : 'Upfront investment'}
                </p>
              </div>

              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                  {selectedStrategy === 'automate' ? 'Break-even Timeline' : 'Monthly Cost'}
                </p>
                <p className={`text-2xl font-bold mb-1 ${
                  selectedStrategy === 'automate'
                    ? (strategyCalculations.breakEvenMonths <= 6 ? 'text-emerald-400' :
                       strategyCalculations.breakEvenMonths <= 12 ? 'text-amber-400' : 'text-red-400')
                    : 'text-purple-400'
                }`}>
                  {selectedStrategy === 'automate'
                    ? `${strategyCalculations.breakEvenMonths?.toFixed(1)} mo`
                    : `RM ${strategyCalculations.monthlyCost?.toLocaleString() || '0'}`
                  }
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {selectedStrategy === 'automate' ? 'ROI timeline' : 'Ongoing expense'}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400 text-center">
              Adjust sliders to compare financial impact across hiring, outsourcing, or automation strategies.
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <div className="text-center mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Execute Decision</p>
              <p className="text-[10px] text-slate-500 mt-1">
                {selectedStrategy === 'hire' ? 'Recruit headcount to reduce bottlenecks' : selectedStrategy === 'outsource' ? 'Use external providers for flexibility' : 'Deploy software to boost efficiency'}
              </p>
            </div>

            <button
              onClick={handleAIOptimize}
              disabled={isLoadingAI || isSimulatingManual}
              className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
            >
              {isLoadingAI ? (
                <><div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" /> Analyzing...</>
              ) : (
                <>✨ AI Auto-Solve Bottleneck</>
              )}
            </button>

            <button
              onClick={handleSimulateManual}
              disabled={isLoadingAI || isSimulatingManual}
              className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                manualSuccess 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50'
              } disabled:opacity-75 disabled:cursor-not-allowed`}
            >
              {isSimulatingManual ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : manualSuccess ? (
                <>✅ Deployed</>
              ) : (
                <>Simulate {selectedStrategy === 'hire' ? 'Hiring' : selectedStrategy === 'outsource' ? 'Outsourcing' : 'Automation'}</>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}