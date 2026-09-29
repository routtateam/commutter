import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = 42,
  readOnly,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn("p-1", !readOnly && "cursor-pointer")}
          aria-label={`${star} star`}
        >
          <FaStar
            size={size}
            color={star <= value ? "#B26A00" : "#E3E7E2"}
          />
        </button>
      ))}
    </div>
  );
}
