import React from "react";
import Products from "./products";
import ReactFitText from  'react-fittext';
import { Accordion } from '@zendeskgarden/react-accordions'



const Consigna = ({
  code ,
  place,
  placeCode,
  day ,
  hour ,
  status,
  statusStyle,
  products,
  productData_subtotal,
  productData_totalDiscount,
  productData_totalPrice

}) => {

    
    
        // const [expandedSections, setExpandedSections] = React.useState([0]) = () => setExpandedSections([]);
        // const [isBare, setIsBare] = React.useState(false);
        // const [isCompact, setIsCompact] = React.useState(false);
        // const isExpandAll = expandedSections.length === 5;
        // const isCollapseAll = expandedSections.length === 0;
        // const onExpandAll = () => setExpandedSections([0, 1, 2, 3, 4]);
        // const onCollapseAll = () => setExpandedSections([]);
        // const onChange = index => {
        //   setExpandedSections(sections =>
        //     expandedSections.includes(index)
        //       ? sections.filter(section => section !== index)
        //       : [...expandedSections, index]
        //   );
        // };
       
 
       
    var statusClass = statusStyle + " float-right";
    var ammountProducts = ammountProducts = products.length;
    var ammountProductsText = "";
    if(ammountProducts > 1){
        ammountProductsText = ammountProducts.toString() + " productos";
    }else{
        ammountProductsText = ammountProducts.toString() + " producto";
    }
    // var codeHref = "#"+code;
    if(place==""&&placeCode==""&&document.getElementById("deliveryPlace")){
        document.getElementById("deliveryPlace").style.display = "none";
    }

    function   numberWithCommas(x) {
        x= parseFloat(x).toFixed(2);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    const [expandedSections] = React.useState();
    // const onCollapseAll = () => setExpandedSections([]);

    // setExpandedSections();–
    // function collapseMe(){
    
    // }
    //         function eventFire(el, etype){
    //             if (el.fireEvent) {
    //             el.fireEvent('on' + etype);
    //             } 
    //             else {
    //             var evObj = document.createEvent('Events');
    //             evObj.initEvent(etype, true, false);
    //             // el.dispatchEvent(evObj);
    //             }
    //         }
// let ex =  onCollapseAll;;
  return (
      
      
    // <div className="consigment shadowbox panel">
        <div className="c-callout c-callout--recessed">
  {/* <strong className="c-callout__title">Callout Title</strong> */}
  {/* <p className="c-callout__paragraph">Callout body text...</p> */}
{/* </div> */}



{/* <button hidden
id="collapse"
                size="small"
                onClick={onCollapseAll}
                className="u-mt"
              >


Collapse All</button> */}
              

        <div className="container c-callout__paragraph">
            <div className="row">
                <div className="col-6">
                    <div className="code">{code}</div>
                    
                </div><ReactFitText>

                <div className="col-6">

                    <div className={statusClass}>{status}</div>


                </div></ReactFitText>
            </div>
            <div className="row deliveryPlace" id="deliveryPlace">
                <div className="col-12 lower">
                <p>{placeCode} - {place}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                <p><b>{day}</b> {hour}</p>
                </div>
                {/* <ReactFitText>
                    <div className="col-5">
                        <a className="collapsed pull-right nobreak" data-toggle="collapse" href={codeHref} role="button" aria-expanded="false" aria-controls={code}>
                            {ammountProductsText}<i className="fa fa-angle-up" aria-hidden="true"></i>
                        </a>
                    </div>
                </ReactFitText> */}
            </div>
        </div>

       <div className="divider"/>

        <Accordion 
        level={1}
        expandedSections={expandedSections}
        >
    <Accordion.Section>
      <Accordion.Header>
        <Accordion.Label>{ammountProductsText}</Accordion.Label>
      </Accordion.Header>
      <Accordion.Panel>
         
      <div className="card-body">
            <hr></hr>
  {products.map((product, i) => {return (<div key={i}><Products {...product}/></div>)})}
        </div>
        <div className="col-12">
           <b>Subtotal:</b><b className="float-right">${numberWithCommas(productData_subtotal)}</b><br></br>
            {productData_totalDiscount!=0 &&  <div><span>Total de descuentos:</span><span className="float-right">${numberWithCommas(productData_totalDiscount)}</span></div>}
           <b>Total de consigna:</b><b className="float-right">${numberWithCommas(productData_totalPrice)}</b><br></br>
        </div>
      </Accordion.Panel>
    </Accordion.Section>
  </Accordion> 
  {/* {    setTimeout(function() {document.getElementById('collapse').click();}.bind(this),30)} */}
{/* 
<div className="collapse" id={code}>
  <div className="card-body">
            <hr></hr>
  {products.map((product, i) => {return (<div key={i}><Products {...product}/></div>)})}
        </div>
        <div className="col-12">
           <b>Subtotal:</b><b className="float-right">{numberWithCommas(productData_subtotal)}$</b><br></br>
           <span>Total de descuentos:</span><span className="float-right">{numberWithCommas(productData_totalDiscount)}$</span><br></br>
           <b>Total de consigna:</b><b className="float-right">{numberWithCommas(productData_totalPrice)}$</b><br></br>
        </div>
    </div> */}
</div>
  );
};

export default Consigna;
