import { LogOut } from "lucide-react";
import { Button } from "../ux/Button";
import { useAuth } from "../../contexts/auth/useAuth";
import { useNavigate } from "react-router";

export const Navbar: React.FC = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white fixed w-full z-10 top-0 shadow left-0">
            <div className="container mx-auto flex justify-between items-center py-3">
                <div className="text-lg font-bold">Mi Aplicación</div>
                <div className="">
                    <Button type="button" color="primary" onClick={() => handleLogout()}>
                        <LogOut size={20} />
                        <span className="hidden sm:inline">Salir</span>
                    </Button>
                </div>
            </div>
        </nav>
    );
}