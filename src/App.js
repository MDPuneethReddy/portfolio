import React from 'react';
import { Navbar } from './components/Navbar';
import {Home} from './pages/Home';
import {About} from './pages/About';
import {Contact} from './pages/Contact';
import {Projects} from './pages/Projects';
import {Experience} from "./pages/Experience"
import { Certification } from './pages/Certification';
import { CssBaseline, Container } from '@mui/material';
const App = () => {
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/home';
  
  return (
    <>
      <Navbar />
      <CssBaseline />
      <Container maxWidth="xl" style={{ padding: 0, margin: 0 }}>
        {isHomePage ? <Home /> : null}
        <About />
        <Experience />
        
        <Projects />
        <Certification />
        <Contact />
      </Container>
    </>
  );
};

export default App;
