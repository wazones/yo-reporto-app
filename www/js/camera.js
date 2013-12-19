

var pictureSource; // fuente de la foto
var destinationType; // formato de lo retornado 
// Esperar que carguen las librerias del API 
document.addEventListener("deviceready",onDeviceReady,false); 
//Se obtienen las librerias del API 
function onDeviceReady() 
{ 
	pictureSource=navigator.camera.PictureSourceType; 
	destinationType=navigator.camera.DestinationType; 
} 
// Cuando se toma una foto 
function onPhotoDataSuccess(imageData) 
{ 
 //Obtener el elemento de imagen 
 var smallImage = document.getElementById('smallImage'); 
 // Mostrar elementos 
 smallImage.style.display = 'block'; 
 // Mostrar la foto 
 smallImage.src = "data:image/jpeg;base64," + imageData; 
 localStorage.setItem("CodigoFoto", imageData);
 
} 

// Cuando se carga una foto 
function onPhotoURISuccess(imageURI) 
{ 
 //Obtener el elemento de imagen/ 
 var largeImage = document.getElementById('smallImage'); 
 var texto = document.getElementById('txtDescripcion'); 
 var code=getBase64FromImageUrl(imageURI)
 // Mostrar elementos 
 largeImage.style.display = 'block'; 
 // Mostrar la foto 
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

// Llamar esta funcion con un boton 
function capturePhoto() 
{ 
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 5, 
		destinationType: destinationType.DATA_URL }); 
	//alert("destino: "+destinationType.DATA_URL);
} 

// Llamar esta funcion con un boton 
function capturePhotoEdit() 
{ 
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: 
		true, 
		destinationType: destinationType.DATA_URL }); 
} 

// Llamar esta funcion con un boton 
function getPhoto(source) { 
	navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
		destinationType: destinationType.FILE_URI, 
		sourceType: source }); 
} 

// Llamado en caso de error 
function onFail(message) { 
	alert('Photo Failed because: ' + message); 
}

window.onload=function()
{ 
	var botonCamara1 = document.getElementById("capture"); 
	//var botonCamara2 = document.getElementById("capturePhotoEdit");
	var botonCamara3 = document.getElementById("pictureSource");
	//var botonCamara4 = document.getElementById("pictureSource2");
	botonCamara1.addEventListener("click",function(){ 
		capturePhoto();
	});
	/*botonCamara2.addEventListener("click",function(){ 
		capturePhotoEdit();
	}); */
	botonCamara3.addEventListener("click",function(){ 
		getPhoto(pictureSource.PHOTOLIBRARY);
	});
	/*botonCamara4.addEventListener("click",function(){ 
		getPhoto(pictureSource.SAVEDPHOTOALBUM);
	}); */
}; 
