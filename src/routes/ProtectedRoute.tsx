import { Navigate } from "react-router-dom";
import Layout from "../layout/layout";
interface ProtectedRouteProps {
    isAuthenticated: boolean;
}
const ProtectedRoute = ({ isAuthenticated }: ProtectedRouteProps): JSX.Element => {
    return <>{isAuthenticated ? <Layout /> : <Navigate to="/auth/login" />}</>;
};

export default ProtectedRoute;
