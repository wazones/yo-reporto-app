var pictureSource; // fuente de la foto
var destinationType; // formato de lo retornado 
var imagen;   //donde se guarda el codigo base64 de la foto
var mapa;  //un map para almacenar datos
var mapa2;  //""
var mapa3;
var canvas;
function start() 
{ 
	//alert("ST");
	mapa = new Map;
	mapa2 = new Map;
	mapa3 = new Map;
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
               var soapRequest0 =requestHeader+
                '<Eventos xmlns="http://tempuri.org/" /></soap:Body></soap:Envelope>';            

		
    $.ajax({
            type: "POST",
            url: wsUrl,
            contentType: "text/xml",
            dataType: "xml",
            data: soapRequest0,
            success: processSuccess0,
            error: processError
    });

           

    function processSuccess0(data, status, req) 
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
		var soapRequest00 =requestHeader+'<NivelesEstimadosComunidad xmlns="http://tempuri.org/" /></soap:Body></soap:Envelope>';            

		$.ajax({
            type: "POST",
            url: wsUrl,
            contentType: "text/xml",
            dataType: "xml",
            data: soapRequest00,
            success: processSuccess00,
            error: processError
    	});

    function processSuccess00(data, status, req) 
	{ 
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
	
	
}//start

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
        	var now = new Date();
        	
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
               	 var soapRequest1 =requestHeader+
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
      			 // '<FechaEvento>'+now+'</FechaEvento>'+
                 '</InsertarEmergenciaComunidad>'+
                 '</soap:Body>'+
                 '</soap:Envelope>'; 
                
                $.ajax({
                    type: "POST",
                    url: wsUrl,
                    contentType: "text/xml",
                    dataType: "xml",
                    data: soapRequest1,
                    success: processSuccess1,
                    error: processError
                });
		 
		 //});//done
		
         } //if (comboboxes not OK)
   		else if($("#selectLevel").val()=="Nivel")
   		{
   			alert("Selecciona un Nivel de Gravedad");
   		}
  	    else if($("#selectEvt").val()=="Categoría")
  		{
   			alert("Selecciona Una Categoría");
   		}
   		else if($("#selectMuni").val()=="Municipio")
  		{
   			alert("Selecciona Un Municipio");
   		}
}//report

function processSuccess1(data, status, req) 
{ 
    if (status == "success")
    {
        var cod;
        alert("Reporte Exitoso");
        alert(req.responseText);
        $("EmergenciaComunidad", req.responseText).each(function(){
            cod=$("CodigoEmergenciaComunidad", this).text();
          	alert("Emergencias Reportadas: "+cod);
      	});
               
        if(imagen!=null)
       		 enviarArchivo(cod);
        		
        		 
    }//if success
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
    var base64 = canvas.toDataURL("image/jpeg");
    var soapRequest2 =requestHeader+
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
        data: soapRequest2,
        success: processSuccess2,
        error: processError
    });

}//enviarArchivo
        
function processSuccess2(data, status, req) 
{ 
    if (status == "success")
    {
       alert("archivo enviado"); 
       alert(req.responseText);
    }
    else
    {
        alert("envio de archivo no exitoso");
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

 canvas = document.createElement("canvas");
canvas.width = img.width;
canvas.height = img.height;
var ctx = canvas.getContext("2d");
ctx.scale(0.25, 0.25);
ctx.drawImage(img);
} 
 
function onPhotoURISuccess(imageURI) 
{ 
 	var largeImage = document.getElementById('smallImage'); 
 	var texto = document.getElementById('txtDescripcion'); 
 	var code=getBase64FromImageUrl(imageURI)
  	largeImage.style.display = 'block';  
 	largeImage.src = imageURI; 
 	texto.value=code;
 	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var img = document.getElementById("smallImage");
	ctx.drawImage(img, 10, 10);
	var todo = c.toDataURL();
	var index=todo.indexOf("base64,");
	index+=7;
	var newData=todo.substring(index);
	window.localStorage.setItem("CodigoFoto", newData);
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
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 10, 
		destinationType: destinationType.DATA_URL }); 
	//alert("destino: "+destinationType.DATA_URL);
} 

function getPhoto(source) 
{ 
	navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
		destinationType: destinationType.FILE_URI, 
		sourceType: source }); 
} 

function onFail(message) 
{ 
	alert('Foto Cancelada: ' + message); 
}


