//Below: Question and answer text; replace this later with ajax?
var qList=function(){
    var list=[
        "How large is the Military Budget?",
        [
            "Greater than 20% of the Federal Budget",
            "Less than 20% of the Federal Budget"
        ],
        "How large is NASA's budget?",
        [
            "Greater than 5% of the Federal Budget",
            "Less than 5% of the Federal Budget"
        ],
        "How large is Welfare and Entitlements?",
        [
            "Greater than 65% of the Federal Budget",
            "Less than 65% of the Federal Budget"
        ]
    ];
    return list;
}
//grading key, must have size equal to number of questions above
var aKey=function(){
    var list=[1,1,0];
    return list;
}
//test the url for get data
function isGet(){
    var url=window.location.href;
    return ( url.indexOf("?")>0 );
}
//below: functions to populate index page; init() called on page load
function init(){
    if( isGet() )//if error, result.html will redirect back to index with get data
    document.getElementById("message").innerHTML = '<font color="red">Please answer all questions</font>';
    listToForm();
}
function listToForm(){//needs a properly formatted list
    /* where list[i] is a string, assume question and call addQuestion() to add
     * question text to page.  Where it is an array, call addAnswers() to 
     * add button choices */
    var list=qList(), iLen=list.length;
    for( var i=0, qNum=0; i<iLen; i++ ){ 
        if( typeof list[i]==="string"){
            qNum++;
            addQuestion( qNum, list[i] );
        }
        else{
            addAnswers( qNum, list[i] )
        }
    }
}
function addQuestion( qNum, qText ){
    /* appends elements to "addTo" div 
     * generates ids for child elements based on question number and type */
    var fs= document.createElement('fieldset');
    fs.id='fs'+qNum;
    fs.className="field_set";
    var legend=document.createElement('legend');
    //legend.id='legend'+qNum;
    legend.innerHTML='Question&nbsp;'+qNum;
    fs.appendChild( legend );
    var label=document.createElement('label');
    //label.id='label'+qNum;
    label.innerHTML=qText;
    fs.appendChild( label );
    document.getElementById("addTo").appendChild( fs );
}
function addAnswers( qNum, aList ){//qList is an array of answer text
    /* appends elements to last fieldset added
     * generates ids and names based on question number 
     * radio button generates value by j index */
    var fs=document.getElementById( 'fs'+qNum );
    fs.appendChild(document.createElement("br"));
    var radio, label, j, jLen=aList.length;
    for( j=0; j<jLen; j++ ){
        //console.log(qList[j]);
        radio = document.createElement("INPUT");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "r"+qNum);
        radio.setAttribute("value", j.toString() );
        label = document.createElement("LABEL");
        label.innerHTML="&nbsp;&nbsp;"+aList[j];
        fs.appendChild( radio );
        fs.appendChild( label );
        fs.appendChild(document.createElement("br"));
    }
    fs.appendChild(document.createElement("br"));
}
//Below: functions for result.html to decode qet data and display result
function getToObj(){
    var url=window.location.href;
    var info=url.split("?");
    var nameValuePairs=info[1].split("&");
    var len=nameValuePairs.length;
    var obj=new Object();
    obj['len']=len-1;//1st is hidden input as placeholder; <2 means no additional data
    for(var i=1;i<len;i++){//start at 1 because of one hidden input
        var map=nameValuePairs[i].split("=");
        var name =map[0];
        var value=map[1];
        obj[name]=value;
    }
    return obj;
}
function handleSubmit(){
    var urObj=getToObj(),key=aKey();
    console.log( urObj['len']+"=="+key.length );
    if( urObj['len'] < key.length ){//user didn't answer all the questions
        window.location.assign("index.html?m=0");
    }
    var list=qList(), qNum=0, iLen=list.length, str, choice;
    str='<table class="table">';
    for( var i=0; i<iLen; i++ ){
        str+="<tr>";
        if( typeof list[i]==="string"){
            
            qNum++;
            str+="<th>Question&nbsp;"+qNum+"</th>";
            str+="<td>"+list[i]+"</td>";
        }
        else{
            choice=urObj[ "r"+qNum ];
            str+="<th></th>";
            str+="<td>You answered:&nbsp;&nbsp;"+list[i][choice];
            if( choice != key[ qNum-1 ] ){
                str+='&nbsp;&nbsp;<font color="red">Incorrect</font></td>';
            }
        }
        str+="</tr>";
    }
    document.getElementById("jsOut").innerHTML = str;
}


