import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

export default function NetworkErrorScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-9 text-center bg-white">
      <div className="w-17 h-17 rounded-full bg-error-tint grid place-items-center mb-4.5">
        <HiOutlineExclamationCircle size={30} className="text-error" />
      </div>
      <div className="font-sans font-bold text-[19px]">We could not load your rides</div>
      <p className="font-sans font-medium text-sm leading-relaxed text-muted mt-2 mb-1.5">
        The request timed out after 30 seconds. Your data is safe — nothing was lost.
      </p>
      <div className="font-display font-semibold text-[11px] text-muted-2 mb-5.5">
        ERR_TIMEOUT · RT-GW-504
      </div>
      <div className="flex flex-col gap-2.5 w-full">
        <Button onClick={() => navigate(-1)}>Try again</Button>
        <Button variant="secondary" onClick={() => navigate("/help")}>
          Contact support
        </Button>
      </div>
    </div>
  );
}
