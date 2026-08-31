import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, RefreshCw } from 'lucide-react';

interface ExportControlProps {
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
}

export const ExportControl: React.FC<ExportControlProps> = ({ onExport }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen(!open);

  const handleSelect = async (format: 'csv' | 'excel' | 'pdf') => {
    setOpen(false);
    setLoading(true);
    // Simulate generation latency (as required: "Show a loading state while generating large exports.")
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      onExport(format);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="export-control-container" ref={containerRef}>
      <button 
        type="button"
        onClick={toggleDropdown}
        disabled={loading}
        className="btn btn-outline btn-sm export-trigger-btn flex items-center gap-1"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Export dataset options"
        style={{ minWidth: '95px', height: '32px' }}
      >
        {loading ? (
          <RefreshCw size={14} className="loading-spinner animate-spin" />
        ) : (
          <Download size={14} />
        )}
        <span>Export</span>
        <ChevronDown size={12} />
      </button>

      {open && (
        <ul className="export-dropdown-menu" role="listbox">
          <li role="option" aria-selected="false" onClick={() => handleSelect('csv')}>CSV</li>
          <li role="option" aria-selected="false" onClick={() => handleSelect('excel')}>Excel</li>
          <li role="option" aria-selected="false" onClick={() => handleSelect('pdf')}>PDF</li>
        </ul>
      )}

      <style>{`
        .export-control-container {
          position: relative;
          display: inline-block;
        }
        .export-dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-input);
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          padding: 4px 0;
          list-style: none;
          z-index: 100;
          min-width: 100px;
        }
        .export-dropdown-menu li {
          padding: 8px 16px;
          font-size: 12px;
          cursor: pointer;
          color: var(--text-primary);
          transition: background-color 0.15s ease;
          font-weight: 550;
          text-align: left;
        }
        .export-dropdown-menu li:hover {
          background-color: var(--bg-primary);
          color: var(--text-brown);
        }
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
export default ExportControl;
