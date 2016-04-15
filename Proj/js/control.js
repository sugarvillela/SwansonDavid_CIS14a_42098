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

var Control = new function(){
    var self=this;
    this.newGame=function(){
        Header.renderText();
        MainStack.clearStack();
        Model.init();
        MainStack.renderStack();
        MainStack.setInfo();
        DealStack.setInfo();
        //document.write("control: newGame()!!!");
    }
    this.onLoad = function(){
        if(localStorage && localStorage.getItem('bool')){
            //render(JSON.parse(localStorage.getItem('nameOfItem')));
            document.write("control: found storage!!!");
        }
        else{
            //document.write("control: no storage!!!");
            self.newGame();
//            Model.initMainStack();
//            MainStack.renderStack();
        } 
    }
    this.cheat=function(){
        document.write("control: cheat()!!!");
    }
}







