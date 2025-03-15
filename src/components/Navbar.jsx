import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Button,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import { pages } from "../utils";

const navbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "rgba(10, 10, 20, 0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo / Brand */}
          <motion.div variants={navbarVariants} initial="hidden" animate="visible">
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Puneeth Reddy
            </Typography>
          </motion.div>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            {pages.map((page, index) => (
              <motion.div
                key={page}
                variants={linkVariants}
                custom={index}
                initial="hidden"
                animate="visible"
              >
                <Button sx={{ color: "#fff", ml: 2 }}>
                  <ScrollLink
                    to={page.toLowerCase()}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    style={{
                      cursor: "pointer",
                      textTransform: "uppercase",
                      fontSize: "14px",
                      letterSpacing: "1px",
                      transition: "0.3s",
                    }}
                    whileHover={{ scale: 1.1, color: "#00FFA3" }}
                  >
                    {page}
                  </ScrollLink>
                </Button>
              </motion.div>
            ))}

            {/* Blog Button */}
            <motion.div variants={linkVariants} custom={pages.length} initial="hidden" animate="visible">
              <Button
                onClick={() => window.open("https://blog.mdpuneethreddy.com", "_blank", "noopener")}
                sx={{
                  color: "#00FFA3",
                  ml: 3,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "20px",
                  px: 2.5,
                  py: 1,
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Blog
              </Button>
            </motion.div>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Menu Drawer */}
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={toggleMobileMenu}
            PaperProps={{
              sx: {
                background: "rgba(10, 10, 20, 0.95)",
                backdropFilter: "blur(15px)",
                width: "250px",
                color: "#fff",
              },
            }}
          >
            <List>
              {pages.map((page, index) => (
                <motion.div
                  key={page}
                  variants={linkVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                >
                  <ListItem button onClick={toggleMobileMenu}>
                    <ScrollLink to={page.toLowerCase()} smooth={true} duration={500}>
                      <ListItemText
                        primary={page}
                        sx={{
                          textAlign: "center",
                          textTransform: "uppercase",
                          color: "#fff",
                          fontSize: "14px",
                        }}
                      />
                    </ScrollLink>
                  </ListItem>
                </motion.div>
              ))}

              {/* Mobile Blog Button */}
              <motion.div variants={linkVariants} custom={pages.length} initial="hidden" animate="visible">
                <ListItem button onClick={() => window.open("https://blog.mdpuneethreddy.com", "_blank", "noopener")}>
                  <ListItemText
                    primary="Blog"
                    sx={{
                      textAlign: "center",
                      textTransform: "uppercase",
                      color: "#00FFA3",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
              </motion.div>
            </List>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export { Navbar };
