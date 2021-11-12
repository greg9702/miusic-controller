import React from "react";
import "./Header.css";
import MainButton from "../common/MainButton";

export default class Heading extends React.Component {
  render() {
    return (
      <div id="heading-box">
        <div id="button-box">
          <MainButton text="list" />
          <MainButton text="search" />
          <MainButton text="refresh" />
        </div>
      </div>
    );
  }
}
