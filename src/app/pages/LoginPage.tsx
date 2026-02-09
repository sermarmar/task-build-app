import { Clock } from "lucide-react";
import { LoginForm } from "../components/template/LoginForm";

export const LoginPage: React.FC = () => {

    return (
        <div className="bg-background-card flex flex-col justify-center rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
                <div className="bg-linear-to-r from-accent-from to-accent-to w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-text-DEFAULT mb-2">TaskBuild</h1>
                <p className="text-text-muted">Gestiona tu tiempo y tareas</p>
            </div>
            <LoginForm />
            
        </div>
    );
}