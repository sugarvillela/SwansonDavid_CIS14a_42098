/*
 onclick = "lightbox('lighta01');
 */
function valInt(){
//    document.getElementById('size_submit').style.visibility= 
//        ( value.match("^[1-9]+[0-9]*$") )? 'visible' : 'hidden';
}
function checkLocal(){
    if( false && localStorage && localStorage.getItem('loggedIn') ){
        window.location = "main.html";
    }
    else{
        valLoginText();
    }
}
function valLoginText(  ){
    var email=document.getElementById('email').value;
    var password=document.getElementById('password').value;
    //console.log("pw length="+password.length);
    document.getElementById('login_submit').style.visibility= 
        ( 
            email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$") &&
            password.length>0
        )? 'visible' : 'hidden';
}
function checkLoginData(){
//    var email=document.getElementById('email').value;
//    var password=document.getElementById('password').value;
    /*Some Ajax code here, to find the password in database.
     *For now, just make it true and redirect */
    localStorage.setItem( "loggedIn", "true" );
    window.location = "main.html";
}
var Model=new function(){
    this.cart=[];
    this.init=function(){
        this.content=fetchContent();
    }
    this.addToCart=function( id ){
        this.cart.push( id );
        View.showCheckout( this.cart.length );
    }
    this.init();
}
var View=new function(){
    this.init=function(){//set number of items displayed
        document.getElementById( "checkout" ).style.visibility="hidden";
        this.page=0;
        this.maxDisplay=8;
        this.maxTable=8;
        this.refresh();
    }
    this.pageInc=function(){
        this.page++;
        var bignum=this.page*this.maxDisplay;
        if( ( this.page*this.maxDisplay ) > Model.content.length ){
            this.page=0;
        }
        console.log('Inc: Page='+this.page + ', bignum='+bignum);
        this.refresh();
    }
    this.pageDec=function(){
        this.page--;
        if( this.page<0 ){
            this.page=Math.floor( Model.content.length/this.maxDisplay );
        }
        console.log('Dec: Page='+this.page + ', len='+Model.content.length);
        this.refresh();
    }
    this.refresh=function(){
        /* Wipe current display */
        for( var i=0; i<this.maxDisplay; i++){
            document.getElementById( 'a'+i ).style.visibility="hidden";
        }
        /* Set view according to content
         * Naming scheme for ids: outer a=a1, image=i1, name=n1, price=p1, 
         * inner a=c1 (it adds to cart)*/
        var s, content=Model.content;
        var start=this.page*this.maxDisplay;
        var end = (start+this.maxDisplay <= content.length)? 
            start+this.maxDisplay: content.length;
        //console.log("start="+start+",end="+end);
        for( i=start; i<end; i++){
            s=(i%this.maxDisplay).toString();
            //console.log("s="+s+",i="+i);
            document.getElementById( s ).innerHTML=i.toString();
            document.getElementById( 'i'+s ).src="thumbs/"+content[i].img;
            document.getElementById( 'n'+s ).innerHTML=content[i].name;
            document.getElementById( 'p'+s ).innerHTML="$"+content[i].price+"/hr";
            document.getElementById( 'a'+s ).style.visibility="visible";
        }
    }
    this.showCheckout=function( numItems ){
        var s= ( numItems>1 )? " items":" item";
        document.getElementById( "checkout" ).style.visibility="visible";
        document.getElementById( "checkoutLink" ).innerHTML=
            numItems.toString()+s+ "&nbsp;&nbsp;&nbsp;&nbsp;View Cart&nbsp;&nbsp;&nbsp;&nbsp;Checkout";
    }
    this.detail=function( i ){
        var content=Model.content;
        document.getElementById( "detail_hidden" ).innerHTML=i;
        document.getElementById( "detail_img" ).src="images/"+content[i].img;
        document.getElementById( "detail_name" ).innerHTML=content[i].name;
        document.getElementById( "detail_sign" ).innerHTML=content[i].sign;
        document.getElementById( "detail_bio" ).innerHTML=content[i].bio;
        document.getElementById( "detail_price" ).innerHTML="$"+content[i].price+"/hr";
        document.getElementById("lightbox").style.display='block';
        document.getElementById('fade').style.display='block';
    }
    this.endDetail=function (){
        document.getElementById("lightbox").style.display='none';
        document.getElementById('fade').style.display='none'
    }
    this.checkoutForm=function( content ){//content is selected content from Control.checkout()
        var len= content.length;
        var row, label, input;
        var addToForm=document.getElementById( "addToForm" );
        addToForm.innerHTML="";
        for( var i=0; i<len; i++){
            row=document.createElement("div");
            row.className="row";
            label=document.createElement("label");
            //label.id="l"+i.toString();
            label.innerHTML="How many hours did ya wanna spend with "+content[i].name+"?";
            label.style.color="black";
            //label.className="form-control";
            input=document.createElement("input");
            input.id="f"+i.toString();//keep track of generated ids: f means form
            input.className="form-control";
            input.addEventListener('keyup', function () {
                Control.checkoutTotal();
            });
            row.appendChild( label );
            row.appendChild( input );
            addToForm.appendChild( row );
        }
        for( var i=0; i<this.maxTable; i++){
            document.getElementById( "tName"+i ).innerHTML = "";
            document.getElementById( "tHrs"+i ).innerHTML = "";
            document.getElementById( "tPrice"+i ).innerHTML = "";
            document.getElementById( "tSub"+i ).innerHTML = "";
        }
        document.getElementById("checkoutForm").style.display='block';
        document.getElementById('fade').style.display='block';
        document.getElementById( "tTotal" ).innerHTML = "0";
    }
    this.checkoutTotal=function( content, total ){//content is selected content from Control.checkout()
        for( var i=0; i<this.maxTable; i++){
            document.getElementById( "tName"+i ).innerHTML = "";
            document.getElementById( "tHrs"+i ).innerHTML = "";
            document.getElementById( "tPrice"+i ).innerHTML = "";
            document.getElementById( "tSub"+i ).innerHTML = "";
        }
        var len= content.length;
        for( i=0; i<len && i<this.maxTable; i++){
            document.getElementById( "tName"+i ).innerHTML = content[i].name;
            document.getElementById( "tHrs"+i ).innerHTML = content[i].hrs;
            document.getElementById( "tPrice"+i ).innerHTML =  content[i].price+"/hr";
            document.getElementById( "tSub"+i ).innerHTML =  content[i].subtotal.toFixed(2);;
        }
        document.getElementById( "tTotal" ).innerHTML = "$"+total.toFixed(2);;
    }
    this.endCheckoutForm=function (){
        document.getElementById("checkoutForm").style.display='none';
        document.getElementById('fade').style.display='none'
    }
}
var Control=new function(){
    this.t=0;
    this.checkoutLen=0;
    this.addToCart=function( id ){
        var d = new Date();
        this.t = d.getTime();
        id=id.substr(1);
        var productId=document.getElementById( id ).innerHTML;
        //console.log("addToCart: productId="+productId);
        Model.addToCart( productId );
    }
    this.toCart_detail=function(){
        var productId=document.getElementById( "detail_hidden" ).innerHTML;
        //console.log("addToCart: productId="+productId);
        Model.addToCart( productId );
    }
    this.detail=function( id ){
        var d = new Date();
        var newTime = d.getTime();
        if(newTime-this.t<500){
            //console.log("detail canceled");
            return;
        }
        id=id.substr(1);
        var productId=document.getElementById( id ).innerHTML;
        console.log("detail: productId="+productId);
        View.detail( productId );
    }
    this.checkout=function(){
        this.selectedContent=[];
        var cart=Model.cart, content=Model.content;
        var len=cart.length;
        for( var i=0; i<len; i++){
            this.selectedContent.push( content[ cart[i] ] );
        }
        View.checkoutForm( this.selectedContent );
    }
    this.checkoutTotal=function(){
        var value, total=0, len=this.selectedContent.length;
        for( var i=0; i<len; i++){
            value=document.getElementById( "f"+i.toString() ).value;
            if(!value.match("^[1-9]+[0-9]*$")){
                continue;
            }
            value-=0;
            this.selectedContent[i].hrs=value;
            this.selectedContent[i].subtotal= this.selectedContent[i].price*value;
            total+=this.selectedContent[i].subtotal;
        }
        //console.log( total );
        View.checkoutTotal( this.selectedContent, total );
    }
    this.payNow=function(){
        var value=document.getElementById( "tTotal" ).innerHTML;
        alert("Tnank you for choosing Dave's Redneck Escort Service. You just spent " + value );
        window.location = "main.html";
    }
}
function makeCell(){
    var div=document.createElement("div"),
        //outer table
        tOuter=document.createElement("table"),
        rowOuter=document.createElement("row"),
        td1Outer=document.createElement("td"),
        td2Outer=document.createElement("td"),
        //inner table
        tInner=document.createElement("table"),
        //inner table row 1
        row1Inner=document.createElement("row"),
        td1Inner=document.createElement("td"),
        //inner table row 2
        row2Inner=document.createElement("row"),
        td21Inner=document.createElement("td"),
        td22Inner=document.createElement("td"),
        //image
        img=document.createElement("img");
    div.className="col-sm-2";
    img.className="img-responsive";
    img.src="images/j5.png";
    td1Inner.innerHTML="td11";
    div.appendChild( tOuter );
    tOuter.appendChild( rowOuter );
    rowOuter.appendChild( td1Outer );
    rowOuter.appendChild( td2Outer );
    td1Outer.appendChild( img );
    td2Outer.appendChild( tInner );
    tInner.appendChild( row1Inner );
}
function fetchContent(){
    /* This data would be populated from the server */
    return [
        {name:"Jay Jay", price:"14.50", img:"0.jpg", sign:"Virgo", hrs:0, subtotal:0,
            bio:"If ya go out with me, maybe I'll bring my banjo and sing you a "+
                " song or two.  I'm also a handyman on the side, so I can "+
                "work on your wiring or plumbing n things of that nature"
        },
        {name:"Enick", price:"17.50", img:"1.jpg", sign:"Pisces", hrs:0, subtotal:0, 
            bio:"My daddy taught me how to treat a woman good. If she's tired after "+
                "cooking dinner, I'd tell her to forget the dishes and go rest "+
                "a spell. She can do them in the morning."
        },
        {name:"Varn", price:"8.00", img:"2.jpg", sign:"Capricorn", hrs:0, subtotal:0,
            bio:"I respect women. On a date, I make sure and open the door for "+
                "her. That'd be the driver side, seein as how I don't got a "+
                "car right now"
        },
        {name:"Edgar", price:"10.75", img:"3.jpg", sign:"Libra", hrs:0, subtotal:0,
            bio:"Mama always said I'm handsome. That's why I went into this "+
                "escortin' thing. It was either that or something in the automotive "+
                "industry, maybe a glove box installer, or one of those fellers "+
                "who changes tires."
        },
        {name:"Lou", price:"12.50", img:"4.jpg", sign:"Cancer", hrs:0, subtotal:0,
            bio:"I'm a fun guy, what else can I say?"
        },
        {name:"Skip", price:"10.00", img:"5.jpg", sign:"Leo", hrs:0, subtotal:0,
            bio:"I had all my teeth till about an hour ago. Had me a mishap "+
                "and all. But, hey, I'm still a fun date."
        },
        {name:"Bill-Ray", price:"7.50", img:"6.jpg", sign:"Ares", hrs:0, subtotal:0,
            bio:"I bring my gun on dates, usually. Especially if we go "+
                "shooting but even if we go to a tractor pull or something"},
        {name:"Billy-Ray", price:"11.00", img:"7.jpg", sign:"Libra", hrs:0, subtotal:0,
            bio:"My real name's Billy-Ray, after my mom, but people call me "+
                "'Happy' now. My nickname used to be Phil, but that was my "+
                "brother's name so it didn't stick."
        },
        {name:"Billy", price:"9.69", img:"8.jpg", sign:"Gemini", hrs:0, subtotal:0,
            bio:"Yeah, I like to show ladies a good time, if ya know what I mean..."
        },
        {name:"Bill", price:"14.99", img:"9.jpg", sign:"Taurus", hrs:0, subtotal:0,
            bio:"My dream date would be, you know, dinner, dancing, an opera, "+
                "maybe pick up a few things at Home Depot on the way. Stuff like "+
                "that"
        }
    ];
}

