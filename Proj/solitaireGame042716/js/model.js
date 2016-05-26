

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
//class for card objects
function card( strName, boolHidden ) {
    this.name=strName; // private member only available within the constructor fn
    this.hidden=boolHidden;
    this.info = function() {
        return this.name + ": " + this.hidden;
    };
}
var Model_main = new function(){
    this.init=function( deck ){//28 cards in main stack, 24 in deal stack
        //console.log( deck );
        this.stack=[];
        for( var i=0; i<7; i++){
            this.stack[i]=[];
        }
        var j, k=0, hidden;
        for( i=0; i<7; i++){
            for( j=i; j>=0; j--, k++){
                //console.log( k.toString() + deck[k] );
                hidden = ( j != 0 );
                this.stack[i].push( new card( deck.pop(), hidden ) );
            }
        }
    };
    this.pullTop=function( i ){   
        return this.stack[i].pop();
    };
    this.pullChunk=function( i, startCard ){
        //console.log("model.pullchunk(): i="+i+" startCard="+startCard);
        var temp, out=[];
        do{
           temp=this.stack[i].pop();
           out.push( temp );
        }
        while( temp.name != startCard && this.stack[i].length );
        out.reverse();
        return out;
    };
    this.pushTop=function( card, index ){
        this.stack[index].push( card );
    };
    this.concat=function( arrayFrom, index ){
        this.stack[index] = this.stack[index].concat( arrayFrom );
    };
    this.turnCardUp=function( i ){
        var j = this.stack[i].length-1;
        this.stack[i][j].hidden=false;
    };
    this.sourceIsTop=function( src, index ){
        //console.log( "src="+src+" index="+index );
        return this.stack[index][ this.stack[index].length-1 ].name==src;
    };
    this.save=function(){
        for( var i=0; i<7; i++){
            if( !this.stack[i].length ){
                console.log( "main stack" );
                console.log( JSON.stringify( this.stack ) );
                break;
            }
        }

        localStorage.setItem( "bool", "TRUE" );
        localStorage.setItem( "mainStack", JSON.stringify( this.stack ) );
//        var j, jLen, jsons=[];
//        for( var i=0; i<7; i++){
//            jLen=this.stack[i].length;
//            jsons[i]={};
//            for( j=0; j<jLen; j++ ){
//                jsons[i][ j.toString() ]=JSON.stringify( this.stack[i][j] );
//            }
//        }
//        for( i=0; i<7; i++){
//            localStorage.setItem( i.toString(), JSON.stringify( jsons[i] ) );
//        }
    };
    this.restore=function(){
        var stackStr=localStorage.getItem("mainStack");
        stackStr = stackStr.replace("\\u0000/g", "");
        this.stack=JSON.parse( stackStr );
    };
};
var Model_deal = new function(){
    this.init=function( deck ){//28 cards in main stack, 24 in deal stack
        this.dealStack=[];
        this.pullStack=[];
        while( deck.length ){
            this.dealStack.push( new card( deck.pop(), false ) );
        }
    };
    this.advance = function(){
        if( this.dealStack.length <= 0){
            this.dealStack=this.pullStack;
            this.pullStack=[];
        }
        for( var i=0; i<3 && this.dealStack.length; i++){
            this.pullStack.push( this.dealStack.pop() );
        }
    };
    this.top = function(){
        if( this.pullStack.length <= 0 ){
            return false;
        }
        return this.pullStack[ this.pullStack.length -1 ];
    };
    this.status_deal=function(){
        return this.dealStack.length;
    };
    this.status_pull=function(){
        return this.pullStack.length;
    };
    this.pull=function(){
        return this.pullStack.pop();
    };
    this.cheat=function(){
        shuffle( this.dealStack );
    };
    this.save=function(){
        localStorage.setItem( "dealStack", JSON.stringify( this.dealStack ) );
        localStorage.setItem( "pullStack", JSON.stringify( this.pullStack ) );
    };
    this.restore=function(){
        var dealStr= localStorage.getItem("dealStack");
        if( dealStr ){
            dealStr = dealStr.replace("\\u0000/g", "");
            this.dealStack=JSON.parse( dealStr );
        }
        else{
            this.dealStack=[];
        }
        var pullStr= localStorage.getItem("pullStack");
        if( pullStr){
            pullStr = pullStr.replace("\\u0000/g", "");
            this.pullStack=JSON.parse( pullStr );
        }
        else{
            this.pullStack=[];
        }
    };
};
var Model_aces=new function(){
    this.init=function(){//28 cards in main stack, 24 in deal stack
        this.stack=[];
        for( var i=0; i<4; i++){
            this.stack[i]=[];
        }
    };
    this.pushTop=function( card, index ){
        this.stack[index].push( card );
    };
    this.save=function(){
        localStorage.setItem( "acesStack", JSON.stringify( this.stack ) );
    };
    this.restore=function(){
        var stackStr= localStorage.getItem("acesStack");
        if( stackStr.length<13 ){
            this.init();
        }
        else{
            stackStr = stackStr.replace("\\u0000/g", "");
            this.stack=JSON.parse( stackStr );
        }
    };
};


