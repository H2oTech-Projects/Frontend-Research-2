import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteList } from "./RouteList";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "lucide-react";
import { staticPermissionList } from "@/utils/testPermission";
const Login = lazy(async () => await import("./../pages/auth/Login"));

const ForgotPassword = lazy(async () => await import("./../pages/auth/ForgotPassword"));
const Register = lazy(async () => await import("./../pages/auth/Register"));
const VerifyUser = lazy(async () => await import("./../pages/auth/VerifyUser"));
interface RoutesContainerProps {
  isLoadingData: boolean;
}

const RoutesContainer = ({ isLoadingData }: RoutesContainerProps) => {
  const authData = useSelector((state:any) => state.auth);
  const UserRole = useSelector((state: any) => state.auth?.userRole);
  const permissionList =  staticPermissionList(UserRole);
  const authorizedRouteList = RouteList?.filter((route:any)=> permissionList.includes(route?.name))
  if (isLoadingData)
    return (<div className="flex h-screen items-center justify-center dark:bg-slate-900 dark:text-white">
      Loading <Loader size={20} />
    </div>)

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center dark:bg-slate-900 dark:text-white">
          Loading <Loader size={20} />
        </div>
      }
    >
      <Routes>
        <>
          <Route
            path="/auth/login"
            element={ <Login />}
          />
          <Route
            path="/auth/forgotPassword"
            element={<ForgotPassword />}
          />
          <Route
            path="/auth/register"
            element={<Register />}
          />
          <Route
            path="/auth/verify-user"
            element={<VerifyUser />}
          />
        </>

        <Route element={<ProtectedRoute isAuthenticated={authData?.isLoggedIn} />}>
          {!isLoadingData && (
            <>
              {authorizedRouteList?.map((route) => (
                <Route
                  path={route.path}
                  element={<route.Component />}
                  key={route.path}
                />
              ))
              }
              <Route
                path="*"
                element={
                  <Navigate
                    to="/page-not-found"
                    replace
                  />
                }
              />
            </>
          )}
          <Route
            path="/"
            element={
              <Navigate
                to={authData.landingPageRoute}
                replace
              />
            }
          />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </Suspense>
  );
};

export default RoutesContainer;
