import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "../../utils/cn";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/authSlice";
import AuthLayout from "@/layout/authLayout";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      const loginStatus = true;
      sessionStorage.setItem("isLoggedIn", JSON.stringify(loginStatus));
      dispatch(login());
      toast.success("Login successful!");
    },
  });

  return (
    <AuthLayout header={
      <>
        Don't have an account?{" "}
        <Link to="/auth/register" className="font-semibold underline cursor-pointer">
          REGISTER NOW
        </Link >
      </>
    }
      title="Login to your FLOW water account"
      titleDescription="Welcome back! Please enter your credentials."
      children={
        <form onSubmit={formik.handleSubmit} className="w-[374px] mx-auto py-4 space-y-4 px-0">
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.email && formik.errors.email ? "border-red-500" : "")}>
              <Mail className="mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="auth-input"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-xs text-red-500 pl-3">{formik.errors.email}</div>
            )}</div>
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.password && formik.errors.password ? "border-red-500" : "")}>
              <Lock className="mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="auth-input"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-gray-500"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-xs text-red-500 pl-3">{formik.errors.password}</div>
            )}
          </div>

          <button type="submit" className="w-full bg-royalBlue text-white rounded-md py-3 font-medium flex items-center justify-between gap-2 hover:bg-blue-800 px-3">
            Login
            <span className="ml-2">→</span>
          </button>
        </form>
      }
    />
  )
};

export default Login;
