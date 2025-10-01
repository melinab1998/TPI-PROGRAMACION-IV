import React from "react";

const Tooth = ({ label, data, onClick }) => {
  const getColor = (section) => {
    if (!data || !data.sections || !data.sections[section]) return "white";
    return data.sections[section].color || "white";
  };

  const getFillColor = (color) => {
    switch (color) {
      case "blue": return "#3b82f6";
      case "red": return "#ef4444";
      case "green": return "#10b981";
      default: return "white";
    }
  };

  return (
    <div 
      className="flex flex-col items-center m-1 cursor-pointer transition-transform hover:scale-105" 
      onClick={onClick}
    >
      <span className="text-xs font-medium mb-1">{label}</span>
      <svg width="40" height="40" viewBox="0 0 100 100" className="drop-shadow-sm">
        <polygon 
          points="20,20 80,20 60,40 40,40" 
          fill={getFillColor(getColor("top"))} 
          stroke="black" 
          strokeWidth="1"
        />
        <polygon 
          points="20,80 80,80 60,60 40,60" 
          fill={getFillColor(getColor("bottom"))} 
          stroke="black" 
          strokeWidth="1"
        />
        <polygon 
          points="20,20 20,80 40,60 40,40" 
          fill={getFillColor(getColor("left"))} 
          stroke="black" 
          strokeWidth="1"
        />
        <polygon 
          points="80,20 80,80 60,60 60,40" 
          fill={getFillColor(getColor("right"))} 
          stroke="black" 
          strokeWidth="1"
        />
        <polygon 
          points="40,40 60,40 60,60 40,60" 
          fill={getFillColor(getColor("center"))} 
          stroke="black" 
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export default Tooth;

