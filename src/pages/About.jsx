import React from "react";
import { Typography, Button, Container, Stack, Card, CardMedia } from "@mui/material";
import { motion } from "framer-motion";
import { FaUserGraduate, FaCode, FaRocket } from "react-icons/fa";
import { LinkedIn } from "@mui/icons-material";

const About = () => {
  return (
    <div
      id="about"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="animated-bg"
    >
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            gutterBottom
            style={{ color: "white" }}
          >
            Who Am I?
          </Typography>
        </motion.div>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <Card
              sx={{
                width: 250,
                height: 250,
                borderRadius: "20px",
                boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.3)",
                overflow: "hidden",
                border: "2px solid #9400FF",
              }}
            >
              <CardMedia component="img" image="/assets/puneeth.JPG" alt="Puneeth Reddy" sx={{ width: "100%", height: "100%" }} />
            </Card>
          </motion.div>

          {/* Info Section */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <div
              className="backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-[rgba(255,255,255,0.15)]"
              style={{
                background: "rgba(10,10,20,0.6)",
                padding: "20px",
                borderRadius: "15px",
              }}
            >
              <Typography variant="h5" gutterBottom style={{ color: "white" }}>
                Hey! I'm <b>Puneeth Reddy</b>
              </Typography>
              <Typography variant="body1" lineHeight={1.8} style={{ color: "white" }}>
                A results-driven software developer with a strong background in full-stack development.  
                Experienced in designing and deploying scalable solutions, optimizing system performance,  
                and collaborating with cross-functional teams to drive innovation.
              </Typography>

              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: "50px",
                  px: 4,
                  py: 1.5,
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#5A00FF",
                  },
                }}
                href="https://www.linkedin.com/in/mdpuneethreddy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn sx={{ mr: 1 }} /> Let's Connect 🚀
              </Button>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <Stack spacing={3}>
              <InfoCard icon={<FaUserGraduate size={30} />} title="Education" description="MTech in Software Engineering" />
              <InfoCard icon={<FaCode size={30} />} title="Experience" description="4+ years in Full Stack Development" />
              <InfoCard icon={<FaRocket size={30} />} title="Projects" description="Built 10+ industry-level solutions" />
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </div>
  );
};

const InfoCard = ({ icon, title, description }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.1)",
        padding: "12px",
        borderRadius: "10px",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
        transition: "0.3s",
      }}
      className="hover:scale-105 hover:shadow-lg transition"
    >
      <div style={{ color: "#FFD700", marginRight: "10px" }}>{icon}</div>
      <div>
        <Typography variant="h6" fontWeight={600} style={{ color: "white" }}>
          {title}
        </Typography>
        <Typography variant="body2" style={{ color: "white" }}>
          {description}
        </Typography>
      </div>
    </div>
  );
};

export { About };
