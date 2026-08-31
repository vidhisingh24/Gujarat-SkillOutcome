import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Tag } from 'lucide-react';

const publicProgrammes = [
  { id: '1', title: 'Advanced Machine Operations (CNC Operator)', trade: 'CNC Machinist', sector: 'Capital Goods', duration: '6 Months', description: 'Comprehensive training on operating and programming Siemens/Fanuc CNC milling and lathe machines.' },
  { id: '2', title: 'Arc & Gas Welding Specialist', trade: 'Welder', sector: 'Fabrication & Manufacturing', duration: '3 Months', description: 'Advanced welding protocols including MIG, TIG, and heavy gas welding operations.' },
  { id: '3', title: 'Industrial Fitter Course', trade: 'Fitter', sector: 'Manufacturing & Engineering', duration: '1 Year', description: 'Core mechanical maintenance, assembly, fitting, and structural engineering training.' },
  { id: '4', title: 'Industrial Electrician & Wireman', trade: 'Electrician', sector: 'Power & Infrastructure', duration: '1 Year', description: 'Heavy industrial power lines wiring, control panel setup, and electrical grids maintenance.' },
  { id: '5', title: 'Office Automation & IT Support', trade: 'IT Specialist', sector: 'IT-ITeS', duration: '3 Months', description: 'Database management, hardware configurations, office suites automation, and customer technical support.' },
  { id: '6', title: 'Solar PV System Installation Specialist', trade: 'Solar Technician', sector: 'Renewable Energy', duration: '3 Months', description: 'Installing, configuring, and maintaining solar photovoltaic panels and grid solar systems.' }
];

export const ProgrammesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  const filteredProgrammes = publicProgrammes.filter(prog => {
    const matchesSearch = prog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prog.trade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || prog.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const sectors = ['All', 'Capital Goods', 'Fabrication & Manufacturing', 'Manufacturing & Engineering', 'Power & Infrastructure', 'IT-ITeS', 'Renewable Energy'];

  return (
    <div className="programmes-container py-12">
      <div className="container">
        <h1 className="page-title text-center mb-2">Vocational Training Programmes</h1>
        <p className="page-subtitle text-center text-muted mb-8">
          Explore certified skill-development initiatives offered across Gujarat's technical training network.
        </p>

        {/* Filter controls */}
        <div className="filter-bar card flex justify-between items-center mb-6 gap-4">
          <div className="search-box flex items-center gap-2">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search by trade or title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="sector-filter flex items-center gap-2">
            <Filter size={16} className="text-muted" />
            <select 
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="sector-select"
            >
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Programmes grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredProgrammes.length > 0 ? (
            filteredProgrammes.map(prog => (
              <div key={prog.id} className="programme-card card flex flex-col justify-between">
                <div>
                  <div className="programme-meta flex gap-2 mb-2">
                    <span className="badge badge-yellow flex items-center gap-1">
                      <Tag size={10} />
                      {prog.sector}
                    </span>
                    <span className="badge badge-green flex items-center gap-1">
                      <Clock size={10} />
                      {prog.duration}
                    </span>
                  </div>
                  <h4 className="programme-card-title mb-2">{prog.title}</h4>
                  <p className="programme-card-desc mb-4">{prog.description}</p>
                </div>
                <div className="programme-footer flex justify-between items-center">
                  <span className="text-sm font-semibold text-brown">Trade: {prog.trade}</span>
                  <a href="#register" className="btn btn-outline btn-sm">Course Details</a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <BookOpen size={48} className="text-muted mb-2" style={{ margin: '0 auto' }} />
              <h5>No Programmes Found</h5>
              <p className="text-muted text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .filter-bar {
          padding: 16px 24px;
        }
        .search-box {
          flex: 1;
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: var(--radius-input);
          background-color: var(--bg-card);
        }
        .search-input {
          border: none;
          background: none;
          outline: none;
          width: 100%;
          font-size: 14px;
        }
        .sector-select {
          padding: 8px 12px;
          border-radius: var(--radius-input);
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          outline: none;
          font-size: 13px;
        }
        
        .programme-card-title {
          font-size: 15px;
          color: var(--text-saffron-dark);
          font-weight: 750;
        }
        .programme-card-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .col-span-3 {
          grid-column: span 3;
        }
        @media (max-width: 768px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .col-span-3 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};
export default ProgrammesPage;
