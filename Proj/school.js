//truthRow, truthTable: generates formatted truth table
function truthRow(x, y){
    //populate an array with various boolean operations
    var result=[
        x,
        y,
        ( !x),
        ( !y),
        ( x && y ),
        ( x || y ),
        // xor xy
        (  x ? !y : y  ),   
        // xor xy xor x
        ( (  x ? ! y : y  )? ! y : y  ),
        // xor xy xor y
        ( (  x  ? ! y : y  )? ! x : x  ),
        // !(x&&y)
        ( !(x && y) ),
        // !x || !y
        ( !x || !y ),
        // !(x||y)
        ( !( x || y ) ),
        // !x && !y
        ( !x  && !y )
    ];
    //convert to table-row formatted string
    var len=result.length;
    var rowString='<tr>';
    for (var i=0; i < len; i++){
        rowString+='<td>' + result[i].toString()+ '</td>';
    }
    return rowString+'<tr>';
}

function truthTable(){
    //create test table 11,10,01,00
    var x=[true, true, false, false];
    var y=[true, false, true, false];
    //prepare output: headings
    var out=
        '<table width="200" border="1">'+
        '<tr>'+
        '<th>x</th>'+
        '<th>y</th>'+
        '<th>!x</th>'+
        '<th>!y</th>'+
        '<th>x&amp;&amp;y</th>'+
        '<th>x||y</th>'+
        '<th>x^y</th>'+
        '<th>x^y^x</th>'+
        '<th>x^y^y</th>'+
        '<th>!(x&amp;&amp;y</th>'+
        '<th>!x||!y</th>'+
        '<th>!(x||y)</th>'+
        '<th>!x&amp;&amp;!y</th>'+
        '</tr>';
    //prepare output: results for test table
    for (var i=0; i < 4; i++) {
        out+=truthRow(x[i], y[i]);
    }
    out+='</table>'; 
    //display
    document.write(out);  
}
//payRow thru testPaycheck:  generates pay table
//set global variables: double time and triple time thresholds, tax rate
var dtThresh=20;
var ttThresh=40;
var taxRate=0.1;
//payRow: returns object containing data based on parameters: hrs and rate
function payRow( hrs, rate ) {
    var gross=(hrs < dtThresh)?//hrs < dtThresh 
        hrs*rate :
        (hrs < ttThresh )?
        dtThresh*rate+2*rate*(hrs - dtThresh):
        dtThresh*rate+
        (ttThresh-dtThresh)*rate*2+
        3*rate*(hrs - ttThresh);
    var out = {
        hours_worked: hrs,
        pay_rate: rate,
        gross_pay: gross,
        taxes: gross*taxRate,
        net_pay: gross-( gross*taxRate )
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
    if( !len ){return;}
    var str="<table border='1'>"
    str+=toTableHead( arr[0] );
    for( var i=0;i<len;i++ ){
        str+=toTableRow( arr[i] );
    }
    str+="</table>"
    document.write( str );
}
function testPaycheck(){
    //Test above functions with random inputs
    var rows=[];
    for( var i=0;i<73;i++){
        var r=Math.floor((Math.random() * 70) + 1);
        rows[i]=payRow( i,10 );
    }
    toTable(rows);  
}



