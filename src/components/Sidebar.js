// components/Sidebar.js
import React, { useState } from "react";
import "../styles/Sidebar.css";

const Sidebar = ({ selectedTool, setSelectedTool, options, updateOptions }) => {
  const [expandedCategory, setExpandedCategory] = useState("aménagement");

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const selectTool = (tool) => {
    setSelectedTool(tool);
  };

  const toggleOption = (option) => {
    updateOptions({
      ...options,
      [option]: !options[option],
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-item" onClick={() => selectTool("dimensions")}>
          <i className="fas fa-ruler"></i>
          <span>Dimensions</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item" onClick={() => selectTool("colonnes")}>
          <i className="fas fa-columns"></i>
          <span>Colonnes & montants</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div
          className={`sidebar-category ${
            expandedCategory === "aménagement" ? "expanded" : ""
          }`}
          onClick={() => toggleCategory("aménagement")}
        >
          <i className="fas fa-chevron-down"></i>
          <span>Aménagement intérieur</span>
        </div>
        {expandedCategory === "aménagement" && (
          <div className="category-items">
            <div
              className="sidebar-subitem"
              onClick={() => selectTool("étagères")}
            >
              <i className="fas fa-minus"></i>
              <span>Étagères</span>
            </div>
            <div
              className="sidebar-subitem"
              onClick={() => selectTool("tiroirs")}
            >
              <i className="fas fa-minus"></i>
              <span>Tiroirs</span>
            </div>
            <div
              className="sidebar-subitem"
              onClick={() => selectTool("elements")}
            >
              <i className="fas fa-minus"></i>
              <span>Éléments de dressing</span>
            </div>
            <div
              className="sidebar-subitem"
              onClick={() => selectTool("diviseurs")}
            >
              <i className="fas fa-minus"></i>
              <span>Diviseurs verticaux</span>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item" onClick={() => toggleCategory("portes")}>
          <i className="fas fa-door-closed"></i>
          <span>Portes</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item" onClick={() => selectTool("couleurs")}>
          <i className="fas fa-palette"></i>
          <span>Palette de couleurs</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item" onClick={() => selectTool("dessus")}>
          <i className="fas fa-square"></i>
          <span>Dessus</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item" onClick={() => selectTool("fond")}>
          <i className="fas fa-square"></i>
          <span>Fond</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item" onClick={() => selectTool("socle")}>
          <i className="fas fa-minus"></i>
          <span>Socle / plinthe</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item" onClick={() => selectTool("options")}>
          <i className="fas fa-cog"></i>
          <span>Options</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-item" onClick={() => selectTool("résumé")}>
          <i className="fas fa-list"></i>
          <span>Résumé du meuble</span>
        </div>
      </div>

      <div className="sidebar-section options-section">
        <div className="option-item">
          <input
            type="checkbox"
            checked={options.caisson}
            onChange={() => toggleOption("caisson")}
          />
          <span>Caisson</span>
        </div>
        <div className="option-item">
          <input
            type="checkbox"
            checked={options.dimensions}
            onChange={() => toggleOption("dimensions")}
          />
          <span>Dimensions</span>
        </div>
        <div className="option-item">
          <input
            type="checkbox"
            checked={options.fond}
            onChange={() => toggleOption("fond")}
          />
          <span>Fond</span>
        </div>
        <div className="option-item">
          <input
            type="checkbox"
            checked={options.portes}
            onChange={() => toggleOption("portes")}
          />
          <span>Portes</span>
        </div>
        <div className="option-item">
          <input
            type="checkbox"
            checked={options.couleurs}
            onChange={() => toggleOption("couleurs")}
          />
          <span>Couleurs</span>
        </div>
        <div className="option-item">
          <input
            type="checkbox"
            checked={options.aretes}
            onChange={() => toggleOption("aretes")}
          />
          <span>Arêtes</span>
        </div>
        <div className="option-item">
          <input
            type="checkbox"
            checked={options.percages}
            onChange={() => toggleOption("percages")}
          />
          <span>Perçages</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
