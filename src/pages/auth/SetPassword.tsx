// import { Link, useParams } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import { useMediaQuery } from "@uidotdev/usehooks";
// import { cn } from "../../utils/cn";
// import AuthenticationCard from "../../components/AuthenticationCard";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { toast } from "react-toastify";
// import { usePostCheckToken } from "@/services/registration";
// import { useEffect } from "react";

// const SetPassword = () => {
//   const isDesktopDevice = useMediaQuery("(min-width: 768px)");
//   const { token } = useParams();
//   const { mutate, isPending, isError, error, isSuccess, data } = usePostCheckToken();
//   const validationSchema = Yup.object().shape({
//     password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password")], "Passwords must match")
//       .required("Confirm password is required"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       console.log("Password Set Successfully:", values);
//       toast.success("Password set successfully!");
//     },
//   });
//   // useEffect(() => {
//   //   if (token) {
//   //     mutate({ key: token });
//   //   }
//   // }, [token]);

//   if(isPending) return <div className="flex h-screen items-center justify-center dark:bg-slate-900 dark:text-white">Loading...</div>;

//   return (
//     <AuthenticationCard
//       children={
//          <div className={cn("flex flex-col items-center gap-4", isDesktopDevice ? "p-11" : "px-3 pt-5")}>
//           <h1 className="border-b border-solid border-royalBlue p-0.5 pt-0 text-2xl font-semibold text-royalBlue">Set Password</h1>
//           <form onSubmit={formik.handleSubmit} className="mt-2 space-y-3 flex w-full flex-col items-center gap-3">
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="w-full rounded-lg border p-1 dark:bg-gray-700"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             {formik.touched.password && formik.errors.password && (
//               <div className="text-sm text-red-500">{formik.errors.password}</div>
//             )}
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               className="w-full rounded-lg border p-1 dark:bg-gray-700"
//               value={formik.values.confirmPassword}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             {formik.touched.confirmPassword && formik.errors.confirmPassword && (
//               <div className="text-sm text-red-500">{formik.errors.confirmPassword}</div>
//             )}
//             <button
//               type="submit"
//               className="w-auto rounded-lg bg-royalBlue px-4 py-2 text-white hover:bg-blue-600 flex items-center justify-center"
//             >
//               Set Password
//             </button>
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

// export default SetPassword;


import React from 'react'

const SetPassword = () => {
  return (
    <div>
      SetPassword
    </div>
  )
}

export default SetPassword
