import { useNavigate, useParams } from "react-router-dom";
import { HiCheck, HiChevronRight, HiOutlineDocumentText, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { Row } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";

const DEPOSIT = 60000;

export default function PremiumRefundScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F5EF] p-4.5">
      <div className="bg-white border border-[#E6E2D6] rounded-2xl p-5 text-center mb-4.5">
        <div className="w-15 h-15 rounded-full bg-success-tint grid place-items-center mx-auto mb-3.5">
          <HiCheck size={28} className="text-success" strokeWidth={2.4} />
        </div>
        <div className="font-sans font-bold text-[10px] tracking-[.14em] text-success-strong uppercase">
          Deposit refunded
        </div>
        <div className="font-display font-bold text-[30px] tracking-[-.02em] mt-3 mb-2 tabular-nums">
          {formatNaira(DEPOSIT)}
        </div>
        <p className="font-sans font-medium text-[13px] text-muted">
          Returned in full to card •••• 4821 on Mon 15 Sep. Allow 2–5 working days for your bank.
        </p>
      </div>
      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
        How it was decided
      </div>
      <div className="bg-white border border-[#E6E2D6] rounded-2xl p-3.5 mb-4.5">
        <Row label="Deposit held" value={formatNaira(DEPOSIT)} />
        <Row label="Damage found at inspection" value={<span className="text-success-strong">None</span>} />
        <Row label="Overstay" value={<span className="text-success-strong">None · returned 13:52</span>} />
        <div className="pb-2.5 border-b border-[#F5F2E8]" />
        <div className="flex justify-between pt-3">
          <span className="font-sans font-bold text-sm">Refunded</span>
          <span className="font-display font-bold text-[18px] text-success-strong tabular-nums">
            {formatNaira(DEPOSIT)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => navigate(`/premium/booking/${id}/inspection`)}
        className="w-full bg-white border border-[#E6E2D6] rounded-2xl p-3.5 flex items-center gap-2.5 mb-3 text-left hover:border-gold transition-colors"
      >
        <HiOutlineDocumentText size={18} className="shrink-0" />
        <span className="flex-1">
          <span className="block font-sans font-semibold text-sm">View the inspection report</span>
          <span className="block font-sans font-medium text-xs text-muted mt-0.5">
            Before and after photos · 24 images
          </span>
        </span>
        <HiChevronRight size={18} className="text-border-strong shrink-0" />
      </button>
      <button
        type="button"
        onClick={() => navigate("/help/disputes")}
        className="w-full bg-white border border-[#E6E2D6] rounded-2xl p-3.5 flex items-center gap-2.5 text-left hover:border-gold transition-colors"
      >
        <HiOutlineExclamationTriangle size={18} className="text-error shrink-0" />
        <span className="flex-1">
          <span className="block font-sans font-semibold text-sm">Dispute this outcome</span>
          <span className="block font-sans font-medium text-xs text-muted mt-0.5">
            Available for 7 days after the decision
          </span>
        </span>
      </button>
    </div>
  );
}
