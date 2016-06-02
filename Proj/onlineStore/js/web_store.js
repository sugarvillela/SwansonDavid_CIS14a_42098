/* First some functions to help with login */
function checkLocal(){
    /* If a user has logged in, they won't have to log in again */
    if( localStorage && localStorage.getItem('loggedIn') ){
        window.location = "main.html";
    }
    else{
        valLoginText();
    }
}
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
function checkLoginData(){
//    var email=document.getElementById('email').value;
//    var password=document.getElementById('password').value;
    /*Some Ajax code here, to find the password in database.
     *For now, just make it true and redirect */
    localStorage.setItem( "loggedIn", "true" );
    window.location = "main.html";
}
/* Following the MVC paradigm, Model holds main content and cart content*/
var Model=new function(){
    this.init=function(){
        this.cart=[];//1-d integer array
        this.content=fetchContent();//object array
    }
    this.addToCart=function( id ){
        this.cart.push( id );
    }
    this.init();//self-call init on var creation
}
var View=new function(){
    this.init=function(){
        document.getElementById( "checkout" ).style.visibility="hidden";
        this.page=0;//page number
        this.maxDisplay=8;//set number of items displayed, to match number written in html
        this.maxCheckout=8;//set number of items allowed in checkout. Obviously problematic, fix later
        this.refresh();
    }
    /* Page nav behavior: if inc on last index, start at first*/
    this.pageInc=function(){
        this.page++;
        var bignum=this.page*this.maxDisplay;
        if( ( this.page*this.maxDisplay ) > Model.content.length ){
            this.page=0;
        }
        console.log('Inc: Page='+this.page + ', bignum='+bignum);
        this.refresh();
    }
    /* Page nav behavior: if dec on first index, start at last*/
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
         * inner a=c1 (it adds to cart) */
        var s, content=Model.content;
        var start=this.page*this.maxDisplay;
        var end = (start+this.maxDisplay <= content.length)? 
            start+this.maxDisplay: content.length;
        /* send content to html fields and set visible */
        for( i=start; i<end; i++){
            s=(i%this.maxDisplay).toString();//mod current index and save as string
            /* first one is a hidden div, to hold the product id */
            document.getElementById( s ).innerHTML=i.toString();
            document.getElementById( 'i'+s ).src="thumbs/"+content[i].img;
            document.getElementById( 'n'+s ).innerHTML=content[i].name;
            document.getElementById( 'p'+s ).innerHTML="$"+content[i].price+"/hr";
            document.getElementById( 'a'+s ).style.visibility="visible";
        }
    }
    this.refreshCartNav=function( numItems ){
        /* display is also a single link to checkout */
        var s= ( numItems>1 )? " items":" item";
        document.getElementById( "checkout" ).style.visibility="visible";
        document.getElementById( "checkoutLink" ).innerHTML=
            numItems.toString()+s+ "&nbsp;&nbsp;&nbsp;&nbsp;View Cart&nbsp;&nbsp;&nbsp;&nbsp;Checkout";
    }
    this.detail=function( i ){
        /* Populate detail popup and make visible */
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
    this.checkoutForm=function( content ){
        /* This function handles the left side of the checkout popup, and also clears
         * any old data display on the right side.
         * content var is selected content from Control.checkout(): array of objects
         * copied from main content based on cart selections.
         * Need quantity from user, so generate a form. On keyup, valid input 
         * automatically updates the checkoutTotal display */
        var len= content.length;
        var row, label, input;
        var addToForm=document.getElementById( "addToForm" );
        addToForm.innerHTML="";
        for( var i=0; i<len; i++){
            row=document.createElement("div");
            row.className="row";
            label=document.createElement("label");
            label.innerHTML="How many hours did ya wanna spend with "+content[i].name+"?";
            label.style.color="black";
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
        /* Clear the checkoutTotal display */
        for( i=0; i<this.maxCheckout; i++){
            document.getElementById( "tName"+i ).innerHTML = "";
            document.getElementById( "tHrs"+i ).innerHTML = "";
            document.getElementById( "tPrice"+i ).innerHTML = "";
            document.getElementById( "tSub"+i ).innerHTML = "";
        }
        document.getElementById( "tTotal" ).innerHTML = "0";
        /* make visible */
        document.getElementById("checkoutForm").style.display='block';
        document.getElementById('fade').style.display='block';
    }
    this.checkoutTotal=function( content, total ){
        /* content var is selected content from Control.checkout(): array of objects
         * copied from main content based on cart selections. Total is tallied in Control.checkoutTotal */
        /* Clear the checkoutTotal display */
        for( var i=0; i<this.maxCheckout; i++){
            document.getElementById( "tName"+i ).innerHTML = "";
            document.getElementById( "tHrs"+i ).innerHTML = "";
            document.getElementById( "tPrice"+i ).innerHTML = "";
            document.getElementById( "tSub"+i ).innerHTML = "";
        }
        /* Set current total displays */
        var len= content.length;
        for( i=0; i<len && i<this.maxCheckout; i++){
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
    this.t=0;//for time, a workaround (see addToCart and detail)
    this.checkoutLen=0;
    
    this.addToCart=function( id ){
        /* Due to the html arrangement, clicking addToCart() also calls detail().
         * Set up a 1/2 second timeout to prevent this */
        var d = new Date();
        this.t = d.getTime();
        /* id's start with a single alpha char, then a number. To get the number,
         * remove the letter */
        id=id.substr(1);
        /* Since the same html holds numerous pages of display, the id's of the html
         * elements are not necessarily the id's of the products. So there is a hidden
         * div, (id=just the numeric id) that contains the product id */
        var productId=document.getElementById( id ).innerHTML;
        Model.addToCart( productId );
        View.refreshCartNav( Model.cart.length );
    }
    this.toCart_detail=function(){
        /* This function is called add to cart on the detail popup. We don't need
         * the timeout workaround. There is a hidden div just like the others */
        var productId=document.getElementById( "detail_hidden" ).innerHTML;
        Model.addToCart( productId );
        View.refreshCartNav( Model.cart.length );
    }
    this.detail=function( id ){
        var d = new Date();
        var newTime = d.getTime();
        if(newTime-this.t<500){
            return;
        }
        id=id.substr(1);
        var productId=document.getElementById( id ).innerHTML;
        View.detail( productId );
    }
    this.checkout=function(){
        /* Copy the main content to selectedContent, based on id's saved in cart */
        this.selectedContent=[];
        var cart=Model.cart, content=Model.content;
        var len=cart.length;
        for( var i=0; i<len; i++){
            this.selectedContent.push( content[ cart[i] ] );
        }
        View.checkoutForm( this.selectedContent );
    }
    this.checkoutTotal=function(){
        /* Get quantity info from checkoutForm. If valid, add things up and send 
         * to display */
        var value, total=0, len=this.selectedContent.length;
        for( var i=0; i<len; i++){
            value=document.getElementById( "f"+i.toString() ).value;
            /* User can remove items by setting quantity to zero */
            if(!value.match("^[0-9]*$")){
                continue;
            }
            value-=0;
            this.selectedContent[i].hrs=value;
            this.selectedContent[i].subtotal= this.selectedContent[i].price*value;
            total+=this.selectedContent[i].subtotal;
        }
        View.checkoutTotal( this.selectedContent, total );
    }
    this.payNow=function(){
        /* Normally we'd need another form to enter credit card info.
         * For now there's this */
        var value=document.getElementById( "tTotal" ).innerHTML;
        alert("Tnank you for choosing Dave's Redneck Escort Service. You just spent " + value );
        window.location = "main.html";
    }
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
                "a spell. She can do them dishes in the morning."
        },
        {name:"Varn", price:"8.00", img:"2.jpg", sign:"Capricorn", hrs:0, subtotal:0,
            bio:"I respect women. On a date, I make sure and open the door for "+
                "her. That'd be the driver side, seein as how I'm waitin on my "+
                "SR-22 right now"
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
            bio:"I usually bring my gun on dates, especially if we go shooting, "+
                " but even if we go to a tractor pull or something. I once went "+
                "over to that there Bureau of Alcohol, Tobacco and Firearms, you "+
                "know, just to see what they was up to. Nice folks. I got me a "+
                "T-shirt n all"},
        {name:"Billy-Ray", price:"11.00", img:"7.jpg", sign:"Libra", hrs:0, subtotal:0,
            bio:"My real name's Billy-Ray, after my mama, but people call me "+
                "'Sunshine' now. My nickname used to be Phil, until my folks named "+
                "my little brother Phil. Then it just got confusing."
        },
        {name:"Billy", price:"9.69", img:"8.jpg", sign:"Gemini", hrs:0, subtotal:0,
            bio:"Yeah, I like to show ladies a good time, if ya know what I mean..."
        },
        {name:"Bill", price:"14.99", img:"9.jpg", sign:"Taurus", hrs:0, subtotal:0,
            bio:"My dream date would be, you know, dinner, dancing, "+
                "maybe pick up a few things at Home Depot on the way. I'm easy "+
                "like that"
        }
    ];
}

