import React, { useState } from "react";
import Tooth from "../Tooth/Tooth";
import ToothModal from "../ToothModal/ToothModal";

const Odontogram = () => {
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [toothData, setToothData] = useState({});

    const topRowRight = ["18", "17", "16", "15", "14", "13", "12", "11"];
    const topRowLeft = ["21", "22", "23", "24", "25", "26", "27", "28"];
    const bottomRowRight = ["48", "47", "46", "45", "44", "43", "42", "41"];
    const bottomRowLeft = ["31", "32", "33", "34", "35", "36", "37", "38"];
    const topChildRight = ["55", "54", "53", "52", "51"];
    const topChildLeft = ["61", "62", "63", "64", "65"];
    const bottomChildRight = ["85", "84", "83", "82", "81"];
    const bottomChildLeft = ["71", "72", "73", "74", "75"];

    const handleToothClick = (toothNumber) => {
        setSelectedTooth(toothNumber);
    };

    const handleSaveToothData = (toothNumber, data) => {
        setToothData((prev) => ({
            ...prev,
            [toothNumber]: data,
        }));
        setSelectedTooth(null);
    };

    const handleCloseModal = () => {
        setSelectedTooth(null);
    };

    const getToothObservations = () => {
        const observations = [];

        Object.entries(toothData).forEach(([toothNumber, data]) => {
            Object.entries(data.sections).forEach(([section, sectionData]) => {
                if (sectionData.color !== "white" && sectionData.observation) {
                    observations.push({
                        toothNumber,
                        section,
                        color: sectionData.color,
                        observation: sectionData.observation,
                    });
                }
            });
        });

        return observations;
    };

    const observations = getToothObservations();

    const sectionLabels = {
        top: "Superior",
        bottom: "Inferior",
        left: "Izquierda",
        right: "Derecha",
        center: "Centro",
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <h1 className="text-2xl font-extrabold tracking-wide mb-8 mt-12 
               text-center text-transparent bg-clip-text 
               bg-gradient-to-r from-primary to-primary/70 
               drop-shadow-sm">
                ODONTOGRAMA
            </h1>

            <div className="flex mb-4">
                {topRowRight.map((t) => (
                    <Tooth
                        key={t}
                        label={t}
                        data={toothData[t]}
                        onClick={() => handleToothClick(t)}
                    />
                ))}
                <div className="w-4" />
                {topRowLeft.map((t) => (
                    <Tooth
                        key={t}
                        label={t}
                        data={toothData[t]}
                        onClick={() => handleToothClick(t)}
                    />
                ))}
            </div>

            <div className="flex mb-8">
                {bottomRowRight.map((t) => (
                    <Tooth
                        key={t}
                        label={t}
                        data={toothData[t]}
                        onClick={() => handleToothClick(t)}
                    />
                ))}
                <div className="w-4" />
                {bottomRowLeft.map((t) => (
                    <Tooth
                        key={t}
                        label={t}
                        data={toothData[t]}
                        onClick={() => handleToothClick(t)}
                    />
                ))}
            </div>

            <div className="flex mb-4">
                {topChildRight.map((t) => (
                    <Tooth
                        key={t}
                        label={t}
                        data={toothData[t]}
                        onClick={() => handleToothClick(t)}
                    />
                ))}
                <div className="w-4" />
                {topChildLeft.map((t) => (
                    <Tooth
                        key={t}
                        label={t}
                        data={toothData[t]}
                        onClick={() => handleToothClick(t)}
                    />
                ))}
            </div>

            <div className="flex mb-8">
                {bottomChildRight.map((t) => (
                    <Tooth
                        key={t}
                        label={t}
                        data={toothData[t]}
                        onClick={() => handleToothClick(t)}
                    />
                ))}
                <div className="w-4" />
                {bottomChildLeft.map((t) => (
                    <Tooth
                        key={t}
                        label={t}
                        data={toothData[t]}
                        onClick={() => handleToothClick(t)}
                    />
                ))}
            </div>

            <div className="flex flex-col gap-4 w-full max-w-3xl">
                {observations.map((obs, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow w-full h-auto"
                    >
                        <div className="flex items-center mb-2">
                            <div
                                className="w-4 h-4 rounded-full mr-2 border"
                                style={{
                                    backgroundColor:
                                        obs.color === "blue"
                                            ? "#1E3A8A"
                                            : obs.color === "red"
                                                ? "#B22222"
                                                : obs.color === "green"
                                                    ? "#2E7D32"
                                                    : "white"
                                }}
                            />
                            <span className="font-semibold text-gray-700">
                                Pieza {obs.toothNumber} - {sectionLabels[obs.section] || obs.section}
                            </span>
                        </div>
                        <p className="text-gray-600 break-words whitespace-pre-wrap">
                            {obs.observation}
                        </p>
                    </div>
                ))}
            </div>
            {selectedTooth && (
                <ToothModal
                    toothNumber={selectedTooth}
                    initialData={toothData[selectedTooth]}
                    onSave={handleSaveToothData}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Odontogram;