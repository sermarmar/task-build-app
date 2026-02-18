import { useAuth } from '../contexts/auth/useAuth';
import { useNavigate } from 'react-router';
import { Input } from '../components/ux/Input';
import { Button } from '../components/ux/Button';
import { useState, useEffect } from 'react';

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
        <form onSubmit={handleLogin} className="space-y-6">
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
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
            <div className="flex justify-end">
                <Button type="submit" disabled={loading} >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
            </div>
            
        </form>
    )
}