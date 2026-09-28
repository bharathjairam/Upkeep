import { Star } from "lucide-react";

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`h-3.5 w-3.5 ${n <= Math.round(rating) ? "fill-accent text-accent" : "text-muted"}`} />
        ))}
      </div>
      <span className="text-xs font-semibold text-body">{rating.toFixed(1)}</span>
    </div>
  );
}
