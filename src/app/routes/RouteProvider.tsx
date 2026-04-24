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
                <div className="flex h-screen overflow-hidden">  {/* 👈 overflow-hidden para que nada se desborde */}
                    <div className="flex-none m-5">
                        <Navbar className="h-[calc(100vh-2.5rem)]" />  {/* 👈 100vh menos el margen top+bottom (2 * 1.25rem) */}
                    </div>
                    <div className="my-10 pr-5 overflow-y-auto scrollbar-primary">
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/home" element={<ProtectedRoute element={<DashboardPage />} />} />
                            <Route path="/notes" element={<ProtectedRoute element={<TaskPage />} />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}