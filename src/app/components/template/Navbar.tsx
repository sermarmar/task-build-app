import { LogOut, User } from "lucide-react";
import { DropdownButton } from "../ux/DropdownButton";
import { useAuth } from "../../contexts/auth/useAuth";
import { useNavigate } from "react-router";

export const Navbar: React.FC = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const dropdownItems = [
        { label: <><LogOut size={16} /> Salir</>, onClick: handleLogout },
    ];

    return (
        <nav className="bg-white fixed w-full z-10 top-0 shadow left-0">
            <div className="container mx-auto flex justify-between items-center py-3">
                <div className="text-lg font-bold">Mi Aplicación</div>
                <DropdownButton
                    buttonText={`${user?.name ?? ""} ${user?.lastName ?? ""}`.trim()}
                    list={dropdownItems}
                >
                    <User size={18} />
                </DropdownButton>
            </div>
        </nav>
    );
}