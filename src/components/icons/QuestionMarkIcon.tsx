
import React from "react";
import { Heart } from "lucide-react";

const QuestionMarkIcon = ({ className = "", size = 24, variant = "question" }: { className?: string; size?: number; variant?: "question" | "heart" }) => {
  if (variant === "heart") {
    return (
      <Heart
        size={size}
        className={className}
        fill="#F2FCE2"
        color="#4ade80"
        strokeWidth={2}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="white" stroke="#ea384c" strokeWidth="1.5" />
      {/* Arial-style question mark */}
      <path
        d="M11 17h2v-2h-2v2zm2-3h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z"
        fill="#ea384c"
      />
    </svg>
  );
};

export default QuestionMarkIcon;
