import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export default function StarRating({
  rating,
  reviewCount,
  size = 14,
}: StarRatingProps) {
  return (
    <span className="flex items-center gap-1 text-sm">
      <Star
        size={size}
        className="text-yellow-400 fill-yellow-400"
      />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-gray-400 text-xs">({reviewCount})</span>
      )}
    </span>
  );
}
