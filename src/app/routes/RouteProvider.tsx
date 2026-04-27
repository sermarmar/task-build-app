import { BrowserRouter, Route, Routes } from "react-router";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AuthProvider } from "../contexts/auth/AuthProvider";
import { TaskPage } from "../pages/TaskPage";
import { Navbar } from "../components/template/Navbar";

export const RouterProvider: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Ruta pública - sin navbar */}
                    <Route path="/" element={<LoginPage />} />

                    {/* Rutas privadas - con navbar */}
                    <Route path="/*" element={
                        <ProtectedRoute element={
                            <div className="flex h-screen overflow-hidden">
                                <div className="flex-none md:m-5">
                                    <Navbar className="" />
                                </div>
                                <div className="my-10 pr-5 overflow-y-auto scrollbar-primary">
                                    <Routes>
                                        <Route path="/home" element={<DashboardPage />} />
                                        <Route path="/notes" element={<TaskPage />} />
                                    </Routes>
                                </div>
                            </div>
                        } />
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}