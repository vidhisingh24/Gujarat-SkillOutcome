import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, MapPin, Send, HelpCircle, RefreshCw } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'trainee',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const localErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      localErrors.name = 'This field is required. Please enter your name.';
    }
    
    if (!formData.email.trim()) {
      localErrors.email = 'This field is required. Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      localErrors.email = 'Enter a valid email address.';
    }

    if (!formData.message.trim()) {
      localErrors.message = 'This field is required. Please enter a message.';
    } else if (formData.message.trim().length < 20) {
      localErrors.message = 'Please enter at least 20 characters describing your inquiry.';
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation failed. Please correct the inline errors.', 'error');
      return;
    }

    setSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      showToast('✓ inquiry submitted successfully. Our helpdesk will respond shortly.', 'success');
      setFormData({ name: '', email: '', role: 'trainee', message: '' });
      setErrors({});
      setSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error inline as user types
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  return (
    <div className="contact-container py-12">
      <div className="container">
        <h1 className="page-title text-center mb-2">Helpdesk & Contact</h1>
        <p className="page-subtitle text-center text-muted mb-8">
          Get in touch with the KaushalSetu Support Desk or Directorate Officers.
        </p>

        <div className="grid grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="contact-info-col flex flex-col gap-6">
            <div className="card">
              <h4 className="card-title mb-4">Directorate Office</h4>
              <ul className="contact-details-list">
                <li className="flex items-start gap-3 mb-4">
                  <MapPin className="contact-icon text-saffron" size={20} />
                  <div>
                    <strong>Office Address:</strong>
                    <p className="text-muted text-sm mt-1" style={{ margin: 0 }}>
                      Directorate of Employment and Training (DET),<br />
                      Block No. 1, 3rd Floor, Dr. Jivraj Mehta Bhavan,<br />
                      Sector - 10, Gandhinagar, Gujarat 382010
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 mb-4">
                  <Phone className="contact-icon text-saffron" size={20} />
                  <div>
                    <strong>Helpdesk Number:</strong>
                    <p className="text-muted text-sm mt-1" style={{ margin: 0 }}>
                      +91 79 23253812 / 13 (Mon-Sat, 10:30 AM to 6:00 PM)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="contact-icon text-saffron" size={20} />
                  <div>
                    <strong>Support Email:</strong>
                    <p className="text-muted text-sm mt-1" style={{ margin: 0 }}>
                      support-kaushalsetu@gujarat.gov.in
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="card alert-card">
              <h5 className="flex items-center gap-2 mb-2" style={{ margin: 0, color: 'var(--text-saffron-dark)' }}>
                <HelpCircle size={18} />
                Frequently Asked Questions
              </h5>
              <p className="text-xs text-muted" style={{ margin: 0, lineHeight: 1.5 }}>
                Trainees can submit their 3, 6, or 12-month check-ins by logging in to the trainee portal. If you forgot your login password or trainee ID, please contact your respective ITI training provider to recover your credentials.
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="contact-form-col">
            <form onSubmit={handleSubmit} className="card" noValidate>
              <h4 className="card-title mb-4">Submit an Inquiry</h4>
              
              <div className="form-group">
                <label className="form-label" htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control" 
                  placeholder="Enter full name"
                />
                {errors.name && <div className="inline-error-msg">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control" 
                  placeholder="Enter email address"
                />
                {errors.email && <div className="inline-error-msg">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">Your Role</label>
                <select 
                  name="role" 
                  id="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="trainee">Trainee</option>
                  <option value="employer">Employer / Company Partner</option>
                  <option value="provider">Training Provider (ITI / Center)</option>
                  <option value="government">Government Official</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message / Question</label>
                <textarea 
                  name="message" 
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-control" 
                  placeholder="Describe your issue or query..."
                />
                {errors.message && <div className="inline-error-msg">{errors.message}</div>}
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary flex items-center gap-2 justify-center" style={{ width: '100%' }}>
                {submitting ? <RefreshCw className="loading-spinner animate-spin" size={14} /> : <Send size={14} />}
                <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-details-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .contact-icon {
          margin-top: 3px;
          flex-shrink: 0;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default ContactPage;
