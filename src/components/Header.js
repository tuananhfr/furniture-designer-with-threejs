// components/Header.js
import React from "react";
import "../styles/Header.css";
import logo from "../images/logo.png";

const Header = ({ price }) => {
  return (
    <div className="header">
      <div className="logo-section">
        <div className="logo">
          <img src={logo} alt="Dessine ton meuble" />
        </div>
        <div className="user-actions">
          <button className="info-button">
            Informations
            <i className="fas fa-chevron-down"></i>
          </button>
          <button className="create-button">Je crée mon meuble</button>
          <button className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-badge">2</span>
          </button>
          <button className="login-button">Se connecter</button>
        </div>
      </div>

      <div className="tool-bar">
        <div className="help-tools">
          <button className="tool-button help-button">
            <i className="fas fa-question-circle"></i>
            <span>Aide</span>
          </button>
          <button className="tool-button assembly-button">
            <i className="fas fa-file-alt"></i>
            <span>Notice de montage</span>
          </button>
          <button className="tool-button undo-button">
            <i className="fas fa-undo"></i>
            <span>Annuler</span>
          </button>
          <button className="tool-button redo-button">
            <i className="fas fa-redo"></i>
            <span>Refaire</span>
          </button>
        </div>
        <div className="action-buttons">
          <button className="save-button">
            <i className="fas fa-save"></i>
            <span>Enregistrer</span>
          </button>
          <div className="price-display">
            <span className="price">{price} €</span>
            <span className="price-details">Incl. TVA 20% & livraison*</span>
          </div>
          <button className="add-to-cart-button">
            <i className="fas fa-shopping-cart"></i>
            <span>Ajouter au panier</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
