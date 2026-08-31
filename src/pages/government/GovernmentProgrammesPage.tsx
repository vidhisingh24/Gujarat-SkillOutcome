import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { governmentApi } from '../../api/governmentApi';
import type { ProgrammeScorecard } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { ExportControl } from '../../components/common/ExportControl';
import { PaginationControl } from '../../components/common/PaginationControl';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportHelpers';

export const GovernmentProgrammesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [programmes, setProgrammes] = useState<ProgrammeScorecard[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      const data = await governmentApi.getProgrammes();
      setProgrammes(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to sync statewide programme outcomes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['District', 'Training Provider', 'Programme', 'Trade', 'Batch', 'Placed', '6-Mo Retained', 'Trade Mismatch', 'Status', 'Audit Reason'];
    const rows = programmes.map(p => [
      p.district,
      p.providerName,
      p.programmeName,
      p.trade,
      p.batchCode,
      `${p.placementRate}%`,
      `${p.sixMonthRetention}%`,
      `${p.mismatchRate}%`,
      p.status,
      p.reason || 'Outcome guidelines met.'
    ]);

    const title = 'Statewide Performance Audit Report';
    const filename = `statewide-performance-audit.${format === 'csv' ? 'csv' : format === 'excel' ? 'xls' : 'pdf'}`;

    if (format === 'csv') {
      exportToCSV(filename, headers, rows);
      showToast('CSV report generated successfully.', 'success');
    } else if (format === 'excel') {
      exportToExcel(filename, 'Programmes', headers, rows);
      showToast('Excel report generated successfully.', 'success');
    } else if (format === 'pdf') {
      exportToPDF(title, headers, rows);
      showToast('PDF print preview triggered.', 'success');
    }
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="loading-spinner animate-spin" style={{ margin: '0 auto 16px' }} />
        <p className="text-muted">Compiling program comparison scorecards worst-first...</p>
      </div>
    );
  }

  // Paginate list
  const paginatedProgrammes = programmes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="gov-programmes py-8">
      <div className="container">
        
        <button onClick={() => navigate('/government/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="card mb-6">
          <div className="flex justify-between items-center pb-2 mb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex gap-3 items-center">
              <BookOpen size={20} className="text-saffron" />
              <h3 style={{ margin: 0, fontSize: '18px' }}>Statewide Provider & Programme Outcomes</h3>
            </div>
            <ExportControl onExport={handleExport} />
          </div>
          <p className="text-xs text-muted" style={{ margin: 0 }}>
            This list is sorted <strong>worst-status-first (RED &rarr; YELLOW &rarr; GREEN)</strong> to prioritize policy interventions and auditing at training centers with high mismatch rates or low retention margins.
          </p>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <h4 className="card-title mb-4" style={{ padding: '20px 20px 0 20px' }}>Statewide Performance Audit (Worst Outcomes First)</h4>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>District</th>
                  <th>Training Provider (Center)</th>
                  <th>Programme / Trade</th>
                  <th>Placed</th>
                  <th>6-Mo Retained</th>
                  <th>Trade Mismatch</th>
                  <th>Status</th>
                  <th>Audit Analysis Reason</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProgrammes.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.district}</strong></td>
                    <td><span className="text-xs font-semibold text-brown">{p.providerName}</span></td>
                    <td>
                      <strong>{p.programmeName}</strong>
                      <br />
                      <span className="text-xs text-muted">Batch: {p.batchCode}</span>
                    </td>
                    <td>{p.placementRate}%</td>
                    <td>{p.sixMonthRetention}%</td>
                    <td>
                      <span className={p.mismatchRate > 25 ? 'text-red font-bold' : ''}>
                        {p.mismatchRate}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        p.status === 'GREEN' ? 'badge-green' : 
                        p.status === 'YELLOW' ? 'badge-yellow' : 'badge-red'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '220px' }}>
                      {p.reason || 'Outcome guidelines met.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControl 
            currentPage={currentPage}
            totalCount={programmes.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>

      </div>

      <style>{`
        .text-red { color: var(--status-red-text); }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default GovernmentProgrammesPage;
