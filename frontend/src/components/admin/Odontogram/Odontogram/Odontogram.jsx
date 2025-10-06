import React, { useState, useEffect } from "react";
import Tooth from "../Tooth/Tooth";
import ToothModal from "../ToothModal/ToothModal";

const Odontogram = ({ initialData = {}, onSave, readOnly = false }) => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [toothData, setToothData] = useState(initialData);

  useEffect(() => {
    setToothData(initialData);
  }, [initialData]);

  const topRowRight = ["18", "17", "16", "15", "14", "13", "12", "11"];
  const topRowLeft = ["21", "22", "23", "24", "25", "26", "27", "28"];
  const bottomRowRight = ["48", "47", "46", "45", "44", "43", "42", "41"];
  const bottomRowLeft = ["31", "32", "33", "34", "35", "36", "37", "38"];
  const topChildRight = ["55", "54", "53", "52", "51"];
  const topChildLeft = ["61", "62", "63", "64", "65"];
  const bottomChildRight = ["85", "84", "83", "82", "81"];
  const bottomChildLeft = ["71", "72", "73", "74", "75"];

  const handleToothClick = (toothNumber) => {
    if (readOnly) return;
    setSelectedTooth(toothNumber);
  };

  const handleSaveToothData = (toothNumber, data) => {
    const newToothData = {
      ...toothData,
      [toothNumber]: data,
    };
    
    setToothData(newToothData);
    
    if (onSave) {
      // Usar setTimeout para evitar conflictos con eventos de React
      setTimeout(() => {
        onSave(newToothData);
      }, 0);
    }
    
    setSelectedTooth(null);
  };

  const handleCloseModal = () => {
    setSelectedTooth(null);
  };

  const getToothObservations = () => {
    const observations = [];
    Object.entries(toothData).forEach(([toothNumber, data]) => {
      if (data && data.sections) {
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
      }
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

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="p-2 sm:p-4 flex flex-col items-center w-full max-w-full overflow-hidden"
      onClick={handleContainerClick}
    >
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide mb-4 sm:mb-8 mt-2 sm:mt-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 drop-shadow-sm">
        ODONTOGRAMA
      </h1>
      
      <div className="w-full max-w-full overflow-x-auto">
        <div className="min-w-max mx-auto px-2">
          {/* Adulto - Arriba */}
          <div className={`flex justify-center mb-3 sm:mb-4 ${readOnly ? 'opacity-80' : ''}`}>
            {topRowRight.map((t) => (
              <Tooth
                key={t}
                label={t}
                data={toothData[t]}
                onClick={() => handleToothClick(t)}
                readOnly={readOnly}
              />
            ))}
            <div className="w-2 sm:w-4" />
            {topRowLeft.map((t) => (
              <Tooth
                key={t}
                label={t}
                data={toothData[t]}
                onClick={() => handleToothClick(t)}
                readOnly={readOnly}
              />
            ))}
          </div>

          {/* Adulto - Abajo */}
          <div className={`flex justify-center mb-6 sm:mb-8 ${readOnly ? 'opacity-80' : ''}`}>
            {bottomRowRight.map((t) => (
              <Tooth
                key={t}
                label={t}
                data={toothData[t]}
                onClick={() => handleToothClick(t)}
                readOnly={readOnly}
              />
            ))}
            <div className="w-2 sm:w-4" />
            {bottomRowLeft.map((t) => (
              <Tooth
                key={t}
                label={t}
                data={toothData[t]}
                onClick={() => handleToothClick(t)}
                readOnly={readOnly}
              />
            ))}
          </div>

          {/* Niño - Arriba */}
          <div className={`flex justify-center mb-3 sm:mb-4 ${readOnly ? 'opacity-80' : ''}`}>
            {topChildRight.map((t) => (
              <Tooth
                key={t}
                label={t}
                data={toothData[t]}
                onClick={() => handleToothClick(t)}
                readOnly={readOnly}
              />
            ))}
            <div className="w-2 sm:w-4" />
            {topChildLeft.map((t) => (
              <Tooth
                key={t}
                label={t}
                data={toothData[t]}
                onClick={() => handleToothClick(t)}
                readOnly={readOnly}
              />
            ))}
          </div>

          {/* Niño - Abajo */}
          <div className={`flex justify-center mb-6 sm:mb-8 ${readOnly ? 'opacity-80' : ''}`}>
            {bottomChildRight.map((t) => (
              <Tooth
                key={t}
                label={t}
                data={toothData[t]}
                onClick={() => handleToothClick(t)}
                readOnly={readOnly}
              />
            ))}
            <div className="w-2 sm:w-4" />
            {bottomChildLeft.map((t) => (
              <Tooth
                key={t}
                label={t}
                data={toothData[t]}
                onClick={() => handleToothClick(t)}
                readOnly={readOnly}
              />
            ))}
          </div>
        </div>
      </div>

      {observations.length > 0 && (
        <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-3xl px-2 sm:px-0">
          <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Observaciones:</h3>
          {observations.map((obs, index) => (
            <div
              key={index}
              className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md border border-gray-200 hover:shadow-md sm:hover:shadow-lg transition-shadow w-full h-auto"
            >
              <div className="flex items-center mb-2">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 border"
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
                <span className="font-semibold text-gray-700 text-sm sm:text-base">
                  Pieza {obs.toothNumber} - {sectionLabels[obs.section] || obs.section}
                </span>
              </div>
              <p className="text-gray-600 break-words whitespace-pre-wrap text-sm sm:text-base">
                {obs.observation}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedTooth && !readOnly && (
        <div onClick={(e) => e.stopPropagation()}>
          <ToothModal
            toothNumber={selectedTooth}
            initialData={toothData[selectedTooth]}
            onSave={handleSaveToothData}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default Odontogram;