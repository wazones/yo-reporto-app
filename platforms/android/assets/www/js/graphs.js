function onGraphsReady(){
	google.load("visualization", "1.0", {packages:["corechart"],callback:llenarDeptos});
    //google.setOnLoadCallback();
    document.body.style.marginTop = "20px";
}
var mapaDeptos;

function llenarDeptos()
{
	mapaDeptos = new Map;
	var wsUrl = window.localStorage.getItem("URL");
	var requestHeader=window.localStorage.getItem("RequestHeader");
               var soapRequest0 =requestHeader+
                '<Departamentos xmlns="http://tempuri.org/" /></soap:Body></soap:Envelope>';            
  $.blockUI({ message: 'Cargando Departamentos'});
		
    $.ajax({
            type: "POST",
            url: wsUrl,
            contentType: "text/xml",
            dataType: "xml",
            data: soapRequest0,
            success: processSuccessDepts,
            error: processError
    });

           

    function processSuccessDepts(data, status, req) 
    { 
       	 var select = document.getElementById("selectDeptGraphs");
         if (status == "success")
         {
              var cont=0;
              $("Departamento", req.responseText).each(function()
              {
              	var todo=$("Codigo", this).text();
              	var cod=$("Descripcion", this).text();
              	var index=todo.indexOf(cod);
              	var number=todo.substring(0,index);
              	mapaDeptos.put(cod,number);
          	  	var el = document.createElement("option");
          	  	el.textContent = cod;
          	  	el.value = cod;
          	  	select.appendChild(el);
          	  	cont++;
      		  });
               
        llenarEventos();
        }//if success
        	
        	
    }//success0
        
    function processError(data, status, req) 
    {
        alert('err '+data.state);
    } 
    
    function llenarEventos()
    {
    $.blockUI({ message: 'Cargando Eventos'});
    	$.ajax({
        type: "GET",
        url: "res/graf5.json",
        timeout: 1000000, 
        contentType: "application/text",
        success: function(data){
       		window.db = JSON.parse(data); 
       		render0();
        },
        error: processError
    });
    
    }
	

}

function getCodeDept(depto)
{
 	return mapaDeptos.get(depto);
}


function getMunicipiosDepto() 
{ 

	$.blockUI({ message: 'Cargando Municipios'});
	var sel=document.getElementById("selectMunGraphs");
	sel.value= "Municipio";
	sel.options.length = 1;


	var selectedDept=$("#selectDeptGraphs").val();
	var selectMuni = document.getElementById("selectMunGraphs");

	var codDepto=getCodeDept($("#selectDeptGraphs").val());

	var wsUrl = window.localStorage.getItem("URL");
	var requestHeader=window.localStorage.getItem("RequestHeader");
               var soapRequest0 =requestHeader+
                '<Municipios xmlns="http://tempuri.org/">'+
                 '<CodigoDepartamento>'+codDepto+'</CodigoDepartamento>'+
                 '</Municipios>'+
                 '</soap:Body>'+
                 '</soap:Envelope>'; 
		
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
       	 var select = document.getElementById("selectMunGraphs");
         if (status == "success")
         {
              var cont=0;
              $("Municipio", req.responseText).each(function()
              {
                $.unblockUI();
              	var todo=$("Codigo", this).text();
              	var cod=$("Descripcion", this).text();
              	var index=todo.indexOf(cod);
              	var number=todo.substring(0,index);
          	  	var el = document.createElement("option");
          	  	el.textContent = cod;
          	  	el.value = cod;
          	  	select.appendChild(el);
          	  	cont++;
      		  });
               
        	 
        }//if success
        	
        	
    }//success0
        
    function processError(data, status, req) 
    {
        alert('err '+data.state);
    } 
	
}//getmunicipiosdepto 

function render()
{
	
	setTimeout(drawChart,0);
	
    function drawChart() {
      var header = ["Mes"];
      for (x in window.db) {
      	header.push(x);
      }
      var mat = [];
      mat.push(header);
      months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
      years = [];

      var currDate = new Date();
      for(var i = currDate.getMonth()+1;i<12;++i){
      	mat.push([ months[i] ]);
      	years.push(""+(currDate.getYear()+1900-1));
      }
      var str = "";

      for(var i = 0;i <=currDate.getMonth();++i){
      	mat.push([ months[i] ]);
      	str+=months[i]+",";
      	years.push(""+(currDate.getYear()+1900));
      }
     // alert(str);

      var depto = $("#selectDeptGraphs").val();
	  var muni = $("#selectMunGraphs").val();
      for(var i = 1;i < header.length;++i){
      	var desastre = header[i];
      	for(var j = 1; j < mat.length;++j){
			var year = years[ j-1 ];
			var month = mat[j][0];
			if(window.db[header[i]] != null &&
				window.db[header[i]][year] != null &&
				window.db[header[i]][year][ month ] != null &&
				window.db[header[i]][year][ month ][ depto ] != null &&
				window.db[header[i]][year][ month ][ depto ][ muni ] != null
			){
      			mat[j].push( window.db[header[i]][year][ month ][ depto ][ muni ] );
      		}
      		else {
      			mat[j].push(0);	
      		}
      	}
      }
		      
        var data = google.visualization.arrayToDataTable(mat);

        var options = {
          title: 'DESASTRES EN '+muni,
          legend: {position: 'none'}
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div3'));
       
        chart.draw(data, options);
      }
      //*/
}

function render0()
{
  $.unblockUI();
  setTimeout(drawChart,0);
  
    function drawChart() {
      var header = ["Mes"];
      for (x in window.db) {
        header.push(x);
      }
      var mat = [];
      mat.push(header);
      months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
      years = [];

      var currDate = new Date();
      for(var i = currDate.getMonth()+1;i<12;++i){
        mat.push([ months[i] ]);
        years.push(""+(currDate.getYear()+1900-1));
      }
      var str = "";

      for(var i = 0;i <=currDate.getMonth();++i){
        mat.push([ months[i] ]);
        str+=months[i]+",";
        years.push(""+(currDate.getYear()+1900));
      }
     // alert(str);

      var depto = "BOGOTA D.C.";
    var muni = "BOGOTA";
      for(var i = 1;i < header.length;++i){
        var desastre = header[i];
        for(var j = 1; j < mat.length;++j){
      var year = years[ j-1 ];
      var month = mat[j][0];
      if(window.db[header[i]] != null &&
        window.db[header[i]][year] != null &&
        window.db[header[i]][year][ month ] != null &&
        window.db[header[i]][year][ month ][ depto ] != null &&
        window.db[header[i]][year][ month ][ depto ][ muni ] != null
      ){
            mat[j].push( window.db[header[i]][year][ month ][ depto ][ muni ] );
          }
          else {
            mat[j].push(0); 
          }
        }
      }
          
        var data = google.visualization.arrayToDataTable(mat);

        var options = {
          title: 'DESASTRES EN '+muni,
          legend: {position: 'none'}
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div3'));
       
        chart.draw(data, options);
      }
      //*/
}

function changeGraphs()
{
     var selectedGraph =$("#selectType").val();
     alert('should change the graph to: ' + selectedGraph +'\n');
    if(selectedGraph == 'Torta') {
        alert('rendering Torta');
        renderTorta();
    }

}


function renderTorta()
{
    $.unblockUI();
    setTimeout(drawChart,0);

    function drawChart() {
        var months2 = [];
        months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
        var years = [];
        var currDate = new Date();
        for(var i = currDate.getMonth()+1;i<12;++i){
            months2.push([ months[i] ]);
            years.push(""+(currDate.getYear()+1900-1));
        }
        for(var i = 0;i <=currDate.getMonth();++i){
            months2.push([ months[i] ]);
            years.push(""+(currDate.getYear()+1900));
        }



        var data = [['Desastres','Ocurrencias']];
        var depto = $("#selectDeptGraphs").val();
        var muni = $("#selectMunGraphs").val();
        for (x in window.db) {
            var sum = 0;
            for(var i = 0;i<months2.length;++i) {
                var month = months2[i];
                var year = years[i];
                if(window.db[x] != null &&

                    window.db[x][year] != null &&
                    window.db[x][year][ month ] != null &&
                    window.db[x][year][ month ][ depto ] != null &&
                    window.db[x][year][ month ][ depto ][ muni ] != null
                    ){
                    sum+=window.db[x][year][ month ][ depto ][ muni ];
                }
            }
            data.push([x,sum]);
        }



        var data = google.visualization.arrayToDataTable(data);
        var options = {
            title: 'Desastres',
            is3D: true,
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart_div3'));
        chart.draw(data, options);
    }
}