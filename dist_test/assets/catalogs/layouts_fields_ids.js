module.exports = {
  //El primer valor es el identificador de la columna, este debe seguir un orden secuencial numerico.
  //Luego tenemos el label, este es el texto que se describirá en el dropdown button y con el que se hara las comparaciones del nombre
    //Justo despues otro orden secuencial para determinar la posicion del csv
      //tenemos luego los siguientes campos que nos brindan infomarcion para exportar
      //val:  nos proporciona un id de campo de ticket, el valor de esa posicion del csv llenara ese valor en ese campo de ticket
      //descripcion:  no ejecuta nada, es solo para entener que se esta cambiando ejecutando
      //num_usr:  nos proporciona el external Id del usuario, el cual nos permite agregarlo como solicitante del ticket
      //num_agent:  nos proporciona el external Id del usuario, el cual nos permita agregarlo como agente del ticket
      //num_agent:  nos proporciona el external Id del usuario, el cual nos permita agregarlo como agente del ticket
      //status: es el valor que permite darle status al ticket, no importa si dice true o false, siempre que aparezca este valor ira al status
  1: {
    label: 'Facturas anuales',
    1: {
      val: 360031220692,
      description: 'nro de la orden de cobro'
    },
    2: {
      num_usr: true,
      description: 'nro de usuario'

    },
    4: {
      val: 360031220672,
      description: 'monto'

    }
  },
  2: {
    label: 'Incidencias',
    1: {
      num_usr: true,
      description: 'nro de usuairo'

    },
    2: {
      val: 360031299651,
      description: 'puntos de contacto'
    },
    3: {
      val: 360031299651,
      description: 'Canal de atencion'
    },
    5: {
      val: 360031367111,
      description: 'Tipos de consultas'
    },
    6: {
      val: 360031304071,
      description: 'Descripcion de hecho'
    },
    7:{
      status: true
    },
    8: {
      val: 360031299971,
      description: 'nro de bicicleta'
    },
    9: {
      val: 360031300171,
      description: 'ubicacion de bicicleta'
    }
  },
  3: {
    label: 'Base de bloqueos',
    4:{
      num_usr_short:true
    }
    ,5: {
      val: 360031220652,
      description: 'Tarjeta'
    }
  },
  4: {
    label: 'Facturas temporales',
    1: {
      val: 360031220692,
      description: 'Nro orden de cobro',
    },
    4: {
      val: 360031220672,
      description: 'Monto'
    }
  },
  5: {
    label: 'MailBox',
    2: {
      val: 360031299651,
      description: 'Punto de contacto'
    },
    3: {
      val: 360031299651,
      description: 'Canal de atencion'
    },
    5: {
      val: 360031367111,
      description: 'Tipo de consultas'
    },
    6: {
      status: true
    },
    10:{
      num_agent: true
    }
  },
  6: {
    label: 'Layout de cargos automaticos',
    1: {
      val: 360031220692,
      description: 'nro orden'
    },
    4:{
      status: true
    },
    7: {
      val: 360031220672,
      description: 'Monto'
    }
  },
  7: {
    label: 'Layout Anual',

    1: {
      val_usr: 'name',
    },
    2: {
      val_usr: 'lastname1',
    },
    3: {
      val_usr: 'lastname2',
    },
    4: {
      val_usr: 'phone',
    },
    6: {
      val_usr: 'email',
    },
    15: {
      val: 360031220652,
      description: 'Tipo tarjeta'
    },

    7: {
      val_camp_usr: "sexo"
    },
    8: {
      val_camp_usr: "punto_de_contacto"
    },

    10: {
      val_camp_usr: "tipo_de_alta"
    },
    14: {
      val_camp_usr: "grado_de_estudios"
    },

    11: {
      val_camp_usr: "fecha_de_nacimiento"
    },
    16: {
      val_camp_usr: "calle_con_numero_oficial"
    },

    19: {
      val_camp_usr: "colonia_oficial"
    },
    20: {
      val_camp_usr: "codigo_postal_direc_oficial"
    },
    21: {
      val_camp_usr: "delegacin_municipio_de_direccin_oficial"
    },
    22: {
      val_camp_usr: "ciudad_oficial"
    },
    12:{
      num_usr_short: true
    }
  },
  8: {
    label: 'Inf de entrega WP',
    1: {
      val_usr: 'name',
    },
    2: {
      val_usr: 'lastname1',
    },
    3: {
      val_usr: 'lastname2',
    },
    4: {
      num_usr_short: true,
    },
    5: {
      val: 360031220652,
      description: 'tipo tarjeta'
    }
  },
  9: {
    label: 'Layout temporal',
    13: {
      val: 360031220652,
      description: 'Tipo Tarjeta'
    },
    6: {
      val_camp_usr: "sexo"
    },
    7: {
      val_camp_usr: "punto_de_contacto"
    },
    9: {
      val_camp_usr: "tipo_de_alta"
    },
    12: {
      val_camp_usr: "grado_de_estudios"
    }
  }
}
export default module;