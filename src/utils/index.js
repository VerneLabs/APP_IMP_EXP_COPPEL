import * as Papa from 'papaparse'
import columnsName from '../javascripts/catalogs/columns-name'

module.exports = {
  papaUnparse (data) {
    const csv = Papa.unparse({
      fields: [...columnsName],
      data
    })

    return csv
  },
  slugify (text) {
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
    const to = 'aaaaeeeeiiiioooouuuunc------'
    for (var i = 0, l = from.length; i < l; i++) {
      text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }

    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/[^-A-Za-z0-9]+/g, '-')
  },
  generateUniqueId (item) {
    const {
      Estatus,
      CodProductoComercial,
      NroPoliza,
      Sufijo,
      NroEndoso,
      NroCuota,
      cod_ind_pagador: payerNumber
    } = item

    return [
      Estatus,
      CodProductoComercial,
      NroPoliza,
      Sufijo,
      NroEndoso,
      NroCuota,
      payerNumber
    ].join('-')
  },
  chunkArray (myArray, chunkSize) {
    var index = 0
    var arrayLength = myArray.length
    var tempArray = []

    for (index = 0; index < arrayLength; index += chunkSize) {
      let myChunk = myArray.slice(index, index + chunkSize)
      tempArray.push(myChunk)
    }
    return tempArray
  }
}
