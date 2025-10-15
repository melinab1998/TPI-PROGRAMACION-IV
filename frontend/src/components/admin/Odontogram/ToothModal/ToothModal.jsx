import React, { useState, useEffect } from "react";

const ToothModal = ({ toothNumber, initialData, onSave, onClose }) => {
  const [sections, setSections] = useState({});
  const [toothStatus, setToothStatus] = useState(null);

  useEffect(() => {
    setSections(
      initialData?.sections || {
        top: { color: "white", observation: "" },
        bottom: { color: "white", observation: "" },
        left: { color: "white", observation: "" },
        right: { color: "white", observation: "" },
        center: { color: "white", observation: "" },
      }
    );
    setToothStatus(initialData?.status || null);
  }, [initialData]);

  const sectionLabels = {
    top: "Superior",
    bottom: "Inferior",
    left: "Izquierdo",
    right: "Derecho",
    center: "Central",
  };

  const customColors = {
    blue: "#1E3A8A",
    red: "#B22222",
    green: "#2E7D32",
  };

  const colors = {
    white: { label: "Sano", description: "Pieza sana" },
    blue: { label: "Pendiente", description: "Tratamiento necesario" },
    red: { label: "Restaurado", description: "Tratamiento existente" },
    green: { label: "Profesional", description: "Tratamiento realizado" },
  };

  // Opciones para el estado de la pieza dental
  const toothStatusOptions = [
    {
      value: null,
      label: "Pieza normal",
      description: "Sin marcas especiales",
    },
    { value: "ausente", label: "Pieza ausente", description: "Cruz roja" },
    {
      value: "extraccion",
      label: "Extracción necesaria",
      description: "Cruz azul",
    },
    {
      value: "corona",
      label: "Pieza con corona",
      description: "Círculo rojo continuo",
    },
    {
      value: "necesitaCorona",
      label: "Necesita corona",
      description: "Círculo azul punteado",
    },
  ];

  const handleColorChange = (section, color) => {
    setSections((prev) => ({
      ...prev,
      [section]: { ...prev[section], color },
    }));
  };

  const handleObservationChange = (section, observation) => {
    setSections((prev) => ({
      ...prev,
      [section]: { ...prev[section], observation: observation.slice(0, 250) },
    }));
  };

  const handleStatusChange = (status, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setToothStatus(status ? { type: status } : null);
  };

  const handleSave = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Guardando:", { sections, status: toothStatus }); // Para debug
    console.log("Guardando datos para pieza:", toothNumber); //Para debug
    onSave(toothNumber, {
      sections,
      status: toothStatus,
    });
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Función para renderizar preview del estado
  const renderStatusPreview = () => {
    if (!toothStatus) return null;

    switch (toothStatus.type) {
      case "ausente":
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <div className="w-4 h-4 border-2 border-red-600 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-red-600 transform rotate-45"></div>
              <div className="w-3 h-0.5 bg-red-600 transform -rotate-45 absolute"></div>
            </div>
            <span>CRUZ ROJA - pieza ausente</span>
          </div>
        );
      case "extraccion":
        return (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-blue-600 transform rotate-45"></div>
              <div className="w-3 h-0.5 bg-blue-600 transform -rotate-45 absolute"></div>
            </div>
            <span>CRUZ AZUL - extracción necesaria</span>
          </div>
        );
      case "corona":
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <div className="w-4 h-4 border-2 border-red-600 rounded-full"></div>
            <span>CÍRCULO ROJO - pieza con corona</span>
          </div>
        );
      case "necesitaCorona":
        return (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 rounded-full"></div>
            <span>CÍRCULO AZUL - necesita corona</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-sans">
              Pieza Dental {toothNumber}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Selecciona el estado de cada sección dental
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-xl"
          >
            ×
          </button>
        </div>

        {/* Sección de Estado de la Pieza Dental - CORREGIDA */}
        <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">
            Estado de la Pieza Dental
          </h3>

          {/* Preview del estado seleccionado */}
          {toothStatus && (
            <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Estado seleccionado:{" "}
              </span>
              {renderStatusPreview()}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {toothStatusOptions.map((option) => (
              <button
                key={option.value || "normal"}
                onClick={(e) => handleStatusChange(option.value, e)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  toothStatus?.type === option.value ||
                  (!toothStatus && !option.value)
                    ? "border-blue-500 bg-blue-100 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      option.value === "ausente"
                        ? "bg-red-500 border-red-500"
                        : option.value === "extraccion"
                        ? "bg-blue-500 border-blue-500"
                        : option.value === "corona"
                        ? "bg-red-500 border-red-500"
                        : option.value === "necesitaCorona"
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-400"
                    }`}
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-800">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-600">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {Object.entries(colors).map(([key, colorInfo]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200"
              >
                <div
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{
                    backgroundColor:
                      key === "white" ? "#FFFFFF" : customColors[key],
                    borderColor:
                      key === "white" ? "#D1D5DB" : customColors[key],
                  }}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-xs">
                    {colorInfo.label}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {colorInfo.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(sections).map(([section, data]) => (
              <div
                key={section}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-base flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          data.color === "white"
                            ? "#D1D5DB"
                            : customColors[data.color],
                      }}
                    />
                    {sectionLabels[section]}
                  </h3>
                  <div className="flex gap-1">
                    {Object.keys(colors).map((c) => (
                      <button
                        key={c}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleColorChange(section, c);
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-all duration-150 transform hover:scale-110 ${
                          data.color === c
                            ? "ring-2 ring-primary ring-offset-1 scale-110"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor:
                            c === "white" ? "#FFFFFF" : customColors[c],
                          borderColor:
                            c === "white" ? "#D1D5DB" : customColors[c],
                        }}
                        title={colors[c].description}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={data.observation}
                    onChange={(e) =>
                      handleObservationChange(section, e.target.value)
                    }
                    placeholder={`Describe el estado de la parte ${sectionLabels[
                      section
                    ].toLowerCase()}...`}
                    className="w-full text-sm border border-gray-300 bg-white rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 min-h-[80px]"
                    rows={3}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Máximo 250 caracteres</span>
                    <span>{data.observation.length}/250</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium shadow-md"
            type="button"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToothModal;

/*import React, { useState, useEffect } from "react";

const ToothModal = ({ toothNumber, initialData, onSave, onClose }) => {
  const [sections, setSections] = useState({});

  useEffect(() => {
    setSections(
      initialData?.sections || {
        top: { color: "white", observation: "" },
        bottom: { color: "white", observation: "" },
        left: { color: "white", observation: "" },
        right: { color: "white", observation: "" },
        center: { color: "white", observation: "" },
      }
    );
  }, [initialData]);

  const sectionLabels = {
    top: "Superior",
    bottom: "Inferior",
    left: "Izquierdo",
    right: "Derecho",
    center: "Central",
  };

  const customColors = {
    blue: "#1E3A8A",
    red: "#B22222",
    green: "#2E7D32",
  };

  const colors = {
    white: { label: "Sano", description: "Pieza sana" },
    blue: { label: "Pendiente", description: "Tratamiento necesario" },
    red: { label: "Restaurado", description: "Tratamiento existente" },
    green: { label: "Profesional", description: "Tratamiento realizado" },
  };

  const handleColorChange = (section, color) => {
    setSections((prev) => ({
      ...prev,
      [section]: { ...prev[section], color },
    }));
  };

  const handleObservationChange = (section, observation) => {
    setSections((prev) => ({
      ...prev,
      [section]: { ...prev[section], observation: observation.slice(0, 250) },
    }));
  };

  const handleSave = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onSave(toothNumber, { sections });
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-sans">
              Pieza Dental {toothNumber}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Selecciona el estado de cada sección dental
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-xl"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {Object.entries(colors).map(([key, colorInfo]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200"
              >
                <div
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{
                    backgroundColor:
                      key === "white" ? "#FFFFFF" : customColors[key],
                    borderColor:
                      key === "white" ? "#D1D5DB" : customColors[key],
                  }}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-xs">
                    {colorInfo.label}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {colorInfo.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(sections).map(([section, data]) => (
              <div
                key={section}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-base flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          data.color === "white"
                            ? "#D1D5DB"
                            : customColors[data.color],
                      }}
                    />
                    {sectionLabels[section]}
                  </h3>
                  <div className="flex gap-1">
                    {Object.keys(colors).map((c) => (
                      <button
                        key={c}
                        onClick={() => handleColorChange(section, c)}
                        className={`w-7 h-7 rounded-full border-2 transition-all duration-150 transform hover:scale-110 ${
                          data.color === c
                            ? "ring-2 ring-primary ring-offset-1 scale-110"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor:
                            c === "white" ? "#FFFFFF" : customColors[c],
                          borderColor:
                            c === "white" ? "#D1D5DB" : customColors[c],
                        }}
                        title={colors[c].description}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={data.observation}
                    onChange={(e) =>
                      handleObservationChange(section, e.target.value)
                    }
                    placeholder={`Describe el estado de la parte ${sectionLabels[
                      section
                    ].toLowerCase()}...`}
                    className="w-full text-sm border border-gray-300 bg-white rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 min-h-[80px]"
                    rows={3}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Máximo 250 caracteres</span>
                    <span>{data.observation.length}/250</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium shadow-md"
            type="button"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToothModal;*/
