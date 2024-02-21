import React, { useState } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { Typography, Pagination } from '@mui/material';
import '../styles/projectcard.css'; 
import { projects } from '../utils';

const Projects = () => {
  const projectsPerPage = 4; 
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const offset = (currentPage - 1) * projectsPerPage;
  const currentProjects = projects.slice(offset, offset + projectsPerPage);

  return (
    <div id="projects" className="projects-container">
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
        Projects
      </Typography>
      <Typography style={{textAlign:"center"}}>
      <div style={{ borderBottom: '2px solid black',paddingBottom:"0px", width: '50%', margin: '0 auto', marginBottom: '20px' }}></div>
      <div className="projects-grid">
        {currentProjects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>

      <div className="pagination-container" >
        <Pagination
          count={Math.ceil(projects.length / projectsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </div>
      </Typography>
    </div>
  );
};

export { Projects };