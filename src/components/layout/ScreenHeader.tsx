import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { cn } from "@/lib/utils";

export function ScreenHeader({
  title,
  onHelp,
  transparent,
  className,
}: {
  title: string;
  onHelp?: () => void;
  transparent?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <header
      className={cn(
        "flex items-center gap-1.5 h-[56px] px-1.5 pr-3 shrink-0",
        !transparent && "bg-white border-b border-border",
        className
      )}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Back"
        className="h-11 w-11 rounded-xl grid place-items-center hover:bg-bg transition-colors"
      >
        <HiArrowLeft size={21} />
      </button>
      <span className="flex-1 font-sans font-bold text-[16.5px] truncate">{title}</span>
      {onHelp ? (
        <button
          type="button"
          onClick={onHelp}
          aria-label="Help"
          className="h-11 w-11 rounded-xl grid place-items-center hover:bg-bg transition-colors text-text-2"
        >
          <HiOutlineQuestionMarkCircle size={22} />
        </button>
      ) : null}
    </header>
  );
}
