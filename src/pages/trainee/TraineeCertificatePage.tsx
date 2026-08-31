import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { traineeApi } from '../../api/traineeApi';
import { useToast } from '../../context/ToastContext';
import type { TraineeProfile } from '../../data/mockData';
import { ArrowLeft, Printer, Award, ShieldAlert } from 'lucide-react';

export const TraineeCertificatePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<TraineeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await traineeApi.getProfile();
        setProfile(data);
      } catch (err: any) {
        showToast(err.message || 'Failed to fetch candidate profile.', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handlePrint = () => {
    // Print dialog acts as local PDF download
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
        <p className="text-muted">Generating certificate preview...</p>
      </div>
    );
  }

  return (
    <div className="certificate-page-container py-8 no-print">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/trainee/dashboard')} className="btn btn-outline btn-sm">
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>

          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={14} />
            <span>Print / Save PDF</span>
          </button>
        </div>

        {/* Certificate Frame */}
        {profile ? (
          <div className="certificate-frame card print-area">
            {/* Border details */}
            <div className="cert-inner-border">
              {/* Top Seal */}
              <div className="cert-header text-center">
                <svg className="cert-seal" viewBox="0 0 100 100" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="44" stroke="#854F0B" strokeWidth="2"/>
                  <circle cx="50" cy="50" r="38" stroke="#854F0B" strokeWidth="1" strokeDasharray="3 3"/>
                  <circle cx="50" cy="50" r="10" stroke="#854F0B" strokeWidth="2" fill="#854F0B"/>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1="50"
                      x2={50 + 38 * Math.cos((i * 15 * Math.PI) / 180)}
                      y2={50 + 38 * Math.sin((i * 15 * Math.PI) / 180)}
                      stroke="#854F0B"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
                <h4 className="cert-state-title">GOVERNMENT OF GUJARAT</h4>
                <span className="cert-dept-title">Directorate of Employment & Training, Gandhinagar</span>
              </div>

              {/* Title */}
              <div className="cert-title-block text-center mt-6">
                <Award size={36} className="text-saffron mb-2" style={{ margin: '0 auto' }} />
                <h2 className="cert-main-title">VOCATIONAL OUTCOME CERTIFICATE</h2>
                <p className="cert-declaration">This is to verify the longitudinal training & employment status of</p>
              </div>

              {/* Candidate details */}
              <div className="cert-candidate text-center mt-4">
                <h1 className="cert-candidate-name">{profile.name}</h1>
                <p className="cert-candidate-details">
                  Registry ID: <strong>{profile.id}</strong> · Sector: <strong>{profile.programme.sector}</strong>
                </p>
              </div>

              {/* Statement */}
              <div className="cert-statement text-center mt-4">
                <p>
                  Having successfully graduated from <strong>{profile.trainingProvider.name}</strong> under the trade program <strong>{profile.trade}</strong>, has completed the mandatory longitudinal tracking cycle.
                </p>
                <div className="cert-employment-block card mt-4 text-center">
                  <span className="text-xs text-muted block mb-1">VERIFIED WORKPLACE PLACEMENT</span>
                  <span className="cert-status text-lg font-bold text-brown">
                    {profile.employment?.companyName ? `Placed at ${profile.employment.companyName}` : 'Self-Employed Startup Program'}
                  </span>
                  <p className="text-xs text-muted mt-1" style={{ margin: 0 }}>
                    Current Designation: {profile.employment?.currentRole || 'Independent Contractor'} · Wage Band: ₹{profile.employment?.salaryBand}
                  </p>
                </div>
              </div>

              {/* Bottom seals and signatures */}
              <div className="cert-signatures flex justify-between items-end mt-12">
                <div className="sig-block text-center">
                  <div className="sig-line" />
                  <span className="sig-title">Training Provider Officer</span>
                  <span className="sig-dept">{profile.trainingProvider.code}</span>
                </div>
                <div className="sig-block text-center">
                  <div className="sig-line" />
                  <span className="sig-title">Employment Officer</span>
                  <span className="sig-dept">DET, Gujarat State</span>
                </div>
              </div>

              <div className="cert-footer text-center mt-6 text-xs text-muted">
                <span>Unique registry verification certificate. Valid on state analytics databases under GJ-SETU-OUTCOME-2026.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <ShieldAlert size={36} className="text-muted" />
            <p>Could not load candidate details.</p>
          </div>
        )}
      </div>

      <style>{`
        .certificate-frame {
          background-color: #FAF6EE;
          border: 12px double #BA7517;
          border-radius: 4px;
          padding: 8px;
          color: #2D271E;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .cert-inner-border {
          border: 2px solid #BA7517;
          padding: 32px;
          display: flex;
          flex-direction: column;
        }
        .cert-seal {
          margin-bottom: 8px;
        }
        .cert-state-title {
          font-family: var(--font-title);
          font-size: 16px;
          font-weight: 700;
          color: #854F0B;
          letter-spacing: 1px;
          margin: 0;
        }
        .cert-dept-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }
        
        .cert-main-title {
          font-family: var(--font-title);
          font-size: 24px;
          color: #5C3D00;
          letter-spacing: 1px;
          font-weight: 700;
          margin: 4px 0;
        }
        .cert-declaration {
          font-size: 13px;
          font-style: italic;
          color: var(--text-muted);
        }
        .cert-candidate-name {
          font-family: var(--font-title);
          font-size: 28px;
          color: #BA7517;
          font-weight: 600;
          border-bottom: 1px solid var(--border-color);
          display: inline-block;
          padding: 0 48px 4px 48px;
        }
        .cert-candidate-details {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 6px;
        }
        .cert-statement {
          font-size: 13px;
          line-height: 1.6;
          color: #4A463F;
        }
        .cert-employment-block {
          background-color: var(--bg-card);
          border: 1px solid #E2A62C;
          padding: 16px;
          border-radius: 6px;
          max-width: 500px;
          margin: 16px auto 0;
        }
        
        .sig-block {
          width: 180px;
        }
        .sig-line {
          height: 1px;
          background-color: var(--text-muted);
          width: 100%;
          margin-bottom: 6px;
        }
        .sig-title {
          font-size: 12px;
          font-weight: 700;
          display: block;
          color: var(--text-saffron-dark);
        }
        .sig-dept {
          font-size: 10px;
          color: var(--text-muted);
          display: block;
        }

        /* Print Media queries */
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            background-color: white;
          }
          .no-print {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};
export default TraineeCertificatePage;
