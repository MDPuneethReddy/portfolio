import React, { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {  scroller } from 'react-scroll';

const Home = ({ navigate }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  const scrollToAbout = () => {
    console.log("clicked")
    scroller.scrollTo('about', {
      duration: 1500,
  delay: 100,
  smooth: true,
    });
  };
  return (
    <div id="home" style={{
      textAlign: 'center',
      paddingTop: '30vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#003366',
      width: '100%',
      minHeight: '100vh',
    }}>

      <h1 style={{color:"white"}}>Hello, I'm <span style={{ color: '#009688' }}>Puneeth Reddy</span>,</h1>
      <h1 style={{color: "white"}}>I'm a full-stack web developer</h1>
      <p>
      <button
        style={{
          cursor: 'pointer',
          border: '2px solid black',
          borderRadius: '5px',
          background: 'transparent',
          fontSize: '16px',
          color: 'black',
          padding: '10px 20px',
          transition: 'color 0.3s, background 0.3s',
          backgroundColor: hovered ? 'blue' : 'transparent',
          color: hovered ? 'white' : 'black',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={scrollToAbout}
      >
        View My Work{' '}
        {hovered ?(
          <ArrowDownwardIcon style={{ verticalAlign: 'middle' }} />
        ): (
          <ArrowForwardIcon style={{ verticalAlign: 'middle' }} />
        ) }
      </button>
      </p>
      

    </div>
  );
};

export { Home };
