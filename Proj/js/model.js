function newDeck(){
    var suits=['c','d','h','s'];
    var deck=[];
    var j;
    for( var i=0; i<4; i++){
        for( j=1; j<14; j++){
            deck.push( suits[i] + j.toString( 16 ) );
        }
    }
    shuffle( deck );
    return deck;
}
function shuffle ( array ) {
  var i = 0, j = 0, temp = null;
  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}
function dispStack( array, label ){
    var len= array.length;
    console.log( label );
    for( var i=0; i<len; i++){
        if( Array.isArray( array[i] ) ){
            dispStack( array[i], "Disp: " + i.toString() );
        }
        else{
            console.log( i.toString() + ": " + array[i].info() );
        }
    } 
}
function card( strName, boolHidden ) {
    this.name=strName; // private member only available within the constructor fn
    this.hidden=boolHidden;
    this.info = function() {
        return this.name + ": " + this.hidden;
    }
}
//function newMainStack( deck ){
//    var mainStack=[];
//    for( var i=0; i<7; i++){
//        mainStack[i]=[];
//    }
//    var j, k=0;
//    for( i=0; i<7; i++){
//        for( j=i; j<7; j++, k++){
//            //console.log( k.toString() + deck[k] );
//            mainStack[i].push( new card( deck[k], true ) );
//        }
//    }
//    return mainStack;
//}
var Model = new function(){
    var self=this;

    this.init=function( ){//28 cards in main stack, 24 in deal stack
        this.deck = newDeck();
        console.log( this.deck );
        this.mainStack=[];
        for( var i=0; i<7; i++){
            this.mainStack[i]=[];
        }
        var j, k=0, hidden;
        for( i=0; i<7; i++){
            for( j=i; j>=0; j--, k++){
                //console.log( k.toString() + deck[k] );
                hidden = ( j != 0 )
                this.mainStack[i].push( new card( this.deck[k], hidden ) );
            }
        }
        this.dealStack=[];
        for( i=k; i<52; i++){
            this.dealStack.push( new card( this.deck[i], false ) );
        }
    }
//    this.setAces = function (){
//        document.getElementById("a2").src = "images/c3.png";
//        //document.write( "view!!!!");
//    }
}


