import React from "react";
import "./MainButton.css";

export default class Heading extends React.Component {
  state = { text: "" };
  render() {
    return <button className="main-button">{this.props.text}</button>;
  }
}
