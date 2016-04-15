//to add an ace : document.getElementById("a2").src = "images/c3.png";
function addImage(){
    //dynamically add an image and set its attribute
    var img=document.createElement("img");
    img.src="images/c1.png"
    img.id="m11"
    document.getElementById("m1").appendChild(img);
}
var MainStack = new function(){
    var self=this;
    this.clearCard=function( stackIndex, cardIndex ){
        var deleteMe = document.getElementById( "m"+stackIndex+"_"+cardIndex );
        deleteMe.parentNode.removeChild( deleteMe );
    }
    this.clearStack = function(){
        if( !Model.mainStack ){//if no game in progress
            //console.log("view.clearstack: no stack");
            return;
        }
        var stack = Model.mainStack;
        var j, jLen, deleteMe;
        for( var i=0; i<7; i++){//parse main stack 0-6 left to right
            jLen = stack[i].length;
            if( !jLen ){//if no cards in stack, keep placeholder, render empty card
                deleteMe = document.getElementById( "m"+i+"_n" );
                deleteMe.parentNode.removeChild( deleteMe );
            }
            for( j=0; j<jLen; j++){
                if( stack[i][j].hidden ){//if hidden, skip
                    if( j == jLen-1 ){//unless it's the top of the stack, then render h card
                        deleteMe = document.getElementById( "m"+i+"_"+j );
                        deleteMe.parentNode.removeChild( deleteMe ); 
                    }
                }
                else{
                    deleteMe = document.getElementById( "m"+i+"_"+j );
                    deleteMe.parentNode.removeChild( deleteMe ); 
                }
            }
        }
    }
    this.renderCard = function( stackIndex, cardIndex, name, first, top ){
        /**/
        var stackId="m"+stackIndex;
        var cardId=stackId+"_"+cardIndex;
        var addId=stackId;
        addId += ( first )? "a0" : "a1";
        var cardSize=( top )?"w" : "p"
        var path = "cards/"+cardSize+name+".png";
        //console.log( stackId+"....."+cardId+"....."+addId+"....."+path );
        var img=document.createElement("img");
        img.src=path;
        img.id=cardId;
        //img.width="79";
        //img.height="123";
        img.className="showCards";
        document.getElementById(addId).appendChild(img);
    }
    this.renderStack = function(){
//        self.renderCard(0, 0, "h1", true, false);
//        self.renderCard(0, 1, "h2", false, true);
//        return;
        var j, jLen, lastHid;
        var stack = Model.mainStack;
        //dispStack( stack, "View!!" );
        //console.log( "StackFileNames" );
        for( var i=0; i<7; i++){//parse main stack 0-6 left to right
            jLen = stack[i].length;
            //console.log( "Stack=" + i );
            
            if( !jLen ){//if no cards in stack, keep placeholder, render empty card
                self.renderCard( i, "n", "0", true, true );
            }
            lastHid=true;
            for( j=0; j<jLen; j++){
                if( stack[i][j].hidden ){//if hidden, skip
                    if( j == jLen-1 ){//unless it's the top of the stack, then render h card
                        self.renderCard( i, j, "h", true, true );
                    }
                }
                else if( lastHid ){//first non-hidden card
                    lastHid=false;
                    self.renderCard( i, j, stack[i][j].name, true, ( j == jLen-1 ) );
                }
                else {//subsequent non-hidden card
                    self.renderCard( i, j, stack[i][j].name, false, ( j == jLen-1 ) );
                }
            }
        }
        
    }
    this.setInfo = function(){
        var stack = Model.mainStack, numHidden;
        for( var i=0; i<7; i++){
            numHidden = stack[i].length;
            if( numHidden ){
                numHidden-=1;
            }
            document.getElementById("mi"+i).innerHTML = numHidden + " hidden";
        }
    }
}
var DealStack = new function(){
    var self=this;
    this.renderStack=function(){
        
    }
    this.setInfo = function(){
        var stack = Model.dealStack;
        document.getElementById("di0").innerHTML = stack.length + " hidden";
    }
}
var Header = new function(){
    var list=[
        "it's fun",
        "it means something sad in French",
        "you've got nothing better to do",
        "go ahead and cheat",
        "because you have no friends",
        "too much time on your hands",
        "really?",
        "a sad, lonely game",
        "nobody can see you cheat",
    ];
    this.renderText = function(){
        var ran=Math.floor(Math.random() * (list.length))
        var slogan = list[ran];
        document.getElementById("slogan").innerHTML = "Solitaire..." + slogan;
    }
}


