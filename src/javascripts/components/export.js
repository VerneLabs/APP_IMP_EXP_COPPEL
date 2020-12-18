import React, {Component} from "react";
import ReactDOM from 'react-dom';
import * as Papa from 'papaparse';
import utils from '../../utils';
import {Button} from '@zendeskgarden/react-buttons';
import {Grid, Row, Col} from '@zendeskgarden/react-grid';
import {Title, Alert} from '@zendeskgarden/react-notifications'
import Loader from './loader';
import Layouts_ids from '../../../dist/assets/catalogs/layouts_fields_ids';
import Layouts_ids_test from '../../../dist/assets/catalogs/layouts_fields_ids_tests';
import sendTicketsZendesk from '../../utils/sendsTicketsZendesk';
import userDataZendesk from '../../utils/userDataZendesk';
import searchZendesk from '../../utils/searchZendesk';
import {Field, Label, Radio, Input, Checkbox} from '@zendeskgarden/react-forms';
import '@zendeskgarden/react-theming';
import '@zendeskgarden/css-callouts';
import '@zendeskgarden/css-forms';
import {ThemeProvider} from '@zendeskgarden/react-theming';
import {Accordion, Stepper} from '@zendeskgarden/react-accordions';
import { CSVLink, CSVDownload } from "react-csv";
import { Datepicker, DatepickerRange } from '@zendeskgarden/react-datepickers';
import moment from 'moment';

import {Modal, Header, Body, Footer, FooterItem} from '@zendeskgarden/react-modals';

class Export extends Component {
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
      prod: false,
      step: 0,
      exportTypeButtonHidden:true,
      showNullValues : false,
      isCompact: false,
      secondSectionHide: true
    }

  }

  componentDidMount() {
    // this.fillDropdown(); console.log("Component mount...");
    let client = this.props.client;
    client.on('pane.deactivated', function () {
      console.log("saliendo de la app");
    });
  }
  setProdOrTestLayouts() {
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
    ReactDOM.render(
      <Modal>
      <Header>Archivos con nombres distintos</Header>
      <Body>Layout que seleccionaste puede ser distinto al archivo subido<br></br>
        Si estas seguro de que la informacion es correcta dale a continuar, de lo
        contrario selecciona cancelar
      </Body>
      <Footer>
        <FooterItem>
          <Button isDanger basic onClick={() => this.modalAction(false, file)}>Cancelar</Button>
        </FooterItem>
        <FooterItem>
          <Button isPrimary onClick={() => this.modalAction(true, file)}>Confirmar</Button>
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
    if (this.state.selectedLayout != 0) {

      const {disableButton} = this.state;
      if (!disableButton) {
        const {file} = this.state;
        if (this.checkIfIsCorrectFile(file.name, this.state.selectedLayout)) {
          // El nombre del archivo corresponde con el nombre del layout seleccionado, por
          // lo que no se consulta con el usuario y se procede a eecutar
          this.executeFile(file);
        } else {
          // El archivo no parece ser el correcto, se lleva a un modal que hacer una
          // verificación para ver si el usuario esta seguro que ese es el archivo a
          // importar
          this.modalShow(file);
        }
      }
    } else {
      console.log("No esta seleccionando ningun archivo");
    }
  }

  checkIfIsCorrectFile(fileName, selectedLayout) {

    // Se revisa si el nombre del archivo tiene nombre parecido a lo que se espera,
    // esto para estar seguro de que el documento que se esta enviando sea el
    // correcto
    let layouts = this.setProdOrTestLayouts();
    let selectedLayoutName = layouts[selectedLayout]
      .label
      .toLowerCase();
    fileName = fileName.toLowerCase()
    if (fileName.includes(selectedLayoutName)) {
      return true;
    } else {
      return false;
    }
  }

  executeFile(file) {
    //Ejecuta el codigo que segmenta los tickets
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        this.bulks = utils.chunkArray(results.data, 50)
        this.setState({bulksTotal: this.bulks.length, firstAlertHide: false, csvHeader: results.meta['fields']})
        this.processData();
        this.showModal()
      }
    })
  }

  async processData() {
    var new_this = this;
    let {countNotification} = this.state
    this.setState({loading: true, show: false})
    ReactDOM.render("", document.getElementById("alerts"))
    if (!this.bulks.length) {
      this.setState({loading: false, disableButton: true, hasUpdated: true, firstAlertHide: true})
      ReactDOM.render(
        <Alert type="success">
        <Title>Completado</Title>
        Se importaron todos los archivos
      </Alert>, document.getElementById("alerts"))
      return
    }

    let [currentBulk] = this.bulks;
    //currentBulks  es el actual
    this.bulks = this
      .bulks
      .slice(1);
    let allTicketsUpdate = [];

    await Promise.all(currentBulk.map(async(ticketData) => {

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
      await Promise.all(propertyValues.map(async(element, index) => {
        let resp = await this.convertToTheRealData(this.state.selectedLayout, index + 1, element)

        if (resp != null) {
          resp.type == 1 && customfields.push(resp.val);
          resp.type == 2 && (status = resp.val);
          resp.type == 3 && (requester_id = resp.val.value);
          resp.type == 5 && (assignee_id = resp.val.value);
        }
        dataForComment = dataForComment + "\n" + header[index] + ": " + element;
      }));

      if (status) {
        status = this.newStatus(status.value);
      } else {
        let defaultStatus = this.getGenericStatus(this.state.selectedLayout);
        if (defaultStatus) {
          status = defaultStatus;
        } else {
          status = "closed"
        }
      }

      let processName = this.getProcessName(this.state.selectedLayout);
      if (propertyValues[0] != null) {
        console.log(propertyValues);
        console.log(typeof(propertyValues[0]));
        if ((typeof(propertyValues[0]) != "number" && propertyValues[0].trim() != "") || propertyValues.length != 1) {

          let ticket_obj = {
            subject: processName,
            comment: {
              "body": "Ticket creado por medio de app de importación" + dataForComment,
              "is_public": false
            },
            custom_fields: customfields
          };
          ticket_obj.tags = ["app_imp"];
          ticket_obj.group_id = this.getGroupId(this.state.selectedLayout);
          ticket_obj.status = status;
          ticket_form_id = this.getProcessForm(this.state.selectedLayout);
          (ticket_form_id != "" && ticket_form_id != null) && (ticket_obj.ticket_form_id = ticket_form_id);
          requester_id != "" && (ticket_obj.requester_id = requester_id);
          assignee_id != "" && (ticket_obj.assignee_id = assignee_id);
          allTicketsUpdate.push(ticket_obj);

          }
        }
      }))
      .then(function () {
        const {client} = new_this.state;
        sendTicketsZendesk(allTicketsUpdate, client);
        countNotification += 1
        new_this.setState({countNotification})

        if (new_this.state.countNotification == new_this.state.bulksTotal) {
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
          <option key={i} value={val.id}>{val.val}</option>
        )
      })}
    </select>, document.getElementById("selectDropdown"));
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
      } else if (layouts[method][this_counter].num_usr) {
        return await userDataZendesk(value, client, 1).then(function (data) {
          return {
            type: 3,
            val: {
              value: data
            }
          }
        });
      } else if (layouts[method][this_counter].num_agent) {
        return await userDataZendesk(value, client, 1).then(function (data) {
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
  getGroupId(method) {
    let layouts = this.setProdOrTestLayouts();
    if (layouts[method].group) {
      return layouts[method].group;
    } else {
      return null;
    }
  }

  async groupIdByName(name) {

    return await userDataZendesk(name, client, 2)
  }

  modalShow(file) {
    ReactDOM.render(
      <Modal>
      <Header>Archivos con nombre distinto al layout seleccionado</Header>
      <Body>
        <Alert type="warning">
          <Title>Parece que la información no está correcta</Title>
          El Layout que seleccionaste puede ser distinto al archivo subido.<br></br>
          Si la información es correcta haz clic en continuar, de lo contrario selecciona
          cancelar.
        </Alert>
      </Body>
      <Footer>
        <FooterItem>
          <Button isDanger basic onClick={() => this.modalAction(false, file)}>Cancelar</Button>
        </FooterItem>
        <FooterItem>
          <Button isPrimary isSuccess onClick={() => this.modalAction(true, file)}>Confirmar</Button>
        </FooterItem>
      </Footer>
    </Modal>, document.getElementById("modal"))

  }

  modalAction(optionSelected, file) {
    //No me funcionanban los modal close, asi que elimino el codigo del modal
    ReactDOM.render("", document.getElementById("modal"))
    //si la opcion es true ejecuta el bloque de tickets para la importación
    if (optionSelected) {
      this.executeFile(file);
    }
  }
  onNext() {
    console.log("Next");
    let step = this.state.step;
    step++;
    this.setState({step})
  }
  onPrev() {
    let step = this.state.step;
    step--;
    this.setState({step})
  }
  setRadioValue(e) {
    console.log(e);
    this.setState({radioValue: e, exportTypeButtonHidden: false})
  }
  translateName(e){
    let resp = "";
    switch(e) {
      case "user":
      resp = "usuarios"
        break;
        case "ticket":
      resp = "tickets"
        break;
      case "organization":
      resp = "organizaciones"
        break;
      default:
        resp = e;
    }
    return resp;
  }

  async exportAction(){
 
    let query= new Object;

    query.type = this.state.radioValue;
    query.init_date = moment(this.state.initDate).format("YYYY-MM-DD");
    query.end_date = moment(this.state.endDate).format("YYYY-MM-DD");


    let datos = await searchZendesk(query, this.props.client, 0)

    console.log("esto es lo que tenemos de respuesta de data",datos);
    console.log("tipo",typeof(datos));
    // var propertyValues = Object.values(datos);

    var values = [];

for (var key in datos) {
  if (datos.values(key)) {
    for (var data in datos[key]) {
      if(data=="tags"){
        console.log("este es de los valores tags");
        let tags = datos[key][data].toString();
        datos[key][data] = tags;

      }
      if(datos[key][data]){

        if(typeof(datos[key][data])=="object" && datos[key][data].length!=0){
          
          let arrElement = datos[key][data];
          for (var elementKey in arrElement) {
            // console.log("state", this.state)
            if(this.state.showNullValues){
              // console.log(1);

              datos[key][`${data}.${arrElement[elementKey].id}`] = arrElement[elementKey].value;

            }else{
              
              if(arrElement[elementKey] && arrElement[elementKey].value){
                // console.log(2);
                datos[key][`${data}.${arrElement[elementKey].id}`] = arrElement[elementKey].value;
              }
            }
          }
          
            // console.log("midata",datos[key][data]);
            // datos[key][`${data}.prueba`] = "Hi";

          delete datos[key][data];
        }
      }
      }
    values.push(datos[key]);
  }
}

      if(values.length==0){
        console.error("Criterios sin data");
        <div className='c-callout c-callout--warning'>
          <strong className='c-callout__title'>
            {/* <span dir='ltr'>Recuerda que:</span> */}
            No existe data dentro de los criterios seleccionados
          </strong>
          <p className='c-callout__paragraph'>
            Por favor cambia los filtros e intenta nuevamente
          </p>
        </div>
          ,document.getElementById("errors");
      }else{
        ReactDOM.render(
          <CSVDownload data={values} target="_blank" filename={"my-file.csv"} />
          ,document.getElementById("alerts"));
      }

  

  }

  setNullValues(e){
    console.log(e);
    let prevValue =this.state.showNullValues;

    console.log(prevValue);
    prevValue == false? this.setState({showNullValues:true}) : this.setState({showNullValues:false})
  }

  setDatesValues(date, method){
    let initDate = Boolean(this.state.initDate);
   let endDate = Boolean(this.state.endDate);
   method == 0 ? (this.setState({initDate : date}), initDate = true): (this.setState({endDate : date}), endDate= true);
   
    if(Boolean(initDate)&& Boolean(endDate)){
      this.setState({secondSectionHide:false})
    }
  }

  
  formatDate(e){
     let date = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    return date.format(e);
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

    let loader = loading
      ? <Loader/ >
        : null 
        return (
        <div>

          <div id="modal"></div>

          <Grid>
            <Row justifyContent="center">
              <Col md={8}>
                <div className='c-callout u-p-sm'>

                  <label className="m-elem title u-pl u-pb-sm u-pt">Exportar data de Zendesk</label>

                  <hr></hr>

                  <Stepper activeIndex={this.state.step}>
                    <Stepper.Step key="step-1">
                      <Stepper.Label>Tipo de exportación</Stepper.Label>
                      <Stepper.Content>
                        ¿Qué deseas exportar?
                        <hr></hr>
                        <Field>
                          <Radio
                            name="default example"
                            value="ticket"
                            checked={this.state.radioValue === 'ticket'}
                            onChange={event => this.setRadioValue(event.target.value)}>
                            <Label>Tickets</Label>
                          </Radio>
                        </Field>
                        <Field>
                          <Radio
                            name="default example"
                            value="user"
                            checked={this.state.radioValue === 'user'}
                            onChange={event => this.setRadioValue(event.target.value)}>
                            <Label>Ususarios</Label>
                          </Radio>
                        </Field>
                        <Field>
                          <Radio
                            name="default example"
                            value="organization"
                            checked={this.state.radioValue === 'organization'}
                            onChange={event => this.setRadioValue(event.target.value)}>
                            <Label>Organizaciones</Label>
                          </Radio>
                        </Field>
                        <div className="buttonContainer">
                          <Button isPrimary hidden={this.state.exportTypeButtonHidden} onClick={() => this.onNext()}>Siguiente</Button>
                        </div>
                      </Stepper.Content>
                    </Stepper.Step>
                    <Stepper.Step key="step-2">
                      <Stepper.Label>Filtros</Stepper.Label>
                      <Stepper.Content>
                      <h5>Campos Nulos</h5>
                        Si seleccionas la siguiente opción todos los campos nulos serán importados en el csv, de lo contrario solo los campos con valores
                          <hr></hr>
                      <Field>
                        <Checkbox checked={this.state.showNullValues} onChange={(e) => this.setNullValues(e)}>
                          <Label>Incluir campos nulos</Label>
                        </Checkbox>
                      </Field>
                      <br></br>
                      <hr></hr>
                      <hr></hr>
                        <h5>Rango de creación</h5>
                        Bajo que criterios deseas que se filtren los {this.translateName(this.state.radioValue)}
                          <hr></hr>
                              <Field>
                              <Label>Fecha inicio de creación</Label>
                              <Datepicker value={this.state.initDate} onChange={selectedDate => {this.setDatesValues(selectedDate, 0)}} style={{ maxWidth: 200 }} formatDate={date => this.formatDate(date)} isCompact={true}>
                                <Input />
                              </Datepicker>
                          </Field>
                       
                       
                          
                          <Field>
                            <Label>Fecha fin de creación</Label>
                            <Datepicker value={this.state.endDate} onChange={selectedDate => {this.setDatesValues(selectedDate, 1)}} formatDate={date => this.formatDate(date)}>
                              <Input />
                            </Datepicker>
                          </Field>

                        <br></br>
                        <div className="buttonContainer" hidden={this.state.secondSectionHide}>
                          <Button isDanger onClick={() => this.onPrev()}>Volver</Button>
                          <span> </span>
                          <Button isPrimary onClick={() => this.onNext()}>Siguiente</Button>
                        </div>
                      </Stepper.Content>
                    </Stepper.Step>
                    <Stepper.Step key="step-3">
                      <Stepper.Label>Finalizar</Stepper.Label>
                      <Stepper.Content>
                        Por ultimo te pedimos que confirmes la seleccion de todo los datos y en el caso de que todo sea correcto selecciones exportar
                        <hr></hr>
                        <br></br>
                        Tipo : {this.translateName(this.state.radioValue)}
                        <br></br>
                        Incluyendo valores nulos: {this.state.showNullValues?"Si":"No"}
                        <br></br>
                        Desde el {moment(this.state.initDate).format("DD/MM/YYYY")} hasta el {moment(this.state.endDate).format("DD/MM/YYYY")}
                        <br></br>
                        <div className="buttonContainer">
                          <Button isDanger onClick={() => this.onPrev()}>Volver</Button>
                          <span></span>
                          <span></span>
                          <Button isPrimary onClick={() => this.exportAction()}>
                    Exportar
                  </Button>
                        </div>
                      </Stepper.Content>
                    </Stepper.Step>
                  </Stepper>
                  {/* <Button
                    isPrimary
                    onClick={() => (console.log(this.state))}>State</Button> */}

                


                <div id="errors"></div>

                </div>
                <br></br>
              </Col>
              <hr></hr>

              <Col md={8} textAlign={"center"} hidden={true}>
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
                          Bloques de tickets exportados.
                        </p>
                      )
                      : (
                        <p className='notification-label'>
                          Bloques de tickets en proceso de exportación.
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

  export default Export;