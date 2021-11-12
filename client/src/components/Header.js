import React from "react";
import "./Header.css";

export default class Heading extends React.Component {
  render() {
    return (
      <div id="heading-box">
        <div id="button-box">
          <button id="list-button" className="heading-button">
            &#9776;
          </button>
          <button id="search-button" className="heading-button">
            &#10148;
          </button>
          <button id="refresh-button" className="heading-button">
            &#128472;
          </button>
        </div>
      </div>
    );
  }
}

// <div id="button-box">
// AAAA
// {/* /* <button id="search-button" className="heading-button">
//   &#10148;
// </button>
// <button id="list-button" className="heading-button">
//   &#9776;
// </button>
// <button id="refresh-button" className="heading-button">
//   &#128472;
// </button> */ */}
// </div>
