import { BrowserRouter, Route, Routes } from "react-router";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AuthProvider } from "../contexts/auth/AuthProvider";
import { TaskPage } from "../pages/TaskPage";
import { Navbar } from "../components/template/Navbar";
import { ConfigPage } from "../pages/ConfigPage";

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
                            <div className="flex h-screen overflow-hidden w-full">
                                <div className="flex-none md:m-5">
                                    <Navbar className="" />
                                </div>
                                <div className="my-10 pr-5 overflow-y-auto scrollbar-primary flex-1">
                                    <Routes>
                                        <Route path="/home" element={<DashboardPage />} />
                                        <Route path="/notes" element={<TaskPage />} />
                                        <Route path="/profile" element={<div>Perfil</div>} />
                                        <Route path="/settings" element={<ConfigPage />} />
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