import { LoginForm } from "../features/login/components/LoginForm";
import { LogoMark } from "../components/template/LogoMark";

export const LoginPage: React.FC = () => {

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-[2.5rem] bg-surface shadow-clay overflow-hidden">

                {/* Panel ilustrado: esferas y ola al estilo del UI kit 3D */}
                <div className="relative hidden md:flex flex-col justify-between p-10 min-h-[560px] bg-gradient-to-br from-tertiary-100 via-cream-100 to-lilac-100 overflow-hidden">
                    <div className="relative z-10 flex items-center gap-3">
                        <LogoMark />
                        <span className="font-heading text-2xl font-bold text-primary-950">Abyssal</span>
                    </div>

                    <span className="absolute top-24 right-16 size-28 rounded-full clay-knob" />
                    <span className="absolute top-52 right-44 size-14 rounded-full clay-peach shadow-clay-pressed" />
                    <span className="absolute top-36 left-14 size-10 rounded-full clay-blue shadow-clay-pressed" />
                    <span className="absolute bottom-40 right-10 size-16 rounded-full bg-accent-blossom-300 shadow-clay-pressed" />

                    <svg className="absolute inset-x-0 bottom-0 w-full" viewBox="0 0 500 220" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M0 120 C 120 40, 220 200, 340 110 S 470 60, 500 90 L 500 220 L 0 220 Z" fill="var(--color-secondary-200)" />
                        <path d="M0 170 C 140 110, 260 230, 380 160 S 480 130, 500 150 L 500 220 L 0 220 Z" fill="var(--color-secondary-300)" opacity="0.8" />
                    </svg>

                    <div className="relative z-10 max-w-xs">
                        <p className="font-heading text-3xl font-bold text-primary-950 leading-tight">Construye hábitos sin ansiedad.</p>
                        <p className="mt-3 text-primary-700">Tareas, hábitos, foco y bienestar en un mismo sitio, a tu ritmo.</p>
                    </div>
                </div>

                <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="md:hidden flex items-center gap-3 mb-8">
                        <LogoMark />
                        <span className="font-heading text-2xl font-bold text-primary-950">Abyssal</span>
                    </div>
                    <h1 className="font-heading text-3xl font-bold text-primary-950">Bienvenido de nuevo</h1>
                    <p className="mt-2 mb-8 text-primary-500">Te ayuda a construir hábitos sostenibles sin ansiedad ni presión.</p>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
