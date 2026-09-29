import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { supportService } from "@/services/api/supportService";
import type { Dispute } from "@/services/api/types";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";

export default function DisputeDetailScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [reply, setReply] = useState("");
  const pushToast = useUiStore((s) => s.pushToast);

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supportService
      .getDispute(id)
      .then((d) => {
        if (d) setDispute(d);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  useEffect(() => {
    if (notFound) navigate("/help/disputes", { replace: true });
  }, [notFound, navigate]);

  if (!dispute) return null;

  async function send() {
    if (!reply.trim() || !dispute) return;
    try {
      await supportService.sendDisputeReply(dispute.id, reply);
    } catch (e) {
      pushToast(e instanceof Error ? e.message : "Could not send your reply", "error");
      return;
    }
    setDispute({
      ...dispute,
      messages: [...dispute.messages, { id: `m_${Date.now()}`, author: "you", body: reply, time: "just now" }],
    });
    setReply("");
  }

  return (
    <div className="flex flex-1 flex-col bg-bg">
      <ScreenHeader title={`Dispute · ${dispute.ref ?? dispute.id}`} />
      <div className="px-4.5 py-3.5 bg-warning-tint flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-warning shrink-0" />
        <span className="flex-1 font-sans font-semibold text-[12.5px] text-warning-strong">
          {dispute.status === "under_review" ? "Under review" : "Resolved"} · opened {dispute.openedAt} ·{" "}
          ₦{dispute.amount} in question
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4.5 flex flex-col gap-3">
        {dispute.messages.map((m) => (
          <div
            key={m.id}
            className={cn("max-w-[82%]", m.author === "you" ? "self-end" : "self-start")}
          >
            <div
              className={cn(
                "rounded-2xl px-3.5 py-3 font-sans font-medium text-sm leading-relaxed",
                m.author === "you" ? "bg-primary text-white rounded-br-md" : "bg-white border border-border rounded-bl-md"
              )}
            >
              {m.body}
            </div>
            <div
              className={cn(
                "font-sans font-medium text-[10.5px] text-muted-2 mt-1.5 px-1",
                m.author === "you" && "text-right"
              )}
            >
              {m.author === "you" ? "You" : "Routta Support"} · {m.time}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3.5 bg-white border-t border-border flex items-center gap-2.5">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Reply to support"
          className="flex-1 h-12 rounded-pill bg-bg px-4 font-sans font-medium text-sm outline-none placeholder:text-muted-2"
        />
        <button
          type="button"
          onClick={send}
          className="w-12 h-12 rounded-full bg-primary grid place-items-center shrink-0"
          aria-label="Send"
        >
          <HiArrowRight size={19} className="text-accent" />
        </button>
      </div>
    </div>
  );
}
