import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { traineeApi } from '../../api/traineeApi';
import { useToast } from '../../context/ToastContext';
import type { CheckIn } from '../../data/mockData';
import { ClipboardList, Star, Save, ArrowLeft, RefreshCw, Upload, FileText } from 'lucide-react';

export const TraineeCheckInPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loadingCheckins, setLoadingCheckins] = useState(true);
  const [activeCheckin, setActiveCheckin] = useState<CheckIn | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [trainingRelated, setTrainingRelated] = useState<string>(''); // 'Exactly' | 'Somewhat' | 'Completely'
  const [salaryBand, setSalaryBand] = useState('');
  const [satisfaction, setSatisfaction] = useState<number>(0);
  const [reasonForLeaving, setReasonForLeaving] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // Optional Upload Evidence state (held locally on client as requested by prompt)
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Inline Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadCheckins = async () => {
    setLoadingCheckins(true);
    try {
      const list = await traineeApi.getCheckins();
      // Find the first pending checkin
      const pending = list.find(c => c.status === 'pending');
      if (pending) {
        setActiveCheckin(pending);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch check-in list.', 'error');
    } finally {
      setLoadingCheckins(false);
    }
  };

  useEffect(() => {
    loadCheckins();
  }, []);

  const handleRatingClick = (val: number) => {
    setSatisfaction(val);
    if (errors.satisfaction) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.satisfaction;
        return copy;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, evidenceFile: 'File size must be below the allowed limit of 5MB.' }));
      setEvidenceFile(null);
      setUploadProgress(null);
      return;
    }

    // Validate type (restricted extension list)
    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'docx'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = allowedExtensions.includes(ext || '');

    if (!isAllowedExt) {
      setErrors(prev => ({ ...prev, evidenceFile: 'Unsupported file type. Only PDF, PNG, JPG, or DOCX files are allowed.' }));
      setEvidenceFile(null);
      setUploadProgress(null);
      return;
    }

    // Reset validation error
    setErrors(prev => {
      const copy = { ...prev };
      delete copy.evidenceFile;
      return copy;
    });

    setEvidenceFile(file);
    setUploadProgress(0);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 80);
  };

  const handleRemoveFile = () => {
    setEvidenceFile(null);
    setUploadProgress(null);
    setErrors(prev => {
      const copy = { ...prev };
      delete copy.evidenceFile;
      return copy;
    });
  };

  const validateForm = () => {
    const localErrors: Record<string, string> = {};

    if (!employmentStatus) {
      localErrors.employmentStatus = 'This field is required. Please select your current employment status.';
    }
    
    if (employmentStatus && employmentStatus !== 'not_employed') {
      if (!trainingRelated) {
        localErrors.trainingRelated = 'This field is required. Please select training course relevance.';
      }
      if (!salaryBand) {
        localErrors.salaryBand = 'This field is required. Please select your current salary band.';
      }
    }

    if (satisfaction === 0) {
      localErrors.satisfaction = 'Please rate your job satisfaction (1 to 5 stars).';
    }

    if (feedbackText && feedbackText.trim().length < 20) {
      localErrors.feedbackText = 'Please enter at least 20 characters describing your feedback.';
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCheckin) return;
    if (!validateForm()) {
      showToast('Validation failed. Please correct the inline errors.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const isRelated = trainingRelated === 'Exactly' || trainingRelated === 'Somewhat';
      
      const payload = {
        checkInId: activeCheckin.id,
        employmentStatus,
        salaryBand: employmentStatus === 'not_employed' ? 'N/A' : salaryBand,
        trainingRelated: isRelated,
        satisfaction,
        reasonForLeaving: employmentStatus === 'not_employed' || employmentStatus === 'changed_job' ? reasonForLeaving : '',
        feedbackText
      };

      // Call central service API layer (excluding evidence file payload as backend does not support it yet)
      await traineeApi.submitCheckin(payload);
      showToast('✓ Check-in submitted successfully.', 'success');
      navigate('/trainee/dashboard');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to log check-in response.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCheckins) {
    return (
      <div className="container py-12 text-center">
        <div className="loading-spinner animate-spin" style={{ margin: '0 auto 16px' }} />
        <p className="text-muted">Loading pending survey metrics...</p>
      </div>
    );
  }

  if (!activeCheckin) {
    return (
      <div className="container py-12 text-center" style={{ maxWidth: '500px' }}>
        <div className="card text-center">
          <ClipboardList size={48} className="text-muted" style={{ margin: '0 auto 12px' }} />
          <h4>No Pending Check-ins</h4>
          <p className="text-muted text-sm mb-4">
            You do not have any due longitudinal check-ins. We will notify you when your next milestone check-in interval becomes available.
          </p>
          <button onClick={() => navigate('/trainee/dashboard')} className="btn btn-primary" style={{ margin: '0 auto' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkin-container py-8">
      <div className="container" style={{ maxWidth: '650px' }}>
        
        <button onClick={() => navigate('/trainee/dashboard')} className="btn btn-outline btn-sm mb-4">
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <div className="card checkin-survey-card">
          {/* Form Header */}
          <div className="survey-header flex gap-3 items-center mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="survey-icon-box">
              <ClipboardList size={22} />
            </div>
            <div>
              <span className="text-xs text-muted font-bold block">LONGITUDINAL FORM</span>
              <h3 style={{ margin: 0, fontSize: '18px' }}>
                {activeCheckin.cycle.replace('_', ' ').toUpperCase()} CHECK-IN Survey
              </h3>
              <span className="text-xs text-muted mt-1 block">Due Date: <strong>{activeCheckin.dueDate}</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="survey-form flex flex-col gap-6">
            
            {/* Field: Employment Status */}
            <div className="form-section">
              <h5 className="form-section-title mb-1">1. Current Employment Status <span className="req-star">*</span></h5>
              <span className="text-xs text-muted block mb-3">Select the option that matches your current professional standing.</span>
              <div className="radio-options-grid">
                {[
                  { value: 'employed', label: 'Employed (Private/Contract)' },
                  { value: 'self_employed', label: 'Self-Employed (Business / Freelancer)' },
                  { value: 'changed_job', label: 'Changed Job (New Company)' },
                  { value: 'not_employed', label: 'Unemployed / Looking for Job' }
                ].map(opt => (
                  <label key={opt.value} className={`radio-label card flex items-center gap-3 ${employmentStatus === opt.value ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="employmentStatus" 
                      value={opt.value}
                      checked={employmentStatus === opt.value}
                      onChange={(e) => {
                        setEmploymentStatus(e.target.value);
                        setErrors(prev => {
                          const c = { ...prev };
                          delete c.employmentStatus;
                          return c;
                        });
                      }}
                      className="radio-bullet"
                      disabled={submitting}
                    />
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.employmentStatus && <div className="inline-error-msg">{errors.employmentStatus}</div>}
            </div>

            {employmentStatus && employmentStatus !== 'not_employed' && (
              <>
                {/* Field: Training Relevance */}
                <div className="form-section">
                  <h5 className="form-section-title mb-1">2. Job Role & Training Relationship <span className="req-star">*</span></h5>
                  <span className="text-xs text-muted block mb-3">How closely does your daily workplace task match the ITI trade training you completed?</span>
                  <div className="radio-options-grid">
                    {[
                      { value: 'Exactly', label: 'Exactly Related (Job trade matches ITI course)' },
                      { value: 'Somewhat', label: 'Somewhat Different (Basic skills align, but role is broader)' },
                      { value: 'Completely', label: 'Completely Different (Work does not use ITI trade training)' }
                    ].map(opt => (
                      <label key={opt.value} className={`radio-label card flex items-center gap-3 ${trainingRelated === opt.value ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="trainingRelated" 
                          value={opt.value}
                          checked={trainingRelated === opt.value}
                          onChange={(e) => {
                            setTrainingRelated(e.target.value);
                            setErrors(prev => {
                              const c = { ...prev };
                              delete c.trainingRelated;
                              return c;
                            });
                          }}
                          className="radio-bullet"
                          disabled={submitting}
                        />
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.trainingRelated && <div className="inline-error-msg">{errors.trainingRelated}</div>}
                </div>

                {/* Field: Salary Band */}
                <div className="form-section">
                  <h5 className="form-section-title mb-1">3. Monthly Salary Band <span className="req-star">*</span></h5>
                  <span className="text-xs text-muted block mb-3">Select your gross monthly income bracket.</span>
                  <div className="radio-options-grid select-grid">
                    {[
                      { value: 'Below 10,000', label: 'Below ₹10,000' },
                      { value: '10,000 - 18,000', label: '₹10,000 - ₹18,000' },
                      { value: '18,000 - 25,000', label: '₹18,000 - ₹25,000' },
                      { value: 'Above 25,000', label: 'Above ₹25,000' }
                    ].map(opt => (
                      <label key={opt.value} className={`radio-label card flex items-center gap-3 ${salaryBand === opt.value ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="salaryBand" 
                          value={opt.value}
                          checked={salaryBand === opt.value}
                          onChange={(e) => {
                            setSalaryBand(e.target.value);
                            setErrors(prev => {
                              const c = { ...prev };
                              delete c.salaryBand;
                              return c;
                            });
                          }}
                          className="radio-bullet"
                          disabled={submitting}
                        />
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.salaryBand && <div className="inline-error-msg">{errors.salaryBand}</div>}
                </div>
              </>
            )}

            {/* Optional Field: Reason for leaving/unemployment */}
            {(employmentStatus === 'not_employed' || employmentStatus === 'changed_job') && (
              <div className="form-group">
                <label className="form-label font-semibold" htmlFor="reasonForLeaving">Reason for Unemployment / Job Attrition <span className="text-xs font-normal text-muted">(Optional)</span></label>
                <textarea
                  id="reasonForLeaving"
                  rows={2}
                  value={reasonForLeaving}
                  onChange={(e) => setReasonForLeaving(e.target.value)}
                  className="form-control"
                  placeholder="e.g. low pay rate, transportation issue, return to home town, etc."
                  disabled={submitting}
                />
              </div>
            )}

            {/* Field: Satisfaction */}
            <div className="form-section">
              <h5 className="form-section-title mb-1">4. Overall Job / Placement Satisfaction <span className="req-star">*</span></h5>
              <span className="text-xs text-muted block mb-3">Rate your overall experience with your post-placement employment.</span>
              <div className="star-rating-box flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    type="button" 
                    onClick={() => handleRatingClick(star)}
                    className="star-btn"
                    disabled={submitting}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star 
                      size={28} 
                      fill={star <= satisfaction ? 'var(--accent-saffron)' : 'none'} 
                      stroke={star <= satisfaction ? 'var(--accent-saffron)' : 'var(--text-muted)'} 
                    />
                  </button>
                ))}
              </div>
              {errors.satisfaction && <div className="inline-error-msg">{errors.satisfaction}</div>}
            </div>

            {/* Field: Feedback text */}
            <div className="form-group">
              <label className="form-label font-semibold" htmlFor="feedbackText">General Feedback / Skill Gaps Noticed <span className="text-xs font-normal text-muted">(Optional, min 20 characters if entered)</span></label>
              <textarea
                id="feedbackText"
                rows={3}
                value={feedbackText}
                onChange={(e) => {
                  setFeedbackText(e.target.value);
                  if (errors.feedbackText) {
                    setErrors(prev => {
                      const copy = { ...prev };
                      delete copy.feedbackText;
                      return copy;
                    });
                  }
                }}
                className="form-control"
                placeholder="e.g. machines used at work were newer than training equipment, or need more Siemens CNC controller training"
                disabled={submitting}
              />
              {errors.feedbackText && <div className="inline-error-msg">{errors.feedbackText}</div>}
            </div>

            {/* Field: Supporting Evidence Upload (Optional) */}
            <div className="form-section">
              <h5 className="form-section-title mb-1">Supporting Evidence <span className="text-xs font-normal text-muted">(Optional)</span></h5>
              <span className="text-xs text-muted block mb-3">Upload an offer letter, salary slip or other employment proof.</span>
              
              <div className="file-upload-box card" style={{ padding: '16px', borderStyle: 'dashed', borderColor: errors.evidenceFile ? 'var(--status-red-border)' : 'var(--border-color)' }}>
                <input 
                  type="file" 
                  id="evidenceFile" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                  disabled={submitting}
                />
                
                {!evidenceFile ? (
                  <label htmlFor="evidenceFile" className="file-upload-label flex flex-col items-center justify-center py-4 cursor-pointer" style={{ width: '100%' }}>
                    <span className="btn btn-outline btn-sm mb-2 flex items-center gap-1">
                      <Upload size={12} />
                      Choose File
                    </span>
                    <span className="text-xs text-muted" style={{ fontSize: '11px' }}>Allowed types: PDF, PNG, JPG, DOCX (Max 5MB)</span>
                  </label>
                ) : (
                  <div className="file-info-container flex flex-col gap-2">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="file-meta flex items-center gap-2">
                        <FileText size={20} className="text-muted" />
                        <div className="flex flex-col">
                          <strong className="text-xs text-brown-dark" style={{ wordBreak: 'break-all' }}>{evidenceFile.name}</strong>
                          <span className="text-xs text-muted" style={{ fontSize: '10px' }}>
                            Type: {evidenceFile.type || 'Document'} · Size: {(evidenceFile.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleRemoveFile}
                        disabled={submitting}
                        className="btn btn-outline btn-sm py-1 px-3"
                        style={{ color: 'var(--status-red-text)', borderColor: 'var(--status-red-border)', height: '28px', fontSize: '11px' }}
                      >
                        Remove
                      </button>
                    </div>

                    {uploadProgress !== null && (
                      <div className="upload-progress-wrapper mt-1">
                        <div className="progress-bar-bg" style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div className="progress-bar-fill" style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--status-green-text)', transition: 'width 0.15s ease-in-out' }} />
                        </div>
                        <span className="text-xs text-muted mt-1 block text-right" style={{ fontSize: '10px' }}>
                          {uploadProgress === 100 ? '✓ Ready to Submit' : `Uploading: ${uploadProgress}%`}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.evidenceFile && <div className="inline-error-msg">{errors.evidenceFile}</div>}
            </div>

            <div className="survey-actions flex gap-4 mt-4 justify-end">
              <button 
                type="button" 
                onClick={() => navigate('/trainee/dashboard')} 
                className="btn btn-outline"
                disabled={submitting}
              >
                Remind Me Later
              </button>
              <button 
                type="submit" 
                className="btn btn-primary flex items-center gap-2"
                disabled={submitting}
              >
                {submitting ? <RefreshCw className="loading-spinner animate-spin" size={14} /> : <Save size={14} />}
                <span>{submitting ? 'Submitting...' : 'Submit Update'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>

      <style>{`
        .survey-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background-color: var(--bg-cream);
          color: var(--accent-icon);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .form-section-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-saffron-dark);
          text-transform: uppercase;
        }
        .req-star {
          color: var(--status-red-text);
          font-weight: bold;
        }
        .radio-options-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .radio-label {
          padding: 12px 16px;
          cursor: pointer;
          border-color: var(--border-color);
          transition: all 0.15s ease;
        }
        .radio-label.selected {
          border-color: var(--accent-icon);
          background-color: #FAF8F2;
          box-shadow: var(--shadow-hover);
        }
        .radio-bullet {
          accent-color: var(--accent-icon);
          cursor: pointer;
        }
        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.1s ease;
        }
        .star-btn:hover {
          transform: scale(1.1);
        }
        .inline-error-msg {
          color: var(--status-red-text);
          font-size: 11px;
          margin-top: 6px;
          font-weight: 600;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .radio-options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
export default TraineeCheckInPage;
