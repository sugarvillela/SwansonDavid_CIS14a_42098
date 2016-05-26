var tSize=0;
function initSize(){
    if( tSize ){
        document.getElementById("addHere").innerHTML = "";
        document.getElementById("addButton").innerHTML = "";
        document.getElementById("jsOut").innerHTML = "";
    }
    tSize=document.getElementById('size_box').value;
    //console.log( "testSize="+tSize );
    var label, input, br;
    var addHere=document.getElementById( "addHere" );
    //addHere.appendChild( document.createElement("br") );
    for(var i=0; i<tSize; i++){
        //itemNumber=i+1;
        label=document.createElement("label");
        //label.id="l"+i.toString();
        label.innerHTML="Item "+(i+1).toString() + " (Integer or Float)";
        //label.className="form-control";
        input=document.createElement("input");
        input.id=i.toString();
        input.className="form-control";
        input.addEventListener('keyup', function () {
            valFloats();
        });
        addHere.appendChild( label );
        addHere.appendChild( input );
        addHere.appendChild( document.createElement("br") );
    }
    //addHere.appendChild( document.createElement("br") );
    var button=document.createElement("button");
    button.className="btn btn-default";
    button.innerHTML="Calculate!";
    button.id="nums_submit";
    button.style.visibility="hidden";
    button.addEventListener('click', function () {
        handleSubmit();
    });    
    document.getElementById('addButton').appendChild( button );
    document.getElementById('size_submit').style.visibility="hidden";
}
function valInt( value ){
    document.getElementById('size_submit').style.visibility= 
        ( value.match("^[1-9]+[0-9]*$") )? 'visible' : 'hidden';
}
function valFloats(){
    var value, good=true;
    for(var i=0; i<tSize; i++){
        value=document.getElementById( i.toString()).value;
        if( !value.match("[0-9]") ){
            good=false;
        }
    }
    document.getElementById('nums_submit').style.visibility= 
        ( good )? 'visible' : 'hidden';
}
function handleSubmit(){
    //console.log( "Handle Submit" );
    var nums=[];
    for(var i=0; i<tSize; i++){
        nums.push( parseFloat( document.getElementById( i.toString()).value ) );
    }
    var avg=average( nums );
    //console.log( nums );
    document.getElementById('jsOut').innerHTML=
        '<h1>Results</h1><dl><dt>Numbers submitted:</dt><dd>'+
        nums +
        '</dd><dt>Mean (Average)</dt><dd>'+ 
        avg + 
        '</dd><dt>Standard Deviation</dt><dd>'+ 
        standardDeviation( nums, avg ) + 
        '</dd></dl>' ;
}
function average( nums ){
    var sum=0, n=nums.length;
    if( n < 1 ){return 0;}
    for(var i=0; i<n; i++){
        sum+=nums[i];
    }
    return sum/n;  
}
function standardDeviation( nums, avg ){
    //v//ar nums=[ 1,5,3,2,4];
    var stDev=0, n=nums.length;
    if( n < 2 ){return 0;}
    //console.log( "average="+avg );
    for(i=0; i<n; i++){
        stDev+=Math.pow( nums[i]-avg , 2);
    }
    stDev/=( n-1 );
    stDev=Math.sqrt( stDev );
    //console.log( "stDev="+stDev );
    return stDev;
}

