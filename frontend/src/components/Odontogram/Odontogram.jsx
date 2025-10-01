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
    setToothData(prev => ({
      ...prev,
      [toothNumber]: data
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
            observation: sectionData.observation
          });
        }
      });
    });

    return observations;
  };

  const observations = getToothObservations();

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Título principal */}
      <h1 className="text-2xl font-bold mb-6 mt-10">Odontograma</h1>
      
      {/* Fila superior adulto */}
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

      {/* Fila inferior adulto */}
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

      {/* Fila superior infantil */}
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

      {/* Fila inferior infantil */}
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

      {/* Observaciones */}
      {observations.length > 0 && (
        <div className="w-full max-w-4xl mt-8">
          <h3 className="text-lg font-semibold mb-4">Observaciones</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {observations.map((obs, index) => (
              <div key={index} className="mb-2 p-2 border-b">
                <div className="flex items-center">
                  <div 
                    className={`w-4 h-4 rounded mr-2 ${
                      obs.color === "blue" ? "bg-blue-500" :
                      obs.color === "red" ? "bg-red-500" :
                      obs.color === "green" ? "bg-green-500" : "bg-white border"
                    }`}
                  />
                  <span className="font-semibold">
                    Pieza {obs.toothNumber} - {obs.section}:
                  </span>
                </div>
                <p className="ml-6">{obs.observation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
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