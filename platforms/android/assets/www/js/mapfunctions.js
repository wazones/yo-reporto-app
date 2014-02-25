var map;
var marker;
var infowindow;
var watchID;


function onDeviceReady() {
    // max_height();
    document.body.style.marginTop = "20px";
    $.blockUI({ message: 'Cargando posición por GPS...'});
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, { timeout: 15000, enableHighAccuracy: false });
    function geo_error(error) {
        //comment
        //alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        //$.unblockUI();
        if (error.code == 1 || error.code == 2) {
            //alert("Servicios de Localización Desabilitados. Debes encender tu GPS y volver a abrir la aplicación");
            //navigator.notification.alert('Servicios de Localización Desabilitados. Debes encender tu GPS y volver a abrir la aplicación',null,'Yo Reporto','Aceptar');

            navigator.notification.alert('Servicios de Localización Desabilitados. Se utilizará Localización por torres celulares (menos preciso)', null, 'Yo Reporto', 'Aceptar');

            //trying low accuracy
            $.blockUI({ message: 'Cargando posición por red...'});
            navigator.geolocation.getCurrentPosition(geo_success, geo_error, { timeout: 20000, enableHighAccuracy: false });
        }
        else {
            if (error.code == 3) {
                //navigator.notification.alert('Error: Tiempo de espera agotado para solicitar la posición',null,'Yo Reporto','Aceptar');
                if (error.code == 3) {
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

    function geo_success(position) {
        $.blockUI({ message: 'Cargando municipios...'});
        window.localStorage.setItem("Latitud", position.coords.latitude);
        window.localStorage.setItem("Longitud", position.coords.longitude);

        var latitud = window.localStorage.getItem("Latitud");
        var longitud = window.localStorage.getItem("Longitud");

        var mapSize;
        if(screen.height<=455)//pantallas pequeñas
        {
            mapSize="320x320";
        }
        else if(screen.height>=1232)//pantallas grandes
        {
            mapSize="640x640";
        }
        else   //pantallas normales'
        {
            mapSize="420x420";
        }


        /*var imageMapa = document.getElementById("img-map2");
         imageMapa.src = "http://maps.googleapis.com/maps/api/staticmap?center="+latitud+","+longitud+"&zoom=15&size="+mapSize+"&scale=2&maptype=roadmap&markers=color:red%7Clabel:S%7C"+latitud+","+longitud+"&sensor=true&key=AIzaSyDJ2xqGVummcNqdYjcbkB3blCzox-OjNss";
         */
        //$('#content').height(getRealContentHeight()+1000);
        //alert("height: "+getRealContentHeight()+1000);
        //alert("width: "+ document.getElementById("map").offsetWidth);
        $('#content').height(document.getElementById("map").offsetWidth * 1.5);



        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: new google.maps.LatLng(latitud,longitud),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var point = new google.maps.LatLng(latitud,longitud);
        if(!marker)
        {
            //create marker
            marker = new google.maps.Marker({
                position: point,
                map: map
            });
        }else
        {
            //move marker to new position
            marker.setPosition(point);
        }
        /*
         google.maps.event.addListener(marker, 'click', function() {
         infowindow.open(map,marker);
         }); */


        $.get("http://yoreporto.herokuapp.com/coordinates/",{"lat":latitud,"long":longitud,count:10},"json").
            done(function(data)
            {

//alert("hey");

                var selectM = document.getElementById("selectMuni");
                data.nearest.forEach(function (elem) {
                    var el = document.createElement("option");
                    var id = elem.ID_MUNICIPIO;
                    var nombreMun = elem.NOMBRE_MUNICIPIO;
                    var codDepto = elem.ID_DEPARTAMENTO;
                    mapa3.put(nombreMun, {idMun: id, nombreMun: nombreMun, codDepto: codDepto});
                    el.textContent = nombreMun;
                    el.value = nombreMun;
                    selectM.appendChild(el);
                })
                $.unblockUI();
            });

    }

    function onTimeout(button) {
        //alert("seleccionaste: "+button);

        if (button == 2) {
            $.blockUI({ message: 'Cargando posición por red...'});
            watchID = navigator.geolocation.getCurrentPosition(geo_success, geo_error, { timeout: 20000, enableHighAccuracy: false });
        }
        else {
            $.blockUI({ message: 'Cargando posición por GPS...'});
            watchID = navigator.geolocation.getCurrentPosition(geo_success, geo_error, { timeout: 10000, enableHighAccuracy: true });
        }
    }
}

function refreshMap() {
   
    $('#selectMuni').val('Municipio');
    $('#selectMuni').selectmenu('refresh');
    $.blockUI({ message: 'Cargando posición por GPS...'});
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, { timeout: 15000, enableHighAccuracy: false });
    function geo_error(error) {
        if (error.code == 3) {
            navigator.notification.confirm(
                'Error: tiempo de espera agotado para solicitar la posición',  // message
                onTimeout,              // callback to invoke with index of button pressed
                'Yo Reporto',            // title
                'Reintentar,Posición por red'          // buttonLabels
            );

        }
        //alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        $.unblockUI();
    }
    function geo_success(position) {
        window.localStorage.setItem("Latitud", position.coords.latitude);
        window.localStorage.setItem("Longitud", position.coords.longitude);

        var latitud = window.localStorage.getItem("Latitud");
        var longitud = window.localStorage.getItem("Longitud");

        var point = new google.maps.LatLng(latitud,longitud);
        if(!marker)
        {
            //create marker
            marker = new google.maps.Marker({
                position: point,
                map: map
            });
        }else
        {
            //move marker to new position
            marker.setPosition(point);
        }

        map.panTo(point);
        
         $.get("http://yoreporto.herokuapp.com/coordinates/",{"lat":latitud,"long":longitud,count:10},"json").
		 	done(function(data)
		 	{
		 	//alert("hey");		 
        $.unblockUI();
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
		 	
		 	});

        $.unblockUI();
    }
    function onTimeout(button) {
        //alert("seleccionaste: "+button);

        if (button == 2) {
            $.blockUI({ message: 'Cargando posición por red...'});
            watchID = navigator.geolocation.getCurrentPosition(geo_success, geo_error, {timeout: 20000, enableHighAccuracy: false });
        }
        else {
            $.blockUI({ message: 'Cargando posición por GPS...'});
            watchID = navigator.geolocation.getCurrentPosition(geo_success, geo_error, {timeout: 10000, enableHighAccuracy: true });
        }
    }



}

function getRealContentHeight() {
    var header = $.mobile.activePage.find("div[data-role='header']:visible");
    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();

    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    }
    return content_height;
}
