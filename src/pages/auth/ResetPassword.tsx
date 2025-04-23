import AuthLayout from '@/layout/authLayout'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from '@/lib/utils';
import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
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

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormData) => {
    console.log("Form submitted:", values);
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
      title="Reset your FLOW water account password"
      titleDescription=" Please enter your new password."
      children={
        <form onSubmit={handleSubmit(onSubmit)} className="w-[374px] mx-auto py-4 space-y-4 px-0">
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
          <button type="submit" className="w-full bg-royalBlue text-white rounded-md py-3 font-medium flex items-center justify-between gap-2 hover:bg-blue-800 px-3">
            Reset Password
            <span className="ml-2">→</span>
          </button>
        </form>
      }
    />
  )
}

export default ResetPassword
