import { BrowserRouter, Route, Routes } from "react-router";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AuthProvider } from "../contexts/auth/AuthProvider";

export const RouterProvider: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<ProtectedRoute element={<DashboardPage />} />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}