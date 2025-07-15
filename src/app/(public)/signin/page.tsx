"use client";
import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./page.module.css";
import InputField from "@/components/global/input-field/input-field";
import { useMutation } from "@tanstack/react-query";
import { SignIn } from "@/services/auth/auth";
import { toast } from "react-toastify";
import {
  SignIn_Payload_Type,
  SignIn_Response_Type,
} from "@/services/auth/auth.types";
import { emailRegex } from "@/utils/helpers/regex";
import { useAppDispatch } from "@/lib/store/hooks/hooks";
import { MyAxiosError } from "@/services/error.type";
import { setUserData } from "@/lib/store/slices/user-slice";
import Button from "@/components/global/button/button";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
// import useFCM from "@/lib/firebase/hooks/useFCM";

// Role-based route mapping
const ROLE_ROUTES = {
  1: "/superAdmin/dashboard",
  2: "/admin/dashboard",
  3: "/student/dashboard",
  4: "/parent/dashboard",
  5: "/teacher/dashboard",
  6: "/counsellor/dashboard",
};
const SignInForm = () => {
  // Memoize styling
  const inputBoxStyles = useMemo(
    () => ({
      backgroundColor: "#EEEEEE",
    }),
    []
  );
  const buttonStyles = useMemo(
    () => ({
      width: "100%",
    }),
    []
  );
  // const { fcmToken, messages } = useFCM();
  // console.log("firebase token", fcmToken);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Consolidate form state into a single object
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    hidePassword: true,
  });

  // Memoize form state setters
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, email: e.target.value }));
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, password: e.target.value }));
    },
    []
  );

  const togglePasswordVisibility = useCallback(() => {
    setFormState((prev) => ({ ...prev, hidePassword: !prev.hidePassword }));
  }, []);

  // Memoize navigation logic to prevent recreation on renders
  const navigateByRole = useCallback(
    (roleId: number) => {
      const route = ROLE_ROUTES[roleId as keyof typeof ROLE_ROUTES];
      if (route) router.push(route);
    },
    [router]
  );

  // Authentication mutation
  const mutation = useMutation({
    mutationFn: (payload: SignIn_Payload_Type) => SignIn(payload, {}),
    onSuccess: (data: SignIn_Response_Type) => {
      const updatedUser = {
        token: data?.token,
        enrollementIds: data?.enrollementIds ? [...data?.enrollementIds] : [],
        childrens: data?.childrens ? [...data?.childrens] : [],
        user: { ...data?.user, firebase_token: "" },
      };
      dispatch(setUserData(updatedUser));
      toast.success("Logged in successfully.");
      navigateByRole(data?.user?.roleId);
      setFormState((prev) => ({ ...prev, email: "", password: "" }));
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError.response) {
        toast.error(
          axiosError.response.data.error ||
            `${axiosError.response.status} ${axiosError.response.statusText}`
        );
      } else {
        toast.error(axiosError.message || "An error occurred during sign in");
      }
      setFormState((prev) => ({ ...prev, password: "" }));
    },
  });

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      // Validate email before submission
      if (!emailRegex.test(formState?.email)) {
        toast.error("Invalid email format.");
        return;
      }

      mutation.mutate({
        email: formState?.email,
        password: formState?.password,
      });
    },
    [formState.email, formState.password, mutation]
  );

  return (
    <form onSubmit={handleSubmit} className={classes.main}>
      <InputField
        value={formState.email}
        icon1={<MailOutlineIcon />}
        placeholder="Email"
        changeFunc={handleEmailChange}
        required
        inputBoxStyles={inputBoxStyles}
        aria-label="Email"
      />
      <div className={classes.linkBox}>
        <InputField
          value={formState.password}
          icon1={<LockOpenIcon />}
          icon2={
            formState.hidePassword ? (
              <VisibilityOffOutlinedIcon />
            ) : (
              <VisibilityIcon />
            )
          }
          placeholder="Password"
          changeFunc={handlePasswordChange}
          handlePasswordDisability={togglePasswordVisibility}
          hide={formState.hidePassword}
          required
          inputBoxStyles={inputBoxStyles}
        />
        <Link href="/forgot-password" className={classes.linkStyle}>
          Forgot Password
        </Link>
      </div>
      <Button
        text="Sign in"
        type="submit"
        loading={mutation.isPending}
        disabled={mutation.isPending}
        inlineStyling={buttonStyles}
      />
    </form>
  );
};

export default SignInForm;
