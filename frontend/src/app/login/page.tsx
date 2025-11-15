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
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Image from "next/image";
import EmailIcon from "@mui/icons-material/Email";
import Link from "next/link";
import { Link as MuiLink } from "@mui/material";
import { loginApi, validateUser } from "../../../services/auth";
import api from "../../../services/api";
import { useForm, Controller, set } from "react-hook-form";
import { LoginForm } from "../../../types/LoginForm";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
    watch,
  } = useForm<LoginForm>({
    defaultValues: { pin: Array(6).fill("") },
    mode: "onChange",
  });
  const rounter = useRouter();
  const { lang } = useLanguage();
  const [pinPage, setPinPage] = useState<boolean>(false);

  const onSubmit = async (data: LoginForm) => {
    setPinPage(await validateUser(getValues("phoneNumber")));
  };

  const pinArray = watch("pin");
  const pin = pinArray.join("");
  useEffect(() => {
    if (pin.length === 6) {
      (async () => {
        const res = await loginApi(getValues("phoneNumber"), pin);
        login(res.data.token, res.data.user);
        rounter.push("/");
      })();
    }
  }, [pin]);

  const refs = useRef<Array<HTMLInputElement | null>>([]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex min-h-screen items-center justify-center bg-[#f2f4f7] font-sans pt-0 lg:pt-17">
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
                    "ยินดีต้อนรับสมาชิก Swensen's เข้าสู่ระบบแล้วเริ่มสั่งไอศกรีมกันเลย!"
                  ) : (
                    <>
                      Welcome! <br />
                      To continue, please sign in.
                    </>
                  )}
                </Typography>
                <TextField
                  {...register("phoneNumber", {
                    required: "กรุณากรอกเบอร์โทร",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "กรุณากรอกเบอร์โทร 10 หลักเท่านั้น",
                    },
                  })}
                  required
                  id="outlined-required"
                  label={lang == "TH" ? "เบอร์โทรศัพท์" : "Phone number"}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
                <Button
                  variant="contained"
                  type="submit"
                  style={{ borderRadius: "50px" }}
                >
                  {lang == "TH" ? "ดำเนินการต่อ" : "Proceed"}
                </Button>
                <Divider style={{ color: "black" }}>OR</Divider>
                <Button
                  variant="outlined"
                  style={{ borderRadius: "50px" }}
                  startIcon={<EmailIcon />}
                >
                  {lang == "TH" ? "เข้าสู่ระบบด้วยอีเมล" : "Login by Email"}
                </Button>
                <div className="flex justify-center items-center gap-2">
                  <Typography variant="h6" style={{ color: "black" }}>
                    {lang == "TH" ? (
                      "ยังไม่มีบัญชีใช่หรือไม่"
                    ) : (
                      <>Don’t have an account?</>
                    )}
                  </Typography>
                  <MuiLink
                    component={Link}
                    href="/register"
                    underline="always"
                    color="text.primary"
                    style={{ color: "black" }}
                  >
                    {lang == "TH" ? "สร้างบัญชี" : <>Sign up</>}
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
                          type="password"
                          inputProps={{
                            maxLength: 1,
                            inputMode: "numeric",
                            style: { textAlign: "center", width: "3rem" },
                          }}
                          variant="outlined"
                          onChange={(e) => {
                            field.onChange(e.target.value.replace(/\D/, ""));
                            if (e.target.value && i < 5) {
                              refs.current[i + 1]?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !field.value &&
                              i > 0
                            ) {
                              refs.current[i - 1]?.focus();
                            }
                          }}
                        />
                      )}
                    />
                  ))}
                </Box>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ borderRadius: "50px" }}
                  disabled={pinPage}
                >
                  {lang == "TH" ? "ดำเนินการต่อ" : "Proceed"}
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
