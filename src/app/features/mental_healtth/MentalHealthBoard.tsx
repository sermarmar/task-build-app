import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Leaf } from "lucide-react";
import { Card, CardBody, CardTitle } from "../../components/ux/Card";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const MentalHealthBoard: React.FC = () => {

    const data = {
        labels: ["Salud", "Trabajo", "Ocio", "Social", "Proyecto"],
        datasets: [
            {
                label: "Salud mental",
                data: [3, 4, 2, 5, 4],
                backgroundColor: "rgba(34, 202, 236, 0.2)",
                borderColor: "rgba(34, 202, 236, 1)",
            }
        ]

    };

    return (
        <Card className="h-full flex flex-col">
            <CardTitle className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <Leaf />
                    Salud mental
                </div>
            </CardTitle>
            <CardBody className="mt-5">
                <Radar data={ data }/>
            </CardBody>
        </Card>
    );
}