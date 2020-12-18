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
    label: 'Incidencias',
    type: 'tickets',
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
    7: {
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
  2: {
    label: 'Base de bloqueos',
    type: 'tickets',
    ticket_form_id: 360000866432,
    status: 'new',
    4: {
      num_usr: true
    },
    5: {
      val: 360031220652,
      description: 'Tarjeta'
    },
    7: {
      group: true
    }
  },
  3: {
    label: 'Layout de cargos automaticos',
    type: 'tickets',
    1: {
      val: 360031220692,
      description: 'nro orden'
    },
    4: {
      status: true
    },
    7: {
      val: 360031220672,
      description: 'Monto'
    }
  },
  4: {
    label: 'Creacion de organizaciones',
    type: 'organizations',
    2: {
      val: 'id_tienda_mirakl'
    },
    3: {
      org_name: true
    },
    9: {
      val: 'correo_contacto_principal',
      description: 'Contacto'
    },
    88: {
      val: 'curp',
      description: 'Curp del representatne legal'
    }
    ,
    89: {
      val: 'nombre_representante_legal',
      description: 'Nombre representante'
    }
    ,
    90: {
      val: 'apellido_representante_legal',
      description: 'Nombre representante'
    }
    ,
    91: {
      val: 'mail_del_representate_legal',
      description: 'corero electronico creo representante'
    }
    ,
    92: {
      val: 'telefono_rl',
      description: 'telefono representante'
    }
    ,
    93: {
      val: 'telefono_oficina',
      description: 'telefono secundario representante'
    }
    ,
    94: {
      val: 'direccion',
      description: 'calle'
    }
    // ,
    // 94: {
    //   // val: 'curp',
    //   description: 'numero exterior'
    // }
    // ,
    // 95: {
    //   // val: 'curp',
    //   description: 'numero interior'
    // }
    ,
    97: {
      val: 'colonia',
      description: 'colonia'
    }
    ,
    98: {
      val: 'municipio',
      description: 'Delegacion o municipio'
    }
    ,
    99: {
      val: 'ubicacion_estado',
      description: 'estado'
    }
    ,
    100: {
      val: 'zip',
      description: 'codigo postal'
    }
    // ,
    // 99: {
    //   // val: 'curp',
    //   description: 'Horario de atencion'
    // }
    ,
    102: {
      val: 'paqueteria_asignada',
      description: 'Transportista predeterminado'
    }
  }
}
export default module;