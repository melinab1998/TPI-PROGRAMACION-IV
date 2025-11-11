import React, { useState } from "react";
import Tooth from "../Tooth/Tooth";
import ToothModal from "../ToothModal/ToothModal";

const Odontogram = () => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [toothData, setToothData] = useState({});
  const [showObservationsModal, setShowObservationsModal] = useState(false);

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
      if (data.general?.status) {
        observations.push({
          toothNumber,
          section: "general",
          color: data.general.status === "ausente" || data.general.status === "corona" ? "red" : "blue",
          observation: data.general.status
            .replaceAll("_", " ")
            .replace(/^\w/, (c) => c.toUpperCase()),
        });
      }
      Object.entries(data.sections || {}).forEach(([section, sectionData]) => {
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
    general: "General",
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-extrabold tracking-wide mb-8 mt-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 drop-shadow-sm">
        ODONTOGRAMA
      </h1>
      <div className="flex mb-4">
        {topRowRight.map((t) => (
          <Tooth key={t} label={t} data={toothData[t]} onClick={() => handleToothClick(t)} />
        ))}
        <div className="w-4" />
        {topRowLeft.map((t) => (
          <Tooth key={t} label={t} data={toothData[t]} onClick={() => handleToothClick(t)} />
        ))}
      </div>
      <div className="flex mb-8">
        {bottomRowRight.map((t) => (
          <Tooth key={t} label={t} data={toothData[t]} onClick={() => handleToothClick(t)} />
        ))}
        <div className="w-4" />
        {bottomRowLeft.map((t) => (
          <Tooth key={t} label={t} data={toothData[t]} onClick={() => handleToothClick(t)} />
        ))}
      </div>
      <div className="flex mb-4">
        {topChildRight.map((t) => (
          <Tooth key={t} label={t} data={toothData[t]} onClick={() => handleToothClick(t)} />
        ))}
        <div className="w-4" />
        {topChildLeft.map((t) => (
          <Tooth key={t} label={t} data={toothData[t]} onClick={() => handleToothClick(t)} />
        ))}
      </div>

      <div className="flex mb-12">
        {bottomChildRight.map((t) => (
          <Tooth key={t} label={t} data={toothData[t]} onClick={() => handleToothClick(t)} />
        ))}
        <div className="w-4" />
        {bottomChildLeft.map((t) => (
          <Tooth key={t} label={t} data={toothData[t]} onClick={() => handleToothClick(t)} />
        ))}
      </div>

      {observations.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setShowObservationsModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            <span className="text-lg">📝</span>
            <div className="flex flex-col items-start">
              <span className="text-sm">Ver Observaciones</span>
              <span className="text-xs opacity-80">{observations.length} registrada(s)</span>
            </div>
          </button>
        </div>
      )}

      {showObservationsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Observaciones del Odontograma
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {observations.length} observación(es) registrada(s)
                </p>
              </div>
              <button
                onClick={() => setShowObservationsModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-xl"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {observations.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No hay observaciones
                  </h3>
                  <p className="text-gray-500">
                    Haz click en alguna pieza dental para agregar observaciones
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {observations.map((obs, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 shadow-sm"
                          style={{
                            backgroundColor:
                              obs.color === "blue" ? "#1E3A8A" :
                                obs.color === "red" ? "#B22222" :
                                  obs.color === "green" ? "#2E7D32" : "white",
                            borderColor:
                              obs.color === "blue" ? "#1E3A8A" :
                                obs.color === "red" ? "#B22222" :
                                  obs.color === "green" ? "#2E7D32" : "#D1D5DB"
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="font-semibold text-gray-800 bg-primary/10 px-2 py-1 rounded-md text-sm">
                              Pieza {obs.toothNumber}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                              {sectionLabels[obs.section] || obs.section}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 text-sm">
                            {obs.observation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowObservationsModal(false)}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

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