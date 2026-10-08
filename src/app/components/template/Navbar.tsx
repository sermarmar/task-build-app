import { CircleUserRound, LayoutDashboard, ListTodo, LogOut, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/auth/useAuth";
import { LogoMark } from "./LogoMark";
import { cn } from "@/utils/cn";

interface NavbarProps {
    className?: string;
}

const NAV_ITEMS = [
    { icon: <LayoutDashboard />, path: '/home',     label: 'Panel' },
    { icon: <ListTodo />,        path: '/notes',    label: 'Tareas y hábitos' },
    { icon: <CircleUserRound />, path: '/profile',  label: 'Perfil' },
    { icon: <Settings />,        path: '/settings', label: 'Configuración' },
];

export const Navbar: React.FC<NavbarProps> = ({ className }) => {

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav
            aria-label="Navegación principal"
            className={cn(
                "fixed z-40 inset-x-4 bottom-4 rounded-full bg-surface/90 backdrop-blur shadow-clay",
                "md:static md:inset-auto md:h-full md:w-24 md:rounded-[2rem] md:py-6",
                className,
            )}
        >
            <div className="flex md:flex-col h-full items-center justify-between px-3 py-2 md:p-0">
                <div className="hidden md:block">
                    <LogoMark />
                </div>

                <ul className="flex md:flex-col flex-1 md:flex-none justify-around md:justify-center gap-2 md:gap-4">
                    {NAV_ITEMS.map(({ icon, path, label }) => {
                        const active = pathname === path;
                        return (
                            <li key={path} className="relative flex">
                                {active && (
                                    // -left-6 = (w-24 de la nav - size-12 del botón) / 2, para que quede pegada al borde
                                    <span className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 h-7 w-1.5 rounded-r-full clay-peach" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => navigate(path)}
                                    title={label}
                                    aria-label={label}
                                    aria-current={active ? 'page' : undefined}
                                    className={cn(
                                        "size-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all [&_svg]:size-5",
                                        active
                                            ? "clay-knob text-tertiary-600"
                                            : "text-primary-400 hover:text-primary-800 hover:bg-white/60",
                                    )}
                                >
                                    {icon}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <button
                    type="button"
                    onClick={handleLogout}
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                    className="hidden md:flex size-12 rounded-2xl items-center justify-center text-primary-400 hover:text-accent-blossom-600 hover:bg-white/60 transition cursor-pointer [&_svg]:size-5"
                >
                    <LogOut />
                </button>
            </div>
        </nav>
    );
}
