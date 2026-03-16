import { Star } from "lucide-react";
import { useState } from "react";

interface StartProps {
  className?: string;
}

export const Stars: React.FC<StartProps> = ({ className }) => {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className={`flex flex-col ${className}`} onMouseLeave={() => setHover(0)}>
      <p className="block text-sm font-medium text-gray-700 mb-1">Puntos de esfuerzo</p>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onMouseOver={() => setHover(star)}
            onClick={() => setStars(star)}
            className={`cursor-pointer ${(hover || stars) >= star ? "text-yellow-500" : "text-gray-500"}`}
          />
        ))}
      </div>
    </div>
  );
};
