import { Card, CardTitle, CardBody } from '../components/ux/Card';
import { CategoryBoard } from '../features/category/components/CategoryBoard';

export const ConfigPage: React.FC = () => {

    

    const menuOptions = [
        {
            label: "Categorias", 
            value: "categories"
        }, 
        {
            label: "Estados", 
            value: "states"
        },
        {
            label: "General", 
            value: "general"
        }
    ];

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-primary-950">Configuración del sistema</h2>
            <h3 className="text-lg text-secondary-700">Personaliza tu experiencia ajustando las opciones del sistema.</h3>
            <div className="flex mt-15 mx-10 gap-10">
                <div className='flex-none'>
                    <h3 className="text-xl font-semibold text-primary-950">Menú de configuración</h3>
                    <ul className="mt-4 text-primary-900">
                        {menuOptions.map(option => (
                            <li key={option.value} className="py-2 px-4 rounded-md hover:bg-tertiary-200 cursor-pointer">
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col gap-5 items-start justify-start flex-1">
                    <CategoryBoard />
                    <Card className='w-full'>
                        <CardTitle>Estados</CardTitle>
                        <CardBody>
                            <p>Contenido de configuración para Estados</p>
                        </CardBody>
                    </Card>
                    <Card className='w-full'>
                        <CardTitle>General</CardTitle>
                        <CardBody>
                            <p>Contenido de configuración para General</p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}