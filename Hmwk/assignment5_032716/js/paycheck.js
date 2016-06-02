function valNumeric(  ){
    /* Called on key-up. Shows submit button on valid input. Hides if invalid */
    var hrs=document.getElementById('hrs').value;
    var rate=document.getElementById('rate').value;
    var taxRate=document.getElementById('taxRate').value;
    var regEx = /^[0-9]*[.]?[0-9]+$/g;
    document.getElementById('submit').style.visibility= 
        (hrs.match( regEx ) && rate.match( regEx ) && 
        taxRate.match( regEx ) && taxRate<100 )? 
        'visible' : 'hidden';
}
var C=new function(){
    //set global variables: double time and triple time thresholds
    //Tax rate is set on index page, as default value of tax rate text input
    this.dtThresh=20;
    this.ttThresh=40;
}
//payRow: returns object containing data based on parameters: hrs and rate
function payRow( hrs, rate, taxRate ) {
    var gross;
    if( hrs < C.dtThresh ){
        gross=hrs*rate;
    }
    else if (hrs < C.ttThresh ){
        gross=C.dtThresh*rate+2*rate*(hrs - C.dtThresh);
    }
    else{
        gross=C.dtThresh*rate+(C.ttThresh-C.dtThresh)*rate*2+3*rate*(hrs - C.ttThresh);  
    }            
    var out = {
        hours_worked: hrs.toFixed(2),
        pay_rate: rate.toFixed(2),
        gross_pay: gross.toFixed(2),
        taxes: ( gross*taxRate ).toFixed(2),
        net_pay: ( gross-( gross*taxRate ) ).toFixed(2)
    }
    return out;
}
//toTableHead: get field names of object and format into table headings
function toTableHead( obj ){
    var out="<tr>";
    for (var prop in obj) {
      out+="<th>" + prop.replace("_", " ").toUpperCase() +"</th>";
    }
    return out+"</tr>";
}
//toTableHead: get field values of object and format into table elements
function toTableRow( obj ){
    var out="<tr>";
    for (var prop in obj) {
      out+="<td>" + obj[prop] + "</td>";
    }
    return out+"</tr>";
}
//toTable: convert an array of objects to a formatted table based on 
//field names and values
function toTable( arr ){
    var len=arr.length;
    if( !len ){return "";}
    var str="<table border='1'>"
    str+=toTableHead( arr[0] );
    for( var i=0;i<len;i++ ){
        str+=toTableRow( arr[i] );
    }
    str+="</table>";
    return str;
}

function testPaycheck(){
    //Test above functions with random inputs
    var hrs=document.getElementById('hrs').value;
    var rate=document.getElementById('rate').value;
    var taxRate=document.getElementById('taxRate').value;
    taxRate/=100;
    
    var rows=[ payRow( hrs-0, rate-0, taxRate-0 ) ], str="<h4>Your Paycheck:</h4>";
    str+=toTable(rows)+"</br>";
    document.getElementById( "jsOut" ).innerHTML=str;
}


