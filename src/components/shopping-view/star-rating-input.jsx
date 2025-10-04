import { Star } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

function StarRatingInput({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className="bg-transparent border-none cursor-pointer p-1"
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                ratingValue <= (hover || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 fill-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

StarRatingInput.propTypes = {
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
};

export default StarRatingInput;
