import { Leaf } from "lucide-react";
import { Card, CardBody, CardTitle } from "../../components/ux/Card";

export const MentalHealthBoard: React.FC = () => {
    return (
        <Card className="h-full flex flex-col">
            <CardTitle className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <Leaf />
                    Salud mental
                </div>
            </CardTitle>
            <CardBody className="mt-5">
                <p>CLorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creació</p>
            </CardBody>
        </Card>
    );
}