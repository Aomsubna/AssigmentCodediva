import api from "./api";

export async function loginApi(phoneNumber: string, password: string) {
  const res = await api.post("Auth/login", { phoneNumber, password });
  // const token = res.data.token;

  // localStorage.setItem("token", token);

  return res;
}

export async function registerUser(
  firstName : string,
  lastName : string,
  phoneNumber: string,
  dateOfBirth : string, 
  email: string,
  gender: string,
  password: string
) {
  const res = await api.post("Auth/register", { 
    firstName,
    lastName,
    phoneNumber, 
    dateOfBirth,
    email,
    gender,
    password
  });
  return res.data;
}

export async function validateUser(phoneNumber: string) {
  const res = await api.post("Auth/validateUser", { phoneNumber });
  return res.data;
}

export async function validateAlreadyUse(phoneNumber: string , email: string) {
  const res = await api.post("Auth/validateAlreadyUse", { phoneNumber , email });
  return res.data;
}