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

  const hasCross =
    data?.status?.type === "ausente" || data?.status?.type === "extraccion";
  const crossColor = data?.status?.type === "ausente" ? "#B22222" : "#1E3A8A";

  const hasCrown =
    data?.status?.type === "corona" || data?.status?.type === "necesitaCorona";
  const crownColor = data?.status?.type === "corona" ? "#B22222" : "#1E3A8A";

  return (
    <div
      className="flex flex-col items-center m-1 cursor-pointer transition-transform hover:scale-105 relative"
      onClick={onClick}
    >
      <span className="text-xs font-medium mb-1">{label}</span>

      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 100 100"
          className="drop-shadow-sm"
        >
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
          {hasCross && (
            <>
              <line
                x1="15"
                y1="15"
                x2="85"
                y2="85"
                stroke={crossColor}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="85"
                y1="15"
                x2="15"
                y2="85"
                stroke={crossColor}
                strokeWidth="6"
                strokeLinecap="round"
              />
            </>
          )}
          {hasCrown && (
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke={crownColor}
              strokeWidth="7"
              strokeOpacity="0.95"
            />
          )}
        </svg>

        {(hasCross || hasCrown) && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default Tooth;


