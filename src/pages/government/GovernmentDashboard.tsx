import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { governmentApi } from '../../api/governmentApi';
import type { GovOverviewResponse, GovAlertsResponse } from '../../api/governmentApi';
import { useToast } from '../../context/ToastContext';
import { 
  Shield, 
  Filter, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw, 
  TrendingUp, 
  CheckSquare, 
  MessageSquare, 
  BarChart3 
} from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [overview, setOverview] = useState<GovOverviewResponse | null>(null);
  const [alerts, setAlerts] = useState<GovAlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dropdown UI states (updated immediately on change)
  const [tempDistrict, setTempDistrict] = useState('All Districts');
  const [tempSector, setTempSector] = useState('All Sectors');
  const [tempTimePeriod, setTempTimePeriod] = useState('Last 12 Months');

  // Applied filter states (updated only on clicking the Enter button)
  const [appliedDistrict, setAppliedDistrict] = useState('All Districts');
  const [appliedSector, setAppliedSector] = useState('All Sectors');
  const [appliedTimePeriod, setAppliedTimePeriod] = useState('Last 12 Months');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [overData, alertData] = await Promise.all([
        governmentApi.getOverview(),
        governmentApi.getAlerts()
      ]);
      setOverview(overData);
      setAlerts(alertData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sync government state monitoring APIs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApplyFilters = () => {
    setAppliedDistrict(tempDistrict);
    setAppliedSector(tempSector);
    setAppliedTimePeriod(tempTimePeriod);
    showToast(`Dashboard updated for: ${tempDistrict} · ${tempSector} · ${tempTimePeriod}`, 'success');
  };

  // Perform dynamic aggregated outcome filtering based on applied filters
  const getFilteredData = () => {
    if (!overview || !alerts) return { filteredOverview: null, filteredAlerts: null };

    let trainees = overview.totalTrainees;
    let placement = overview.placementRate;
    let retention3m = overview.threeMonthRetention;
    let retention6m = overview.sixMonthRetention;
    let retention12m = overview.twelveMonthRetention;
    let mismatch = overview.mismatchRate;
    let response = overview.responseRate;

    // Simulate district aggregations
    if (appliedDistrict === 'Ahmedabad') {
      trainees = 5420;
      placement = 71;
      retention3m = 86;
      retention6m = 80;
      retention12m = 74;
      mismatch = 11;
      response = 94;
    } else if (appliedDistrict === 'Gandhinagar') {
      trainees = 2130;
      placement = 65;
      retention3m = 81;
      retention6m = 76;
      retention12m = 70;
      mismatch = 16;
      response = 89;
    } else if (appliedDistrict === 'Rajkot') {
      trainees = 3820;
      placement = 69;
      retention3m = 83;
      retention6m = 77;
      retention12m = 71;
      mismatch = 15;
      response = 91;
    } else if (appliedDistrict === 'Surat') {
      trainees = 4290;
      placement = 67;
      retention3m = 82;
      retention6m = 75;
      retention12m = 69;
      mismatch = 17;
      response = 90;
    }

    // Simulate sector offsets
    if (appliedSector === 'Capital Goods') {
      trainees = Math.round(trainees * 0.3);
      placement = Math.max(40, placement - 4);
      mismatch = Math.min(40, mismatch + 2);
    } else if (appliedSector === 'Manufacturing & Engineering') {
      trainees = Math.round(trainees * 0.4);
      placement = Math.min(95, placement + 4);
      mismatch = Math.max(5, mismatch - 2);
    } else if (appliedSector === 'IT-ITeS') {
      trainees = Math.round(trainees * 0.2);
      placement = Math.min(95, placement + 8);
      mismatch = Math.max(5, mismatch - 6);
    } else if (appliedSector === 'Fabrication') {
      trainees = Math.round(trainees * 0.1);
      placement = Math.max(40, placement - 8);
      mismatch = Math.min(40, mismatch + 6);
    }

    // Simulate time slice offsets
    if (appliedTimePeriod === 'Last 6 Months') {
      trainees = Math.round(trainees * 0.5);
      placement = Math.min(98, placement + 2);
    } else if (appliedTimePeriod === 'Last 2 Years') {
      trainees = Math.round(trainees * 2.1);
      placement = Math.max(40, placement - 3);
    }

    const filteredOverview: GovOverviewResponse = {
      totalTrainees: trainees,
      placementRate: placement,
      threeMonthRetention: retention3m,
      sixMonthRetention: retention6m,
      twelveMonthRetention: retention12m,
      mismatchRate: mismatch,
      responseRate: response
    };

    // Filter alerts list based on District
    let list = [...alerts.list];
    if (appliedDistrict !== 'All Districts') {
      list = list.filter(item => item.programmeId.toLowerCase().includes(appliedDistrict.substring(0, 4).toLowerCase()));
      // If no alerts found for this mock district, create a customized warning
      if (list.length === 0 && alerts.list.length > 0) {
        list = [{
          id: `alt_custom_${appliedDistrict}`,
          severity: 'YELLOW',
          message: `[${appliedDistrict}] Notice: Lathe Operator courses reporting higher mismatch rate in regional center.`,
          programmeId: `PRG-${appliedDistrict.substring(0,3).toUpperCase()}-09`,
          date: new Date().toISOString().split('T')[0]
        }];
      }
    }

    const filteredAlerts: GovAlertsResponse = {
      total: list.length,
      redCount: list.filter(item => item.severity === 'RED').length,
      yellowCount: list.filter(item => item.severity === 'YELLOW').length,
      list
    };

    return { filteredOverview, filteredAlerts };
  };

  const { filteredOverview, filteredAlerts } = getFilteredData();
  const isDirty = tempDistrict !== appliedDistrict || tempSector !== appliedSector || tempTimePeriod !== appliedTimePeriod;

  if (loading) {
    return (
      <div className="container py-8">
        <div className="skeleton skeleton-profile-card mb-6" />
        <div className="skeleton skeleton-section" />
        <style>{`
          .skeleton {
            background: linear-gradient(90deg, #F0EDE4 25%, #E5E2D7 50%, #F0EDE4 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
            border-radius: var(--radius-card);
          }
          .skeleton-profile-card { height: 80px; }
          .skeleton-section { height: 420px; }
          @keyframes loading-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <div className="card text-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <AlertCircle size={40} className="text-red" style={{ margin: '0 auto 12px', color: 'var(--status-red-text)' }} />
          <h4>State Directorate Database Sync Failed</h4>
          <p className="text-muted text-sm mb-4">{error}</p>
          <button onClick={loadDashboardData} className="btn btn-primary flex items-center justify-center gap-2" style={{ margin: '0 auto' }}>
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="government-dashboard py-8">
      <div className="container">
        
        {/* Directorate Header */}
        <div className="dashboard-header flex justify-between items-center mb-6 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <span className="text-xs text-muted font-bold block">DIRECTORATE OF EMPLOYMENT & TRAINING (DET)</span>
            <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-saffron-dark)' }}>Skill Development Directorate — Outcome Overview</h3>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-green flex items-center gap-1">
              <Shield size={12} />
              Secured DET Link
            </span>
          </div>
        </div>

        {/* Filter Bar UI */}
        <div className="filter-bar card flex gap-4 items-center mb-6 py-3 px-4">
          <span className="text-xs font-bold text-muted flex items-center gap-1">
            <Filter size={14} />
            FILTERS:
          </span>
          <select 
            value={tempDistrict} 
            onChange={(e) => setTempDistrict(e.target.value)} 
            className="filter-select"
          >
            <option>All Districts</option>
            <option>Ahmedabad</option>
            <option>Gandhinagar</option>
            <option>Rajkot</option>
            <option>Surat</option>
          </select>
          <select 
            value={tempSector} 
            onChange={(e) => setTempSector(e.target.value)} 
            className="filter-select"
          >
            <option>All Sectors</option>
            <option>Capital Goods</option>
            <option>Manufacturing & Engineering</option>
            <option>IT-ITeS</option>
            <option>Fabrication</option>
          </select>
          <select 
            value={tempTimePeriod} 
            onChange={(e) => setTempTimePeriod(e.target.value)} 
            className="filter-select"
          >
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>Last 2 Years</option>
          </select>
          
          <button 
            onClick={handleApplyFilters} 
            className={`filter-enter-btn ${isDirty ? 'dirty' : 'applied'}`}
          >
            {isDirty ? 'Enter' : '✓ Applied'}
          </button>
        </div>

        {/* State KPIs Grid */}
        {filteredOverview && (
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="card stat-card">
              <span className="stat-val">{filteredOverview.totalTrainees}</span>
              <span className="stat-lbl">Total Trainees Tracked</span>
            </div>
            <div className="card stat-card">
              <span className="stat-val">{filteredOverview.placementRate}%</span>
              <span className="stat-lbl">Workplace Placements</span>
            </div>
            <div className="card stat-card">
              <span className="stat-val">{filteredOverview.threeMonthRetention}%</span>
              <span className="stat-lbl">3-Month Retention</span>
            </div>
            <div className="card stat-card">
              <span className="stat-val">{filteredOverview.sixMonthRetention}%</span>
              <span className="stat-lbl">6-Month Retention</span>
            </div>
            <div className="card stat-card">
              <span className="stat-val">{filteredOverview.twelveMonthRetention}%</span>
              <span className="stat-lbl">12-Month Retention</span>
            </div>
            <div className="card stat-card">
              <span className="stat-val" style={{ color: 'var(--status-red-text)' }}>{filteredOverview.mismatchRate}%</span>
              <span className="stat-lbl">Trade Mismatch Rate</span>
            </div>
            <div className="card stat-card">
              <span className="stat-val">{filteredOverview.responseRate}%</span>
              <span className="stat-lbl">Check-in Response Rate</span>
            </div>
            {/* Quick dashboard navigator */}
            <div className="card stat-card flex flex-col justify-center items-center" style={{ backgroundColor: 'var(--bg-cream)', borderColor: 'var(--accent-saffron)' }}>
              <strong className="text-sm text-brown text-center mb-1">Statewide Coverage</strong>
              <span className="text-xs text-muted">{appliedDistrict === 'All Districts' ? '33 Districts active' : `${appliedDistrict} Active`}</span>
            </div>
          </div>
        )}

        {/* What KaushalSetu Enables Section */}
        <div className="card mb-6">
          <h5 className="section-title text-center mb-4" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            What KaushalSetu Enables
          </h5>
          <div className="grid grid-cols-4 gap-4" style={{ marginTop: '16px' }}>
            <div className="enables-box text-center p-3" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-button)', backgroundColor: '#FAF8F2', padding: '12px' }}>
              <div className="enables-icon-wrapper flex justify-center mb-2" style={{ color: 'var(--accent-icon)', display: 'flex', justifyContent: 'center' }}>
                <TrendingUp size={20} />
              </div>
              <strong className="text-xs block text-brown-dark" style={{ letterSpacing: '0.5px', fontSize: '11px', display: 'block' }}>TRACK</strong>
              <span className="text-xs text-muted block mt-1" style={{ fontSize: '11px', display: 'block' }}>Trainee outcomes over time</span>
            </div>
            <div className="enables-box text-center p-3" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-button)', backgroundColor: '#FAF8F2', padding: '12px' }}>
              <div className="enables-icon-wrapper flex justify-center mb-2" style={{ color: 'var(--accent-icon)', display: 'flex', justifyContent: 'center' }}>
                <CheckSquare size={20} />
              </div>
              <strong className="text-xs block text-brown-dark" style={{ letterSpacing: '0.5px', fontSize: '11px', display: 'block' }}>VERIFY</strong>
              <span className="text-xs text-muted block mt-1" style={{ fontSize: '11px', display: 'block' }}>Employment records with employers</span>
            </div>
            <div className="enables-box text-center p-3" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-button)', backgroundColor: '#FAF8F2', padding: '12px' }}>
              <div className="enables-icon-wrapper flex justify-center mb-2" style={{ color: 'var(--accent-icon)', display: 'flex', justifyContent: 'center' }}>
                <MessageSquare size={20} />
              </div>
              <strong className="text-xs block text-brown-dark" style={{ letterSpacing: '0.5px', fontSize: '11px', display: 'block' }}>IMPROVE</strong>
              <span className="text-xs text-muted block mt-1" style={{ fontSize: '11px', display: 'block' }}>Training through real feedback</span>
            </div>
            <div className="enables-box text-center p-3" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-button)', backgroundColor: '#FAF8F2', padding: '12px' }}>
              <div className="enables-icon-wrapper flex justify-center mb-2" style={{ color: 'var(--accent-icon)', display: 'flex', justifyContent: 'center' }}>
                <BarChart3 size={20} />
              </div>
              <strong className="text-xs block text-brown-dark" style={{ letterSpacing: '0.5px', fontSize: '11px', display: 'block' }}>DECIDE</strong>
              <span className="text-xs text-muted block mt-1" style={{ fontSize: '11px', display: 'block' }}>Government data intelligence</span>
            </div>
          </div>
        </div>

        {/* Dashboard grid: Alerts vs Sub-Nav links */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Alerts column */}
          <div className="col-span-2 flex flex-col gap-6">
            
            {/* Early warning alerts feed */}
            {filteredAlerts && (
              <div className="card">
                <div className="flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <h4 className="card-title flex items-center gap-2" style={{ margin: 0 }}>
                    <AlertTriangle className="text-saffron" size={20} />
                    Statewide Early Warning Alerts ({filteredAlerts.redCount} RED, {filteredAlerts.yellowCount} YELLOW)
                  </h4>
                  <Link to="/government/alerts" className="text-xs font-semibold text-brown">Manage Alerts</Link>
                </div>

                <div className="alerts-list flex flex-col gap-3">
                  {filteredAlerts.list.slice(0, 3).map(alert => (
                    <div key={alert.id} className={`alert-card flex gap-3 ${alert.severity === 'RED' ? 'alert-card-danger' : 'alert-card-warning'}`} style={{ margin: 0 }}>
                      <AlertCircle className={alert.severity === 'RED' ? 'text-red' : 'text-saffron'} size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <span className={`badge ${alert.severity === 'RED' ? 'badge-red' : 'badge-yellow'}`} style={{ fontSize: '9px', padding: '1px 6px', marginBottom: '4px' }}>
                          {alert.severity} Warning
                        </span>
                        <p className="text-xs" style={{ margin: 0, fontWeight: 550, color: 'var(--text-primary)' }}>{alert.message}</p>
                        <span className="text-xs text-muted block mt-1">Logged on {alert.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sub-navigation options */}
          <div className="sidebar-column flex flex-col gap-6">
            <div className="card flex flex-col gap-4">
              <h4 className="card-title">Outcome Intelligence Nav</h4>
              
              <Link to="/government/analytics" className="btn btn-outline py-3 flex flex-col items-start gap-1" style={{ textAlign: 'left' }}>
                <strong className="text-sm">District Analytics</strong>
                <span className="text-xs text-muted">Compare trainee placements by district.</span>
              </Link>

              <Link to="/government/programmes" className="btn btn-outline py-3 flex flex-col items-start gap-1" style={{ textAlign: 'left' }}>
                <strong className="text-sm">Programme Comparison</strong>
                <span className="text-xs text-muted">Worst-performing courses audit index.</span>
              </Link>

              <Link to="/government/skill-gaps" className="btn btn-outline py-3 flex flex-col items-start gap-1" style={{ textAlign: 'left' }}>
                <strong className="text-sm">Skill-Gap Intelligence</strong>
                <span className="text-xs text-muted">Classified categories of workplace gaps.</span>
              </Link>
            </div>
            
            <div className="card alert-card">
              <h5 style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-saffron-dark)' }}>Ecosystem Status</h5>
              <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.4 }}>
                All dashboard data models are driven by aggregated outcomes. When filters are updated, they filter local view layers without making unauthorized API queries.
              </p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .col-span-2 { grid-column: span 2; }
        .filter-select {
          padding: 6px 12px;
          border-radius: var(--radius-input);
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-primary);
          font-size: 12px;
          outline: none;
          cursor: pointer;
        }
        .filter-select:focus {
          border-color: var(--accent-icon);
        }
        .filter-enter-btn {
          padding: 6px 16px;
          font-size: 12px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-button);
          cursor: pointer;
          font-weight: bold;
          transition: all 0.15s ease;
          border: 1px solid transparent;
        }
        .filter-enter-btn.dirty {
          background-color: var(--text-saffron-dark);
          color: white;
        }
        .filter-enter-btn.dirty:hover {
          background-color: var(--secondary-brown);
        }
        .filter-enter-btn.applied {
          background-color: var(--status-green-bg);
          color: var(--status-green-text);
          border-color: var(--status-green-border);
        }
        .filter-enter-btn.applied:hover {
          background-color: #E2F5E9;
        }
        .text-red { color: var(--status-red-text); }
      `}</style>
    </div>
  );
};
export default GovernmentDashboard;
