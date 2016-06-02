function valLoginText(  ){
    /* Called on key-up. Shows submit button on valid input. Hides if invalid */
    var email=document.getElementById('email').value;
    var password=document.getElementById('password').value;
    document.getElementById('login_submit').style.visibility= 
        ( 
            email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$") &&
            password.length>0
        )? 'visible' : 'hidden';
}
function checkLoginData(){//user@mail.com bonkers
    var email=document.getElementById('email').value;
    var password=jStrHash( document.getElementById('password').value );
    var name=document.getElementById('name').value;
    if( localStorage ){
        var stored = localStorage.getItem( email );
        if( stored ){
            console.log( "Exist "+ stored );
            console.log( "Hash "+ password );
            //localStorage.removeItem( email );
            //localStorage.removeItem( password );
            if( stored==password ){
                console.log( "Matches " );
                if( name.length ){
                    console.log( "Save name to old: "+name );
                    localStorage.setItem( email+password, name );
                }
                else{
                    name=localStorage.getItem( email+password );
                    console.log( "Exist name "+ name );
                }
                
                

                window.location = ( name )? "survey.html?user="+name : "survey.html";
            }
            else{
                alert( "Bad username or password" );
            }
        }
        else{
            console.log( "Setting items: "+email+", "+ password );
            localStorage.setItem( email, password );//save password to unique email
            if( name.length ){
                console.log( "Save new name: "+name );
                localStorage.setItem( email+password, name );
                window.location = "survey.html?user="+name;
            }
            else{
                window.location = "survey.html";
            }
            //localStorage.setItem( password, email );
        }
    }
}
function jStrHash(str){
    var hash = 0;
    var len = str.length;
    for (var i = 0; i < len; i++){
        var ch = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+ch;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash & 0x7FFFFFFF;
}
function checkGet(){
    var info=window.location.href;
    info=info.split("?");
    if( info.length==2 ){
        info=info[1].split("=");
        if( info.length==2 ){
            Model.userName=info[1].replace("#", "");
            document.getElementById("greeting").innerHTML=
                "Welcome <b>"+Model.userName+"</b>!";
        }
    }
}
var Model=new function(){
    //Question and answer text; in a real app, replace this with ajax
    this.userName="";
    this.questionList=function(){
        var list=
        [
            {
                question: "How large is the Military Budget?",
                answers: 
                [
                    "Greater than 20% of the Federal Budget",
                    "Less than 20% of the Federal Budget"
                ],
                key: 1
            },
            {
                question: "How large is NASA's budget?",
                answers: 
                [
                    "Greater than 5% of the Federal Budget",
                    "Less than 5% of the Federal Budget"
                ],
                key: 1
            },
            {
                question: "How large is Welfare and Entitlements?",
                answers: 
                [
                    "Greater than 65% of the Federal Budget",
                    "Less than 65% of the Federal Budget"
                ],
                key: 0
            }
        ];
        return list;
    }
}
var View=new function(){
    this.listToForm=function(){
        this.hideResult();//sets response div to display: none
        var list=Model.questionList(), len=list.length;//needs a properly formatted list
        /* Call addQuestion() to add question text to page. Call addAnswers() to 
         * add button choices */
        for( var i=0; i<len; i++ ){                    //Use i+1 to add question number
            this.addQuestion( i+1, list[i].question );  //question is a string
            this.addAnswers( i+1, list[i].answers );    //answers is an array
        }
    }
    this.addQuestion=function( qNum, qText ){
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
    this.addAnswers=function( qNum, aList ){
        /* appends elements to last fieldset added
         * generates ids and names based on question number 
         * radio button generates value by index */
        var fs=document.getElementById( 'fs'+qNum );
        fs.appendChild(document.createElement("br"));
        var radio, label, len=aList.length;
        for( var i=0; i<len; i++ ){
            radio = document.createElement("INPUT");
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", "r"+qNum);
            radio.setAttribute("value", i.toString() );
            label = document.createElement("LABEL");
            label.innerHTML="&nbsp;&nbsp;"+aList[i];
            fs.appendChild( radio );
            fs.appendChild( label );
            fs.appendChild(document.createElement("br"));
        }
        fs.appendChild(document.createElement("br"));
    }
    this.dispResult=function( list, score ){
        /* Precondition: array of objects now has 'choice' and 'correct' fields set.
         * Display results in formatted html */
        document.getElementById("score").innerHTML = 
            Model.userName + "'s score: " + score.toFixed(0) + "%";
        var len=list.length, str;
        str='<table class="table">';
        for( var i=0, qNum=1; i<len; i++, qNum++ ){
            str+="<tr>"+
                "<th>Question&nbsp;"+qNum+"</th>"+
                "<td>"+list[i].question+"</td>"+
                "<th></th>"+
                "<td>You answered:&nbsp;&nbsp;"+list[i].answers[ list[i].choice ];
            if( list[i].correct ){
                str+='&nbsp;&nbsp;<font color="green">Correct</font></td>';
            }
            else{
                str+='&nbsp;&nbsp;<font color="red">Incorrect</font></td>';
            }
            str+="</tr>";
        }
        str+="</table>";
        document.getElementById("result").innerHTML = str;
        document.getElementById("form").style.display="none";
        document.getElementById("response").style.display="block";
        
    }
    this.hideResult=function(){
        document.getElementById("response").style.display="none";
        document.getElementById("form").style.display="block";
    } 
}
var Control=new function(){
    this.submit=function(){
        /* First get choices from form */
        var group, list=Model.questionList(), len=list.length, score=0;
        for(var i=1, n=0;i<=len;i++){//start at 1     
            group = document.getElementsByName("r"+i);
            for(var j = 0; j < group.length; j++) {
                if( group[j].checked == true ) {
                    n++;
                    list[i-1].choice=group[j].value;
                }
            }
        }
        /* Check for choices length */
        if( n == len ){
            document.getElementById("message").innerHTML = '';
        }
        else{//user didn't answer all the questions
            document.getElementById("message").innerHTML = '<font color="red">Please answer all questions</font>';
            return; 
        }
        /* Score the test, save result in same list object */
        for( i=0; i<len; i++ ){
            if( list[i].choice==list[i].key){
                list[i].correct=true;
                score++;
            }
            else{
                list[i].correct=false;
            }
        }
        score=( score/len )*100;
        /* Send to view for display */
        View.dispResult( list, score );
    }
}