import AuthLayout from '@/layout/authLayout'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

const ResetPassword = () => {
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
      title="Forgot your FLOW water account?"
      titleDescription="Please enter your email."
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
                autoComplete="off"
              />
            </div>
            {errors.email && (
              <div className="text-xs text-red-500 pl-3">{errors.email.message}</div>
            )}
          </div>

          <button type="submit"  className="w-full bg-royalBlue text-white rounded-md py-3 font-medium flex items-center justify-between gap-2 hover:bg-blue-800 px-3">
            Submit
            <span className="ml-2">→</span>
          </button>
        </form>
      }
    />
  )
}

export default ResetPassword
