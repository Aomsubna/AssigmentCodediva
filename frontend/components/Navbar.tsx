"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import LanguageIcon from "@mui/icons-material/Language";
import React from "react";
import {
  Drawer,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const rounter = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [anchorElDrawer, setAnchorElDrawer] = useState<null | HTMLElement>(
    null
  );
  const openDrawerMenu = Boolean(anchorElDrawer);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const { lang, setLang } = useLanguage();

  const handleSelect = (selectedLang: "TH" | "EN") => {
    setLang(selectedLang);
    handleClose();
  };
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleLogout = () => {
    handleClose();
    setAnchorEl2(null);
    logout();
  };

  return (
    <div className="flex w-full shadow-lg shadow-black/3 justify-center bg-[#fcfeff] fixed top-0 left-0 right-0 z-50">
      <nav className="bg-[#fcfeff] px-6 py-5 lg:py-4 flex justify-between items-center w-full max-w-7xl">
        <div className="lg:hidden absolute left-4">
          <IconButton onClick={() => setOpenDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </div>
        <div
          className="text-black font-bold text-xl cursor-pointer mx-auto lg:mx-0"
          onClick={() => rounter.push("/")}
        >
          🍨 Swensen Clone
        </div>

        <div className="hidden lg:flex space-x-2 ml-auto">
          {/* <div className="flex space-x-2"> */}
          {user ? (
            <div className="flex gap-2">
              {user.isAdmin == true ? (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => rounter.push("/product")}
                >
                  {lang == "TH" ? "เพิ่มสินค้า" : "Add Product"}
                </Button>
              ) : null}
              <Button
                variant="outlined"
                fullWidth
                style={{ borderRadius: "50px" }}
                onClick={handleClick2}
              >
                {lang == "TH"
                  ? `สวัสดี ${user.firstName}`
                  : `Hello ${user.firstName}`}
              </Button>
              <Menu
                anchorEl={anchorEl2}
                open={open2}
                onClose={handleClose2}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleLogout}>
                  {lang === "TH" ? "ออกจากระบบ" : "Logout"}
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              variant="contained"
              fullWidth
              style={{ borderRadius: "50px" }}
              onClick={() => {
                rounter.push("/login");
                setOpenDrawer(false);
              }}
            >
              {lang == "TH" ? "เข้าสู่ระบบ / ลงทะเบียน" : "Login / Register"}
            </Button>
          )}
          {/* <Button
            variant="contained"
            style={{ borderRadius: "50px" }}
            onClick={() => rounter.push("/login")}
          >
            {lang == "TH" ? "เข้าสู่ระบบ / ลงทะเบียน" : "Login / Register"}
          </Button> */}
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            startIcon={<LanguageIcon />}
          >
            {lang}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
          >
            <MenuItem onClick={() => handleSelect("TH")}>TH</MenuItem>
            <MenuItem onClick={() => handleSelect("EN")}>EN</MenuItem>
          </Menu>
        </div>
      </nav>

      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <div className="w-64 p-4 space-y-4">
          {user ? (
            <div className="flex flex-col space-y-2 gap-2">
              <Typography variant="subtitle1" className="font-bold">
                {lang === "TH"
                  ? `สวัสดี, ${user.firstName}`
                  : `Hello, ${user.firstName}`}
              </Typography>

              {user.isAdmin && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    rounter.push("/product");
                    setOpenDrawer(false);
                  }}
                >
                  {lang === "TH" ? "เพิ่มสินค้า" : "Add Product"}
                </Button>
              )}

              <Button
                variant="outlined"
                fullWidth
                onClick={(e) => setAnchorElDrawer(e.currentTarget)}
                endIcon={<LanguageIcon />}
              >
                {lang}
              </Button>
              <Menu
                anchorEl={anchorElDrawer}
                open={openDrawerMenu}
                onClose={() => setAnchorElDrawer(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    handleSelect("TH");
                    setOpenDrawer(false);
                    setAnchorElDrawer(null);
                  }}
                >
                  TH
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleSelect("EN");
                    setOpenDrawer(false);
                    setAnchorElDrawer(null);
                  }}
                >
                  EN
                </MenuItem>
              </Menu>

              <Button
                variant="contained"
                fullWidth
                color="error"
                onClick={() => {
                  handleLogout();
                  setOpenDrawer(false);
                }}
              >
                {lang === "TH" ? "ออกจากระบบ" : "Logout"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant="outlined"
                fullWidth
                onClick={(e) => setAnchorElDrawer(e.currentTarget)}
                endIcon={<LanguageIcon />}
              >
                {lang}
              </Button>
              <Menu
                anchorEl={anchorElDrawer}
                open={openDrawerMenu}
                onClose={() => setAnchorElDrawer(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    handleSelect("TH");
                    setOpenDrawer(false);
                    setAnchorElDrawer(null);
                  }}
                >
                  TH
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleSelect("EN");
                    setOpenDrawer(false);
                    setAnchorElDrawer(null);
                  }}
                >
                  EN
                </MenuItem>
              </Menu>
              <Button
                variant="contained"
                fullWidth
                style={{ borderRadius: "50px" }}
                onClick={() => {
                  rounter.push("/login");
                  setOpenDrawer(false);
                }}
              >
                {lang === "TH" ? "เข้าสู่ระบบ / ลงทะเบียน" : "Login / Register"}
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
