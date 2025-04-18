import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "../../utils/cn";
import AuthenticationCard from "../../components/AuthenticationCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { usePostRegisterUser } from "@/services/registration";
import { useEffect, useState } from "react";
import { Mail, Lock, User, ChevronLeft, Info } from "lucide-react";
import RegisterImage from "../../assets/registerImage.jpg";
import FlowLogo from "../../assets/Circular-Light-Gray.png";
// const Register = () => {
//   const isDesktopDevice = useMediaQuery("(min-width: 768px)");
//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("Invalid email address").required("Email is required"),
//   });
//   const { mutate, isPending, isError, error, isSuccess, data } = usePostRegisterUser();
//   const formik = useFormik({
//     initialValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       console.log("Form Submitted:", values);
//       mutate({
//         email: values.email,
//         username: values.firstName + values.lastName,
//         password1: "10passworduser",
//         password2: "10passworduser",
//         first_name: values.firstName,
//         last_name: values.lastName,
//       });
//     },
//   });



//   return (
//     <AuthenticationCard

//       children={
//         <div className={cn("flex flex-col items-center gap-4", isDesktopDevice ? "px-6 py-7 " : "px-3 pt-5")}>
//           <h1 className="border-b border-solid border-royalBlue p-0.5 pt-0 text-2xl font-semibold text-royalBlue">Register</h1>
//           <form onSubmit={formik.handleSubmit} className="mt-2 space-y-3 ">
//             <input
//               type="text"
//               name="firstName"
//               placeholder="First Name"
//               className="w-full rounded-lg border p-1 dark:bg-gray-700"
//               value={formik.values.firstName}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             <input
//               type="text"
//               name="lastName"
//               placeholder="Last Name"
//               className="w-full rounded-lg border p-1 dark:bg-gray-700"
//               value={formik.values.lastName}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             <input
//               type="text"
//               name="email"
//               placeholder="Email"
//               className="w-full rounded-lg border p-1 dark:bg-gray-700"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             {formik.touched.email && formik.errors.email && (
//               <div className="text-sm text-red-500">{formik.errors.email}</div>
//             )}
//             {/* <select
//                         name="gender"
//                         className="w-full rounded-lg border p-1 dark:bg-gray-700 appearance-none"
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         defaultValue=""
//                     >
//                         <option value="" disabled hidden>Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     {formik.touched.gender && formik.errors.gender && (
//                         <div className="text-sm text-red-500">{formik.errors.gender}</div>
//                     )}
//                     <select
//                         name="state"
//                         className="w-full rounded-lg border p-1 dark:bg-gray-700 appearance-none"
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}

//                     >
//                         <option value="" disabled hidden>Select State</option>
//                         <option value="California">California</option>
//                         <option value="New York">New York</option>
//                         <option value="Texas">Texas</option>
//                     </select>
//                     {formik.touched.state && formik.errors.state && (
//                         <div className="text-sm text-red-500">{formik.errors.state}</div>
//                     )} */}
//             <div className="flex w-full flex items-center justify-center">
//               <button
//                 type="submit"
//                 className="w-1/2  rounded-lg bg-blue-500 p-1 text-white hover:bg-blue-600"
//                 disabled={isPending}
//               >
//                 Register
//               </button>
//             </div>
//             <Link
//               to="/auth/login"
//               className="mt-2 flex items-center justify-center text-blue-500 hover:underline"
//             >
//               <ArrowLeft size={15} /> Back
//             </Link>
//           </form>
//         </div>
//       }
//     />
//   );
// };

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

    if(isSuccess){
     toast.success(data?.msg );
    formik.resetForm();
}
     

  }, [error, isSuccess]);

  return (
    <>
      <div className="flex min-h-screen w-full">
        <div className="w-[470px] max-w-[500px] text-white relative ">
          <div className="z-10 flex flex-col justify-between h-full px-6 py-10">

            <div className="flex justify-center items-center align-center mb-4 gap-3">
              <img src={FlowLogo} alt="Flow Logo" className="w-16 h-16 mb-2" />
              <span className="text-3xl font-semibold ">FLOW</span>
            </div>

            {/* Bottom Text */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Water Accounts for Your Fields</h2>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
              </p>
            </div>
          </div>
          <img
            src={RegisterImage}
            alt="H2O Logo"
            className="w-full h-full object-cover -z-10 absolute top-0 left-0"
          />
        </div>

        {/* Right Form Section */}
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="flex flex-col justify-between min-h-full">

            {/* Top Navigation */}
            <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-600">
              <div className="flex items-center gap-1 cursor-pointer hover:underline">
                <ChevronLeft size={16} />
                <span>Return Home</span>
              </div>
              <div className="text-right text-sm">
                Already have an account?{" "}
                <span className="font-semibold underline cursor-pointer">
                  LOG IN NOW
                </span>
              </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center -mt-20">
              {/* Title Section */}
              <div className="flex flex-col gap-1 justify-center items-center mt-5">
                <h1 className="font-semibold text-2xl">
                  START YOUR EXCLUSIVE JOURNEY
                </h1>
                <h4 className="font-thin">SIGN UP AND JOIN THE FLOW</h4>
              </div>

              {/* Form Section */}
              <div className="flex justify-center">
                <form onSubmit={formik.handleSubmit} className="w-[374px] mx-auto py-4 space-y-4 px-0">
                  <div>
                    <div className={cn("flex items-center border rounded-md px-3 py-2", formik.touched.username && formik.errors.username ? "border-red-500" : "")}>
                      <User className="mr-2" />
                      <input
                        type="text"
                        placeholder="Username"
                        className="w-full outline-none"
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
                        className="w-full outline-none"
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
                        className="w-full outline-none"
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
                        className="w-full outline-none"
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
                        className="w-full outline-none"
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
                        className="w-full outline-none"
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
                  <button type="submit" disabled={isPending} className="w-full bg-green-700 text-white rounded-md py-3 font-medium flex items-center justify-between gap-2 hover:bg-green-800 px-3">
                    Register an Account
                    <span className="ml-2">→</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-4 py-3 text-xs text-gray-400">
              <div>Copyright 2025 - 2022 H2otechonline All rights Reserved</div>
              <div className="flex items-center gap-1 cursor-pointer hover:underline">
                <Info size={14} />
                <span>Need help?</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>

  )
}

export default Register;
