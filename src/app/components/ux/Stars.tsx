import { Star } from "lucide-react";
import { useState } from "react";

interface StartProps {
  points?: number;
  className?: string;
  onChange?: (points: number) => void;
}

export const Stars: React.FC<StartProps> = ({ points = 0, className, onChange }) => {
  const [stars, setStars] = useState(points);
  const [hover, setHover] = useState(0);

  return (
    <div className={`flex flex-col ${className}`} onMouseLeave={() => setHover(0)}>
      <p className="block text-sm font-medium text-gray-700 mb-1">Puntos de esfuerzo</p>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onMouseOver={() => setHover(star)}
            onClick={() => {
              setStars(star);
              onChange?.(star);
            }}
            className={`cursor-pointer ${(hover || stars) >= star ? "text-yellow-500" : "text-gray-500"}`}
          />
        ))}
      </div>
    </div>
  );
};
