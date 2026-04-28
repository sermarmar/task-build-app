import { Card, CardBody, CardTitle } from "../components/ux/Card";
import { useAuth } from "../contexts/auth/useAuth";
import { CalendarBoard } from "../features/calendar/CalendarBoard";
import { MentalHealthBoard } from "../features/mental_healtth/MentalHealthBoard";
import { ButtonCreateHabit } from "../features/habits/components/ButtonCreateHabit";
import { HabitBoardProvider } from "../features/habits/contexts/HabitBoardProvider";
import { ButtonCreateTask } from "../features/tasks/components/ButtonCreateTask";
import { TaskBoardProvider } from "../features/tasks/contexts/TaskBoardProvider";
import { HabitsListToday } from "../features/habits/components/HabistListToday";
import { Pomodoro } from "../features/pomodoro/Pomodoro";


export const DashboardPage: React.FC = () => {

    const { user } = useAuth();

    return (
        <div className="grid grid-cols-6 grid-rows-5 gap-4 h-[calc(100vh-80px)]">
            <div className="col-span-3">
                <Card className="h-full bg-gradient-to-br from-secondary-600 to-secondary-800 text-tertiary-50 px-6 py-3 relative overflow-hidden">
                    <CardTitle className="text-[4.75vh] text-tertiary-50 font-medium">{`Hola ${user?.name} ${user?.lastName}!!`}</CardTitle>
                    <CardBody className="text-lg text-tertiary-50 mt-2">
                        Bienvenido a tu panel de control. Aquí podrás gestionar tus tareas, monitorear tu progreso y mantener un equilibrio saludable entre trabajo y descanso. ¡Vamos a ser productivos juntos!
                    </CardBody>
                    <svg
                        className="absolute -right-[130px] -bottom-[150px] pointer-events-none text-tertiary-50"
                        width="320" height="320" viewBox="0 0 320 320" fill="none"
                    >
                        <circle cx="160" cy="160" r="150" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                        <circle cx="160" cy="160" r="100" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                        <circle cx="160" cy="160" r="50" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                    </svg>
                </Card>
            </div>
            <div className="col-start-4 grid grid-rows-2 gap-2">
                <HabitBoardProvider>
                    <ButtonCreateHabit />
                </HabitBoardProvider>
                <TaskBoardProvider>
                    <ButtonCreateTask />
                </TaskBoardProvider>
            </div>
            <div className="col-span-2 row-span-5 col-start-5">
                <CalendarBoard />
            </div>
            <div className="col-span-2 row-span-2 row-start-2">
                <Pomodoro />
            </div>
            <div className="row-span-2 col-start-3 row-start-2">
                <HabitBoardProvider>
                    <div className="max-h-full flex flex-col">
                        <h3 className="text-lg font-medium ml-4 mb-2">Hábitos para hoy</h3>
                        <Card className="h-full overflow-y-auto overflow-x-hidden">
                            <HabitsListToday />
                        </Card>
                    </div>
                </HabitBoardProvider>
            </div>
            <div className="row-span-2 col-start-4 row-start-2">
                <Card>
                    <h2 className="text-sm">Tareas pendientes en desarrollo...</h2>
                </Card>
            </div>
            <div className="row-span-2 row-start-4">
                <MentalHealthBoard />
            </div>
            <div className="col-span-3 row-span-2 row-start-4">
                <Card>
                    <h2 className="text-sm">Mapa de actividad en desarrollo...</h2>
                </Card>
            </div>
        </div>
    );
}