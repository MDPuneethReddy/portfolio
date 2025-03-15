import React from "react";
import { Container, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { skills } from "../utils";

const Experience = () => {
  return (
    <div
      id="skills"
      style={{
        background: "linear-gradient(135deg, #1E1E1E, #282828)",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="lg">
        {/* Heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ color: "#fff", letterSpacing: 1.5, marginBottom: 3 }}
          >
            Skills & Expertise
          </Typography>
        </motion.div>

        {/* Skills Grid with animations */}
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          spacing={4}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 50, color: "#fff" }}>{skill.icon}</div>
              <Typography sx={{ color: "#ccc", marginTop: 1 }}>
                {skill.name}
              </Typography>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </div>
  );
};

export { Experience };
