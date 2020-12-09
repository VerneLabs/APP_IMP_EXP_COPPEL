/*
This is the first JavaScript file that runs once your iframe is loaded within a Zendesk product.
*/
/* eslint-disable no-unused-vars */

// Este es el archivo que corre la aplicación al iniciar

//Carga de dependencias y componentes
import I18n from 'i18n';
import LegacyApp from './legacy_app';
import React from 'react';
import {render} from 'react-dom';
import Home from './home' //componente home en javascripts/home.js

const app = document.getElementById('app'); //referencia a aelemento html llamado #app
render(<Home/>, app); //render de react para el componente HOME
