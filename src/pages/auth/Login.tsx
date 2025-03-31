import { Link, useNavigate } from "react-router-dom";
import { Mail, Key } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "../../utils/cn";
import AuthenticationCard from "../../components/AuthenticationCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
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
    <AuthenticationCard

      children={
        <div className={cn("flex flex-col items-center gap-4", isDesktopDevice ? "p-11" : "px-3 pt-5")}>
          <h1 className="border-b border-solid border-royalBlue p-0.5 pt-0 text-2xl font-semibold text-royalBlue">Login</h1>
          <form
            onSubmit={formik.handleSubmit}
            action="login"
            className={cn("mt-2 flex w-full flex-col items-center", isDesktopDevice ? "mt-6 gap-6" : "mt-0 gap-4")}
          >
            <div className="flex w-full flex-col">
              <div
                className={cn(
                  "w-full rounded-2xl p-3 text-royalBlue",
                  isDesktopDevice
                    ? "input"
                    : "flex h-10 flex-shrink-0 items-center justify-center gap-4 border border-slate-300 px-2 text-base dark:border-slateLight-900 dark:bg-slateLight-900",
                )}
              >
                <Mail size={20} />
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="flex-grow bg-slate-50 outline-none dark:bg-slateLight-900"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email && formik.values.email !== "" && (
                <div className="px-2 text-sm text-red-500">{formik.errors.email}</div>
              )}
            </div>
            <div className="flex w-full flex-col">
              <div
                className={cn(
                  "w-full rounded-2xl p-3 text-royalBlue",
                  isDesktopDevice
                    ? "input"
                    : "flex h-10 flex-shrink-0 items-center justify-center gap-4 border border-slate-300 px-2 text-base dark:border-slateLight-900 dark:bg-slateLight-900",
                )}
              >
                <Key size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="flex-grow bg-slate-50 outline-none dark:bg-slateLight-900"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.password && formik.errors.password && formik.values.password !== "" && (
                <div className="px-2 text-sm text-red-500">{formik.errors.password}</div>
              )}
            </div>
            {/* <div className="checkbox -mt-2 flex w-full items-center justify-start gap-2 pl-2 text-royalBlue">
                        <input
                            id="rememberMe"
                            type="checkbox"
                            name="rememberMe"
                            checked={formik.values.rememberMe}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="rememberMe">Remember Me</label>
                    </div> */}
            <button
              type="submit"
              className={cn(
                "rounded-2xl bg-royalBlue text-base font-semibold text-white hover:bg-blue-500",
                isDesktopDevice ? "h-10 w-56" : "h8 w-40",
              )}
            >
              Login
            </button>
            <Link
              to="/auth/forgotPassword"
              className="-mt-4 border-b border-solid border-royalBlue p-0.5 text-royalBlue hover:font-semibold"
            >
              Forgot Password?
            </Link>
            <Link
              to="/auth/register"
              className="-mt-4 border-b border-solid border-royalBlue p-0.5 text-royalBlue hover:font-semibold"
            >
              Register
            </Link>
          </form>
        </div>

      }
    />
  );
  // return (
  //     <div
  //         className={cn(
  //             "flex content-center items-center justify-center bg-slateLight-100 transition-colors dark:bg-slateLight-950",
  //             isDesktopDevice ? "min-h-screen" : "h-screen",
  //         )}
  //     >
  //         <div
  //             className={cn(
  //                 "relative flex overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slateLight-800",
  //                 isDesktopDevice ? "h-[420px] w-[760px]" : "flex h-[660px] w-11/12 flex-col",
  //             )}
  //         >
  //             <div className={cn("flex flex-col items-center gap-3 bg-royalBlue p-5", isDesktopDevice ? "w-1/2" : "h-1/2")}>
  //                 <h1 className={cn("font-bold text-white", isDesktopDevice ? "m-4 text-5xl" : "m-2 text-4xl")}>Flow</h1>
  //                 <h3 className={cn("font-thin text-slate-300", isDesktopDevice ? "m-3 text-2xl" : "m-1 text-xl")}>Water Accounting Application</h3>
  //                 <div className="flex flex-col items-center">
  //                     <p className="text-base font-thin text-slate-300">Data from all your fields in one </p>
  //                     <p className="text-base font-thin text-slate-300">easy to access spot.</p>
  //                 </div>
  //                 <div className={cn("flex flex-col items-center gap-3", isDesktopDevice ? "mt-6" : "mt-1")}>
  //                     <h4 className="text-sm font-semibold text-white">Powered By</h4>
  //                     <div className="w-58 flex h-14 items-center justify-center rounded-lg bg-white p-2">
  //                         <img
  //                             src={H2OLogo}
  //                             alt="h2o-logo"
  //                             className="w-57 h-12"
  //                         />
  //                     </div>
  //                 </div>
  //             </div>
  //             <div className={cn(isDesktopDevice ? "w-1/2 p-2" : "h-1/2 p-1")}>
  //                 <div className={cn("flex flex-col items-center gap-4", isDesktopDevice ? "p-11" : "px-3 pt-5")}>
  //                     <h1 className="border-b border-solid border-royalBlue p-0.5 pt-0 text-2xl font-semibold text-royalBlue">Login</h1>

  //                     <form
  //                         action="login"
  //                         className={cn("mt-6 flex w-full flex-col items-center gap-6", isDesktopDevice ? "mt-6" : "mt-0")}
  //                     >
  //                         <div
  //                             className={cn(
  //                                 "w-full rounded-2xl p-3 text-royalBlue",
  //                                 isDesktopDevice
  //                                     ? "input"
  //                                     : "flex h-10 flex-shrink-0 items-center justify-center gap-4 border border-slate-300 px-2 text-base",
  //                             )}
  //                         >
  //                             <Mail size={20} />
  //                             <input
  //                                 type="text"
  //                                 placeholder="Email"
  //                                 className="flex-grow bg-white outline-none dark:bg-slateLight-800"
  //                             />
  //                         </div>
  //                         <div
  //                             className={cn(
  //                                 "w-full rounded-2xl p-3 text-royalBlue",
  //                                 isDesktopDevice
  //                                     ? "input"
  //                                     : "flex h-10 flex-shrink-0 items-center justify-center gap-4 border border-slate-300 px-2 text-base",
  //                             )}
  //                         >
  //                             <Key size={20} />
  //                             <input
  //                                 type="password"
  //                                 placeholder="Password"
  //                                 className="flex-grow bg-white outline-none dark:bg-slateLight-800"
  //                             />
  //                         </div>
  //                         <div className="checkbox -mt-2 flex w-full items-center justify-start gap-2 pl-2 text-royalBlue">
  //                             <input
  //                                 id="rememberMe"
  //                                 type="checkbox"
  //                             />
  //                             <label htmlFor="rememberMe">Remember Me</label>
  //                         </div>
  //                         <button
  //                             type="submit"
  //                             className="h-10 w-56 rounded-2xl bg-royalBlue text-base font-semibold text-white hover:bg-blue-500"
  //                         >
  //                             Login
  //                         </button>
  //                         <Link
  //                             to="/auth/forgotPassword"
  //                             className="-mt-4 border-b border-solid border-royalBlue p-0.5 text-royalBlue"
  //                         >
  //                             Forgot Password?
  //                         </Link>
  //                     </form>
  //                 </div>
  //             </div>
  //             <div className="icon absolute left-1/2 top-1/2 z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white p-1 dark:bg-slateLight-800">
  //                 <div className="circle h-full w-full rounded-full bg-royalBlue dark:bg-slateLight-800">
  //                     <img
  //                         src={EarthLightLogo}
  //                         alt="Flow"
  //                         className="h-full w-full"
  //                     />
  //                 </div>
  //             </div>
  //         </div>
  //     </div>
  // );
};

export default Login;
