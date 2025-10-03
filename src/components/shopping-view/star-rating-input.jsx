import { useState } from "react";
import PropTypes from "prop-types";
import { Star } from "lucide-react";

function StarRatingInput({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={starValue}
            className="transition-transform duration-200 ease-in-out transform hover:scale-125"
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(rating)}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={`w-7 h-7 cursor-pointer transition-colors duration-200 ${
                starValue <= (hover || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
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
