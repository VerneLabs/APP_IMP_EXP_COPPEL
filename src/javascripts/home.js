//Importación de componentes y librerias
import React, {Component} from 'react';
import ZAFClient from 'zendesk_app_framework_sdk';
import HomeLayout from './components/home-layout';
import MainMenu from './pages/mainMenu';
import HandleError from './components/handle-error';
import {ThemeProvider} from '@zendeskgarden/react-theming';

const client = ZAFClient.init(); //client de zendesk framework


//Componente React home
class Home extends Component {
  componentDidMount(){
    // // Resizing de ventana de la aplicaciónusando el client de zendesk
    // client.invoke('resize', { width: '100%', height: '540px' });
    // client.invoke('resize', { width: '100%', height: '79vh' });
  }

  //render principal de la aplicación, si hay un error global hace render de HandleError
  //Home layout que hace render como children de main menu
  //al componente main menu se le pasa como parametro el cliente de zendesk
  //main menu está ubicado en avascripts/pages/mainMenu.js

  render(){
    return (
      <HandleError>
       <ThemeProvider>
        <HomeLayout>
          <MainMenu client={client}/>
        </HomeLayout>
      </ThemeProvider>
    </HandleError>
    )
  }
}

export default Home;
