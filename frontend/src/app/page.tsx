"use client";
import Image from "next/image";

import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  MobileStepper,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { getCategory, getProduct } from "../../services/product";
import { Product } from "../../types/Product";
import { useLanguage } from "@/context/LanguageContext";
import { Category } from "../../types/Category";
import { useAuth } from "@/context/AuthContext";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const stepImages = ["/banner2Fsw-banner.png"];

export default function Home() {
  const { lang } = useLanguage();
  const [tab, setTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = stepImages.length;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const { user } = useAuth();

  const handleNext = () =>
    setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    (async () => {
      // console.log(await getProduct());
      setCategories(await getCategory());
      setProducts(await getProduct());
    })();
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);

    setSelectedCategoryId(categories ? categories[newValue].id : null);
  };

  return (
    <div className="w-full min-h-screen bg-[#ffffff] flex flex-col items-center pt-30 ">
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mb: 4,
          display: "flex",
          flexDirection: { sm: "row" },
          alignItems: "center",
          gap: 2,
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "black", fontWeight: "bold", flexShrink: 0 }}
        >
          {lang == "TH" ? "ไปส่งที่" : "Delivery To:"}
        </Typography>

        <Button
          variant="contained"
          disabled
          // startIcon={<AddLocationIcon />}
          // endIcon={<ArrowDropDownIcon />}
          sx={{
            flexGrow: 1,
            textAlign: "left",
            justifyContent: "space-between",
            alignItems: "center",
            textTransform: "none",
            px: 2,
          }}
        >
          <div className="flex items-center gap-1">
            <AddLocationIcon />
            <span>
              {lang === "TH"
                ? "เลือกที่อยู่จัดส่ง"
                : "Select a delivery address"}
            </span>
          </div>
          <ArrowDropDownIcon />
        </Button>
      </Box>
      {user ? (
        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            mb: 4,
            mx: "auto",
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h5"
            style={{ color: "black", fontWeight: "bold" }}
          >
            {lang == "TH"
              ? `สวัสดี ${user.firstName}`
              : `Hello ${user.firstName}`}
          </Typography>
        </Box>
      ) : null}

      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mb: 4,
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <div
          className="w-full relative rounded-xl overflow-hidden"
          style={{ paddingTop: "20%" }}
        >
          <Image
            src={stepImages[activeStep]}
            alt={`Step ${activeStep + 1}`}
            fill
            className=" rounded-xl object-contain"
          />
        </div>
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
          sx={{ mt: 2, justifyContent: "center" }}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mb: 4,
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
          {lang == "TH" ? "โปรโมชั่น" : "Highlight & Promotions"}
        </Typography>
      </Box>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-[1000px] pb-10">
        {products
          ?.filter((i) => i.isPromotion == true)
          .map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center cursor-pointer"
            >
              <div className="w-full h-32 bg-gray-200 rounded-xl mb-3 overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.imageUrl}`}
                  alt={item.nameEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full">
                <Typography sx={{ color: "black" }}>
                  ฿ {item.price.toLocaleString()}
                </Typography>
                <Typography sx={{ color: "black" }}>
                  {lang == "TH" ? item.nameTh : item.nameEn}
                </Typography>
              </div>
            </motion.div>
          ))}
      </div>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mb: 4,
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
          {lang == "TH" ? "เมนูจัดส่ง" : "Delivery Menu"}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mb: 4,
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Tabs
          value={tab}
          // onChange={(e, v) => setTab(v)}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ color: "black" }}
        >
          {categories?.map((category) => (
            <Tab
              key={category.id}
              label={
                lang === "TH"
                  ? category.categoryNameTh
                  : category.categoryNameEn
              }
            />
          ))}
        </Tabs>
      </Box>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-[1000px] pb-10">
        {products
          ?.filter((i) =>
            i.isPromotion == false && selectedCategoryId
              ? i.categoryId === selectedCategoryId
              : true && i.isPromotion == false
          )
          .map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center cursor-pointer"
            >
              <div className="w-full h-32 bg-gray-200 rounded-xl mb-3 overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.imageUrl}`}
                  alt={item.nameEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full font-sans">
                <Typography sx={{ color: "black" }}>
                  ฿ {item.price.toLocaleString()}
                </Typography>
                <Typography sx={{ color: "black" }}>
                  {lang == "TH" ? item.nameTh : item.nameEn}
                </Typography>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
