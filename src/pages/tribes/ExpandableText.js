import { useState } from "react";

const ExpandableText = ({ text, limit = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null; // Avoid errors if text is empty

  const displayText = isExpanded ? text : `${text.slice(0, limit)}...`;

  return (
    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
      {displayText}{" "}
      {text.length > limit && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-600 dark:text-purple-400 font-medium underline"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </p>
  );
};

export default ExpandableText;