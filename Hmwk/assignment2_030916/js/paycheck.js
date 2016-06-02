var C=new function(){
    //set global variables: double time and triple time thresholds, tax rate
    this.dtThresh=20;
    this.ttThresh=40;
    this.taxRate=0.1;
}
//payRow: returns object containing data based on parameters: hrs and rate
function payRow( hrs, rate ) {
    var gross=(hrs < C.dtThresh)?//hrs < C.dtThresh 
        hrs*rate :
            (hrs < C.ttThresh )?
            C.dtThresh*rate+2*rate*(hrs - C.dtThresh):
                C.dtThresh*rate+
                (C.ttThresh-C.dtThresh)*rate*2+3*rate*(hrs - C.ttThresh);              
    var out = {
        hours_worked: hrs,
        pay_rate: rate,
        gross_pay: gross,
        taxes: gross*C.taxRate,
        net_pay: gross-( gross*C.taxRate )
    }
    return out;
}
function payRow_ifElse( hrs, rate ) {
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
        hours_worked: hrs,
        pay_rate: rate,
        gross_pay: gross,
        taxes: gross*C.taxRate,
        net_pay: gross-( gross*C.taxRate )
    }
    return out;
}
function payRow_switch( hrs, rate ) {
    var gross;
    switch( hrs < C.dtThresh ) {
        case ( true ):
            gross=hrs*rate;
            break;
        default:
            switch( hrs < C.ttThresh ) {
                case ( true ):
                    gross=C.dtThresh*rate+2*rate*(hrs - C.dtThresh);
                    break;
                default:
                    gross=C.dtThresh*rate+(C.ttThresh-C.dtThresh)*rate*2+3*rate*(hrs - C.ttThresh);
            } 
    }          
    var out = {
        hours_worked: hrs,
        pay_rate: rate,
        gross_pay: gross,
        taxes: gross*C.taxRate,
        net_pay: gross-( gross*C.taxRate )
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
    var rows=[], len=64, str="<h4>Using ternary operators:</h4>";
    for( var i=0;i<len;i+=4){
        //var r=Math.floor((Math.random() * 70) + 1);
        rows[i]=payRow( i,10 );
    }
    str+=toTable(rows)+"</br>";
    
    str+="<h4>Using if-else</h4>";
    rows=[];
    for( i=0;i<len;i+=4){
        //var r=Math.floor((Math.random() * 70) + 1);
        rows[i]=payRow_ifElse( i,10 );
    }
    str+=toTable(rows)+"</br>";
    
    str+="<h4>Using switch statement</h4>";
    rows=[];
    for( i=0;i<len;i+=4){
        //var r=Math.floor((Math.random() * 70) + 1);
        rows[i]=payRow_switch( i,10 );
    }
    str+=toTable(rows)+"</br>";
    document.getElementById( "jsOut" ).innerHTML=str;
}


