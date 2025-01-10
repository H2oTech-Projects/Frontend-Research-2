import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteList } from "./RouteList";
import ProtectedRoute from "./ProtectedRoute";
const Login = lazy(async () => await import("./../pages/auth/Login"));
const ResetPassword = lazy(async () => await import("./../pages/auth/ResetPassword"));
const ForgotPassword = lazy(async () => await import("./../pages/auth/ForgotPassword"));
interface RoutesContainerProps {
    isLoadingData: boolean;
}

const RoutesContainer = ({ isLoadingData }: RoutesContainerProps) => {
    const isAuthenticated = false;
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <>
                    <Route
                        path="/auth/login"
                        element={isAuthenticated ? <Navigate to={"/map"} /> : <Login />}
                    />
                    <Route
                        path="/auth/forgotPassword"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/auth/reset-password"
                        element={<ResetPassword />}
                    />
                </>

                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                    {!isLoadingData && (
                        <>
                            {RouteList?.map((route) => (
                                <Route
                                    path={route.path}
                                    element={<route.Component />}
                                    key={route.path}
                                />
                            ))}
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
                                to="/map"
                                replace
                            />
                        }
                    />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default RoutesContainer;
