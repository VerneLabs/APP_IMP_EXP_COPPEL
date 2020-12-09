/* eslint-disable react/prop-types */
import React from 'react';

//Componente homelayout, hace render del children que se le pase
function HomeLayout(props){
  return (
    <section>
      {props.children}
    </section>
  )
}

export default HomeLayout;
