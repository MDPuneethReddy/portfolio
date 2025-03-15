import React, { useState } from "react";
import { motion } from "framer-motion";
import Div100vh from "react-div-100vh";
import { Mail, Send } from "lucide-react";
import { TextField, Button, Snackbar } from "@mui/material";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://formspree.io/f/${process.env.REACT_APP_FORMSPREE_ID}`, formData);
      if (response.status === 200) {
        setOpen(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Div100vh id="contact" className="flex items-center justify-center text-center w-full animated-bg">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-8 backdrop-blur-lg bg-[rgba(10,10,20,0.6)] p-12 rounded-3xl shadow-xl border border-[rgba(255,255,255,0.15)] w-full max-w-lg"
      >
        <h1 style={{color:"white"}} className="text-4xl font-extrabold text-white tracking-wide flex items-center gap-3">
          <Mail className="text-blue-400" size={36} /> Contact Me
        </h1>
        <p style={{color:"white"}}className="text-white opacity-80 text-lg">
          I'd love to hear from you! Let's create something amazing together.
        </p>

        <motion.form 
          onSubmit={handleSubmit} 
          className="w-full flex flex-col gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TextField 
            label="Name" 
            name="name" 
            fullWidth 
            variant="filled" 
            className="bg-gray-700 text-white rounded-lg"
            value={formData.name} 
            onChange={handleChange} 
            InputLabelProps={{ style: { color: '#bbb' } }}
            inputProps={{ style: { color: "white" } }} 
          />
          <TextField 
            label="Email" 
            name="email" 
            fullWidth 
            variant="filled" 
            className="bg-gray-700 text-white rounded-lg"
            value={formData.email} 
            onChange={handleChange} 
            InputLabelProps={{ style: { color: '#bbb' } }}
            inputProps={{ style: { color: "white" } }} 
          />
          <TextField 
            label="Message" 
            name="message" 
            fullWidth 
            multiline rows={4} 
            variant="filled" 
            className="bg-gray-700 text-white rounded-lg"
            value={formData.message} 
            onChange={handleChange} 
            InputLabelProps={{ style: { color: '#bbb' } }}
            inputProps={{ style: { color: "white" } }} 
          />
          <motion.button
            type="submit"
            style={{
              backgroundColor: 'black',
              borderRadius: '9999px',
              color: 'white',
              padding: '0.75rem 1.5rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
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
            <span style={{ position: 'relative', zIndex: 10 }}>Send Message</span>
            <Send size={22} style={{ position: 'relative', zIndex: 10, color: 'white' }} />

            {/* Neon Glow Effect */}
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#9400FF,#5A00FF,transparent)] 
                             opacity-60 blur-xl -z-10 animate-pulse"></span>
          </motion.button>
        </motion.form>

        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => setOpen(false)}
          message="Message sent successfully!"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        />
      </motion.div>
    </Div100vh>
  );
};

export { Contact };
