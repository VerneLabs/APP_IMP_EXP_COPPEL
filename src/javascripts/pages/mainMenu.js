import React, { Component } from "react";
import "./mainMenu.css";
import Data from "../components/data";

//Componente Main Menu
class MainMenu extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
          <Data client={this.props.client}/>
      </div>
      
    );
  }
}

export default MainMenu;
