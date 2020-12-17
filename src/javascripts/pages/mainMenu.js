import React, { Component } from "react";
import "./mainMenu.css";
import Data from "../components/data";
import Export from "../components/export";
import { ButtonGroup, Button } from '@zendeskgarden/react-buttons';
import {Grid, Row, Col} from '@zendeskgarden/react-grid';


//Componente Main Menu
class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state ={
      dataHidden: true
    };
 
  }
  setSelectedItem(e){
    console.log(e)
  }
  componentDidMount() {
    this.setState(
      {
        // dataHidden: false,
        // selectedItem: "lily"
      }
      );
  }

  componentWillMount(){
    this.setState({
      dataHidden: false,
    })
  }
  actionShow(e){
    console.log("este es e",e);
    let show= true;
    show = (e == "import"? true:false);
    this.setState({dataHidden: show, selectedItem: e})

    console.log(this.state)
  }



  render() {
    return (
      <div>
         <div className='c-callout c-callout--warning' hidden={this.state.firstAlertHide}>
          <strong className='c-callout__title'>
            {/* <span dir='ltr'>Recuerda que:</span> */}
          </strong>
          <p className='c-callout__paragraph'>
            La actualización de tickets requiere que la aplicación se encuentre 
            abierta. Si cierras la aplicación se perderán los datos o procesos
            que estén en ejecución.
          </p>
        </div>
        <br></br>
        <Grid>
            <Row justifyContent="center">
              <Col md={8} textAlign={"center"}>
                <ButtonGroup selectedItem={this.state.selectedItem} onSelect={(e) => this.actionShow(e)}>
                    <Button value="import">Importar</Button>
                    <Button value="export">Exportar</Button>
                </ButtonGroup>
            </Col>
          </Row>
        </Grid>
        <br></br>
         {this.state.dataHidden ? <Data client={this.props.client} hidden={true}/>:<Export client={this.props.client}/>}
      
      </div>
      
    );
  }
}

export default MainMenu;
