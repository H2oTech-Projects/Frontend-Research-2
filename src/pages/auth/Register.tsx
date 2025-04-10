import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "../../utils/cn";
import AuthenticationCard from "../../components/AuthenticationCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { usePostRegisterUser } from "@/services/registration";

const Register = () => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });
  const { mutate, isPending, isError, error, isSuccess, data } = usePostRegisterUser();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      mutate({
        email: values.email,
        username: values.firstName + values.lastName,
        password1: "10passworduser",
        password2: "10passworduser",
        first_name: values.firstName,
        last_name: values.lastName,
      });
    },
  });



  return (
    <AuthenticationCard

      children={
        <div className={cn("flex flex-col items-center gap-4", isDesktopDevice ? "px-6 py-7 " : "px-3 pt-5")}>
          <h1 className="border-b border-solid border-royalBlue p-0.5 pt-0 text-2xl font-semibold text-royalBlue">Register</h1>
          <form onSubmit={formik.handleSubmit} className="mt-2 space-y-3 ">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full rounded-lg border p-1 dark:bg-gray-700"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full rounded-lg border p-1 dark:bg-gray-700"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full rounded-lg border p-1 dark:bg-gray-700"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-sm text-red-500">{formik.errors.email}</div>
            )}
            {/* <select
                        name="gender"
                        className="w-full rounded-lg border p-1 dark:bg-gray-700 appearance-none"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        defaultValue=""
                    >
                        <option value="" disabled hidden>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {formik.touched.gender && formik.errors.gender && (
                        <div className="text-sm text-red-500">{formik.errors.gender}</div>
                    )}
                    <select
                        name="state"
                        className="w-full rounded-lg border p-1 dark:bg-gray-700 appearance-none"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        
                    >
                        <option value="" disabled hidden>Select State</option>
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                        <option value="Texas">Texas</option>
                    </select>
                    {formik.touched.state && formik.errors.state && (
                        <div className="text-sm text-red-500">{formik.errors.state}</div>
                    )} */}
            <div className="flex w-full flex items-center justify-center">
              <button
                type="submit"
                className="w-1/2  rounded-lg bg-blue-500 p-1 text-white hover:bg-blue-600"
                disabled={isPending}
              >
                Register
              </button>
            </div>
            <Link
              to="/auth/login"
              className="mt-2 flex items-center justify-center text-blue-500 hover:underline"
            >
              <ArrowLeft size={15} /> Back
            </Link>
          </form>
        </div>
      }
    />
  );
};

export default Register;
