import { Plus } from "lucide-react";
import { Button } from "../../../components/ux/Button";
import { Card, CardBody, CardTitle } from "../../../components/ux/Card";
import { CategoriesList } from "./CategoriesList";
import { ModalFormCategory } from "./ModalFormCategory";
import { useState } from "react";

export const CategoryBoard: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return(
        <>
            <Card className='w-full'>
                <CardTitle className='mb-5 flex items-center justify-between'>
                    Categorías
                    <Button type='button' color='primary' className='text-sm' onClick={() => setIsModalOpen(true)}>
                        Agregar categoría <Plus />
                    </Button>
                </CardTitle>
                <CardBody>
                    <CategoriesList />
                </CardBody>
            </Card>
            <ModalFormCategory show={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
        
    );

}