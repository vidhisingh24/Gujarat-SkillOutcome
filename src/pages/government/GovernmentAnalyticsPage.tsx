import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { governmentApi } from '../../api/governmentApi';
import type { DistrictMetric } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { ExportControl } from '../../components/common/ExportControl';
import { PaginationControl } from '../../components/common/PaginationControl';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportHelpers';

export const GovernmentAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [districts, setDistricts] = useState<DistrictMetric[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Smaller page size is perfect for compact district grid

  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const data = await governmentApi.getDistricts();
      setDistricts(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve district analytics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const headers = ['District Name', 'Trainees Registered', 'Verified Hired Candidates', 'Employment Rate'];
    const rows = districts.map(d => [
      d.name,
      `${d.trainees} candidates`,
      `${d.employed} placed`,
      `${d.employmentRate}%`
    ]);

    const title = 'District Placement Comparison Matrix';
    const filename = `district-placement-report.${format === 'csv' ? 'csv' : format === 'excel' ? 'xls' : 'pdf'}`;

    if (format === 'csv') {
      exportToCSV(filename, headers, rows);
      showToast('CSV report generated successfully.', 'success');
    } else if (format === 'excel') {
      exportToExcel(filename, 'Districts', headers, rows);
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
        <p className="text-muted">Loading district analytics dataset...</p>
      </div>
    );
  }

  // Paginated subset
  const paginatedDistricts = districts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="gov-analytics py-8">
      <div className="container" style={{ maxWidth: '850px' }}>
        
        <button onClick={() => navigate('/government/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="card mb-6">
          <div className="flex justify-between items-center pb-2 mb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex gap-3 items-center">
              <BarChart3 size={20} className="text-saffron" />
              <h3 style={{ margin: 0, fontSize: '18px' }}>District Placement Comparison Matrix</h3>
            </div>
            <ExportControl onExport={handleExport} />
          </div>
          <p className="text-xs text-muted" style={{ margin: 0 }}>
            Review outplacement outcomes grouped by local administrative districts, sorted alphabetically as returned by state registries.
          </p>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <h4 className="card-title mb-4" style={{ padding: '20px 20px 0 20px' }}>District-level Summary (Alphabetical Registry)</h4>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>District Name</th>
                  <th>Trainees Registered</th>
                  <th>Verified Hired Candidates</th>
                  <th>Employment Rate</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDistricts.map((d, idx) => (
                  <tr key={idx}>
                    <td><strong>{d.name}</strong></td>
                    <td>{d.trainees} candidates</td>
                    <td>{d.employed} placed</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <strong className="text-sm">{d.employmentRate}%</strong>
                        {/* Inline progress bar */}
                        <div className="status-progress-bar" style={{ width: '80px', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', display: 'block' }}>
                          <div 
                            style={{ 
                              width: `${d.employmentRate}%`, 
                              height: '100%', 
                              backgroundColor: d.employmentRate > 75 ? 'var(--status-green-text)' : 'var(--status-yellow-text)' 
                            }} 
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControl 
            currentPage={currentPage}
            totalCount={districts.length}
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
export default GovernmentAnalyticsPage;
