var map;
var marker;
var infowindow;
var watchID;


function onDeviceReady() {
 // max_height();
  document.body.style.marginTop = "20px";
    $.blockUI({ message: 'Cargando posición por GPS...'});
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 15000, enableHighAccuracy: false });
    function geo_error(error)
    {
        //comment
        //alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        //$.unblockUI();
        if(error.code==1 || error.code == 2)
        {
            //alert("Servicios de Localización Desabilitados. Debes encender tu GPS y volver a abrir la aplicación");
            //navigator.notification.alert('Servicios de Localización Desabilitados. Debes encender tu GPS y volver a abrir la aplicación',null,'Yo Reporto','Aceptar');

            navigator.notification.alert('Servicios de Localización Desabilitados. Se utilizará Localización por torres celulares (menos preciso)',null,'Yo Reporto','Aceptar');

            //trying low accuracy
            $.blockUI({ message: 'Cargando posición por red...'});
            navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 20000, enableHighAccuracy: false });
        }
        else
        {
            if(error.code==3)
            {
                //navigator.notification.alert('Error: Tiempo de espera agotado para solicitar la posición',null,'Yo Reporto','Aceptar');
                if(error.code==3)
                {
                navigator.notification.confirm(
                'Error: tiempo de espera agotado para solicitar la posición',  // message
                 onTimeout,              // callback to invoke with index of button pressed
                'Yo Reporto',            // title
                'Reintentar,Posición por red'          // buttonLabels
                 );

                }
            }
        //alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        }
    }
    function geo_success(position)
    {
        $.blockUI({ message: 'Cargando municipios...'});
        window.localStorage.setItem("Latitud", position.coords.latitude);
        window.localStorage.setItem("Longitud", position.coords.longitude);
        
        var latitud=window.localStorage.getItem("Latitud");
        var longitud=window.localStorage.getItem("Longitud");
        
        var mapSize;
        if(screen.height<=455)
        {
            mapSize="320x320";
        }
        else
        {   
            mapSize="640x640";
        }
        
        
            var imageMapa = document.getElementById("img-map2");
            imageMapa.src = "http://maps.googleapis.com/maps/api/staticmap?center="+latitud+","+longitud+"&zoom=15&size="+mapSize+"&scale=2&maptype=roadmap&markers=color:red%7Clabel:S%7C"+latitud+","+longitud+"&sensor=true&key=AIzaSyDJ2xqGVummcNqdYjcbkB3blCzox-OjNss";
        
        $.get("http://yoreporto.herokuapp.com/coordinates/",{"lat":latitud,"long":longitud,count:10},"json").
done(function(data)
{
//alert("hey");	
      
var selectM = document.getElementById("selectMuni");
data.nearest.forEach(function(elem){
var el = document.createElement("option");
var id=elem.ID_MUNICIPIO;
var nombreMun=elem.NOMBRE_MUNICIPIO;
var codDepto=elem.ID_DEPARTAMENTO;
mapa3.put(nombreMun,{idMun:id,nombreMun:nombreMun,codDepto:codDepto});
el.textContent=nombreMun;
el.value=nombreMun;
selectM.appendChild(el);
})
 $.unblockUI();
});
      
    }

    function onTimeout(button)
    {
      //alert("seleccionaste: "+button);
      
          if(button == 2)
          {
            $.blockUI({ message: 'Cargando posición por red...'});
            watchID = navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 20000, enableHighAccuracy: false });
          }
          else
          {
            $.blockUI({ message: 'Cargando posición por GPS...'});
            watchID = navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 10000, enableHighAccuracy: true });
          } 
      

    }
}

