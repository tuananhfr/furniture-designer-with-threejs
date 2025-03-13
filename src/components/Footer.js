// components/Footer.js
import React from "react";
import "../styles/Footer.css";
import LogoFooter from "../images/logo.png"; // Assurez-vous d'avoir le logo dans votre projet

const Footer = () => {
  return (
    <footer className="footer">
      {/* Logo positionné à gauche */}
      <div className="footer-wrapper">
        <div className="footer-logo">
          <img src={LogoFooter} alt="Dessine ton meuble" />
        </div>
      </div>

      {/* Ligne de séparation */}
      <div className="footer-separator"></div>

      <div className="footer-content">
        {/* Section Catégories */}
        <div className="footer-column">
          <h3 className="footer-title">Catégories</h3>
          <ul className="footer-links">
            <li>
              <a href="/meuble-sous-escalier">Meuble sous escalier</a>
            </li>
            <li>
              <a href="/meuble-sous-pente">Meuble sous pente</a>
            </li>
            <li>
              <a href="/bibliotheque">Bibliothèque</a>
            </li>
            <li>
              <a href="/separateur-de-piece">Séparateur de pièce</a>
            </li>
            <li>
              <a href="/dressing-et-placards">Dressing et placards</a>
            </li>
            <li>
              <a href="/meuble-escalier">Meuble escalier</a>
            </li>
            <li>
              <a href="/meuble-dangle">Meuble d'angle</a>
            </li>
            <li>
              <a href="/caisson">Caisson</a>
            </li>
            <li>
              <a href="/meuble-tv">Meuble TV</a>
            </li>
            <li>
              <a href="/meuble-a-hauteur-variable">Meuble à hauteur variable</a>
            </li>
            <li>
              <a href="/bureau">Bureau</a>
            </li>
            <li>
              <a href="/planches-sur-mesure">Planches sur mesure</a>
            </li>
            <li>
              <a href="/tous-nos-meubles">Tous nos meubles sur mesure</a>
            </li>
          </ul>
        </div>

        {/* Section Informations */}
        <div className="footer-column">
          <h3 className="footer-title">Informations</h3>
          <ul className="footer-links">
            <li>
              <a href="/mon-compte">Mon compte</a>
            </li>
            <li>
              <a href="/a-propos">À propos de nous</a>
            </li>
            <li>
              <a href="/savoir-faire">Savoir-faire</a>
            </li>
            <li>
              <a href="/aide-configurateur">Aide configurateur</a>
            </li>
            <li>
              <a href="/aide-outil-assemblage">Aide outil d'assemblage</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/notice-de-montage">Notice de montage</a>
            </li>
            <li>
              <a href="/livraison">Livraison</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/pour-les-pros">Pour les pros</a>
            </li>
          </ul>
        </div>

        {/* Section Dessine Ton Meuble */}
        <div className="footer-column about-column">
          <h3 className="footer-title">Dessine Ton Meuble</h3>
          <p>
            DessineTonMeuble, c'est une société Picarde qui vous propose de
            créer en ligne votre meuble sur mesure et de le recevoir chez vous
            en kit prêt à monter depuis 2011.
          </p>
          <p>
            Notre configurateur vous permet de créer votre meuble exactement
            comme vous le voulez. Nous proposons un service d'accompagnement de
            qualité pour vous aider dans la conception de vos projets.
          </p>
        </div>

        <div className="footer-column contact-column">
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-contact">
            <li>
              <div className="contact-item">
                <div className="contact-icon phone-icon"></div>
                <span>03 65 96 01 16</span>
              </div>
            </li>
            <li>
              <div className="contact-item">
                <div className="contact-icon clock-icon"></div>
                <span>Lundi au vendredi - 9h à 16h30</span>
              </div>
            </li>
            <li>
              <div className="contact-item">
                <div className="contact-icon email-icon"></div>
                <span>serviceclients@dessinetonmeuble.fr</span>
              </div>
            </li>
            <li>
              <div className="contact-item">
                <div className="contact-icon location-icon"></div>
                <div className="contact-text">
                  <span>Showroom</span>
                  <span>14 rue de Beauvais - 60300 Senlis</span>
                </div>
              </div>
            </li>
          </ul>

          {/* Section Légal */}
          <div className="legal-section">
            <h3 className="footer-title">Légal</h3>
            <ul className="footer-links">
              <li>
                <a href="/informations-legales">Informations légales</a>
              </li>
              <li>
                <a href="/politique-de-confidentialite">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="/cgv">Conditions Générales de Vente</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section Réseaux Sociaux */}
      <div className="social-section">
        <p className="follow-text">Suivez-nous</p>
        <div className="social-icons">
          <a
            href="https://pinterest.com"
            className="social-icon pinterest-icon"
          >
            <img alt="https://pinterest.com" />
          </a>
          <a
            href="https://instagram.com"
            className="social-icon instagram-icon"
          >
            <img alt="https://instagram.com" />
          </a>
        </div>
      </div>

      {/* Copyright et Drapeaux */}
      <div className="footer-bottom">
        <p className="copyright">tuananhfr - GitHub - ©2025</p>
        <div className="language-flags">
          <a href="/fr" className="flag french-flag">
            <img alt="/fr" />
          </a>
          <a href="/en" className="flag english-flag">
            <img alt="/en" />
          </a>
          <a href="/nl" className="flag dutch-flag">
            <img alt="/nl" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
