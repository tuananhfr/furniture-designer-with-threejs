import React, { useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TwoDView from "./components/TwoDView";
import ThreeDView from "./components/ThreeDView";
import OptionsPanel from "./components/OptionsPanel";
import "./styles/App.css";
import Footer from "./components/Footer";

function App() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [furnitureConfig, setFurnitureConfig] = useState({
    dimensions: { width: 1700, height: 2300, depth: 608 },
    components: [],
    options: {
      caisson: true,
      dimensions: true,
      fond: true,
      portes: true,
      couleurs: true,
      aretes: true,
      percages: false,
    },
    price: 2865,
  });
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [hoveredComponent, setHoveredComponent] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 70,
      behavior: "smooth",
    });
  }, []);
  const updateFurnitureConfig = useCallback(
    (updates) => {
      setFurnitureConfig((prev) => {
        const newConfig = { ...prev, ...updates };
        if (updates.components) {
          // Nếu component đang được chọn bị xóa, hủy chọn nó
          if (
            selectedComponent &&
            !updates.components.find((c) => c.id === selectedComponent.id)
          ) {
            setSelectedComponent(null);
          }
        }
        return newConfig;
      });
    },
    [selectedComponent]
  );

  const handleComponentSelect = useCallback((component) => {
    setSelectedComponent(component);
  }, []);

  const handleComponentHover = useCallback((component) => {
    setHoveredComponent(component);
  }, []);

  const updateOptions = useCallback(
    (options) => {
      updateFurnitureConfig({ options });
    },
    [updateFurnitureConfig]
  );

  return (
    <div className="app-container">
      <Header price={furnitureConfig.price} />
      <div className="main-content">
        <Sidebar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          options={furnitureConfig.options}
          updateOptions={(options) => updateFurnitureConfig({ options })}
          selectedComponent={selectedComponent}
        />
        <div className="design-area">
          <div className="views-container">
            <div className="view-panel">
              <h3>2D View</h3>
              <TwoDView
                furnitureConfig={furnitureConfig}
                updateFurnitureConfig={updateFurnitureConfig}
                selectedTool={selectedTool}
                selectedComponent={selectedComponent}
                onComponentSelect={handleComponentSelect}
                hoveredComponent={hoveredComponent}
                onComponentHover={handleComponentHover}
              />
            </div>
            <div className="view-panel">
              <h3>3D View</h3>
              <div className="view-content">
                <ThreeDView
                  furnitureConfig={furnitureConfig}
                  updateFurnitureConfig={updateFurnitureConfig}
                  selectedComponent={selectedComponent}
                  onComponentSelect={handleComponentSelect}
                  hoveredComponent={hoveredComponent}
                  onComponentHover={handleComponentHover}
                />
                <OptionsPanel
                  options={furnitureConfig.options}
                  updateOptions={updateOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
