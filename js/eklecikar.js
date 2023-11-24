
function eklecikar(kutu,inputAlan){
    if(document.getElementById(kutu).checked){ // ekle
    document.getElementById(inputAlan).value+="@"+kutu;
    }else{
    document.getElementById(inputAlan).value=document.getElementById(inputAlan).value.replace("@"+kutu,"");
    }
    }
    
    /////hepsini seç fx
    
    var secili=0;
    function hepsi(liste){
    var broken=liste.split("@");
    if(secili==0){
    for(var i in broken){
    if(broken[i]){
    document.getElementById(broken[i]).checked=1;
    }
    }
    secili=1;
    document.getElementById('hepsi13').value='Hiçbirini Seçme';
    document.getElementById('liste').value=liste;
    }else{
    for(var i in broken){
    if(broken[i]){
    document.getElementById(broken[i]).checked=0;
    }
    }
    document.getElementById('hepsi13').value='Hepsini Seç';
    document.getElementById('liste').value='';
    secili=0;
    
    }
    }///hepsi
    
    