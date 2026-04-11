import { Star } from "lucide-react";
import { useState } from "react";

interface StartProps {
  label?: string;
  points?: number;
  className?: string;
  onChange?: (points: number) => void;
  disabled?: boolean;
}

export const Stars: React.FC<StartProps> = ({ label = "", points = 0, className, onChange, disabled = false }) => {
  const [stars, setStars] = useState(points);
  const [hover, setHover] = useState(0);

  const handleChangeStars = (newStars: number) => {
    if (disabled) {
      return;
    }
    setStars(newStars);
    onChange?.(newStars);
  }

  const handleMouseOver = (star: number) => {
    if (disabled) {
      return;
    }
    setHover(star);
  }

  return (
    <div className={`flex flex-col ${className}`} onMouseLeave={() => handleMouseOver(0)}>
      { label && <p className="block text-sm font-medium text-gray-700 mb-1">{label}</p> }
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onMouseOver={() => handleMouseOver(star)}
            onClick={() => handleChangeStars(star)}
            className={`cursor-pointer ${(hover || stars) >= star ? "text-yellow-500" : "text-gray-500"}`}
          />
        ))}
      </div>
    </div>
  );
};
