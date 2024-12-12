import React from "react";
import PropTypes from "prop-types";
import "./StarRating.css"; // For styling the stars

const StarRating = ({ percentage }) => {
  // Convert percentage to a rating out of 5
  const rating = (percentage / 100) * 5;

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        // Determine the class for full, half, or empty stars
        const starClass =
          rating >= index + 1
            ? "full-star"
            : rating > index
            ? "half-star"
            : "empty-star";
        return <span key={index} className={`star ${starClass}`} />;
      })}
    </div>
  );
};

StarRating.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default StarRating;
