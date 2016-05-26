function padL( str, n, padCh ){//can't believe I have to write my own in js'
    padCh=padCh[0];
    n-=str.length;
    var leading="";
    for(var i = 0; i < n; i++){
        leading+=padCh;
    }
    return leading + str;
}
function inArray( needle, haystackArray ){//simple search
    var len=haystackArray.length;
    for (var i = 0; i < len; i++){
        if( haystackArray[i]==needle ){
            return true;
        }
    }
    return false;
}
function arrayToPretty( strArray ){//display an array as a table
    var len=strArray.length;
    var table= '<table class="table table-striped"><tr>';
    for(var i = 0; i < len; i++){//
        if( i%5 == 0 ){
            table+= "</tr><tr>";
        }
        table+= "<td>"+strArray[i]+" </td>";//.padL( this.store[i].toString(2), 8, "0" )
    }
    table+= "</tr></table>";
    return table; 
}
function valIn( value ){
    document.getElementById('size_submit').style.visibility= 
        ( value.match("^[1-9]+[0-9]*$") )? 'visible' : 'hidden';
    //console.log( value );
//    if( value.match("^[1-9]+[0-9]*$") ){
//        //console.log( "good" );
//        document.getElementById('size_submit').style.visibility= 'visible';
//    }
//    else {
//        //console.log( "bad" );
//        document.getElementById('size_submit').style.visibility= 'hidden';
//    }
}
var TestBloom= new function(){
    this.B=false;
    /* Init is not called at instantiation. It is called when user submits a 
     * valid integer for the testSize */
    this.init=function(  ){
        this.testSize=document.getElementById('size_box').value;//already validated
        /* Set up test array of random words to save in bf*/
        var randObj=new randString( this.testSize, false );
        this.goodArray=randObj.getStrArr();
        this.numBytes=randObj.getNumBytes();
        /* Set up same size array, different random words, for false positive test*/
        randObj.init(this.testSize, this.goodArray);
        this.badArray=randObj.getStrArr();
        /* Create and load bf */
        this.B=new BloomFilter( this.goodArray );
        /* Set up view */
        this.showStats=true;
        this.showSource=false;
        this.showBloom=false;
        this.refresh();
    }
    this.calcStats=function(){
        /* Run test */
        var goodPos=0;
        var badNeg=0;
        var badPos=0;
        for (var i = 0; i < this.testSize; i++) {
            if( this.B.find( this.goodArray[i] ) ){
                goodPos++;
            }
            else{
                badNeg++;
            }
        }
        for (i = 0; i < this.testSize; i++) {
            if( this.B.find( this.badArray[i] ) ){
                badPos++;
            }
        }
        var found=100 * ( goodPos )/this.testSize;
        var lost=100 * badNeg/this.testSize;
        var falsePos=100 * badPos/this.testSize;
        var result="InputSize = "+this.numBytes+
                " bytes; bloomSize = "+this.B.getBloomSize()+
                " bits, storeSize = "+this.B.getStoreSize()+" bytes<br>";
        result+="testSize = "+this.testSize+"; goodPos = "+goodPos+"; badNeg = "+badNeg+"; badPos = "+badPos+";<br>";
        result+="found = "+found+"%, lost = "+lost+"%, falsePos = "+falsePos+"%<br>";

        result+="<br>";
        //result+=this.B.display();
        return result;
    }
    this.changeView=function( view ){
        if( !this.B ){return;}
        if(view=='stats'){
            this.showStats=!this.showStats;
        }
        else if(view=='source'){
            this.showSource=!this.showSource;
        }
        else{
            this.showBloom=!this.showBloom;
        }
        this.refresh();
    }
    this.refresh=function(){
        if( this.showStats ){
            document.getElementById('stats').innerHTML = this.calcStats();
            document.getElementById('stats_button').innerHTML = 'Hide Stats';
        }
        else{
            document.getElementById('stats').innerHTML = "";
            document.getElementById('stats_button').innerHTML = 'Show Stats';
        }
        if( this.showSource ){
            document.getElementById('source').innerHTML = arrayToPretty( this.goodArray ) ;
            document.getElementById('source_button').innerHTML = 'Hide Source';
        }
        else{
            document.getElementById('source').innerHTML = "";
            document.getElementById('source_button').innerHTML = 'Show Source';
        }
        if( this.showBloom ){
            document.getElementById('bloom').innerHTML = this.B.display();
            document.getElementById('bloom_button').innerHTML = 'Hide Bloom Filter';
        }
        else{
            document.getElementById('bloom').innerHTML = "";
            document.getElementById('bloom_button').innerHTML = 'Show Bloom Filter';
        }
    }
}
/* randString claas generates array of random strings of length len.
 * Skiplist must be false or must be an array. If array, random strings generated
 * will be unique from the skip list. */
function randString( len, skipList ){
    this.init= function ( len, skipList ){//generates array of random strings
        var list="abcdefghijklmnopqrstuvwxyz0123456789";
        this.arr=[];
        this.numBytes=0;
        var last = 'abc';
        var n = 0;
        while(n<len){
            var strLen=Math.floor((Math.random() * 6) + 3);//select string length of new element
            var tmpStr="";
            for (var i = 0; i < strLen; i++) {  //build string for new element
                tmpStr+=list[ Math.floor((Math.random() * 35) ) ];  //select random letter to add
            }
            if( Math.floor((Math.random() * 3) ) == 1 ){               //25% chance of adding last to current
                tmpStr+=last;
            }
            if( !skipList || !inArray( tmpStr, skipList ) ){//Keep array unique from skip list
                this.arr.push( tmpStr );
                this.numBytes+=tmpStr.length;   //counting number of characters added
                n++;                            //counting number of elements added
                last = tmpStr;
                //console.log( "Str : "+tmpStr );
                //console.log( "Hash: "+APHash(tmpStr) );
            }
        }
    }
    this.init( len, skipList );
    /* Init doesn't return the array; to get array, call getStrArr()*/
    this.getStrArr = function(){
        return this.arr;
    }
    this.getNumBytes = function(){
        return this.numBytes;
    }
}
function BloomFilter( strArray ){
    /* This bloom filter utilizes bit masking to set one of 32 bits per integer 
     * variable, for a store size about 15% of the data input in bytes. It uses 
     * three hash functions.
     * According to what I've read, javascript cooperates by changing
     * it's normal floating point system to a 32-bit int when these types of 
     * operations are performed. Which means, surprisingly, it works! */
    this.calcBloomSize = function( bits ){//bits is number of bits to be stored
        /* This formula is pretty generous. The bloom size could be trimmed quite
         * a bit with very little loss of accuracy. As it is, it's 100% accurate */
        bits=Math.ceil( bits );
        var ln2 = Math.log(2);          //save value for later
        var p = 0.1;                    //p is probability of false positive
        var size = ( -1 * bits * Math.log(p) )/(ln2 * ln2); //m = -(n*lnp)/(ln2)^2
        return Math.ceil( size/32 )*32;//fix length to be a multiple of 32
    }
    /* The function to call for finding an item in the bloom filter.
     * Creates hashes and calls getBit on all. All true returns true */
    this.find = function( findMe ){
        //console.log("find: "+findMe);
        return this.getBit( jStrHash( findMe ) ) &&
            this.getBit( djb2( findMe ) ) &&
            this.getBit( APHash( findMe ) );
    }
    /* Input parameter is already hashed. Function sets a particular bit of a
     * particular element based on the hash*/
    this.setBit = function( hashed ){
        hashed = hashed%this.bloomSize;      //mod for indexes beyond storageSize; source of hash collisions
        var iStorage = Math.floor(hashed/32);//index in int array
        var iByte = hashed%32;               //bit number in char, left to right
        var mask = 1 << iByte;
        //console.log("setBit: hashed="+hashed+", iStorage="+iStorage+", iByte="+iByte+", mask="+mask );
        this.store[iStorage] |= mask;
    }
    /* Input parameter is already hashed. Function creates a mask based on the 
     * hash and checks for that bit set*/
    this.getBit = function(hashed){
        hashed = hashed%this.bloomSize;   //mod for indexes beyond storageSize; source of hash collisions
        var iStorage = Math.floor(hashed/32);           //index in char array
        var iByte = hashed%32;              //bit number in char, left to right
        var mask = 1 << iByte;
        //console.log("getBit: hashed="+hashed+", iStorage="+iStorage+", iByte="+iByte+", mask="+mask );
        return ( (this.store[iStorage] & mask) == mask  );
    }
    /* Outputs an html-ready table as a string. 32-bit integers are displayed as
     * binary. First bit=1 causes minus sign on display */
    this.display = function(){
        var table= '<table class="table table-striped"><tr>';
        for(var i = 0; i < this.storeSize; i++){//
            if( i%3 == 0 ){
                table+= "</tr><tr>";
            }
            table+= "<td>"+padL( this.store[i].toString(2), 32, "0" )+" </td>";//.padL( this.store[i].toString(2), 8, "0" )
            //table+= "<td>"+str_pad( decbin( this.store[i] ),32,"0",STR_PAD_LEFT)+" </td>";
        }
        table+= "</tr></table>";
        return table;
    }
    /* constructor function for class. Sets store size and populates bloom
     * filter from strArray */
    this.init= function ( strArray ){
        var strSize = strArray.length;
        for(var i=0;i<strSize;i++){                 //delete space or newline etc
            strArray[i] = strArray[i].trim();       
        }
        this.bloomSize = this.calcBloomSize(strSize*8);//number of bits
        this.storeSize = this.bloomSize/32;         //size of integer array
        if( this.storeSize < 1 ){                   //protect against empty array
            this.storeSize = 1;
        }
        this.store = [];
        for(i=0;i<this.storeSize;i++){              //initialize array to zero's'
            this.store.push( 0x00000000 );
        }
        for (i = 0; i < strSize; i++) { //for each string, run hashes and set bit
            //console.log("init: "+strArray[i]);
            this.setBit( jStrHash( strArray[i] ) );
            this.setBit( djb2( strArray[i] ) );
            this.setBit( APHash( strArray[i] ) );
        }
    }
    /* Getter functions */
    this.getBloomSize = function(){return this.bloomSize;}
    this.getStoreSize = function(){return this.storeSize;}
    this.getBloomAsArray = function(){return this.store;}
    /* Called on object instantiation */
    this.init( strArray );    
}



