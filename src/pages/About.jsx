import React from 'react';
import { Grid, Paper, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PeopleIcon from '@mui/icons-material/People';
const About = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid id="about" style={{backgroundColor:""}} container spacing={isSmallScreen ? 2 : 4} justifyContent="center" alignItems="center">
      <Grid item xs={12} >
        <Typography variant="h2" align="center" gutterBottom>
          About Me
        </Typography>
      </Grid>
      <div style={{ borderBottom: '2px solid black',paddingBottom:"0px", width: '50%', margin: '0 auto', marginBottom: '20px' }}></div>
      <Grid item xs={12} md={8} textAlign="center">
  <Avatar
    alt="Your Name"
    src="./assets/puneeth.JPG"
    
    sx={{
      width: isSmallScreen ? theme.spacing(20) : theme.spacing(30),
      height: isSmallScreen ? theme.spacing(15) : theme.spacing(30),
      borderRadius: '50%', 
      margin: '0 auto', 
    }}
  />
</Grid>
      <Grid item xs={12} md={8} container spacing={isSmallScreen ? 2 : 4}>
        <Grid item xs={12} sm={6} >
          <Paper elevation={3} style={{ height:"150px", borderRadius: '5px', marginBottom: '15px',backgroundColor:"teal" }}>
          <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
  <LightbulbIcon />
  <h2 style={{ margin: '0', padding: '0', fontSize:"18px" }}>Experience</h2>
  <p style={{ margin: '10px', padding: '10px',fontSize:"15px" }}>3.5 years</p>
  <p style={{ margin: '0', padding: '0',fontSize:"15px" }}>Full Stack Software Development</p>
</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ height:"150px", borderRadius: '5px', marginBottom: '15px',backgroundColor:"teal" }}>
          <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
  <PeopleIcon />
  <h2 style={{ margin: '0', padding: '0',fontSize:"18px" }}>Education</h2>
  <p style={{ margin: '10px', padding: '10px' ,fontSize:"15px"}}>Masters Degree in Computer Science</p>
  <p style={{ margin: '0', padding: '0',fontSize:"15px" }}>MTech in Software Engineering</p>
  
</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center" style={{ margin: '0 auto', maxWidth: '800px' }}>
          Hello! I'm Puneeth Reddy, a dynamic Full Stack Developer currently pursuing a Master's in Computer Science at Florida State University. Armed with a Bachelor's in Integrated Software Engineering from Vellore Institute of Technology, I excel in a multitude of technologies including <b>Python</b>,<b> JavaScript</b>,<b> TypeScript</b>,<b> HTML</b>,<b> CSS</b>, and various databases such as <b>PostgreSQL</b>,<b> MySQL</b>,<b> MongoDB</b>, and <b>SQLite</b>. Proficient in frameworks like <b>React</b>, <b>Redux</b>, <b>NodeJS</b>,<b>FastAPI</b> and <b>Express</b>, I bring a wealth of experience from my role as a <b>Full Stack Developer</b> at <b>Novartis</b>, where I led the adoption of cost-saving tools, resulting in a substantial reduction in company expenditures. My skills extend to <b>API design</b>, <b>data visualization</b>, and <b>microservices architecture</b>. Let's connect and explore the vast world of web development!
        </Typography>
      </Grid>
    </Grid>
  );
};

export { About };
