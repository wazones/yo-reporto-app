var map;
var marker;
var infowindow;
var watchID;


function onDeviceReady() 
{
  //$(window).unbind();
  /*$(window).bind('pageshow resize orientationchange', function(e){
    max_height();
  });*/
  //alert("MF");
  max_height();
  document.body.style.marginTop = "20px";
  google.load("maps", "3.8", {"callback": map, other_params: "sensor=true&language=es"});
}

function map()
{
    var latlng = new google.maps.LatLng(4.00, -74.00);
    var myOptions = 
    {
      zoom: 6,
      center: latlng,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false
    };
  	map = new google.maps.Map(document.getElementById("map"), myOptions);

  	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        //get geoposition once
        //navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true });
        //watch for geoposition change
        watchID = navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 60000, enableHighAccuracy: true });   
      }); 
}

function geo_error(error)
{
    //comment
    //alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    if(error.code==1)
    {
    	//alert("Servicios de Localización Desabilitados. Debes encender tu GPS y volver a abrir la aplicación");
    	navigator.notification.alert('Servicios de Localización Desabilitados. Debes encender tu GPS y volver a abrir la aplicación',null,'Yo Reporto','Aceptar');
    
    }
    else 
    	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

function geo_success(position) 
{

    map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    map.setZoom(15);

    var info = 
    ('Latitude: '         + position.coords.latitude          + '<br>' +
      'Longitude: '         + position.coords.longitude         + '<br>' +
      'Altitude: '          + position.coords.altitude          + '<br>' +
      'Accuracy: '          + position.coords.accuracy          + '<br>' +
      'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br>' +
      'Heading: '           + position.coords.heading           + '<br>' +
      'Speed: '             + position.coords.speed             + '<br>' +
      'Timestamp: '         + new Date(position.timestamp));
	
	window.localStorage.setItem("Latitud", position.coords.latitude);
    window.localStorage.setItem("Longitud", position.coords.longitude);

    var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
      if(!infowindow)
      {
        infowindow = new google.maps.InfoWindow({
          content: info
        });
      }
      else
      {
        infowindow.setContent(info);
      }
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      }); 
      
      var latitud=window.localStorage.getItem("Latitud");
      var longitud=window.localStorage.getItem("Longitud");
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
		 	
		 	});
      
      
}
	
	
function max_height()
{
 
  var h = $('div[data-role="header"]').outerHeight(true);
  var f = $('div[data-role="footer"]').outerHeight(true);
  var w = $(window).height();
  var c = $('div[data-role="content"]');
  var c_h = c.height();
  var c_oh = c.outerHeight(true);
  var c_new = w - h - f - c_oh + c_h;
 // alert("w: "+w+" - h: "+h+" - f: "+f+" - c_oh: "+c_oh+" + c_h: "+c_h+" =cnew = "+c_new);
  var total = h + f + c_oh;
  if(c_h<c.get(0).scrollHeight)
  {
    c.height(c.get(0).scrollHeight);
    //alert("primer if");
  }
  else
  {
    c.height(c_new/2.5);
    
  }
}