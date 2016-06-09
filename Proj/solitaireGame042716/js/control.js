
function wantsNew(){
    var url=window.location.href;
    var get=url.split("?");
    if( get.length==2 ){
        var pairs=get[1].split("=");
        if( pairs.length==2 ){
            return pairs[1]=="n";
        }
    }
    return false;
}
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
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
function allowDrop(event) {
    event.preventDefault();
}
function nameFromPath( path ){
    var junk=path.split('/');
    var len=junk.length;
    if( len > 1){
        var pairs=junk[ len-1 ].split(".");
        if( pairs.length==2 ){
            //console.log("nameFromPath() valid path="+path);
            return pairs[0].substr(1, 2);
        } 
    }
    //console.log("nameFromPath() returned path="+path);
    return path;
}
function indexFromID( id ){
    //file:///C:/xampp/htdocs/Pretty/cards/ws5.png
    var junk=id.split('_');
    var len=junk.length;
    if( len > 1){
        return parseInt( junk[ len-1 ] );
    }
    return 0;
}
var Rules = new function(){
    this.dealToAces=function( src_from, src_to ){
        //console.log( "dealToAces() src_from: "+src_from+ " to aces src_to:"+src_to );
        return( 
            src_from != 0 && 
            (
                (src_from[1]==1 && src_to==0) ||
                (src_from[0]==src_to[0] && src_from[1]-src_to[1]==1)
            )
        )
    };
    this.mainToAces=function( src_from, src_to ){
        //console.log( "mainToAces() src_from: "+parseInt( src_from[1], 16 )+ " src_to:"+parseInt( src_to[1], 16 ) );
        if( src_from == 0 || src_from == 'h' ){return false;}
        return( 
            src_from != 0 && src_from != 'h' &&
            (
                (src_from[1]==1 && src_to==0) ||
                (src_from[0]==src_to[0] && ( parseInt( src_from[1], 16 ) - parseInt( src_to[1], 16 ) )==1)
            )
        )
    };
    this.dealToMain=function( src_from, src_to ){
        var color_from=( src_from[0]=='d' || src_from[0]=='h');
        var color_to=( src_to[0]=='d' || src_to[0]=='h');
//        console.log( "dealToMain() src_from: "+src_from+ ", src_to:"+src_to +
//            ", color_from: "+color_from+ ", color_to:"+color_to );
        return( 
            src_from != 0 && src_from != 'h' &&
            (
                (src_from[1]=='d' && src_to==0) ||
                (
                    color_from != color_to && 
                    parseInt( src_to[1], 16 ) -parseInt( src_from[1], 16 )==1
                )
            )
        );
    };
    this.mainToMain=function( src_from, src_to ){
        var color_from=( src_from[0]=='d' || src_from[0]=='h');
        var color_to=( src_to[0]=='d' || src_to[0]=='h');
//        console.log( "mainToMain() src_from: "+src_from+ ", src_to:"+src_to +
//            ", color_from: "+color_from+ ", color_to:"+color_to );
        return( 
            src_from != 0 && src_from != 'h' &&
            (
                (src_from[1]=='d' && src_to==0) ||
                (color_from != color_to && parseInt( src_to[1], 16 ) -parseInt( src_from[1], 16 )==1)
            )
        );
    };
};
var Control = new function(){
    this.init = function(){
        this.id_from=0;//init vars here
        this.sourceFrom=0;//init vars here
        if( localStorage && localStorage.getItem('acesStack') ){
            //console.log("control: found storage!!!");
            Model_main.restore();
            Model_deal.restore();
            Model_aces.restore();
            Header.renderText();
            View_main.render();
            View_main.setInfo();
            View_deal.render();
            View_deal.setInfo();
            View_aces.render();
            View_aces.setInfo();
        }
        else{
            this.newGame();
        } 
    };
    this.newGame=function(){
        Header.renderText();
        View_main.clear();
        var deck = newDeck();
        //console.log( deck );
        
        Model_main.init( deck );
        Model_deal.init( deck );
        Model_aces.init();
        View_main.render();
        View_main.setInfo();
        Model_deal.advance();
        View_deal.render();
        View_deal.setInfo();
        View_aces.render();
        View_aces.setInfo();
        Model_main.save();
        Model_deal.save();
        Model_aces.save();
        //document.write("control: newGame()!!!");
    };
    this.advance = function(){
        Model_deal.advance();
        View_deal.render();
        View_deal.setInfo();
        Model_main.save();
        Model_deal.save();
        Model_aces.save();
    };
    this.cheat=function(){
        Model_deal.cheat();
        Model_deal.advance();
        View_deal.render();
        View_deal.setInfo();
        Model_main.save();
        Model_deal.save();
        Model_aces.save();
        //document.write("control: cheat()!!!");
    };
    this.saveIdFrom=function( setIdFrom, path ){
        this.id_from=setIdFrom;
        this.sourceFrom=path;//nameFromPath( path );
    };
    this.moveToAces=function( id_to, path_to ){
        if( !this.id_from ){
            return;
        }
        var card, index=parseInt( id_to.substr(1,1) ),src_to =nameFromPath( path_to );
//        console.log( "sourceFrom: "+this.sourceFrom+", id_from: "+this.id_from+
//            " to aces source:"+src+", aces id: "+id_to );
        if( this.id_from === "d1"){
            this.sourceFrom=nameFromPath( this.sourceFrom );
            if( Rules.dealToAces( this.sourceFrom, src_to ) ){
                card = Model_deal.pull();
                Model_aces.pushTop( card, index );
                View_deal.render();
                View_deal.setInfo();
                View_aces.render();
                View_aces.setInfo();
            }
        }
        else{
            if(  Rules.mainToAces( this.sourceFrom, src_to ) &&
                Model_main.sourceIsTop( this.sourceFrom, parseInt( this.id_from[0] ) )
            ){
                View_main.clear();
                card = Model_main.pullTop( parseInt( this.id_from[0] ) );
                Model_aces.pushTop( card, index );
                View_main.render();
                View_main.setInfo();
                View_aces.render();
                View_aces.setInfo();
            }
        }
        this.id_from=0;
        this.sourceFrom=0;
        Model_main.save();
        Model_deal.save();
        Model_aces.save();
    };
    this.moveToMain=function( id_to, src_to ){//id to in this case is a number, so no manipulation is needed
        var card;//, src_to=nameFromPath( path_to );
//        console.log( "sourceFrom: "+this.sourceFrom+", id_from: "+this.id_from+
//            ", id_to: "+id_to+ " src_to:"+src_to );
        if( this.id_from === "d1"){
            this.sourceFrom=nameFromPath( this.sourceFrom );
            if( Rules.dealToMain( this.sourceFrom, src_to ) ){
                View_main.clear();
                card = Model_deal.pull();
                card.hidden=false;
                Model_main.pushTop( card, id_to );
                View_main.render();
                View_main.setInfo();
                View_deal.render();
                View_deal.setInfo();
            }
        }
        else{
            if( Rules.mainToMain( this.sourceFrom, src_to ) ){
                View_main.clear();
                card = Model_main.pullChunk( parseInt( this.id_from[0] ), this.sourceFrom );
                Model_main.concat( card, id_to );
                View_main.render();
                View_main.setInfo();
            }
        }
        Model_main.save();
        Model_deal.save();
        Model_aces.save();
        this.id_from=0;
        this.sourceFrom=0;
    };
    this.turnCardUp=function( index ){
        //console.log( "index="+index);
        View_main.clear();
        Model_main.turnCardUp( index );
        View_main.render();
        View_main.setInfo();
        Model_main.save();
        Model_deal.save();
        Model_aces.save();
    };
};







