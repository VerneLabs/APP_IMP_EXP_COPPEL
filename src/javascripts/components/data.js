import React, {Component} from "react";
import ReactDOM from 'react-dom';
import * as Papa from 'papaparse';
import utils from '../../utils';
import {Button} from '@zendeskgarden/react-buttons';
import {Grid, Row, Col} from '@zendeskgarden/react-grid';
import { Title,Alert } from '@zendeskgarden/react-notifications'
import Loader from './loader';
import Layouts_ids from '../../../dist/assets/catalogs/layouts_fields_ids';
import Layouts_ids_test from '../../../dist/assets/catalogs/layouts_fields_ids_tests';
import sendTicketsZendesk from '../../utils/sendsTicketsZendesk';
import sendOrganizationsZendesk from '../../utils/sendOrganizationsZendesk';
import userDataZendesk from '../../utils/userDataZendesk';
import '@zendeskgarden/react-theming';
import '@zendeskgarden/css-callouts';
import '@zendeskgarden/css-forms';

import { Modal, Header, Body, Footer, FooterItem } from '@zendeskgarden/react-modals';

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: props.client,
      show: false,
      loading: false,
      hasUpdated: false,
      policies: [],
      bulks: [],
      bulksTotal: 0,
      countNotification: 0,
      disableButton: true,
      firstAlertHide: false,
      selectedLayout: 0,
      selectedLayoutForm: 0,
      csvHeader: [],
      prod: true,
      type: ""
    }

  }

  componentDidMount() {
    this.fillDropdown();
    console.log("Component mount...");
    let client = this.props.client;
    client.on('pane.deactivated', function() {
      console.log("saliendo de la app");
    });
  }
  setProdOrTestLayouts(){
    if (this.state.prod) {
      return Layouts_ids;
    } else {
      return Layouts_ids_test
    }
  }

  changeSelect(e) {
    this.setState({selectedLayout: e.target.value});
  }

  testingfunction() {
    let file;
    ReactDOM.render(<Modal>
    <Header>Archivos con nombres distintos</Header>
    <Body>Layout que seleccionaste puede ser distinto al archivo subido<br></br> Si estas seguro de que la informacion es correcta dale a continuar, de lo contrario selecciona cancelar </Body>
    <Footer>
      <FooterItem>
        <Button isDanger basic 
         onClick={() => this.modalAction(false, file)}
        >Cancelar</Button>
      </FooterItem>
      <FooterItem>
        <Button isPrimary
         onClick={() => this.modalAction(true, file)}
        >Confirmar</Button>
      </FooterItem>
    </Footer>
  </Modal>, document.getElementById("modal"))
    
  }

  showModal() {
    this.setState({show: true})
  }

  async componentWillMount() {
    let client = this.props.client; //cliente de zendesk recibido en los props
    let metadata = await client.metadata(); //obtiene metadata de configuración de app del manifest.json

    delete metadata.settings["title"]; //borra el dato de titulo de la app del metadata de configuraicón de app de zendesk
    let baseParams = metadata.settings; //metadata guardado en la variable baseParams

    this.setState({client, baseParams, updated: true}); //guardado en estado del componente
    this.baseParams = baseParams;
  }

  handleChange(e) {
    const [file] = e.target.files
    this.setState({file, disableButton: false})
  }

  handlerCreateBulkTickets() {
    const {allPolicies, client} = this.state
    let zendeskTicketData = []
    allPolicies.forEach((itemCSV) => {
      if (itemCSV.Codigo_Agente && itemCSV.Codigo_Asegurado) {
        const ticketData = this.generateTicketFormat(itemCSV)
        zendeskTicketData.push(ticketData)
      }
    })
    const sectionsZendeskTicketData = utils.chunkArray(zendeskTicketData, 100)

    sendTicketsZendesk(sectionsZendeskTicketData, client)

    this.setState({disabledCreateButton: true, disabledProcessButton: true})
  }

  handlerProcessFile() {
    if(this.state.selectedLayout != 0){

      const {disableButton} = this.state;
      if (!disableButton) {
        const {file} = this.state;
        if(this.checkIfIsCorrectFile(file.name, this.state.selectedLayout)){
          //El nombre del archivo corresponde con el nombre del layout seleccionado, por lo que no se consulta con el usuario y se procede a eecutar
          this.executeFile(file);
        }else{
          //El archivo no parece ser el correcto, se lleva a un modal que hacer una verificación para ver si el usuario esta seguro que ese es el archivo a importar
          this.modalShow(file);
        }
      }
    }else{
      console.log("No esta seleccionando ningun archivo");
    }
  }

  checkIfIsCorrectFile(fileName, selectedLayout){

  // Se revisa si el nombre del archivo tiene nombre parecido a lo que se espera, esto para estar seguro de que el documento que se esta enviando sea el correcto
    let layouts = this.setProdOrTestLayouts();
    let selectedLayoutName = layouts[selectedLayout].label.toLowerCase();
    fileName = fileName.toLowerCase()
    if(fileName.includes(selectedLayoutName)){
      return true;
    }else{
      return false;
    }
  }

executeFile(file){
  //Ejecuta el codigo que segmenta los tickets
  
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      console.log("este es el valor de results", results)
      this.bulks = utils.chunkArray(results.data, 50)
      this.setState({bulksTotal: this.bulks.length,firstAlertHide: false, csvHeader : results.meta['fields']})
      this.processData();
      this.showModal()
    }
  })
}

  async processData() {



    var new_this = this;
    let {countNotification} = this.state
    this.setState({loading: true, show: false})
    ReactDOM.render("",document.getElementById("alerts"))
    if (!this.bulks.length) {
      this.setState({loading: false, disableButton: true, hasUpdated: true, firstAlertHide: true})
      ReactDOM.render(  
        <Alert type="success">
        <Title>Completado</Title>
        Se importaron todos los archivos
      </Alert>,document.getElementById("alerts"))
      return
    }

    let [currentBulk] = this.bulks;
    //currentBulks  es el actual
    this.bulks = this
      .bulks
      .slice(1);
    let allTicketsUpdate = [];

    await Promise.all(currentBulk.map(async (ticketData) => {

      // agarra el valor del ticket, dependiendo del tipo de layout queremos
      // transformarlo. cada valor lo pasamos a un objeto con un arreglo interno de
      // custom fields desde ahi podemos hacer el post masivo

      let propertyValues = Object.values(ticketData);
      let customfields = [];
      let status = null;
      let dataForComment = "";
      let requester_id = "";
      let assignee_id = "";
      let ticket_form_id = ""; 
      let header = this.state.csvHeader;
      let type = "";
      let org_name="";

      

      await Promise.all(propertyValues.map( async (element, index) => {
      let resp = await this.convertToTheRealData(this.state.selectedLayout, index+1, element)

        if (resp != null) {
          // resp.type == 0 && (type = resp.val);
          resp.type == 1 && customfields.push(resp.val);
          resp.type == 2 && (status = resp.val);
          resp.type == 3 && (requester_id = resp.val.value);
          resp.type == 5 && (assignee_id = resp.val.value);
          resp.type == 6 && (org_name= resp.val.value);
        }

        dataForComment = dataForComment + "\n" + header[index] +": "+ element;
    }));

      type = this.getGenerictype(this.state.selectedLayout);
      this.setState({type})

      let ticket_obj;
      console.log("el type es: ", type)
      if(type=="tickets"){
        console.log("151 Entre a set Tickets ");

        if(status){
          status = this.newStatus(status.value);
        }else{
          let defaultStatus = this.getGenericStatus(this.state.selectedLayout);
          if(defaultStatus){
            status = defaultStatus;
          }else{
            status = "closed"
          }
        }


        let processName = this.getProcessName(this.state.selectedLayout);
        if(propertyValues[0] != null){
          console.log(propertyValues);
          console.log(typeof(propertyValues[0]));
          if((typeof(propertyValues[0])!="number" && propertyValues[0].trim()!="")||propertyValues.length !=1){

          ticket_obj = {
            subject: processName,
            comment: {
              "body": "Ticket creado por medio de app de importación" + dataForComment,
              "is_public": false
            },
            custom_fields: customfields
          };
          ticket_obj.group_id = this.getGroupId(this.state.selectedLayout);
          ticket_obj.status = status;
          ticket_form_id = this.getProcessForm(this.state.selectedLayout);
          (ticket_form_id!= ""&&ticket_form_id !=null )&& (ticket_obj.ticket_form_id = ticket_form_id);
          requester_id != "" && (ticket_obj.requester_id = requester_id);
          assignee_id != "" && (ticket_obj.assignee_id = assignee_id);
        }
      }
      }else if(type=="organizations"){
        console.log("151 Entre a set organizacion ");
        let newCustom= new Object;
        // for(var val in customfields){
        //   console.log("val", val );
        //   newCustom[val.id] = val.value
        // }
        customfields.forEach(val => {
          newCustom[val.id] = val.value
        });

        ticket_obj = {
          name: org_name,
         
          organization_fields: newCustom
        };
        console.log("customFields",newCustom);
      }else{
        console.log("151 Bueno no entre a ninguno")
      }

        if(ticket_obj){
          ticket_obj.tags= ["app_imp"];
          allTicketsUpdate.push(ticket_obj);
        }
        
    
      })).then(function() {
        const {client} = new_this.state;
        console.warn("valor a enviar",new_this.state.type, allTicketsUpdate);
        if(new_this.state.type == "tickets"){
          sendTicketsZendesk(allTicketsUpdate, client);
        }else if(new_this.state.type == "organizations"){
          sendOrganizationsZendesk(allTicketsUpdate, client);
        }
        countNotification += 1
        new_this.setState({countNotification})
    
        if(new_this.state.countNotification == new_this.state.bulksTotal){
          console.log("Se completo el proceso");
        }
        setTimeout(() => {
          new_this.processData()
        }, 2000)
      });

  }

  fillDropdown() {
    let data = this.setProdOrTestLayouts();
    let arrayData = Object.values(data);
    let array = [];
    arrayData.forEach(element => {
      let index = arrayData.indexOf(element) + 1;

      array.push({id: index, val: element.label})
    });

    ReactDOM.render(
      <select
      id="dropdownType"
      className="typedropodown m-elem"
      defaultValue="0"
      onChange={(e) => this.changeSelect(e)}>

 <option value="0" disabled>Seleccione un Layout</option>
    {array.map((val, i) => {
      return (
      <option key={i} value={val.id} >{val.val}</option>
      )
    })}
</select>

      , document.getElementById("selectDropdown"));
  }

  newStatus(oldStatus) {

    if (oldStatus == "New") {
      return "new"
    }
    return oldStatus;

  }

  async convertToTheRealData(method, this_counter, value) {

    const {client} = this.props;
    let layouts = this.setProdOrTestLayouts();
    // if (layouts[method][this_counter].type) {
    //   return {
    //     type: 0,
    //     val: {
    //       id: layouts[method][this_counter].val,
    //       value: value
    //     }
    //   }
    // }else
    if (layouts[method][this_counter] != null) {
      if (layouts[method][this_counter].val) {
        return {
          type: 1,
          val: {
            id: layouts[method][this_counter].val,
            value: value
          }
        };
      } else if (layouts[method][this_counter].status) {
        return {
          type: 2,
          val: {
            id: layouts[method][this_counter].val,
            value: value
          }
        };
      }else if (layouts[method][this_counter].org_name) {
        return {
          type: 6,
          val: {
            id: layouts[method][this_counter].val,
            value: value
          }
        };
      } else if (layouts[method][this_counter].num_usr) {
        return await userDataZendesk(value, client,1)
        .then(function(data) {
          return {
            type: 3,
            val: {
              value: data
            }
          }
        });
      } else if (layouts[method][this_counter].num_agent) {
        return await userDataZendesk(value, client,1)
        .then(function(data) {
          return {
            type: 5,
            val: {
              value: data
            }
          }
        });
        
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  getProcessName(method) {
    let layouts = this.setProdOrTestLayouts();
    if (layouts[method].label) {
      return layouts[method].label;
    } else {
      return null;
    }
  }
  getProcessForm(method) {
    let layouts = this.setProdOrTestLayouts();
    if (layouts[method].ticket_form_id) {
      return layouts[method].ticket_form_id;
    } else {
      return null;
    }
  }
  getGenericStatus(method) {
    let layouts = this.setProdOrTestLayouts();
    if (layouts[method].status) {
      return layouts[method].status;
    } else {
      return null;
    }
  }
  getGenerictype(method) {
    let layouts = this.setProdOrTestLayouts();
    if (layouts[method].type) {
      return layouts[method].type;
    } else {
      return null;
    }
  }
  getGroupId(method) {
    let layouts = this.setProdOrTestLayouts();
    if (layouts[method].group) {
      return layouts[method].group;
    } else {
      return null;
    }
  }

  async groupIdByName(name){

   return await userDataZendesk(name, client,2)
  }

modalShow(file){
  ReactDOM.render(<Modal>
    <Header>Archivos con nombre distinto al layout seleccionado</Header>
    <Body>  <Alert type="warning">
        <Title>Parece que la información no está correcta</Title>
        El Layout que seleccionaste puede ser distinto al archivo subido.<br></br> Si la información es correcta haz clic en continuar, de lo contrario selecciona cancelar.
      </Alert></Body>
    <Footer>
      <FooterItem>
        <Button isDanger basic 
         onClick={() => this.modalAction(false, file)}
        >Cancelar</Button>
      </FooterItem>
      <FooterItem>
        <Button isPrimary isSuccess
         onClick={() => this.modalAction(true, file)}
        >Confirmar</Button>
      </FooterItem>
    </Footer>
  </Modal>, document.getElementById("modal"))

}


  modalAction(optionSelected, file){
    //No me funcionanban los modal close, asi que elimino el codigo del modal
    ReactDOM.render("", document.getElementById("modal"))
    //si la opcion es true ejecuta el bloque de tickets para la importación
    if(optionSelected){
      this.executeFile(file);
    }
  }

  render() {
    const {
      loading,
      bulksTotal,
      hasUpdated,
      messageFile,
      disableButton,
      countNotification
    } = this.state

    let loader = loading? <Loader/ > : null
      return (
        <div>


         
        <div id="modal"></div>


          <Grid>
            <Row justifyContent="center">
              <Col md={8} textAlign={"center"}>
                <div className='c-callout u-p-sm'>

                  <label className="m-elem title u-pl u-pb-sm u-pt">Layouts para importar</label>
                  <hr></hr>
                  <div id="selectDropdown">

                  </div>


                  <div className='upload-csv u-mt-xl m-elem'>
                    <input
                      type='file'
                      name='file'
                      accept='.csv'
                      onChange={(e) => this.handleChange(e)}/>
                  </div>

                  {messageFile && <p>{messageFile}</p>}
                  <Button
                    isPrimary
                    disabled={disableButton}
                    hidden={disableButton}
                    onClick={() => this.handlerProcessFile()}>
                    Procesar archivo csv
                  </Button>
                </div>
                <br></br>
              </Col>
              <hr></hr>
              
              <Col md={8} textAlign={"center"}>
                <div className='c-callout u-p-sm '>
                  <p className='u-m-xs'>Notificaciones</p>
                  <hr></hr>
                  <div className='u-ta-center'>
                    <p className='notification-count'>
                      {countNotification}
                      / {bulksTotal}
                    </p>
                    {hasUpdated
                      ? (
                        <p className='notification-label'>
                          Bloques de tickets actualizados.
                        </p>
                      )
                      : (
                        <p className='notification-label'>
                          Bloques de tickets en proceso de actualización.
                        </p>
                      )}
       
                  </div>

                  {loader}
                  <div id="alerts"></div>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>

      );
    }}

  export default Data;

