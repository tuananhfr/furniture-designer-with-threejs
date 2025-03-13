import React from "react";
import "../styles/OptionsPanel.css";

const OptionsPanel = ({ options, updateOptions }) => {
  const handleOptionChange = (optionKey) => {
    updateOptions({
      ...options,
      [optionKey]: !options[optionKey],
    });
  };

  const optionLabels = {
    caisson: "Caisson",
    dimensions: "Dimensions",
    fond: "Fond",
    portes: "Portes",
    couleurs: "Couleurs",
    aretes: "Arêtes",
    percages: "Perçages",
  };

  return (
    <div className="options-panel">
      <h4>Options d'affichage</h4>
      <div className="options-grid">
        {Object.keys(options).map((optionKey) => (
          <div className="option-item" key={optionKey}>
            <label>
              <input
                type="checkbox"
                checked={options[optionKey]}
                onChange={() => handleOptionChange(optionKey)}
              />
              {optionLabels[optionKey]}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsPanel;
