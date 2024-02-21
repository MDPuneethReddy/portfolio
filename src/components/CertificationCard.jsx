import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import '../styles/projectcard.css'; 

const CertificationCard = (props) => {
  return (
    <Card className="project-card" >
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
            <Typography variant="h6">{props.project.title}</Typography>
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
  onClick={() => window.open(props.project.link, '_blank', 'noopener')}
>
  View
</button>
            </Typography>
          </CardContent>
        </div>
    </Card>
  );
};

export { CertificationCard };
