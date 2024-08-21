import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { skills } from '../utils';

const Experience = () => {
  return (
    <div id="experience" style={{ paddingTop: '40px', paddingBottom: '40px', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            padding: 4,
            border: '1px solid #ddd',
            backgroundColor: '#ffffff',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 4 }}>
            Skills
          </Typography>
          <Grid container spacing={3}>
            {skills.map((skill, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
              >
                <Paper
                  elevation={2}
                  sx={{
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <Box sx={{ fontSize: 50, marginBottom: 1 }}>
                    {skill.icon}
                  </Box>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    {skill.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export { Experience };
