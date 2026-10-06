import { BrowserRouter, Route, Routes } from "react-router";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AuthProvider } from "../contexts/auth/AuthProvider";
import { TaskPage } from "../pages/TaskPage";
import { Navbar } from "../components/template/Navbar";
import { ConfigPage } from "../pages/ConfigPage";
import { UserPage } from "../pages/UserPage";

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
                            <div className="flex h-screen overflow-hidden w-full md:gap-2 md:p-5">
                                <Navbar />
                                <main className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-primary px-4 pt-6 pb-28 md:px-6 md:py-3">
                                    <Routes>
                                        <Route path="/home" element={<DashboardPage />} />
                                        <Route path="/notes" element={<TaskPage />} />
                                        <Route path="/profile" element={<UserPage />} />
                                        <Route path="/settings" element={<ConfigPage />} />
                                    </Routes>
                                </main>
                            </div>
                        } />
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
