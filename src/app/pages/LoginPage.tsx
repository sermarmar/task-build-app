import { Card } from "../components/ux/Card";
import { LoginForm } from "../features/login/components/LoginForm";

export const LoginPage: React.FC = () => {

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="relative overflow-hidden">

                {/* Background circles */}
                <div className="absolute rounded-full pointer-events-none w-[280px] h-[280px] bg-primary-900 opacity-[0.12] -top-[100px] -right-[80px]" />
                <div className="absolute rounded-full pointer-events-none w-[200px] h-[200px] bg-secondary-700 opacity-[0.15] -bottom-[60px] -left-[50px]" />
                <div className="absolute rounded-full pointer-events-none w-[140px] h-[140px] bg-tertiary-300 opacity-30 bottom-[20px] -right-[20px]" />

                <div className="text-center mb-8 z-10">
                    <img src="/logo.png" alt="Abyssal Logo" className="mx-auto w-30 h-30"/>
                    <h1 className="text-3xl font-bold text-primary-950 mb-2">Abyssal</h1>
                    <p className="text-tertiary-950/40">Te ayuda a construir hábitos sostenibles sin ansiedad ni presión.</p>
                </div>
                <div className="relative z-10">
                    <LoginForm />
                </div>
                
                
            </Card>
        </div>
        
    );
}