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
  
  // 1: {
  //   label: 'Creacion de organizaciones',
  //   type: 'organizations',
  //   2: {
  //     val: 'id_tienda_mirakl'
  //   },
  //   3: {
  //     org_name: true
  //   },
  //   // 4: {
  //   //   val: 'estatus_de_tienda',
  //   //   description: 'Necesita traducciones - Es el status de la tienda  Open=Activa, Suspendida=Pausada sin publicaciones, Closed=Cerrada por seller'
  //   // },

  //   // DATO INCORRECTO------------------
  //   // 9: {
  //     //   val: 'correo_contacto_principal',
  //     //   description: 'Contacto principal'
  //     // },
  //   // DATO INCORRECTO------------------
  //   88: {
  //     val: 'curp',
  //     description: 'Curp del representatne legal'
  //   }
  //   ,
  //   89: {
  //     val: 'nombre_contacto_principal',
  //     description: 'Nombre Contacto principal'
  //   }
  //   ,
  //   91: {
  //     val: 'correo_contacto_principal',
  //     description: 'corero electronico BODEGA'
  //   }
  //   //FALTA INFO --------------------------
  //   // xs: {
  //     //   val: 'razon_social',
  //     //   description: 'Razon social'
  //     // }
  //   //FALTA INFO --------------------------

  //   //FALTA INFO --------------------------
  //   // xs: {
  //     //   val: 'rfc',
  //     //   description: 'rfc'
  //     // }
  //   //FALTA INFO --------------------------
  //   ,
  //   92: {
  //     val: 'telefono_contacto_principal',
  //     description: 'telefono representante'
  //   }
  //   ,
  //   93: {
  //     val: 'telefono_oficina',
  //     description: 'telefono secundario representante'
  //   }
  //   ,
  //   94: {
  //     val: 'direccion',
  //     description: 'calle'
  //   }
  //   ,
  //   97: {
  //     val: 'colonia',
  //     description: 'colonia'
  //   }
  //   ,
  //   98: {
  //     val: 'municipio',
  //     description: 'Delegacion o municipio'
  //   }
  //   ,
  //   99: {
  //     val: 'ubicacion_estado',
  //     description: 'estado'
  //   }
  //   ,
  //   100: {
  //     val: 'zip',
  //     description: 'codigo postal'
  //   }
  //   ,
  //   // 102: {
  //   //   val: 'paqueteria_asignada',
  //   //   description: 'NECESITA TRADUCCIONES ---   Transportista predeterminado - FedEx = fedex, DHL= dhl'
  //   // }


    /// Ultimo Layout--------------------------
  1: {
    label: 'Creacion de organizaciones',
    type: 'organizations',
    2: {
      val: 'id_tienda_mirakl'
    },
    3: {
      org_name: true
    },
    // 4: {
    //   val: 'estatus_de_tienda',
    //   description: 'Necesita traducciones - Es el status de la tienda  Open=Activa, Suspendida=Pausada sin publicaciones, Closed=Cerrada por seller'
    // },


    
    5: {
      val: 'curp',
      description: 'Curp del representatne legal'
    }
    ,
    // 6: {
    //   val: 'paqueteria_asignada',
    //   description: 'NECESITA TRADUCCIONES ---   Transportista predeterminado - FedEx = fedex, DHL= dhl'
    // }
    // ,
    
    7: {
      val: 'nombre_contacto_principal',
      description: 'Nombre Contacto principal'
    }
    ,
    8: {
      val: 'correo_contacto_principal',
      description: 'corero electronico BODEGA'
    },

    9: {
        val: 'razon_social',
        description: 'Razon social'
      },



    10: {
        val: 'rfc',
        description: 'rfc'
      }

    ,
    11: {
      val: 'telefono_contacto_principal',
      description: 'telefono representante'
    }
    ,
    12: {
      val: 'telefono_oficina',
      description: 'telefono secundario representante'
    }
    ,
    13: {
      val: 'direccion',
      description: 'calle'
    }
    ,
    14: {
      val: 'ubicacion_estado',
      description: 'estado'
    }
    ,
    15: {
      val: 'colonia',
      description: 'colonia'
    }
    ,
    16: {
      val: 'municipio',
      description: 'Delegacion o municipio'
    }
    ,
    17: {
      val: 'zip',
      description: 'codigo postal'
    }
  }
}
export default module;