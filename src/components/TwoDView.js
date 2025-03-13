import React, { useState } from "react";
import "../styles/TwoDView.css";
import {
  initialHeightsLeft,
  initialHeightsRight,
  totalHeight,
} from "../constants";

const TwoDView = () => {
  const [scale, setScale] = useState(0.3);
  const [heightsLeft, setHeightsLeft] = useState(initialHeightsLeft);
  const [heightsRight, setHeightsRight] = useState(initialHeightsRight);

  const handleDividerMove = (side, key, direction) => {
    const setHeights = side === "left" ? setHeightsLeft : setHeightsRight;

    setHeights((prevHeights) => {
      const keys = Object.keys(prevHeights);
      const index = keys.indexOf(key);
      if (index === -1 || index === keys.length - 1) return prevHeights;

      const newHeights = { ...prevHeights };
      const moveAmount = direction === "up" ? -1 : 1;

      newHeights[key] += moveAmount;
      newHeights[keys[index + 1]] -= moveAmount;

      return newHeights;
    });
  };

  const handleZoom = (type) => {
    setScale((prev) => {
      if (type === "in" && prev < 0.5) return prev + 0.05;
      if (type === "out" && prev > 0.1) return prev - 0.05;
      return prev;
    });
  };

  return (
    <div className="two-d-view">
      <div className="zoom-controls">
        <button onClick={() => handleZoom("in")} className="zoom-button">
          +
        </button>
        <span className="zoom-level">{Math.round(scale * 100)}%</span>
        <button onClick={() => handleZoom("out")} className="zoom-button">
          -
        </button>
      </div>

      <div
        className="furniture-container"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Left Column */}
        <div className="left-column" style={{ height: `${totalHeight}px` }}>
          {Object.entries(heightsLeft).map(([key, height], index) => (
            <React.Fragment key={key}>
              <div className="section" style={{ height: `${height}px` }}>
                <div className="dimension-arrow"></div>
                <span className="dimension-text">{height}mm</span>
              </div>
              {index < 6 && (
                <div className="brown-divider-container">
                  <div
                    className={`brown-divider ${
                      index === 3 ? "special-divider" : ""
                    }`}
                  >
                    <div className="divider-controls">
                      <button
                        className="divider-button"
                        onClick={() => handleDividerMove("left", key, "up")}
                      >
                        ↑
                      </button>
                      <button
                        className="divider-button"
                        onClick={() => handleDividerMove("left", key, "down")}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
          <span className="width-text">823mm</span>
        </div>

        <div className="divider" style={{ height: `${totalHeight}px` }} />

        {/* Right Column */}
        <div className="right-column" style={{ height: `${totalHeight}px` }}>
          {Object.entries(heightsRight).map(([key, height], index) => (
            <React.Fragment key={key}>
              <div className="section" style={{ height: `${height}px` }}>
                <div className="dimension-arrow"></div>
                <span className="dimension-text">{height}mm</span>
              </div>
              {index < 3 && (
                <div className="brown-divider-container">
                  <div className="brown-divider">
                    <div className="divider-controls">
                      <button
                        className="divider-button"
                        onClick={() => handleDividerMove("right", key, "up")}
                      >
                        ↑
                      </button>
                      <button
                        className="divider-button"
                        onClick={() => handleDividerMove("right", key, "down")}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
          <span className="width-text">823mm</span>
        </div>

        <span className="depth-text left">18mm</span>
        <span className="depth-text right">18mm</span>
      </div>
    </div>
  );
};

export default TwoDView;
