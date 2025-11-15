import { Product } from "../types/Product";
import api from "./api";


export async function getCategory() {
  const res = await api.get("Product/getCategory");

  return res.data;
}

export async function getProduct() {
  const res = await api.get("Product/getProduct");

  return res.data;
}

export async function addProduct(product: Product, categoryNameTh : string , categoryNameEn : string , isPromotion : boolean , file : File | null) {
  const formData = new FormData();
  if (file) {
    formData.append("product.FileImage", file);
  }
  formData.append("product.NameTh", product.nameTh);
  formData.append("product.NameEn", product.nameEn);
  formData.append("product.DescriptionTh", product.descriptionTh ?? "");
  formData.append("product.DescriptionEn", product.descriptionEn ?? "");
  formData.append("product.CategoryId", product.categoryId.toString());
  formData.append("product.Price", product.price.toString());
  formData.append("product.categoryNameTh", categoryNameTh);
  formData.append("product.categoryNameEn", categoryNameEn);
  formData.append("product.isPromotion", String(isPromotion));
  // const res = await api.post("Product/addProduct",{product,categoryNameTh,categoryNameEn,isPromotion});
  const res = await api.post("Product/addProduct", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data
}