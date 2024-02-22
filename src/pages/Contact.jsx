import React, { useState } from 'react';
import { Button, TextField, Snackbar, Typography } from '@mui/material';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
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
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div id="contact" style={{ padding: '20px', textAlign: 'center', color: 'black' }}>
      <Typography variant="h2" gutterBottom>
        Contact Me
      </Typography>
      <div style={{ borderBottom: '2px solid black', paddingBottom: '15px', width: '50%', margin: '0 auto', marginBottom: '15px' ,color:"black"}}></div>
      <form onSubmit={handleSubmit} style={{ maxWidth: '50%', margin: '0 auto' }}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          value={formData.name}
          onChange={handleChange}
          InputProps={{ style: { color: 'black' } }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          value={formData.email}
          onChange={handleChange}
          InputProps={{ style: { color: 'black' } }}
        />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          name="message"
          value={formData.message}
          onChange={handleChange}
          InputProps={{ style: { color: 'black' } }}
        />

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
          Submit
        </Button>
      </form>

      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Message sent!"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        style={{ color: 'black' }}
      />
    </div>
  );
};

export { Contact };
