import React, { useState } from 'react';
import { CertificationCard } from '../components/CertificationCard';
import {  Typography, Pagination } from '@mui/material';
import '../styles/projectcard.css'; 
import { certifications } from '../utils';

const Certification = () => {
  const projectsPerPage = 4; 
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const offset = (currentPage - 1) * projectsPerPage;
  const currentcertifications = certifications.slice(offset, offset + projectsPerPage);

  return (
    <div id="certification" className="projects-container">
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
        Certifications
      </Typography>
      <div style={{ borderBottom: '2px solid black',paddingBottom:"0px", width: '50%', margin: '0 auto', marginBottom: '20px' }}></div>
      <div className="projects-grid">
        {currentcertifications.map((project, index) => (
          <CertificationCard key={index} project={project} />
        ))}
      </div>

      <div className="pagination-container">
        <Pagination
          count={Math.ceil(certifications.length / projectsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export { Certification };