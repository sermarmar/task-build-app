
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/auth/useAuth";
import { LogOut } from "lucide-react";

export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Bienvenido, <span className="font-semibold">{user}</span></p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>

                <div className="border-t pt-6">
                    <p className="text-gray-600">Tu contenido del dashboard irá aquí...</p>
                </div>
            </div>
        </div>
    );
}