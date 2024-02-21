import React from 'react';
import { Container, Typography,  List, ListItem, ListItemText, Grid, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import { frontendskills,backendskills } from '../utils';


const Experience = () => {
  

  return (
    <div id="experience" style={{backgroundColor:""}}>
    <Container maxWidth="lg">
    <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
        Experience
      </Typography>
      <div style={{ borderBottom: '2px solid black',paddingBottom:"0px", width: '50%', margin: '0 auto', marginBottom: '20px' }}></div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: 'teal' }}>
            <Typography variant="h5" gutterBottom>
              Frontend Development & Project Management
            </Typography>
            <List>
              {frontendskills.map((skill, index) => (
                <ListItem key={index}>
                  <CheckCircleIcon sx={{ marginRight: 1 }} /> 
                  <ListItemText primary={skill.name} secondary={skill.proficiency} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: 'teal' }}>
            <Typography variant="h5" gutterBottom>
              Backend Development & Other Tools
            </Typography>
            <List>
              {backendskills.map((skill, index) => (
                <ListItem key={index}>
                  <CheckCircleIcon sx={{ marginRight: 1 }} /> 
                  <ListItemText primary={skill.name} secondary={skill.proficiency} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
};

export  {Experience};
