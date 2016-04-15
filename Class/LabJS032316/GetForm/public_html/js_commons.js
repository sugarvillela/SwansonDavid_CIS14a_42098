function calcSav(pv,i,n){
    return (n<=0)? pv:
	calcSav(pv,i,n-1)*(1+i);
}
function getToObj(){
    var url=window.location.href;
    var info=url.split("?");
    var nameValuePairs=info[1].split("&");
    var obj=new Object();
    for(var i=0;i<nameValuePairs.length;i++){
        var map=nameValuePairs[i].toString().split("=");
        var name =map[0];
        var value=map[1];
        obj[name]=value;
    }
    return obj;
}
function handleSubmit(){
    var urObj=getToObj();
    var savings=calcSav(urObj['pv'],urObj['i'],urObj['n']).toFixed(2);
    var str="<table>";//<tr><th>Result</th><td></td></tr>";
    for(var name in urObj){
        str+="<tr><th>";
        str+=name;
        str+="</th><td>";
        str+=urObj[name];
        str+="</td></tr>";
    }
    str+="<tr><th>Savings $</th><td>" + savings.toString()+ "<td></tr>";
    str+="</table>";
    document.getElementById("heading").innerHTML = "Result";
    document.getElementById("jsOut").innerHTML = str;
}




