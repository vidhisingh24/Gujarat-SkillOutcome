import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, User, Search } from 'lucide-react';
import { ExportControl } from '../../components/common/ExportControl';
import { PaginationControl } from '../../components/common/PaginationControl';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportHelpers';

const mockProviderTrainees = [
  { id: 'trn_ravi_01', name: 'Ravi Parmar', trade: 'CNC Machinist', batch: 'CNC-2025-BATCH-02', company: 'Gujarat Precision Tools Pvt Ltd', salary: '10,000 - 18,000', checkinCompletion: '3-Mo Completed', status: 'Employed (Verified)' },
  { id: 'trn_anil_02', name: 'Anil Solanki', trade: 'CNC Machinist', batch: 'CNC-2025-BATCH-02', company: 'Gujarat Precision Tools Pvt Ltd', salary: '10,000 - 18,000', checkinCompletion: '3-Mo Completed, 6-Mo Due', status: 'Employed (Pending verification)' },
  { id: 'trn_nikita_03', name: 'Nikita Patel', trade: 'IT Specialist', batch: 'IT-GANDH-2025-B4', company: 'TechSolutions Ahmedabad', salary: '18,000 - 25,000', checkinCompletion: '3-Mo Completed', status: 'Employed (Pending verification)' },
  { id: 'trn_suresh_04', name: 'Suresh Rathod', trade: 'Fitter', batch: 'FIT-2025-BATCH-03', company: 'N/A', salary: 'N/A', checkinCompletion: '3-Mo Missed', status: 'Unemployed' },
  { id: 'trn_priya_05', name: 'Priya Vaghela', trade: 'Welder', batch: 'WLD-2025-BATCH-01', company: 'Gujarat Weldfab Industries', salary: 'Below 10,000', checkinCompletion: '3-Mo Completed', status: 'Employed (Verified)' }
];

export const ProviderOutcomesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Fits nicely for the mock trainees list

  // Reset pagination to page 1 on search filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filtered = mockProviderTrainees.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.trade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginated list
  const paginatedTrainees = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['Trainee Name', 'Trainee ID', 'Trade Program', 'Batch', 'Hired Company', 'Wage Band', 'Tracking Status', 'Outcome State'];
    const rows = filtered.map(t => [
      t.name,
      t.id,
      t.trade,
      t.batch,
      t.company,
      t.salary,
      t.checkinCompletion,
      t.status
    ]);

    const title = 'Trainee Outplacement Logs';
    const filename = `trainee-outplacement-logs.${format === 'csv' ? 'csv' : format === 'excel' ? 'xls' : 'pdf'}`;

    if (format === 'csv') {
      exportToCSV(filename, headers, rows);
      showToast('CSV report generated successfully.', 'success');
    } else if (format === 'excel') {
      exportToExcel(filename, 'Outplacement', headers, rows);
      showToast('Excel report generated successfully.', 'success');
    } else if (format === 'pdf') {
      exportToPDF(title, headers, rows);
      showToast('PDF print preview triggered.', 'success');
    }
  };

  return (
    <div className="provider-outcomes-page py-8">
      <div className="container">
        
        <button onClick={() => navigate('/training-provider/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        {/* Toolbar Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ margin: 0, fontSize: '18px' }}>Trainee Outplacement Logs</h3>
          <ExportControl onExport={handleExport} />
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            {/* Search bar */}
            <div className="search-box flex items-center gap-2" style={{ border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', maxWidth: '300px', width: '100%', backgroundColor: 'var(--bg-card)' }}>
              <Search size={16} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search candidate name or trade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'none', fontSize: '13px', width: '100%', color: 'var(--text-primary)' }}
                aria-label="Search trainees outplacement log"
              />
            </div>
            <span className="text-xs text-muted">Total Hired/Tracked: {mockProviderTrainees.length}</span>
          </div>

          {paginatedTrainees.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Trainee Name</th>
                      <th>Trade Program</th>
                      <th>Hired Company</th>
                      <th>Wage Band</th>
                      <th>Tracking Status</th>
                      <th>Outcome State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTrainees.map(t => (
                      <tr key={t.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-muted" style={{ flexShrink: 0 }} />
                            <div>
                              <strong>{t.name}</strong>
                              <br />
                              <span className="text-xs text-muted">ID: {t.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>{t.trade}<br /><span className="text-xs text-muted">{t.batch}</span></td>
                        <td>{t.company}</td>
                        <td>{t.salary}</td>
                        <td>{t.checkinCompletion}</td>
                        <td>
                          <span className={`badge ${
                            t.status.includes('Verified') ? 'badge-green' : 
                            t.status.includes('Pending') ? 'badge-yellow' : 'badge-red'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
              <h5>No Trainees Found</h5>
              <p className="text-xs">No records matched your search term.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default ProviderOutcomesPage;
