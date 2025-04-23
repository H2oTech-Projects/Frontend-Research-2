import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { cn } from "../../utils/cn";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/authSlice";
import AuthLayout from "@/layout/authLayout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormData) => {
    const loginStatus = true;
    sessionStorage.setItem("isLoggedIn", JSON.stringify(loginStatus));
    dispatch(login());
    toast.success("Login successful!");
  };

  return (
    <AuthLayout
      header={
        <>
          Don't have an account?{" "}
          <Link to="/auth/register" className="font-semibold underline cursor-pointer">
            REGISTER NOW
          </Link>
        </>
      }
      title="Login to your FLOW water account"
      titleDescription="Welcome back! Please enter your credentials."
      children={
        <form onSubmit={handleSubmit(onSubmit)} className="w-[374px] mx-auto py-4 space-y-4 px-0">
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", errors.email ? "border-red-500" : "")}>              
              <Mail className="mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="auth-input"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <div className="text-xs text-red-500 pl-3">{errors.email.message}</div>
            )}
          </div>

          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", errors.password ? "border-red-500" : "")}>              
              <Lock className="mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="auth-input"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-gray-500"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.password && (
              <div className="text-xs text-red-500 pl-3">{errors.password.message}</div>
            )}
          </div>

          <button type="submit" className="w-full bg-royalBlue text-white rounded-md py-3 font-medium flex items-center justify-between gap-2 hover:bg-blue-800 px-3">
            Login
            <span className="ml-2">→</span>
          </button>
        </form>
      }
    />
  );
};

export default Login;
