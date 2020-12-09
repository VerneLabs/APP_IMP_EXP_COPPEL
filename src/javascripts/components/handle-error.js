/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {Title, Alert} from '@zendeskgarden/react-notifications';


//Componente de handling error global
class HandleError extends Component {

  constructor(props){
    super(props)
    this.state = {
      handleError: false
    }
  }

  componentDidCatch(){
    this.setState({handleError: true})
  }

  render(){
    if(this.state.handleError){
      return (
        // <h4>Global Error</h4>
        <Alert type='error'>
        <Title>Error</Title>
        Algo ocurrio mal
      </Alert>
      )
    }
    return this.props.children
  }
}

export default HandleError
