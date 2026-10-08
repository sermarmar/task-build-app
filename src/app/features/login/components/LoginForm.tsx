import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/auth/useAuth';
import { Input } from '../../../components/ux/Input';
import { Button } from '../../../components/ux/Button';

export const LoginForm: React.FC = () => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { login, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        try {
            await login(username, password);
            navigate('/home');
        } catch (err) {
            setError('Error al iniciar sesión. Intenta de nuevo.');
            console.error(err);
        }
    }

    return(
        <form onSubmit={handleLogin} className="space-y-5">
            {error && (
                <div role="alert" className="p-3 rounded-2xl bg-accent-blossom-100 text-accent-blossom-800 text-sm font-bold">
                    {error}
                </div>
            )}

            <Input
                name="username"
                label="Usuario"
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required/>

            <Input
                name="password"
                label="Contraseña"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                value={password}
                required
            />
            <Button type="submit" color="tertiary" form="rounded" size="lg" disabled={loading} className="w-full justify-center mt-2">
                {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </Button>
        </form>
    )
}