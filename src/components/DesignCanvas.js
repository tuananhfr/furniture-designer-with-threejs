// components/DesignCanvas.js
import React from "react";
import TwoDView from "./TwoDView";
import ThreeDView from "./ThreeDView";
import "../styles/DesignCanvas.css";

const DesignCanvas = ({
  furnitureConfig,
  updateFurnitureConfig,
  selectedTool,
}) => {
  return (
    <div className="design-canvas">
      <div className="view-2d">
        <h3>Vue 2D</h3>
        <TwoDView
          furnitureConfig={furnitureConfig}
          updateFurnitureConfig={updateFurnitureConfig}
          selectedTool={selectedTool}
        />
      </div>
      <div className="view-3d">
        <h3>Vue 3D</h3>
        <ThreeDView
          furnitureConfig={furnitureConfig}
          selectedTool={selectedTool}
        />
      </div>

      {furnitureConfig.notification && (
        <div className="notification-box">
          <div className="notification-content">
            <h3>Hauteur de votre meuble:</h3>
            <p>
              Votre meuble mesure 230.0cm en hauteur, une hauteur sous plafond
              de 238.4cm minimum sera nécessaire pour le relever après montage.
            </p>
            <p>
              Meuble sans fond ou avec fond partiel: pour une meilleure
              stabilité latérale il faut prévoir une fixation murale, ou plus de
              fonds.
            </p>
          </div>
          <button
            className="close-notification"
            onClick={() => updateFurnitureConfig({ notification: null })}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default DesignCanvas;
