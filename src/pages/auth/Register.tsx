import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { usePostRegisterUser } from "@/services/registration";
import { useEffect, useState } from "react";
import { Mail, Lock, User, ChevronLeft, Info } from "lucide-react";
import AuthLayout from "@/layout/authLayout";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate, isPending, isError, error, isSuccess, data } = usePostRegisterUser();
  const formik = useFormik({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(8, "Password too short").matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character').required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: (values) => {

      mutate({
        email: values.email,
        username: values.username,
        password: values.password,
        password_confirm: values.confirmPassword,
        first_name: values.firstName,
        last_name: values.lastName,
      });
    },
  });
  useEffect(() => {
    if (error) {
      toast.error("Registration failed: " + error?.response?.data?.msg as any);
    }

    if (isSuccess) {
      toast.success(data?.msg);
      formik.resetForm();
    }


  }, [error, isSuccess]);

  return (
    <AuthLayout
      header={
        <>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold underline cursor-pointer">
            LOG IN NOW
          </Link >
        </>
      }

      title="START YOUR EXCLUSIVE JOURNEY"
      titleDescription="SIGN UP AND JOIN THE FLOW"
      children={
        <form onSubmit={formik.handleSubmit} className="w-[374px] mx-auto py-4 space-y-4 px-0">
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.username && formik.errors.username ? "border-red-500" : "")}>
              <User className="mr-2" />
              <input
                type="text"
                placeholder="Username"
                className="w-full outline-none dark:bg-sky-950"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <div className="text-xs text-red-500 pl-3">{formik.errors.username}</div>
            )}
          </div>
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.firstName && formik.errors.firstName ? "border-red-500" : "")}>
              <User className="mr-2 " />
              <input
                type="text"
                placeholder="Enter Your First Name"
                className="w-full outline-none dark:bg-sky-950"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-xs text-red-500 pl-3">{formik.errors.firstName}</div>
            )}</div>
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.lastName && formik.errors.lastName ? "border-red-500" : "")}>
              <User className="mr-2" />
              <input
                type="text"
                placeholder="Enter Your Last Name"
                className="w-full outline-none dark:bg-sky-950"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-xs text-red-500 pl-3">{formik.errors.lastName}</div>
            )}
          </div>
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.email && formik.errors.email ? "border-red-500" : "")}>
              <Mail className="mr-2" />
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full outline-none dark:bg-sky-950"
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
                className="w-full outline-none dark:bg-sky-950"
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
          <div>
            <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "")}>
              <Lock className="mr-2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className="w-full outline-none dark:bg-sky-950"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="text-xs text-gray-500"
              >
                {showConfirmPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="text-xs text-red-500 pl-3">{formik.errors.confirmPassword}</div>
            )}
          </div>
          <button type="submit" disabled={isPending} className="w-full bg-royalBlue text-white rounded-md py-3 font-medium flex items-center justify-between gap-2 hover:bg-blue-800 px-3">
            Register an Account
            <span className="ml-2">→</span>
          </button>
        </form>
      }

    />

  );

  // return (
  //   <>
  //     <div className="flex min-h-screen w-full">
  //       <div className="w-[440px] text-white relative ">
  //         <div className="z-10 flex flex-col justify-between h-full px-6 py-10">

  //           <div className="flex justify-center items-center align-center mb-4 gap-3">
  //             <img src={FlowLogo} alt="Flow Logo" className="w-16 h-16 mb-2" />
  //             <span className="text-3xl font-semibold ">FLOW</span>
  //           </div>

  //           {/* Bottom Text */}
  //           <div className="text-center space-y-2">
  //             <h2 className="text-2xl font-semibold">Water Accounts for Your Fields</h2>
  //             <p className="text-sm">
  //               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
  //             </p>
  //           </div>
  //         </div>
  //         <img
  //           src={RegisterImage}
  //           alt="H2O Logo"
  //           className="w-full h-full object-cover -z-10 absolute top-0 left-0 dark:hidden"
  //         />
  //         <img
  //           src={NightRegisterImage}
  //           alt="H2O Logo"
  //           className="w-full h-full object-cover -z-10 absolute top-0 left-0 hidden dark:block"
  //         />
  //       </div>

  //       {/* Right Form Section */}
  //       <div className="flex flex-col flex-grow dark:bg-sky-950">
  //           {/* Top Navigation */}
  //           <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-600 dark:text-white">
  //             <div className="flex items-center gap-1 cursor-pointer hover:underline">
  //               <ChevronLeft size={16} />
  //               <span>Return Home</span>
  //             </div>
  //             <div className="text-right text-sm">
  //               Already have an account?{" "}
  //               <Link to="/auth/login" className="font-semibold underline cursor-pointer">
  //                 LOG IN NOW
  //               </Link >
  //             </div>
  //           </div>

  //           <div className="flex-grow flex flex-col items-center justify-center dark:text-white ">
  //             {/* Title Section */}
  //             <div className="flex flex-col gap-1 justify-center items-center mt-5">
  //               <h1 className="font-semibold text-2xl">
  //                 START YOUR EXCLUSIVE JOURNEY
  //               </h1>
  //               <h4 className="font-thin">SIGN UP AND JOIN THE FLOW</h4>
  //             </div>

  //             {/* Form Section */}
  //             <div className="flex justify-center">
  //               <form onSubmit={formik.handleSubmit} className="w-[374px] mx-auto py-4 space-y-4 px-0">
  //                 <div>
  //                   <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.username && formik.errors.username ? "border-red-500" : "")}>
  //                     <User className="mr-2" />
  //                     <input
  //                       type="text"
  //                       placeholder="Username"
  //                       className="w-full outline-none dark:bg-sky-950"
  //                       name="username"
  //                       value={formik.values.username}
  //                       onChange={formik.handleChange}
  //                       onBlur={formik.handleBlur}
  //                     />
  //                   </div>
  //                   {formik.touched.username && formik.errors.username && (
  //                     <div className="text-xs text-red-500 pl-3">{formik.errors.username}</div>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.firstName && formik.errors.firstName ? "border-red-500" : "")}>
  //                     <User className="mr-2 " />
  //                     <input
  //                       type="text"
  //                       placeholder="Enter Your First Name"
  //                       className="w-full outline-none dark:bg-sky-950"
  //                       name="firstName"
  //                       value={formik.values.firstName}
  //                       onChange={formik.handleChange}
  //                       onBlur={formik.handleBlur}
  //                     />
  //                   </div>
  //                   {formik.touched.firstName && formik.errors.firstName && (
  //                     <div className="text-xs text-red-500 pl-3">{formik.errors.firstName}</div>
  //                   )}</div>
  //                 <div>
  //                   <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.lastName && formik.errors.lastName ? "border-red-500" : "")}>
  //                     <User className="mr-2" />
  //                     <input
  //                       type="text"
  //                       placeholder="Enter Your Last Name"
  //                       className="w-full outline-none dark:bg-sky-950"
  //                       name="lastName"
  //                       value={formik.values.lastName}
  //                       onChange={formik.handleChange}
  //                       onBlur={formik.handleBlur}
  //                     />
  //                   </div>
  //                   {formik.touched.lastName && formik.errors.lastName && (
  //                     <div className="text-xs text-red-500 pl-3">{formik.errors.lastName}</div>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.email && formik.errors.email ? "border-red-500" : "")}>
  //                     <Mail className="mr-2" />
  //                     <input
  //                       type="email"
  //                       placeholder="example@email.com"
  //                       className="w-full outline-none dark:bg-sky-950"
  //                       name="email"
  //                       value={formik.values.email}
  //                       onChange={formik.handleChange}
  //                       onBlur={formik.handleBlur}
  //                     />
  //                   </div>
  //                   {formik.touched.email && formik.errors.email && (
  //                     <div className="text-xs text-red-500 pl-3">{formik.errors.email}</div>
  //                   )}</div>
  //                 <div>
  //                   <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.password && formik.errors.password ? "border-red-500" : "")}>
  //                     <Lock className="mr-2" />
  //                     <input
  //                       type={showPassword ? "text" : "password"}
  //                       placeholder="Enter your password"
  //                       className="w-full outline-none dark:bg-sky-950"
  //                       name="password"
  //                       value={formik.values.password}
  //                       onChange={formik.handleChange}
  //                       onBlur={formik.handleBlur}
  //                     />
  //                     <button
  //                       type="button"
  //                       onClick={() => setShowPassword(!showPassword)}
  //                       className="text-xs text-gray-500"
  //                     >
  //                       {showPassword ? "HIDE" : "SHOW"}
  //                     </button>
  //                   </div>
  //                   {formik.touched.password && formik.errors.password && (
  //                     <div className="text-xs text-red-500 pl-3">{formik.errors.password}</div>
  //                   )}
  //                 </div>
  //                 <div>
  //                   <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "")}>
  //                     <Lock className="mr-2" />
  //                     <input
  //                       type={showConfirmPassword ? "text" : "password"}
  //                       placeholder="Re-enter your password"
  //                       className="w-full outline-none dark:bg-sky-950"
  //                       name="confirmPassword"
  //                       value={formik.values.confirmPassword}
  //                       onChange={formik.handleChange}
  //                       onBlur={formik.handleBlur}
  //                     />
  //                     <button
  //                       type="button"
  //                       onClick={() =>
  //                         setShowConfirmPassword(!showConfirmPassword)
  //                       }
  //                       className="text-xs text-gray-500"
  //                     >
  //                       {showConfirmPassword ? "HIDE" : "SHOW"}
  //                     </button>
  //                   </div>
  //                   {formik.touched.confirmPassword && formik.errors.confirmPassword && (
  //                     <div className="text-xs text-red-500 pl-3">{formik.errors.confirmPassword}</div>
  //                   )}
  //                 </div>
  //                 <button type="submit" disabled={isPending} className="w-full bg-royalBlue text-white rounded-md py-3 font-medium flex items-center justify-between gap-2 hover:bg-green-800 px-3">
  //                   Register an Account
  //                   <span className="ml-2">→</span>
  //                 </button>
  //               </form>
  //             </div>
  //           </div>

  //           {/* Footer */}
  //           <div className="flex justify-between items-center px-4 py-3 text-xs text-gray-400">
  //             <div>Copyright 2025 - 2022 H2otechonline All rights Reserved</div>
  //             <div className="flex items-center gap-1 cursor-pointer hover:underline">
  //               <Info size={14} />
  //               <span>Need help?</span>
  //             </div>
  //           </div>

  //         </div>
  //       </div>
  //   </>

  // )
}

export default Register;
