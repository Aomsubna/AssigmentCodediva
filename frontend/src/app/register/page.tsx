"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  Button,
  Card,
  TextField,
  Typography,
  Divider,
  Box,
  Icon,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Image from "next/image";
import EmailIcon from "@mui/icons-material/Email";
import Link from "next/link";
import { Link as MuiLink } from "@mui/material";
import { validateAlreadyUse, registerUser } from "../../../services/auth";
import api from "../../../services/api";
import { useForm, Controller, set } from "react-hook-form";
import { LoginForm } from "../../../types/LoginForm";
import LockIcon from "@mui/icons-material/Lock";
import { RegisterForm } from "../../../types/RegisterForm";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Register() {
  const [readyRegister, setReadyRegister] = useState<boolean>();
  const [showPin, setShowPin] = useState(false);
  const [showPinVerify, setShowPinVerify] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
    watch,
    setError,
  } = useForm<RegisterForm>({
    defaultValues: {
      pin: Array(6).fill(""),
      pinVerify: Array(6).fill(""),
      acceptTerms: true,
    },
    mode: "onChange",
  });
  const rounter = useRouter();
  const { lang } = useLanguage();
  const [pinPage, setPinPage] = useState<boolean>(false);
  const onSubmit = async (data: RegisterForm) => {
    console.log(
      await validateAlreadyUse(getValues("phoneNumber"), getValues("email"))
    );
    const reponse = await validateAlreadyUse(
      getValues("phoneNumber"),
      getValues("email")
    );

    if (reponse.isEmailUsed) {
      setError("phoneNumber", {
        type: "manual",
        message:
          lang === "TH"
            ? "เบอร์นี้ถูกใช้ไปแล้ว"
            : "This phone number is already in use",
      });
    }
    if (reponse.isPhonenumberUsed) {
      setError("email", {
        type: "manual",
        message:
          lang === "TH"
            ? "อีเมลนี้ถูกใช้ไปแล้ว"
            : "This email is already in use",
      });
    }

    setPinPage(!(reponse.isEmailUsed || reponse.isPhonenumberUsed));
  };

  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const refsPinVerify = useRef<Array<HTMLInputElement | null>>([]);

  const pinArray = watch("pin");
  const pin = pinArray.join("");
  const pinVerifyArray = watch("pinVerify");
  const pinVerify = pinVerifyArray.join("");
  useEffect(() => {
    if (pin.length === 6 && pinVerify.length === 6 && pin === pinVerify) {
      (async () => {
        // await login(getValues("phoneNumber"), pin);
        setReadyRegister(true);
      })();
    } else if (
      pin.length === 6 &&
      pinVerify.length === 6 &&
      pin !== pinVerify
    ) {
      setReadyRegister(false);
    } else {
      setReadyRegister(undefined);
    }
  }, [pin, pinVerify]);

  const handleRegister = async () => {
    await registerUser(
      getValues("firstName"),
      getValues("lastName"),
      getValues("phoneNumber"),
      getValues("dateOfBirth"),
      getValues("email"),
      getValues("gender"),
      getValues("pin").join("")
    );
    rounter.push("/login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex min-h-screen items-center justify-center bg-[#f2f4f7] font-sans pt-20 lg:pt-17">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-30">
          <div className="flex flex-col shadow-lg shadow-black/3 bg-white rounded-lg p-8 gap-6 w-full lg:w-[600px] my-0 lg:my-5 mx-0 lg:mx-8 self-auto max-h-fit">
            {!pinPage ? (
              <>
                <Button
                  variant="text"
                  style={{
                    borderRadius: "50px",
                    width: "100px",
                  }}
                  startIcon={<KeyboardArrowLeftIcon />}
                  onClick={() => rounter.push("/")}
                >
                  {lang == "TH" ? "ย้อนกลับ" : "Back"}
                </Button>
                <Typography variant="h5" style={{ color: "black" }}>
                  {lang == "TH" ? (
                    "สมัครสมาชิกฟรี! รับสิทธิประโยชน์และส่วนลดมากมาย"
                  ) : (
                    <>Sign Up for Exclusive Delivery Deals!</>
                  )}
                </Typography>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-col lg:flex-row gap-2 w-full">
                    <TextField
                      {...register("firstName", {
                        required:
                          lang === "TH"
                            ? "กรุณากรอกชื่อ"
                            : "Please enter your first name",
                      })}
                      required
                      fullWidth
                      id="outlined-required"
                      label={lang == "TH" ? "ชื่อ" : "First name"}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                    <TextField
                      {...register("lastName", {
                        required:
                          lang === "TH"
                            ? "กรุณากรอกนามสกุล"
                            : "Please enter your last name",
                      })}
                      required
                      fullWidth
                      id="outlined-required"
                      label={lang == "TH" ? "นามสกุล" : "Last name"}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-2">
                    <TextField
                      {...register("phoneNumber", {
                        required:
                          lang === "TH"
                            ? "กรุณากรอกเบอร์โทรศัพท์"
                            : "Please enter your phone number",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message:
                            lang === "TH"
                              ? "กรุณากรอกเบอร์โทร 10 หลักเท่านั้น"
                              : "Please enter a 10-digit phone number",
                        },
                      })}
                      required
                      fullWidth
                      id="outlined-required"
                      label={lang == "TH" ? "เบอร์โทรศัพท์" : "Phone number"}
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                    />
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      rules={{
                        required:
                          lang == "TH"
                            ? "กรุณาเลือกวันเกิด"
                            : "Please select date of birth",
                      }}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={lang == "TH" ? "วันเกิด" : "Date of Birth"}
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue) =>
                              field.onChange(
                                newValue ? newValue.format("YYYY-MM-DD") : ""
                              )
                            }
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.dateOfBirth,
                                helperText: errors.dateOfBirth?.message,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-2">
                    <div className="flex-1">
                      <TextField
                        {...register("email", {
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message:
                              lang == "TH"
                                ? "กรุณากรอกอีเมลให้ถูกต้อง เช่น example@gmail.com"
                                : "Please enter a valid email address (e.g. example@gmail.com)",
                          },
                        })}
                        fullWidth
                        id="outlined-required"
                        label={
                          lang == "TH"
                            ? "อีเมล (ไม่ระบุได้)"
                            : "Email (Optional)"
                        }
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    </div>

                    <div className="flex-1 flex items-start lg:items-center">
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          {lang == "TH" ? "เพศ" : "Gender"}
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="male"
                          name="radio-buttons-group"
                        >
                          <FormControlLabel
                            sx={{ color: "black" }}
                            value="male"
                            control={<Radio />}
                            label={lang == "TH" ? "ชาย" : "Male"}
                          />
                          <FormControlLabel
                            sx={{ color: "black" }}
                            value="female"
                            control={<Radio />}
                            label={lang == "TH" ? "หญิง" : "Female"}
                          />
                          <FormControlLabel
                            sx={{ color: "black" }}
                            value="not specified"
                            control={<Radio />}
                            label={lang == "TH" ? "ไม่ระบุ" : "Not Specified"}
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                </div>

                <Divider style={{ color: "black" }}></Divider>
                <FormGroup sx={{ gap: 2 }}>
                  <Controller
                    name="acceptTerms"
                    control={control}
                    rules={{
                      required:
                        lang == "TH"
                          ? "กรุณายอมรับข้อตกลงก่อนดำเนินการต่อ"
                          : "Please accept the terms and conditions to proceed",
                    }}
                    render={({ field }) => (
                      <FormControlLabel
                        sx={{ color: "black", alignItems: "flex-start" }}
                        control={
                          <Checkbox
                            {...field}
                            checked={!!field.value} // แปลงเป็น boolean ชัดเจน
                          />
                        }
                        label={
                          lang == "TH"
                            ? "ฉันได้อ่านและยอมรับ ข้อกำหนดการใช้งาน และ นโยบายความเป็นส่วนตัว ของสเวนเซ่นส์"
                            : "I have read and accepted the terms & conditions and privacy statement of Swensen’s."
                        }
                      />
                    )}
                  />

                  {errors.acceptTerms && (
                    <Typography color="error" variant="body2">
                      {errors.acceptTerms.message}
                    </Typography>
                  )}

                  <FormControlLabel
                    sx={{ color: "black", alignItems: "flex-start" }}
                    control={<Checkbox />}
                    label={
                      lang == "TH"
                        ? "ฉันยินยอมรับข้อมูลข่าวสาร กิจกรรมส่งเสริมการขายต่างๆ จากสเวนเซ่นส์และบริษัทในเครือ โดยเราจะเก็บข้อมูลของท่านไว้เป็นความลับ สามารถศึกษาเงื่อนไขหรือข้อตกลง นโยบายความเป็นส่วนตัว เพิ่มเติมได้ที่เว็บไซต์ของบริษัทฯ"
                        : "I agree to receive the information including other marketing activities from Swensen’s and affiliated companies. We will keep your data confidential. Learn more about privacy statement from company’s website."
                    }
                  />
                </FormGroup>

                <Button
                  variant="contained"
                  type="submit"
                  style={{ borderRadius: "50px" }}
                  // onClick={validatePhonNumber}
                >
                  {lang == "TH" ? "สร้างบัญชี" : "Create Account"}
                </Button>
                <div className="flex justify-center items-center gap-2">
                  <Typography variant="h6" style={{ color: "black" }}>
                    {lang == "TH" ? (
                      "มีบัญชีสมาชิกอยู่แล้วใช่หรือไม่"
                    ) : (
                      <>Already have an account?</>
                    )}
                  </Typography>
                  <MuiLink
                    component={Link}
                    href="/register"
                    underline="always"
                    color="text.primary"
                    style={{ color: "black" }}
                  >
                    {lang == "TH" ? "เข้าสู่ระบบ" : <>Sign in</>}
                  </MuiLink>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="text"
                  style={{
                    borderRadius: "50px",
                    width: "100px",
                  }}
                  startIcon={<KeyboardArrowLeftIcon />}
                  onClick={() => setPinPage(false)}
                >
                  {lang == "TH" ? "ย้อนกลับ" : "Back"}
                </Button>
                <div className="flex flex-col w-full justify-center items-center gap-6">
                  <LockIcon sx={{ color: "black" }} />
                  <Typography variant="h5" style={{ color: "black" }}>
                    {lang == "TH" ? "ใส่รหัส PIN" : "Enter Your Pin"}
                  </Typography>
                </div>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body2" sx={{ color: "black" }}>
                    {lang === "TH"
                      ? "ตั้งรหัส PIN 6 หลัก"
                      : "Enter 6-digit PIN"}
                  </Typography>
                  <Box display="flex" gap={1} justifyContent="center">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Controller
                        key={i}
                        name={`pin.${i}`}
                        control={control}
                        rules={{ required: true, pattern: /^[0-9]$/ }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            inputRef={(el) => (refs.current[i] = el)}
                            type={showPin ? "text" : "password"}
                            inputProps={{
                              maxLength: 1,
                              inputMode: "numeric",
                              style: { textAlign: "center", width: "3rem" },
                            }}
                            variant="outlined"
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/\D/, "")); // กรองตัวเลขเท่านั้น
                              if (e.target.value && i < 5) {
                                refs.current[i + 1]?.focus(); // ไปช่องถัดไป
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Backspace" &&
                                !field.value &&
                                i > 0
                              ) {
                                refs.current[i - 1]?.focus(); // กลับไปช่องก่อนหน้า
                              }
                            }}
                          />
                        )}
                      />
                    ))}
                  </Box>
                  <div className="flex justify-end">
                    <IconButton
                      onClick={() => setShowPin(!showPin)}
                      edge="end"
                      size="small"
                    >
                      {showPin ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </div>

                  <Typography variant="body2" sx={{ color: "black" }}>
                    {lang === "TH" ? "ยืนยันรหัส PIN" : "Confirm your PIN"}
                  </Typography>
                  <Box display="flex" gap={1} justifyContent="center">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Controller
                        key={i}
                        name={`pinVerify.${i}`}
                        control={control}
                        rules={{ required: true, pattern: /^[0-9]$/ }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            inputRef={(el) => (refsPinVerify.current[i] = el)}
                            type={showPinVerify ? "text" : "password"}
                            inputProps={{
                              maxLength: 1,
                              inputMode: "numeric",
                              style: { textAlign: "center", width: "3rem" },
                            }}
                            variant="outlined"
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/\D/, "")); // กรองตัวเลขเท่านั้น
                              if (e.target.value && i < 5) {
                                refsPinVerify.current[i + 1]?.focus(); // ไปช่องถัดไป
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Backspace" &&
                                !field.value &&
                                i > 0
                              ) {
                                refsPinVerify.current[i - 1]?.focus(); // กลับไปช่องก่อนหน้า
                              }
                            }}
                          />
                        )}
                      />
                    ))}
                  </Box>
                  <div className="flex justify-end">
                    <IconButton
                      onClick={() => setShowPinVerify(!showPinVerify)}
                      edge="end"
                      size="small"
                    >
                      {showPinVerify ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </div>
                </Box>
                {/* {!readyRegister ? (
                  <Typography color="error" variant="body2" align="center">
                    {lang === "TH" ? "PIN ไม่ตรงกัน" : "PINs do not match"}
                  </Typography>
                ) : null} */}
                {readyRegister === false &&
                  pin.length === 6 &&
                  pinVerify.length === 6 && (
                    <Typography color="error" variant="body2" align="center">
                      {lang === "TH" ? "PIN ไม่ตรงกัน" : "PINs do not match"}
                    </Typography>
                  )}
                <Button
                  variant="contained"
                  type="button"
                  style={{ borderRadius: "50px" }}
                  onClick={handleRegister}
                  disabled={!readyRegister}
                >
                  {lang == "TH" ? "ยืนยัน" : "Confirm"}
                </Button>
              </>
            )}
          </div>
          <div className="relative items-center p-4 min-h-screen w-lg hidden lg:block">
            <Image
              src="/register-banner.png"
              alt="Swensen's Ice Cream"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
