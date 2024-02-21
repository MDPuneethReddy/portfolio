import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import '../styles/projectcard.css';

const ProjectCard = (props) => {
  return (
    <Card className='project-card'>
      <div className='card-front'>
        <CardMedia
          component="img"
          height="140"
          image={props.project.image}
          alt={props.project.title}
          sx={{ objectFit: 'cover', p: 2 }}
        />
        <CardContent className="card-content">
          <Typography style={{textAlign:"center"}}>
          <Typography style={{marginBottom: '8px'}} variant="h6"><b>{props.project.title}</b></Typography>
          <Typography style={{marginBottom: '8px'}} variant="body2" className="description">
            {props.project.description}
          </Typography>
          <Typography  style={{marginBottom: '8px',marginTop:"8px"}} variant="body2" className="tech-stack">
            Tech Stack:
            {props.project.techStack.map((tech, index) => (
              <Chip key={index} label={tech} style={{ margin: '0 5px' }} />
            ))}
          </Typography>
          <button
  style={{
    cursor: 'pointer',
    border: '2px solid blue',
    borderRadius: '10px',
    background: 'transparent',
    fontSize: '16px',
    color: 'black',
    padding: '10px 20px',
    transition: 'color 0.3s, background 0.3s, border 0.3s, border-radius 0.3s',
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = 'gold'}
  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
  onClick={() => window.open(props.project.githubLink, '_blank', 'noopener')}
>
  GitHub Link
</button>
</Typography>
        </CardContent>
      </div>
    </Card>
  );
};

export { ProjectCard };
