import React, { Component } from 'react'
import { PALETTE } from '@zendeskgarden/react-theming';
import { Dots } from '@zendeskgarden/react-loaders'

class Loader extends Component {
  render () {
    return       <Dots size={32} color={PALETTE.green[600]} />

  }
}

export default Loader
