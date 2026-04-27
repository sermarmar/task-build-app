import { Bolt, CircleUserRound, House, ListTodo, LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/auth/useAuth";
import { useLocation, useNavigate } from "react-router";
import { Button } from "../ux/Button";

interface NavbarProps {
    className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const navItems = [
        { icon: <House />, path: '/home' },
        { icon: <ListTodo />, path: '/notes' },
        { icon: <CircleUserRound />, path: '/profile' },
        { icon: <Bolt />, path: '/settings' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={`bg-tertiary-300 text-primary-900 
        shadow md:rounded-full 
        w-full md:h-full md:w-auto
        fixed md:relative bottom-0 md:bottom-auto z-10
        ${className} md:h-[calc(100vh-2.5rem)]`}>
            <div className="flex md:flex-col md:h-full items-center justify-center md:justify-between p-2">
                <User size={24} className="hidden md:block mb-2" />
                <div className="flex md:flex-col justify-between md:justify-center gap-8 items-center">
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
                <div className="hidden md:block">
                    <LogoutComponent />
                </div>
            </div>
        </nav>
    );
}

const LogoutComponent: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Button type="button" form="pill" color="transparent" onClick={ handleLogout } className="hover:bg-primary-900 hover:text-tertiary-50">
            <LogOut />
        </Button>
    );
}