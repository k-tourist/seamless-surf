
import React from "react";
import { Heart } from "lucide-react";

const GreenHeartIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => {
  return (
    <Heart
      size={size}
      className={className}
      fill="#F2FCE2"
      color="#4ade80"
      strokeWidth={2}
    />
  );
};

export default GreenHeartIcon;
