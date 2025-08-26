import React, { useState } from "react";

const colors = ["white", "lightblue", "red", "lightgreen"];

const Tooth = ({ label }) => {
    const [selected, setSelected] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        center: 0,
    });

    const cycleColor = (part) => {
        setSelected({
            ...selected,
            [part]: (selected[part] + 1) % colors.length, 
        });
    };

    return (
        <div className="flex flex-col items-center m-1">
            <span className="text-xs">{label}</span>
            <svg width="40" height="40" viewBox="0 0 100 100">
                <polygon
                    points="20,20 80,20 60,40 40,40"
                    fill={colors[selected.top]}
                    stroke="black"
                    onClick={() => cycleColor("top")}
                />
                <polygon
                    points="20,80 80,80 60,60 40,60"
                    fill={colors[selected.bottom]}
                    stroke="black"
                    onClick={() => cycleColor("bottom")}
                />
                <polygon
                    points="20,20 20,80 40,60 40,40"
                    fill={colors[selected.left]}
                    stroke="black"
                    onClick={() => cycleColor("left")}
                />
                <polygon
                    points="80,20 80,80 60,60 60,40"
                    fill={colors[selected.right]}
                    stroke="black"
                    onClick={() => cycleColor("right")}
                />
                <polygon
                    points="40,40 60,40 60,60 40,60"
                    fill={colors[selected.center]}
                    stroke="black"
                    onClick={() => cycleColor("center")}
                />
            </svg>
        </div>
    );
};

export default Tooth;

