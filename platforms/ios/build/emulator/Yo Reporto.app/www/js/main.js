var pictureSource; // fuente de la foto
var destinationType; // formato de lo retornado 
var imagen;   //donde se guarda el codigo base64 de la foto
var mapa;  //un map para almacenar datos
var mapa2;  //""
var mapa3;
var canvas;

 function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(4.00, -74.00),
          zoom: 10
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
      }

function onAboutReady()
{
    //alert("height: "+screen.height);
    //alert("width: "+screen.width);
    var imageContainer = document.getElementById("imageabout");
    if(screen.height==568&&screen.width==320)//iphone 5
    {
          imageContainer.src="img/about/i5.png"
          
    }
    else if(screen.height==480&&screen.width==320)//otros iphone
    {
        imageContainer.src="img/about/i4.png"
    }
    
    else if(screen.height==1024&&screen.width==768)//ipads
    {
        imageContainer.src="img/about/ipad.png"
    }
    else if(screen.height==1232&&screen.width==800)//nexus 10
    {
          imageContainer.src="img/about/nexus10.png"
    }
    else if(screen.height==1024&&screen.width==600)//samsung chirreta
    {
          imageContainer.src="img/about/1024x600.png"
    }
    else if(screen.height==455&&screen.width==320)//galaxy ace
    {
          imageContainer.src="img/about/galaxyace.png"
    }
    else if(screen.height==592&&screen.width==360)//moto x
    {
          imageContainer.src="img/about/motox.png"
    }
    else 
    {
          imageContainer.src="img/about/default.png"
    }
    
    
}

function start() 
{  
	mapa = new Map();
	mapa2 = new Map();
	mapa3 = new Map();
	window.localStorage.setItem("URL", "http://www.gestiondelriesgo.gov.co/ServicioApp/EventosComunidad.asmx");
	window.localStorage.setItem("RequestHeader", '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>');
	var botonCamara1 = document.getElementById("capture"); 
	var botonCamara2 = document.getElementById("pictureSource");
	var btnReport=document.getElementById("btnReport");
	
	
	botonCamara1.addEventListener("click",function()
	{ 
		capturePhoto();
	});

	botonCamara2.addEventListener("click",function()
	{ 
		getPhoto(pictureSource.PHOTOLIBRARY);
	});
	
	btnReport.addEventListener("click",function()
	{ 
		report();
	});
	
	
	pictureSource=navigator.camera.PictureSourceType; 
	destinationType=navigator.camera.DestinationType; 
	
	
	var wsUrl = window.localStorage.getItem("URL");
	var requestHeader=window.localStorage.getItem("RequestHeader");
 var requestEventos =requestHeader+
 '<Eventos xmlns="http://tempuri.org/" /></soap:Body></soap:Envelope>';            
 
 $.blockUI({ message: 'Cargando datos...'});
 
 $.ajax({
  type: "POST",
  url: wsUrl,
  contentType: "text/xml",
  dataType: "xml",
  data: requestEventos,
  success: processSuccessEventos,
  error: processError
});



 function processSuccessEventos(data, status, req) 
 { 
   var select = document.getElementById("selectEvt");
   if (status == "success")
   {
    var cont=0;
    $("Evento", req.responseText).each(function()
    {
     var todo=$("Codigo", this).text();
     var cod=$("Descripcion", this).text();
     var index=todo.indexOf(cod);
     var number=todo.substring(0,index);
     mapa.put(cod,number);
     var el = document.createElement("option");
     el.textContent = cod;
     el.value = cod;
     select.appendChild(el);
     cont++;
   });

    llenarGravedad();
        }//if success


    }//success0

    function processError(data, status, req) 
    {
      alert('err '+data.state);
    } 

    function llenarGravedad()
    {
      var wsUrl = window.localStorage.getItem("URL");
      var requestHeader=window.localStorage.getItem("RequestHeader");
      var requestNiveles =requestHeader+'<NivelesEstimadosComunidad xmlns="http://tempuri.org/" /></soap:Body></soap:Envelope>';            

      $.ajax({
        type: "POST",
        url: wsUrl,
        contentType: "text/xml",
        dataType: "xml",
        data: requestNiveles,
        success: processSuccessNiveles,
        error: processError
      });

      function processSuccessNiveles(data, status, req) 
      { 
        //$.unblockUI();
        var select = document.getElementById("selectLevel");
        if (status == "success")
        {
        	var cont=0;
        	$("Nivel", req.responseText).each(function()
        	{
           var todo=$("Codigo", this).text();
           var cod=$("Descripcion", this).text();
           var el = document.createElement("option");
           var index=todo.indexOf(cod);
           var number=todo.substring(0,index);
           mapa2.put(cod,number);
           el.textContent = cod;
           el.value = cod;
           select.appendChild(el);
           cont++;
         });  		 
    	}//if success
	}//success00
	
}//llenargravedad
//spinnerplugin.hide();
 //navigator.notification.activityStop();
}//start

function testConnection()
{

 var networkState=navigator.network.connection.type;
 
                    
                       var value = window.localStorage.getItem("NombreUsuario");
                       if(value!=null)
                       {
		 	    	   //alert("si usuario");
               $.mobile.navigate("#pg-third",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"none"});
             }
             else
             {
		 			   //alert("no user");
             $.mobile.navigate("#pg-second",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"none"});
           }
         
}




       function goThird()
       {



         if($("#txtNombre").val()=="")
         {
             navigator.notification.alert('Por favor ingresa tu nombre',null,'Yo Reporto','Aceptar');
           }
           else if($("#txtTelefono").val()=="")
           {
   					navigator.notification.alert('Por favor ingresa tu teléfono',null,'Yo Reporto','Aceptar');
          }
          else if($("#txtEmail").val()=="")
          {
   					navigator.notification.alert('Por favor ingresa tu e-mail',null,'Yo Reporto','Aceptar');
          }
          else if($("#txtEmail").val()!="")
          {
          	var x=$("#txtEmail").val()
			var atpos=x.indexOf("@");
			var dotpos=x.lastIndexOf(".");
			if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
  			{
  				navigator.notification.alert('Introduce una dirección de e-mail válida',null,'Yo Reporto','Aceptar');
  			
  			}
          
          	else
          	{
          
          	 window.localStorage.setItem("NombreUsuario", $("#txtNombre").val());
          	 window.localStorage.setItem("TelefonoUsuario", $("#txtTelefono").val());
           	 window.localStorage.setItem("EmailUsuario", $("#txtEmail").val());
           	 window.localStorage.setItem("EntidadUsuario", $("#selectEntidad").val());
           	 $.mobile.navigate("#pg-third",{allowSamePageTransition:true,reloadPage:true,changeHash:true,transition:"none"});
         	}
         }
 		}//gothird

    function getCodeEvent(event)
    {
      return mapa.get(event);
    }

    function getCodeLevel(level)
    {
      return mapa2.get(level);
    }
    function getCodeMuni(muni)
    {
      return mapa3.get(muni);
    }

    function report() 
    {

    	if($("#selectLevel").val()!="Nivel"&&$("#selectEvt").val()!="Categoría"&&$("#selectMuni").val()!="Municipio")
      {
       var codeLevel=getCodeLevel($("#selectLevel").val());
       var codeEvent=getCodeEvent($("#selectEvt").val());
       var nombreUsuario = window.localStorage.getItem("NombreUsuario");
       var telefonoUsuario = window.localStorage.getItem("TelefonoUsuario");
       var emailUsuario = window.localStorage.getItem("EmailUsuario");
       var entidadUsuario = window.localStorage.getItem("EntidadUsuario");
       var latitud = window.localStorage.getItem("Latitud");
       var longitud = window.localStorage.getItem("Longitud");
       var descripcion;
       var now = new Date().toISOString();

       var departamento=getCodeMuni($("#selectMuni").val()).codDepto;
       var municipio=getCodeMuni($("#selectMuni").val()).idMun;
			//formatDate(now);
			//alert(now);

		 	//$.get("http://yoreporto.herokuapp.com/coordenates/",{"lat":latitud,"long":longitud},"json").
		 	//done(function(data)
		 	//{
		 		
		 		//var depto=data.nearest[0].ID_DEPARTAMENTO;
		 		//var municipio=data.nearest[0].ID_MUNICIPIO;
		 		
		 		var wsUrl = window.localStorage.getItem("URL");
       var requestHeader=window.localStorage.getItem("RequestHeader");
       var requestInsertarEmergencia =requestHeader+
       '<InsertarEmergenciaComunidad xmlns="http://tempuri.org/">'+
       '<Nombres>'+nombreUsuario+'</Nombres>'+
       '<Telefono>'+telefonoUsuario+'</Telefono>'+
       '<Email>'+emailUsuario+'</Email>'+
       '<IDDepartamento>'+departamento+'</IDDepartamento>'+
       '<IDMunicipio>'+municipio+'</IDMunicipio>'+
       '<VeredaCorregimiento>null</VeredaCorregimiento>'+
       '<Coordenadas>'+latitud+','+longitud+'</Coordenadas>'+
       '<DescripcionEvento>'+descripcion+'</DescripcionEvento>'+
       '<CodigoNivelEstimado>'+codeLevel+'</CodigoNivelEstimado>'+
       '<Entidad>'+entidadUsuario+'</Entidad>'+
       '<CodigoEstado>1</CodigoEstado>'+
       '<CodigoEvento>'+codeEvent+'</CodigoEvento>'+
       '<FechaEvento>'+now+'</FechaEvento>'+
            '</InsertarEmergenciaComunidad>'+
            '</soap:Body>'+
            '</soap:Envelope>'; 

			 $.blockUI({ message: 'Enviando reporte...'});
	
            $.ajax({
              type: "POST",
              url: wsUrl,
              contentType: "text/xml",
              dataType: "xml",
              data: requestInsertarEmergencia,
              success: processSuccessInsertarEmergencia,
              error: processError
            });

		 //});//done

         } //if (comboboxes not OK)
         else if($("#selectLevel").val()=="Nivel")
         {
          navigator.notification.alert('Selecciona un nivel de gravedad',null,'Yo Reporto','Aceptar');
        }
        else if($("#selectEvt").val()=="Categoría")
        {
           navigator.notification.alert('Selecciona una categoría',null,'Yo Reporto','Aceptar');
        }
        else if($("#selectMuni").val()=="Municipio")
        {
          navigator.notification.alert('Selecciona un municipio',null,'Yo Reporto','Aceptar');
        }
}//report

function processSuccessInsertarEmergencia(data, status, req) 
{ 
  if (status == "success")
  {
    var cod;
   
  
    //alert(req.responseText);
    $("EmergenciaComunidad", req.responseText).each(function(){
      cod=$("CodigoEmergenciaComunidad", this).text();
      //alert("Emergencias Reportadas: "+cod);
    });

	if(imagen==null)
	{
		navigator.notification.alert('Reporte exitoso',null,'Yo Reporto','Aceptar');
        resetMenus();
		 $.unblockUI();
        
		
		  
	}
	
    if(imagen!=null)
    {	 
     	 enviarArchivo(cod);
    }
    


    }//if success
    else
 	{
 		navigator.notification.alert('Reporte no exitoso',null,'Yo Reporto','Aceptar');
 		$.unblockUI();
	}
}//success1

function processError(data, status, req) 
{
  alert('error! '+data.state);
} 

function enviarArchivo(codigoEme)
{
  var tex=$("#txtDescripcion").val();
  var emailUsuario = window.localStorage.getItem("EmailUsuario");
  var wsUrl = window.localStorage.getItem("URL");
  var requestHeader=window.localStorage.getItem("RequestHeader");
  //var base64 = canvas.toDataURL("image/jpeg");
  //alert(base64);
  var requestInsertarArchivo =requestHeader+
  '<InsertarArchivoEmergencia xmlns="http://tempuri.org/">'+
  '<File>'+imagen+'</File>'+
  '<NombreArchivo>'+emailUsuario+codigoEme+'.jpg</NombreArchivo>'+
  '<Descripcion>Fosto</Descripcion>'+
  '<CodigoEmergencia>'+codigoEme+'</CodigoEmergencia>'+
  '<TipoArchivo>1</TipoArchivo>'+
  '</InsertarArchivoEmergencia>'+
  '</soap:Body>'+
  '</soap:Envelope>';            

  $.ajax({
    type: "POST",
    url: wsUrl,
    timeout: 1000000, 
    contentType: "text/xml",
    dataType: "xml",
    data: requestInsertarArchivo,
    success: processSuccessInsertarArchivo,
    error: processError
  });

}//enviarArchivo

function processSuccessInsertarArchivo(data, status, req) 
{ 
  if (status == "success")
  {
   navigator.notification.alert('Reporte exitoso',null,'Yo Reporto','Aceptar');
    resetMenus();
      var img = document.getElementById('smallImage');
    img.style.visibility = ('hidden');
    $.unblockUI();
      //imalert(req.responseText);
  
 }
 else
 {
 	navigator.notification.alert('Envio de archivo no exitoso',null,'Yo Reporto','Aceptar');
 	$.unblockUI();
}
}//success2




function onPhotoDataSuccess(imageData) 
{ 
  var smallImage = document.getElementById('smallImage'); 
  smallImage.style.display = 'block'; 
  smallImage.src = "data:image/jpeg;base64," + imageData; 
  imagen=imageData;
  var img = document.createElement("img");
  img.src = "data:image/gif;base64," + imageData;
  smallImage.style.visibility = ('visible');
} 

function onPhotoURISuccess(imageURI) 
{ 
  var largeImage = document.getElementById('smallImage'); 
   largeImage.style.display = 'block';
   largeImage.src = "data:image/jpeg;base64," + imageURI;
   imagen=imageURI;
   var img = document.createElement("img");
   img.src = "data:image/gif;base64," + imageURI;
   largeImage.style.visibility = ('visible');
    
  
    
} 

function getBase64FromImageUrl(URL) 
{
  var img = new Image();
  img.src = URL;
  img.onload = function () 
  {
   var canvas = document.createElement("canvas");
   canvas.width =this.width;
   canvas.height =this.height;
   var ctx = canvas.getContext("2d");
   ctx.drawImage(this, 0, 0);
   var dataURL = canvas.toDataURL("image/png");

   return  dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

 }
}


function capturePhoto() 
{ 
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, 
		destinationType: destinationType.DATA_URL, correctOrientation: true,
        targetWidth: 480, targetHeight: 480}); 
	//alert("destino: "+destinationType.DATA_URL);
} 

function getPhoto(source) 
{ 
	navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
		destinationType: destinationType.DATA_URL, correctOrientation: true, 
		sourceType: source }); 
} 

function onFail(message) 
{ 
//	alert('Foto Cancelada: ' + message); 
}

function resetMenus(){ 
    $('#selectLevel').val('Nivel');
    $('#selectLevel').selectmenu('refresh');
    $('#selectEvt').val('Categoría');
    $('#selectEvt').selectmenu('refresh');
    $('#selectMuni').val('Municipio');
    $('#selectMuni').selectmenu('refresh');
 
}




