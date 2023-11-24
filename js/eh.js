
function eh(a,b){ /// evet hayır fonksiyonu
    if(document.getElementById(b).checked){
    document.getElementById(a).value="E";
    }else{
    document.getElementById(a).value="H";
    }
    
    }/// evet hayır fonksiyonu
    
    function bosalt(a){
    document.getElementById(a).value='';
    }
    function kapat(dv){
    document.getElementById(dv).style.display="none";
    document.getElementById('mask2').style.display="none";
    }
    
    