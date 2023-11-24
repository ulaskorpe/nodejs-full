
function AJAX() {
    var ajax = false;
    // Internet Explorer (5.0+)
    try {
    ajax = new ActiveXObject("Msxml2.XMLHTTP"); // yeni versiyon xmlhttp
    } catch (e) {
    try {
    ajax = new ActiveXObject("Microsoft.XMLHTTP"); // eski versiyon xmlhttp
    } catch (e) {
    ajax = false;
    }
    }
    // Mozilla ve Safari
    if ( !ajax && typeof XMLHttpRequest != 'undefined' ) {
    try{
    ajax = new XMLHttpRequest();
    }catch(e) {
    ajax = false;
    }
    }
    
    // Diger
    if ( !ajax && window.createRequest ) {
    try{
    ajax = window.createRequest();
    }catch(e) {
    ajax = false;
    }
    }
    
    return ajax;
    }
    
    function gonderxx(dosya,degerler,sonuc,dv,f1){
    ///// dosya -> işlemin gönderileceği dosya
    //// degerler -> işleme gönderilecek değerler
    //// sonuc -> sonuç görüntülenecek dosya
    //// dv -> sonuç dosyasını görüntüleneceği div
    var broken=degerler.split("@");
    var lx="";
    for(var i in broken){
    if(broken[i]){
    lx+="&"+broken[i]+"="+document.getElementById(broken[i]).value;
    }
    }
    ajax = new AJAX();
    if ( ajax ) {
    ajax.onreadystatechange = function () {};
    ajax.abort();
    }
    ajax.open('GET', dosya+"?sf=13"+encodeURI(lx), true);
    ajax.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
    ajax.setRequestHeader("Connection", "close");
    ajax.send(null);
    ajax.onreadystatechange = function () {
    if( ajax.readyState == 4 ) {
    //alert(ajax.responseText);
    var dizi=ajax.responseText.trim().split("@");
    if(dizi[1]){///hele dur!
    alert(dizi[0]);
    document.getElementById(dizi[1]).value="";
    document.getElementById(dizi[1]).focus();
    }else{// işlem tamam
    if(f1!=""){////form
    document.getElementById(f1).submit();
    }else{////form yok
    var broken1=dizi[0].split("æ") ;
    alert(broken1[0]);
    var ix=broken1[1] ;
    if(dosya=='http://www.felaketbolgesi.com/uyeler/msgx.php'){
    document.getElementById('msg').value='';
    };
    
        if(dv!=""){
            goster2(sonuc,dv,ix);
        }else{
    
           window.open(sonuc,"_self");
        }
        }////form varmı yokmu
    }////işlem tamam
    
    } //readystate
    
    }// funx ajax
    
    }/////function gonder
    
    