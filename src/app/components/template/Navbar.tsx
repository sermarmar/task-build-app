import { LogOut, User } from "lucide-react";
import { DropdownButton } from "../ux/DropdownButton";
import { useAuth } from "../../contexts/auth/useAuth";
import { useNavigate } from "react-router";

interface NavbarProps {
    className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {

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
        <nav className={`bg-tertiary-200 shadow rounded-2xl text-primary-900 h-full flex flex-col items-center ${className}`}>
            <div className="flex flex-col h-full items-center justify-between p-4">
                <User size={24} className="mb-2" />
                <LogOut size={16} className="mb-2" />
            </div>
        </nav>
    );
}