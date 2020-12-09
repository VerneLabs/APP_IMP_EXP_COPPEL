module.exports = {
  //El primer valor es el identificador de la columna, este debe seguir un orden secuencial numerico.
  //Luego tenemos el label, este es el texto que se describirá en el dropdown button y con el que se hara las comparaciones del nombre
  //Aqui mismo podemos tener un ticket_form_id que nos da el formulario que se debe mostrar al seleccionar este layour, ejemplo en layouts_fileds_ids_test ya que no tenemos actualmente esos datos para producción
  //el valor  status dara el estatus generico que tendran todos los tickets
  //El valor group tendra el id donde se documentaran los tickets
  //Justo despues otro orden secuencial para determinar la posicion del csv
  //tenemos luego los siguientes campos que nos brindan infomarcion para exportar
  //val:  nos proporciona un id de campo de ticket, el valor de esa posicion del csv llenara ese valor en ese campo de ticket
  //descripcion:  no ejecuta nada, es solo para entener que se esta cambiando ejecutando
  //num_usr:  nos proporciona el external Id del usuario, el cual nos permite agregarlo como solicitante del ticket
  //num_agent:  nos proporciona el external Id del usuario, el cual nos permita agregarlo como agente del ticket
  //status: es el valor que permite darle status al ticket, no importa si dice true o false, siempre que aparezca este valor ira al status
  1: {
      label: 'Prueba Coppel',
      // ticket_form_id: 360000977272,
      // // status: 'hold',
      // group: 28193638,
      // 1: {
      //   val: 360032997332
      // },
      // 2: {
      //   val: 360019454151
      // },
      // 3: {
      //   val: 360014831552
      // }
      // ,
      // 6: {
      //   status: true
      // },
      // 10:{
      //     num_usr: true
      // }
    }
   
  }    
export default module;