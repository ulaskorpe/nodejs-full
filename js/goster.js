
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
    
    function goster2(dosya,dv,lx) {
    document.getElementById(dv).innerHTML='
    
    
    
    img src=loading.gif ';
    ajax = new AJAX();
    //var dosya= 'ctrl.php?email=';
    if ( ajax ) {
    ajax.onreadystatechange = function () {};
    ajax.abort();
    }
    ajax.open('GET', dosya+"?sf="+lx, true);
    ajax.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
    ajax.setRequestHeader("Connection", "close");
    ajax.send(null);
    ajax.onreadystatechange = function () {
    if( ajax.readyState == 4 ) {
    document.getElementById(dv).style.display='';
    document.getElementById(dv).innerHTML=ajax.responseText;
    } //readystate
    }// funx ajax
    } // funcs
    