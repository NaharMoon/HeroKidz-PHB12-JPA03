import { FaStar } from "react-icons/fa";

const StarRating = ({ value = 0, small = false }) => {
  return (
    <div className={`flex items-center gap-1 ${small ? "text-sm" : "text-base"}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} className={star <= Math.round(value) ? "text-amber-400" : "text-base-300"} />
      ))}
      <span className="ml-1 text-base-content/70">{Number(value || 0).toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
