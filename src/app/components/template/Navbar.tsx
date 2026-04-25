import { Bolt, CircleUserRound, House, ListTodo, LogOut, Notebook, User } from "lucide-react";
import { useAuth } from "../../contexts/auth/useAuth";
import { useLocation, useNavigate } from "react-router";
import { Button } from "../ux/Button";

interface NavbarProps {
    className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {

    const { logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const navItems = [
        { icon: <House />, path: '/home' },
        { icon: <ListTodo />, path: '/notes' },
        { icon: <CircleUserRound />, path: '/profile' },
        { icon: <Bolt />, path: '/settings' },
    ];

    const isActive = (path: string) => pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };


    return (
        <nav className={`bg-tertiary-200 shadow rounded-full text-primary-900 h-full flex flex-col items-center ${className}`}>
            <div className="flex flex-col h-full items-center justify-between p-2">
                <User size={24} className="mb-2" />
                <div className="flex flex-col gap-8">
                    {navItems.map(({ icon, path }) => (
                        <Button
                            key={path}
                            type="button"
                            form="pill"
                            color="transparent"
                            onClick={() => navigate(path)}
                            className={`
                                hover:bg-primary-900 hover:text-tertiary-50
                                ${isActive(path)
                                    ? 'bg-primary-900 text-tertiary-50' 
                                    : ''}
                            `}
                        >
                            {icon}
                        </Button>
                    ))}
                </div>
                <Button type="button" form="pill" color="transparent" onClick={ handleLogout } className="hover:bg-primary-900 hover:text-tertiary-50">
                    <LogOut />
                </Button>
            </div>
        </nav>
    );
}