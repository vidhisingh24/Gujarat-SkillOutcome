import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { traineeApi } from '../../api/traineeApi';
import type { TraineeOutcomesResponse } from '../../api/traineeApi';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Award, CheckSquare } from 'lucide-react';

export const TraineeOutcomesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState<TraineeOutcomesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutcomes = async () => {
      try {
        const response = await traineeApi.getOutcomes();
        setData(response);
      } catch (err: any) {
        showToast(err.message || 'Failed to fetch outcomes dataset.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOutcomes();
  }, []);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
        <p className="text-muted">Assembling outcomes history...</p>
      </div>
    );
  }

  const completedCheckins = data?.checkins.filter(c => c.status === 'completed') || [];

  return (
    <div className="outcomes-page py-8">
      <div className="container" style={{ maxWidth: '750px' }}>
        
        <button onClick={() => navigate('/trainee/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <Award className="text-saffron" size={24} />
            <h3 style={{ margin: 0, fontSize: '18px' }}>Employment Outcome Record</h3>
          </div>

          <div className="outcome-summary flex flex-col gap-4 text-sm">
            {data?.employment ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted block">CURRENT EMPLOYER</span>
                  <strong>{data.employment.companyName}</strong>
                </div>
                <div>
                  <span className="text-xs text-muted block">JOB DESIGNATION</span>
                  <strong>{data.employment.currentRole}</strong>
                </div>
                <div>
                  <span className="text-xs text-muted block">SALARY BAND</span>
                  <strong>₹{data.employment.salaryBand}</strong>
                </div>
                <div>
                  <span className="text-xs text-muted block">VERIFICATION STATE</span>
                  <span className={`badge mt-1 ${data.employment.verificationStatus === 'confirmed' ? 'badge-green' : 'badge-yellow'}`}>
                    {data.employment.verificationStatus?.toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                No active employment records verified. Complete pending check-ins to update.
              </div>
            )}
          </div>
        </div>

        {/* Survey responses list */}
        <div className="card">
          <h4 className="card-title mb-4">Completed Milestones</h4>
          {completedCheckins.length > 0 ? (
            <div className="completed-milestones-list flex flex-col gap-4">
              {completedCheckins.map(chk => (
                <div key={chk.id} className="milestone-response-item card">
                  <div className="flex justify-between items-center mb-3 pb-2" style={{ borderBottom: '1px dashed var(--border-color)' }}>
                    <h5 style={{ margin: 0, color: 'var(--text-saffron-dark)', fontSize: '14px' }}>
                      {chk.cycle.replace('_', ' ').toUpperCase()} CHECK-IN
                    </h5>
                    <span className="text-xs text-muted">Submitted on {chk.submittedDate}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div>
                      <span className="text-muted block">EMPLOYMENT STATUS</span>
                      <strong className="text-brown">{chk.employmentStatus?.toUpperCase()}</strong>
                    </div>
                    <div>
                      <span className="text-muted block">SALARY BAND</span>
                      <strong className="text-brown">₹{chk.salaryBand}</strong>
                    </div>
                    <div>
                      <span className="text-muted block">COURSE RELEVANCE</span>
                      <strong className="text-brown">{chk.trainingRelated ? 'Related' : 'Not Related'}</strong>
                    </div>
                    <div>
                      <span className="text-muted block">SATISFACTION RATING</span>
                      <strong className="text-brown">{chk.satisfaction} / 5</strong>
                    </div>
                  </div>

                  {chk.feedbackText && (
                    <div className="response-comment bg-primary p-3 rounded" style={{ backgroundColor: '#FCFAF5', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      <span className="text-muted text-xs block mb-1">CANDIDATE FEEDBACK LOG:</span>
                      <p className="text-xs italic text-primary" style={{ margin: 0 }}>"{chk.feedbackText}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted">
              <CheckSquare size={36} className="text-muted mb-2" style={{ margin: '0 auto' }} />
              <p className="text-sm">You have not submitted any outcome check-ins yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default TraineeOutcomesPage;
