import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

const skills = [
  'html5',
  'css3',
  'javascript',
  'react',
  'nodejs',
  // Add more icons as needed
];

function Skills() {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {skills.map((skill, index) => (
          <Grid
            item
            xs={12} // 1 icon per row on small screens
            sm={6}  // 2 icons per row on small screens
            md={4}  // 3 icons per row on medium screens
            lg={3}  // 4 icons per row on large screens
            xl={2.4} // 5 icons per row on extra-large screens
            key={index}
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <Icon sx={{ fontSize: 40 }}>{skill}</Icon>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
export {Skills}
