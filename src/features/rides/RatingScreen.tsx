import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InitialsAvatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";
import { Chip } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRideStore } from "@/store/rideStore";
import { rideService } from "@/services/api/rideService";
import { initials } from "@/lib/utils";

const WORDS = ["", "Not great", "Could be better", "Good", "Great", "Excellent"];
const TAGS = ["Safe driving", "Clean vehicle", "Great conversation", "On time", "Knew the route", "Polite"];

export default function RatingScreen() {
  const navigate = useNavigate();
  const trip = useRideStore((s) => s.lastCompletedTrip);
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>(["Safe driving", "On time"]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trip) navigate("/home", { replace: true });
  }, [trip, navigate]);

  if (!trip) return null;
  const name = trip.transporter?.name.split(" ")[0] ?? "your Transporter";

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function submit() {
    if (!trip) return;
    setLoading(true);
    await rideService.rateTrip(trip, stars, tags, note);
    setLoading(false);
    navigate("/tip");
  }

  return (
    <div className="flex flex-1 flex-col bg-white pt-5.5 px-4.5 overflow-y-auto">
      <div className="text-center mb-5">
        <InitialsAvatar
          initials={initials(trip.transporter?.name ?? "CO")}
          size="xl"
          className="mx-auto mb-3"
        />
        <div className="font-sans font-semibold text-[17px]">How was {name}?</div>
        <p className="font-sans font-medium text-[13px] text-muted mt-1.5">
          Your rating is anonymous and helps other Commuters.
        </p>
      </div>
      <div className="mb-2">
        <StarRating value={stars} onChange={setStars} />
      </div>
      <div className="text-center font-sans font-semibold text-[13.5px] text-text-2 mb-5">
        {WORDS[stars]}
      </div>
      <div className="font-sans font-bold text-[11px] tracking-[.12em] text-muted uppercase mb-2.5">
        What stood out?
      </div>
      <div className="flex flex-wrap gap-2 mb-4.5">
        {TAGS.map((tag) => (
          <Chip key={tag} active={tags.includes(tag)} onClick={() => toggleTag(tag)} type="button">
            {tag}
          </Chip>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={`Add a note for ${name} (optional)`}
        className="border-[1.5px] border-border rounded-btn p-3.5 min-h-[76px] font-sans font-medium text-sm placeholder:text-muted-2 outline-none focus:border-primary mb-4"
      />
      <div className="flex flex-col gap-2 pb-6">
        <Button onClick={submit} loading={loading}>
          Submit rating
        </Button>
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="h-12 rounded-btn font-sans font-bold text-[14.5px] text-text-2 hover:bg-bg transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
