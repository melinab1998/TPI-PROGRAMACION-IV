import React from "react";

const Tooth = ({ label, data, onClick }) => {
  const getColor = (section) => {
    if (!data || !data.sections || !data.sections[section]) return "white";
    return data.sections[section].color || "white";
  };

  const getFillColor = (color) => {
    switch (color) {
      case "blue":
        return "#1E3A8A";
      case "red":
        return "#B22222";
      case "green":
        return "#2E7D32";
      default:
        return "white";
    }
  };

  return (
    <div 
      className="flex flex-col items-center m-1 cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <span className="text-xs font-medium mb-1">{label}</span>
      
      <svg width="40" height="40" viewBox="0 0 100 100" className="drop-shadow-sm">
        {/* Secciones */}
        <polygon points="20,20 80,20 60,40 40,40" fill={getFillColor(getColor("top"))} stroke="black" strokeWidth="1" />
        <polygon points="20,80 80,80 60,60 40,60" fill={getFillColor(getColor("bottom"))} stroke="black" strokeWidth="1" />
        <polygon points="20,20 20,80 40,60 40,40" fill={getFillColor(getColor("left"))} stroke="black" strokeWidth="1" />
        <polygon points="80,20 80,80 60,60 60,40" fill={getFillColor(getColor("right"))} stroke="black" strokeWidth="1" />
        <polygon points="40,40 60,40 60,60 40,60" fill={getFillColor(getColor("center"))} stroke="black" strokeWidth="1" />
        
        {/* Estados generales */}
        {data?.general?.status === "ausente" && (
          <>
            <line x1="20" y1="20" x2="80" y2="80" stroke="#B22222" strokeWidth="6" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#B22222" strokeWidth="6" />
          </>
        )}
        {data?.general?.status === "extraccion" && (
          <>
            <line x1="20" y1="20" x2="80" y2="80" stroke="#1E3A8A" strokeWidth="6" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#1E3A8A" strokeWidth="6" />
          </>
        )}
        {data?.general?.status === "corona" && (
          <circle cx="50" cy="50" r="35" stroke="#B22222" strokeWidth="4" fill="none" />
        )}
        {data?.general?.status === "necesita_corona" && (
          <circle cx="50" cy="50" r="35" stroke="#1E3A8A" strokeWidth="4" fill="none" strokeDasharray="6 4" />
        )}
      </svg>
    </div>
  );
};

export default Tooth;
