import React from "react";
import { Box, Typography } from "@mui/material";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { projects } from "../utils";

const Projects = () => {
  const topProjects = projects.slice(0, 4); // Pick 4 best projects

  return (
    <Box
      id="projects"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
        padding: "4rem 0",
        position: "relative",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: "#fff",
          fontWeight: "bold",
          letterSpacing: 1.5,
          marginBottom: "3rem",
        }}
      >
        My Work
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: "3rem",
          position: "relative",
          maxWidth: "1100px",
          padding: "0 2rem",
        }}
      >
        {topProjects.map((project, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              transform: `rotate(${index % 2 === 0 ? "-3deg" : "3deg"}) scale(1)`,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: `rotate(0deg) scale(1.1)`,
              },
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: index % 2 === 0 ? "300px" : "250px",
                height: "auto",
                borderRadius: "8px",
                filter: "brightness(90%)",
                transition: "filter 0.3s",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                marginTop: "1rem",
              }}
            >
              {project.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#bbb",
                maxWidth: "80%",
                marginTop: "0.5rem",
              }}
            >
              {project.description}
            </Typography>
            <Box sx={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                <FaGithub size={22} color="#fff" />
              </a>
              {project.externalLink && (
                <a href={project.externalLink} target="_blank" rel="noopener noreferrer">
                  <FaExternalLinkAlt size={22} color="#fff" />
                </a>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export { Projects };
