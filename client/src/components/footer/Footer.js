import React from "react";
import "./Footer.css";
import MainButton from "../common/MainButton";

export default class Footer extends React.Component {
  render() {
    return (
      <div id="footer-box">
        <div id="footer-text-button-box">
          <div id="footer-text-box">
            <div id="footer-image-area"></div>
            <div id="footer-text-area">
              <div id="footer-text">Foo - bar</div>
            </div>
          </div>
          <div id="footer-button-box">
            <MainButton text="skip" />
          </div>
        </div>
      </div>
    );
  }
}
