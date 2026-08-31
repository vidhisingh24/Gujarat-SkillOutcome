import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employerApi } from '../../api/employerApi';
import { useToast } from '../../context/ToastContext';
import type { VerificationRequest } from '../../data/mockData';
import { ArrowLeft, CheckCircle, Search, Filter, X, AlertTriangle } from 'lucide-react';
import { ExportControl } from '../../components/common/ExportControl';
import { PaginationControl } from '../../components/common/PaginationControl';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportHelpers';

export const EmployerVerificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Data lists
  const [list, setList] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All dates');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Correction Confirmation Modal Target
  const [confirmTarget, setConfirmTarget] = useState<VerificationRequest | null>(null);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await employerApi.getVerifications();
      setList(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch verification listings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  // Reset pagination to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  const handleAction = async (id: string, status: 'confirmed' | 'denied') => {
    setActioningId(id);
    try {
      await employerApi.updateVerification(id, status);
      showToast(`Candidate verification update processed: ${status.toUpperCase()}`, 'success');
      
      // Update local state list
      setList(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    } catch (err: any) {
      showToast(err.message || 'Failed to complete verification request.', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const triggerChangeDecision = (req: VerificationRequest) => {
    setConfirmTarget(req);
  };

  const handleExecuteChange = async () => {
    if (!confirmTarget) return;
    const nextStatus = confirmTarget.status === 'confirmed' ? 'denied' : 'confirmed';
    const id = confirmTarget.id;
    
    setConfirmTarget(null);
    setActioningId(id);
    try {
      await employerApi.updateVerification(id, nextStatus);
      showToast(`Verification decision updated to ${nextStatus.toUpperCase()} successfully.`, 'success');
      setList(prev => prev.map(v => v.id === id ? { ...v, status: nextStatus } : v));
    } catch (err: any) {
      showToast(err.message || 'Failed to update decision.', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDateFilter('All dates');
    showToast('Filters cleared', 'info');
  };

  // Helper function to check date limits
  const filterByDate = (createdDate: string, option: string) => {
    if (option === 'All dates') return true;
    const dateVal = new Date(createdDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (option === 'Today') {
      const target = new Date(createdDate);
      target.setHours(0, 0, 0, 0);
      return target.getTime() === today.getTime();
    }
    if (option === 'Last 7 days') {
      const diffTime = Math.abs(today.getTime() - dateVal.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (option === 'Last 30 days') {
      const diffTime = Math.abs(today.getTime() - dateVal.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }
    return true;
  };

  // Filter logs locally
  const filtered = list.filter(v => {
    const matchesSearch = v.trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.trainee.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || v.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = filterByDate(v.createdDate, dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Paginate list
  const paginatedList = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle export action
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['Candidate Name', 'Trainee ID', 'Audit Period', 'Wage Class', 'Reported Role', 'Log Date', 'Status'];
    const rows = filtered.map(v => [
      v.trainee.name,
      v.trainee.id,
      v.cycle.replace('_', ' ').toUpperCase(),
      `₹${v.salaryBand}`,
      v.jobRole,
      v.createdDate,
      v.status.toUpperCase()
    ]);

    const title = 'Employment Verification Audit Logs';
    const filename = `employment-verification-audit.${format === 'csv' ? 'csv' : format === 'excel' ? 'xls' : 'pdf'}`;

    if (format === 'csv') {
      exportToCSV(filename, headers, rows);
      showToast('CSV report generated successfully.', 'success');
    } else if (format === 'excel') {
      exportToExcel(filename, 'Verifications', headers, rows);
      showToast('Excel report generated successfully.', 'success');
    } else if (format === 'pdf') {
      exportToPDF(title, headers, rows);
      showToast('PDF print preview triggered.', 'success');
    }
  };

  if (loading && list.length === 0) {
    return (
      <div className="container py-12 text-center">
        <div className="loading-spinner animate-spin" style={{ margin: '0 auto 16px' }} />
        <p className="text-muted">Loading verifications dataset...</p>
      </div>
    );
  }

  return (
    <div className="verifications-page py-8">
      <div className="container">
        
        <button onClick={() => navigate('/employer/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        {/* Toolbar Header with export */}
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ margin: 0, fontSize: '18px' }}>Employment Verification Audit Logs</h3>
          <ExportControl onExport={handleExport} />
        </div>

        {/* Filter Toolbar */}
        <div className="filter-toolbar card mb-6 p-4">
          <div className="toolbar-grid">
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by candidate name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="toolbar-search-input"
                aria-label="Search verification logs"
              />
            </div>
            
            <div className="toolbar-dropdown-group flex gap-3">
              <div className="select-container flex items-center gap-1">
                <Filter size={12} className="text-muted" />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="toolbar-select"
                  aria-label="Filter by Status"
                >
                  <option value="All">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="denied">Denied</option>
                </select>
              </div>

              <div className="select-container flex items-center gap-1">
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="toolbar-select"
                  aria-label="Filter by Date"
                >
                  <option value="All dates">All dates</option>
                  <option value="Today">Today</option>
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
                </select>
              </div>

              {(searchTerm || statusFilter !== 'All' || dateFilter !== 'All dates') && (
                <button 
                  onClick={handleClearFilters}
                  className="btn btn-outline btn-sm clear-filters-btn"
                  style={{ height: '32px' }}
                >
                  <X size={12} />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {paginatedList.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Audit Period</th>
                      <th>Wage Class</th>
                      <th>Reported Role</th>
                      <th>Log Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.map(req => (
                      <tr key={req.id}>
                        <td>
                          <strong>{req.trainee.name}</strong>
                          <br />
                          <span className="text-xs text-muted">ID: {req.trainee.id}</span>
                        </td>
                        <td>{req.cycle.replace('_', ' ').toUpperCase()}</td>
                        <td>₹{req.salaryBand}</td>
                        <td>{req.jobRole}</td>
                        <td>{req.createdDate}</td>
                        <td>
                          <span className={`badge ${
                            req.status === 'confirmed' ? 'badge-green' : 
                            req.status === 'denied' ? 'badge-red' : 'badge-yellow'
                          }`}>
                            {req.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {req.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleAction(req.id, 'confirmed')} 
                                disabled={actioningId !== null}
                                className="btn btn-primary btn-sm py-1 px-3 font-semibold"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => handleAction(req.id, 'denied')} 
                                disabled={actioningId !== null}
                                className="btn btn-outline btn-sm py-1 px-3 font-semibold"
                                style={{ color: 'var(--status-red-text)' }}
                              >
                                Deny
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted italic">Audited</span>
                              <button
                                onClick={() => triggerChangeDecision(req)}
                                disabled={actioningId === req.id}
                                className="btn-link text-xs"
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-brown)', textDecoration: 'underline' }}
                              >
                                {actioningId === req.id ? 'Saving...' : 'Change'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              <PaginationControl 
                currentPage={currentPage}
                totalCount={filtered.length}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </>
          ) : (
            <div className="text-center py-12 text-muted" style={{ padding: '40px' }}>
              <CheckCircle size={48} className="text-muted mb-2" style={{ margin: '0 auto' }} />
              <h5>No Verification Logs Found</h5>
              <p className="text-xs">No records matching your search queries or active filtering settings.</p>
            </div>
          )}
        </div>

        {/* Correction Confirmation Modal Dialog */}
        {confirmTarget && (
          <div className="modal-backdrop">
            <div className="modal-content card" role="dialog" aria-modal="true">
              <div className="flex gap-3 items-start mb-4">
                <div className="alert-circle-icon text-red" style={{ color: 'var(--status-yellow-text)', marginTop: '2px' }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Change Verification Decision?</h4>
                  <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.4 }}>
                    Are you sure you want to change the verification status for <strong>{confirmTarget.trainee.name}</strong> from <strong>{confirmTarget.status.toUpperCase()}</strong> to <strong>{confirmTarget.status === 'confirmed' ? 'DENIED' : 'CONFIRMED'}</strong>?
                    <br /><br />
                    <em>Notice: Reverting an audited verification status back to Pending is not supported by registry API.</em>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button onClick={() => setConfirmTarget(null)} className="btn btn-outline btn-sm">Cancel</button>
                <button onClick={handleExecuteChange} className="btn btn-primary btn-sm">Yes, Change Decision</button>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .toolbar-grid {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 16px;
          align-items: center;
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
        }
        .toolbar-search-input {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-input);
          background-color: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }
        .toolbar-search-input:focus {
          border-color: var(--accent-icon);
        }
        .toolbar-select {
          padding: 6px 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-input);
          background-color: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }
        .toolbar-select:focus {
          border-color: var(--accent-icon);
        }
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(38, 36, 32, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal-content {
          max-width: 420px;
          width: 90%;
          padding: 24px;
          background-color: var(--bg-card);
          border-color: var(--accent-saffron);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .toolbar-grid {
            grid-template-columns: 1fr;
          }
          .toolbar-dropdown-group {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};
export default EmployerVerificationsPage;
