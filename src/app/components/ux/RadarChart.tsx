import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
    data: Record<string, number>;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {

    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: "Salud mental",
                data: Object.values(data),
                backgroundColor: "rgba(34, 202, 236, 0.2)",
                borderColor: "rgba(34, 202, 236, 1)",
            }
        ]
    };

    return (
        <>
            <Radar data={ chartData } />
        </>
    );
}