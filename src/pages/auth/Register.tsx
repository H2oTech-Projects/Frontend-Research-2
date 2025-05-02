import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { toast } from "react-toastify";
import { usePostRegisterUser } from "@/services/registration";
import { useEffect, useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import AuthLayout from "@/layout/authLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {showErrorToast, showSuccessToast} from "../../utils/tools";

const schema = z.object({
  firstName: z.string().min(1, "First name is required").min(3, "First name must be at least 3 characters").regex(/^[A-Za-z\s'-]+$/, "First name cannot contain numbers or special characters"),
  lastName: z.string().min(1, "Last name is required").min(3, "Last name must be at least 3 characters").regex(/^[A-Za-z\s'-]+$/, "Last name cannot contain numbers or special characters"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password too short")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate, isPending, isError, error, isSuccess, data } = usePostRegisterUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormData) => {
    mutate({
      email: values.email,
      password: values.password,
      password_confirm: values.confirmPassword,
      first_name: values.firstName,
      last_name: values.lastName,
    },{
      onSuccess: (data) => {
        showSuccessToast(data.message);
        reset(); // Reset the form after successful registration
      },
      onError: (err) => {
        showErrorToast(err?.response?.data.message)
            //toast.error(err?.response?.data?.message || "Login failed.");
      },
    });
  };

  return (
    <AuthLayout
      header={
        <>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold underline cursor-pointer">
            LOG IN NOW
          </Link>
        </>
      }
      title="START YOUR EXCLUSIVE JOURNEY"
      titleDescription="SIGN UP AND JOIN THE FLOW"
      children={
        <form onSubmit={handleSubmit(onSubmit)} className="w-[374px] mx-auto py-4 space-y-4 px-0">
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", errors.firstName ? "border-red-500" : "")}>
              <User className="mr-2" />
              <input type="text" placeholder="Enter Your First Name" className="auth-input" {...register("firstName")} autoComplete="off" />
            </div>
            {errors.firstName && <div className="text-xs text-red-500 pl-3">{errors.firstName.message}</div>}
          </div>
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", errors.lastName ? "border-red-500" : "")}>
              <User className="mr-2" />
              <input type="text" placeholder="Enter Your Last Name" className="auth-input" {...register("lastName")} autoComplete="off" />
            </div>
            {errors.lastName && <div className="text-xs text-red-500 pl-3">{errors.lastName.message}</div>}
          </div>
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", errors.email ? "border-red-500" : "")}>
              <Mail className="mr-2" />
              <input type="email" placeholder="example@email.com" className="auth-input" {...register("email")} autoComplete="off" />
            </div>
            {errors.email && <div className="text-xs text-red-500 pl-3">{errors.email.message}</div>}
          </div>
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", errors.password ? "border-red-500" : "")}>
              <Lock className="mr-2" />
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="auth-input" {...register("password")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-gray-500">
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.password && <div className="text-xs text-red-500 pl-3">{errors.password.message}</div>}
          </div>
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", errors.confirmPassword ? "border-red-500" : "")}>
              <Lock className="mr-2" />
              <input type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" className="auth-input" {...register("confirmPassword")} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-xs text-gray-500">
                {showConfirmPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.confirmPassword && <div className="text-xs text-red-500 pl-3">{errors.confirmPassword.message}</div>}
          </div>
          <button type="submit" disabled={isPending} className="w-full bg-royalBlue text-white rounded-md py-3 font-medium flex items-center justify-between gap-2 hover:bg-blue-800 px-3">
            {isPending ? "Registering..." : "Register an Account"}
            <span className="ml-2">→</span>
          </button>
        </form>
      }
    />
  );
};

export default Register;