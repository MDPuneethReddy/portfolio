import React from "react";
import { motion } from "framer-motion";
import Div100vh from "react-div-100vh";
import { ArrowRight } from "lucide-react";
import { Link  } from "react-scroll";

function Home() {
  return (
    <Div100vh className="flex items-center justify-center text-center w-full animated-bg">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-8 backdrop-blur-lg bg-[rgba(10,10,20,0.6)] p-12 rounded-3xl shadow-xl border border-[rgba(255,255,255,0.15)]"
      >
        <h1 style={{color:"white"}}className="text-7xl font-extrabold text-white tracking-wide">
          Hello, I'm{" "}
          <span className="bg-white text-black px-4 py-2 rounded-lg shadow-md">
            Puneeth
          </span>
        </h1>
        <h2  style={{color:"white"}} className="text-3xl text-white opacity-90 font-medium">
        I'm a full-stack web developer
        </h2>
        <Link
      to="about" // ID of the About section
      smooth={true}
      duration={800} // Smooth scrolling duration
      offset={-50} // Adjust offset if needed
    >
        <motion.button
  style={{
    backgroundColor: 'black', // Or your theme-based background color
    borderRadius: '9999px',      // For fully rounded corners
    color: 'white',              // White text
    padding: '0.75rem 1.5rem',    // Tailwind's px-6 py-3 equivalent
    fontSize: '1.125rem',        // Tailwind's text-lg equivalent
    fontWeight: 'bold',           // Tailwind's font-bold equivalent
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',               // Tailwind's gap-2 equivalent
    position: 'relative',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  }}
  className="transition-all duration-300 shadow-xl"
  whileHover={{
    scale: 1.05,
    boxShadow: "0px 0px 50px rgba(170, 0, 255, 1)",
  }}
  whileTap={{ scale: 0.95 }}
>
  <span style={{ position: 'relative', zIndex: 10 }}>View My Work</span>
  <ArrowRight size={22} style={{ position: 'relative', zIndex: 10, color: 'white' }} />

  {/* Always-visible neon glow effect */}
  <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#9400FF,#5A00FF,transparent)] 
                   opacity-60 blur-xl -z-10 animate-pulse"></span>
</motion.button>

</Link>


      </motion.div>
    </Div100vh>
  );
}

export { Home };
