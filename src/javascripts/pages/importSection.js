import React, {Component} from 'react';

class ImportSection extends Component{

  constructor(props){
    super(props)
    this.state = {}

  }

  backToMenu(e){
    this.props.changeSelectedPage(e.target.value)
  }

  render(){
      return(
        <div>
          <button value="mainMenu" onClick={(e) => this.backToMenu(e)}>Back</button>
        </div>
      )
  }
}

export default ImportSection;
