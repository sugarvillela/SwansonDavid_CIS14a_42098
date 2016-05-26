/* view.js contains singleton classes to render model data to html elements in the 
 * form of png images of cards */
var View_main = new function(){
    var self=this;
    this.clear = function(){
        if( !Model_main.stack ){
            /* If no game in progress */
            return;
        }
        /* main.stack is 2-d array of card objects. i and j loops cycle through
         * each card and remove by id, in preparation for re-rendering altered
         * contents of the mainstack array*/
        var stack = Model_main.stack;
        var j, jLen, deleteMe;
        for( var i=0; i<7; i++){//parse main stack 0-6 left to right
            jLen = stack[i].length;
            if( !jLen ){
                /* case 1: j array is empty, so card img is named n */
                deleteMe = document.getElementById( i+"_n" );
                deleteMe.parentNode.removeChild( deleteMe );
            }
            for( j=0; j<jLen; j++){
                if( stack[i][j].hidden ){//if hidden, skip
                    /* case 2: card 'hidden' is set, so no img has been rendered. Skip it */
                    if( j == jLen-1 ){
                        /* case 3: hidden, but at top of deck, so a facedown image is rendered */
                        deleteMe = document.getElementById( i+"_"+j );
                        deleteMe.parentNode.removeChild( deleteMe ); 
                    }
                }
                else{
                    /* case 4: all other cards are rendered and can be deleted without error */
                    deleteMe = document.getElementById( i+"_"+j );
                    deleteMe.parentNode.removeChild( deleteMe ); 
                }
            }
        }
    }
    this.renderCard = function( i, j, name, first, top ){
        /* build ids for img tags to be added:  */
        var cardId=i+"_"+j;
        /* Find the id of the add div. All cards but first are sent to add_stem */
        var addId=( first )? i+"_add_root" : i+"_add_stem";
        /* Choose size: all cards except top card are rendered as partial images */
        var cardSize=( top )?"w" : "p"
        /* build path to image, based on card name */
        var path = "cards/"+cardSize+name+".png";
        /* Now create img tag and add attributes */
        var img=document.createElement("img");
        img.src=path;
        img.id=cardId;
        img.className="showCards";
        /* 'h' means facedown card. Clicking it flips it over */
        if( name=='h'){
            img.addEventListener('click', function () {
                Control.turnCardUp( i );
            }); 
        }
        /* Add drag and drop to rendered images */
        img.addEventListener('dragstart', function () {
            /* On dragstart, save the card data */
            Control.saveIdFrom( cardId, name );//path
        });
        img.addEventListener('dragover', function () {
            allowDrop(event);
        });
        img.addEventListener('drop', function () {
            Control.moveToMain( i, name );
        });
        document.getElementById(addId).appendChild(img);
    }
    /* View_main.render():  Parse through main.stack (2-d array of card objects)
     * and render an appropriate image in the right spot */
    this.render = function(){
        var j, jLen, lastHid;
        var stack = Model_main.stack;
        for( var i=0; i<7; i++){//parse main stack 0-6 left to right
            jLen = stack[i].length;           
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
        var stack = Model_main.stack, j, jLen;
        for( var i=0; i<7; i++){
            jLen=stack[i].length;
            j=0;
            while(j<jLen && stack[i][j].hidden){
                j++;
            }
            document.getElementById("mi"+i).innerHTML = j + " hidden";
        }
    }
}
var View_deal = new function(){
    this.render=function(){
        var path0, width0, height0, path1;
        if( Model_deal.status_deal() ){
            path0="cards/stack.png"
            width0="85";
            height0="129";
        }
        else{
            path0="cards/w0.png?gggg"
            width0="79";
            height0="123";
        }
        document.getElementById("d0").src = path0;//just change existing image
        document.getElementById("d0").width=width0;
        document.getElementById("d0").height=height0;
        var top = Model_deal.top();
        if( top ){
            path1="cards/w"+top.name+".png"
        }
        else{
            path1="cards/w0.png"
        }
        document.getElementById("d1").src = path1;//just change existing image
    }
    this.setInfo = function(){
        document.getElementById("di0").innerHTML = Model_deal.status_deal() + " hidden";
        var hid=Model_deal.status_pull()-1;
        if(hid<0){
            hid=0;
        }
        document.getElementById("di1").innerHTML = hid + " hidden";
    }
}
var View_aces = new function(){
    this.render=function(){
        var path, jLen, acesStack=Model_aces.stack;
        for( var i=0; i<4; i++){
            jLen=acesStack[i].length;
            if( jLen ){
                path="cards/w"+acesStack[i][jLen-1].name+".png";
               
            }
            else{
                 path="cards/w0.png";
            }
            document.getElementById("a"+i).src = path;
        }
    }
    this.setInfo = function(){
        var stack = Model_aces.stack, jLen, hidden;
        for( var i=0; i<4; i++){
            jLen=stack[i].length;
            hidden=( jLen )? jLen-1 : 0;
            document.getElementById("ai"+i).innerHTML = hidden + " hidden";
        }
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
        "fun for the whole family",
        "AKA frustration",
    ];
    this.renderText = function(){
        var ran=Math.floor(Math.random() * (list.length))
        var slogan = list[ran];
        document.getElementById("slogan").innerHTML = "Solitaire..." + slogan;
    }
}