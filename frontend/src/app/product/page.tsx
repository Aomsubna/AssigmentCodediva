"use client";

import {
  Button,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Product } from "../../../types/Product";
import { useLanguage } from "@/context/LanguageContext";
import { Category } from "../../../types/Category";
import { addProduct, getCategory } from "../../../services/product";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
    watch,
    setError,
    setValue,
  } = useForm<Product>({});
  const [image, setImage] = useState<string>();
  const { lang } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [newCategoryTh, setNewCategoryTh] = useState("");
  const [newCategoryEn, setNewCategoryEn] = useState("");
  const [isPromotion, setIsPromotion] = useState(false);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const rounter = useRouter();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileImage(file);
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleAddCategory = () => {
    if (!newCategoryTh || !newCategoryEn) return;
    const newCat = {
      id: (categories.length + 1).toString(),
      categoryNameTh: newCategoryTh,
      categoryNameEn: newCategoryEn,
    };
    setCategories([...categories, newCat]);
    setValue("categoryId", newCat.id);
    setNewCategoryTh(newCategoryTh);
    setNewCategoryEn(newCategoryEn);
    setOpenAddCategory(false);
  };

  const onSubmit = async () => {
    await addProduct(
      getValues(),
      newCategoryTh,
      newCategoryEn,
      isPromotion,
      fileImage
    );
    rounter.push("/");
  };

  useEffect(() => {
    (async () => {
      setCategories(await getCategory());
    })();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="w-full min-h-screen bg-[#ffffff] flex flex-col items-center pt-30">
        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            mb: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h3" sx={{ color: "black" }}>
            {lang == "TH" ? "เพิ่มสินค้า" : "Add Product"}
          </Typography>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-48 h-48 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${
                image ? "border-gray-300" : "border-gray-400 bg-gray-100"
              }`}
            >
              {image ? (
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 014-4h10a4 4 0 014 4v4H3v-4z"
                    />
                  </svg>
                  <span className="text-sm">
                    {lang === "TH"
                      ? "คลิกเพื่ออัปโหลดรูป"
                      : "Click to upload image"}
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleUpload}
              />
            </div>

            {image && (
              <Button variant="contained" component="label">
                {lang === "TH" ? "เปลี่ยนรูป" : "Change Image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleUpload}
                />
              </Button>
            )}
          </div>

          <TextField
            {...register("nameTh", {
              required:
                lang === "TH"
                  ? "กรุณากรอกชื่อสินค้า (TH)"
                  : "Please enter product name (TH)",
            })}
            required
            fullWidth
            label={lang == "TH" ? "ชื่อสินค้า (ไทย)" : "Product Name (TH)"}
            error={!!errors.nameTh}
            helperText={errors.nameTh?.message}
          />

          <TextField
            {...register("nameEn", {
              required:
                lang === "TH"
                  ? "กรุณากรอกชื่อสินค้า (EN)"
                  : "Please enter product name (EN)",
            })}
            required
            fullWidth
            label={lang == "TH" ? "ชื่อสินค้า (อังกฤษ)" : "Product Name (EN)"}
            error={!!errors.nameEn}
            helperText={errors.nameEn?.message}
          />

          <TextField
            {...register("descriptionTh", {
              required:
                lang === "TH"
                  ? "กรุณากรอกรายละเอียด (TH)"
                  : "Please enter description (TH)",
            })}
            required
            fullWidth
            label={lang == "TH" ? "รายละเอียดสินค้า (ไทย)" : "Description (TH)"}
            error={!!errors.descriptionTh}
            helperText={errors.descriptionTh?.message}
          />

          <TextField
            {...register("descriptionEn", {
              required:
                lang === "TH"
                  ? "กรุณากรอกรายละเอียด (EN)"
                  : "Please enter description (EN)",
            })}
            required
            fullWidth
            label={
              lang == "TH" ? "รายละเอียดสินค้า (อังกฤษ)" : "Description (EN)"
            }
            error={!!errors.descriptionEn}
            helperText={errors.descriptionEn?.message}
          />

          <TextField
            {...register("price", {
              required: lang === "TH" ? "กรุณากรอกราคา" : "Please enter price",
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message:
                  lang === "TH" ? "กรุณากรอกตัวเลขเท่านั้น" : "Numbers only",
              },
            })}
            required
            fullWidth
            type="number"
            label={lang == "TH" ? "ราคา" : "Price"}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <Typography variant="h6" sx={{ color: "black" }}>
            {lang === "TH" ? "ประเภทสินค้า" : "Product Type"}
          </Typography>
          <RadioGroup
            row
            value={isPromotion ? "promo" : "normal"}
            onChange={(e) => {
              const val = e.target.value === "promo";
              setIsPromotion(val);
              setValue("isPromotion", val);
              if (val) setValue("categoryId", "");
            }}
          >
            <FormControlLabel
              value="normal"
              control={<Radio />}
              sx={{ color: "black" }}
              label={lang === "TH" ? "สินค้าแบบปกติ" : "Normal"}
            />
            <FormControlLabel
              value="promo"
              control={<Radio />}
              sx={{ color: "black" }}
              label={lang === "TH" ? "Promotion" : "Promotion"}
            />
          </RadioGroup>

          {!isPromotion && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Controller
                name="categoryId"
                control={control}
                defaultValue=""
                rules={{
                  required:
                    lang === "TH"
                      ? "กรุณาเลือกหมวดหมู่"
                      : "Please select category",
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    select
                    {...field}
                    label={lang === "TH" ? "หมวดหมู่สินค้า" : "Category"}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {lang === "TH" ? c.categoryNameTh : c.categoryNameEn}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Button
                variant="outlined"
                onClick={() => setOpenAddCategory(true)}
              >
                {lang === "TH" ? "+ เพิ่มหมวดหมู่ใหม่" : "+ Add Category"}
              </Button>
            </Box>
          )}

          <Button type="submit" variant="contained">
            {lang === "TH" ? "บันทึกสินค้า" : "Save Product"}
          </Button>
        </Box>

        <Dialog
          open={openAddCategory}
          onClose={() => setOpenAddCategory(false)}
        >
          <DialogTitle>
            {lang === "TH" ? "เพิ่มหมวดหมู่ใหม่" : "Add New Category"}
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              value={newCategoryTh}
              onChange={(e) => setNewCategoryTh(e.target.value)}
              label={
                lang === "TH" ? "ชื่อหมวดหมู่ (ไทย)" : "Category Name (TH)"
              }
              fullWidth
            />
            <TextField
              value={newCategoryEn}
              onChange={(e) => setNewCategoryEn(e.target.value)}
              label={
                lang === "TH" ? "ชื่อหมวดหมู่ (อังกฤษ)" : "Category Name (EN)"
              }
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddCategory(false)}>
              {lang === "TH" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleAddCategory}>
              {lang === "TH" ? "เพิ่ม" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </form>
  );
}
