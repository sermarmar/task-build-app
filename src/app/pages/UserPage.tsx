import { AtSign, LogOut, Mail, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/auth/useAuth";
import { PageHeader } from "../components/template/PageHeader";
import { Card } from "../components/ux/Card";
import { Button } from "../components/ux/Button";

export const UserPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const fields = [
        { icon: <UserRound />, label: 'Nombre',  value: `${user?.name ?? ''} ${user?.lastName ?? ''}`.trim() },
        { icon: <AtSign />,    label: 'Usuario', value: user?.username },
        { icon: <Mail />,      label: 'Email',   value: user?.email },
    ];

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Tu perfil" subtitle="Tus datos de cuenta." />

            <Card className="max-w-2xl flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                <span className="size-28 shrink-0 rounded-full clay-blue shadow-clay-pressed flex items-center justify-center font-heading text-4xl font-bold text-secondary-950">
                    {`${user?.name?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase()}
                </span>
                <div className="flex-1 w-full flex flex-col gap-3">
                    {fields.map(({ icon, label, value }) => (
                        <div key={label} className="flex items-center gap-4 rounded-2xl bg-white/50 shadow-clay-inset px-4 py-3">
                            <span className="text-tertiary-500 [&_svg]:size-5">{icon}</span>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-primary-400">{label}</p>
                                <p className="font-bold text-primary-900 truncate">{value || '—'}</p>
                            </div>
                        </div>
                    ))}
                    <Button type="button" color="light" form="rounded" className="self-end mt-2 text-accent-blossom-700" onClick={handleLogout}>
                        <LogOut size={16} />
                        Cerrar sesión
                    </Button>
                </div>
            </Card>
        </div>
    );
};
