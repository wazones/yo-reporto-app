function onGraphsReady() {
    $.blockUI({ message: 'Cargando Departamentos'});
    window.localStorage.setItem("URL", "http://www.gestiondelriesgo.gov.co/ServicioApp/EventosComunidad.asmx");
    	window.localStorage.setItem("RequestHeader", '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>');

    google.load("visualization", "1.0", {packages: ["corechart"], callback: llenarDeptos});
    //google.setOnLoadCallback();
    document.body.style.marginTop = "20px";
}
var mapaDeptos;

function llenarDeptos() {
    mapaDeptos = new Map;
    var wsUrl = window.localStorage.getItem("URL");
    var requestHeader = window.localStorage.getItem("RequestHeader");
    var soapRequest0 = requestHeader +
        '<Departamentos xmlns="http://tempuri.org/" /></soap:Body></soap:Envelope>';


    $.ajax({
        type: "POST",
        url: wsUrl,
        contentType: "text/xml",
        dataType: "xml",
        data: soapRequest0,
        success: processSuccessDepts,
        error: processError
    });


    function processSuccessDepts(data, status, req) {
        var select = document.getElementById("selectDeptGraphs");
        if (status == "success") {
            var cont = 0;
            $("Departamento", req.responseText).each(function () {
                var todo = $("Codigo", this).text();
                var cod = $("Descripcion", this).text();
                var index = todo.indexOf(cod);
                var number = todo.substring(0, index);
                mapaDeptos.put(cod, number);
                var el = document.createElement("option");
                el.textContent = cod;
                el.value = cod;
                select.appendChild(el);
                cont++;
            });

            llenarEventos();
        }//if success


    }//success0

    function processError(data, status, req) {
        alert('err ' + data.state);
    }

    function llenarEventos() {
        $.blockUI({ message: 'Cargando Eventos...'});
        $.ajax({
            type: "GET",
            url: "res/graf5.json",
            timeout: 1000000,
            contentType: "application/text",
            success: function (data) {
                window.db = JSON.parse(data);
                firstRender();
            },
            error: processError
        });

    }
}
function firstRender() {
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
        //$.blockUI({ message: 'Cargando Municipios...'});
        window.localStorage.setItem("Latitud", position.coords.latitude);
        window.localStorage.setItem("Longitud", position.coords.longitude);

        var latitud=window.localStorage.getItem("Latitud");
        var longitud=window.localStorage.getItem("Longitud");
        $.get("http://yoreporto.herokuapp.com/coordinates/",{"lat":latitud,"long":longitud,count:1},"json").
            done(function(data)
            {
                //Solo 1 muni
                data.nearest.forEach(function(elem){
                    var muni = {};
                    muni.id=elem.ID_MUNICIPIO;
                    muni.nombre=elem.NOMBRE_MUNICIPIO;
                    muni.codDepto=elem.ID_DEPARTAMENTO;
                    muni.nombreDepto = elem.NOMBRE_DEPARTAMENTO;
                    $("#selectDeptGraphs").val(muni.nombreDepto);
                    $("#selectDeptGraphs").trigger('change');
                    $("#selectMunGraphs").one('loadMunis',function(){
                        $("#selectMunGraphs").val(muni.nombre);
                        $("#selectMunGraphs").trigger("change");
                    });
                    //$("#selectMunGraphs").val(muni.nombre);
                    //render();
                });
               // $.unblockUI();
            }).fail(function(){
               // $.unblockUI();
                alert('Intenta más tarde');
            });
    };

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
function getCodeDept(depto) {
    return mapaDeptos.get(depto);
}


function getMunicipiosDepto() {
	$('#selectMunGraphs option:first').attr("selected", 'true');
	 $('#selectMunGraphs').selectmenu('refresh');
		
    var selectedDept = $("#selectDeptGraphs").val();
    if (selectedDept != "Departamento") {
        $.blockUI({ message: 'Cargando Municipios'});
        var sel = document.getElementById("selectMunGraphs");
        sel.value = "Municipio";
        sel.options.length = 1;


        var selectedDept = $("#selectDeptGraphs").val();
        var selectMuni = document.getElementById("selectMunGraphs");

        var codDepto = getCodeDept($("#selectDeptGraphs").val());

        var wsUrl = window.localStorage.getItem("URL");
        var requestHeader = window.localStorage.getItem("RequestHeader");
        var soapRequest0 = requestHeader +
            '<Municipios xmlns="http://tempuri.org/">' +
            '<CodigoDepartamento>' + codDepto + '</CodigoDepartamento>' +
            '</Municipios>' +
            '</soap:Body>' +
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


        function processSuccess0(data, status, req) {
            var select = document.getElementById("selectMunGraphs");
            if (status == "success") {
                var cont = 0;
                $("Municipio", req.responseText).each(function () {
                    $.unblockUI();
                    var todo = $("Codigo", this).text();
                    var cod = $("Descripcion", this).text();
                    var index = todo.indexOf(cod);
                    var number = todo.substring(0, index);
                    var el = document.createElement("option");
                    el.textContent = cod;
                    el.value = cod;
                    select.appendChild(el);
                    cont++;
                });
                $(select).trigger('loadMunis');
            }//if success


        }//success0

        function processError(data, status, req) {
            alert('err ' + data.state);
        }

    }//if selected !=departamento

}//getmunicipiosdepto 

function render() {

    var selectedGraph = $("#selectType").val();
    var selectedDept = $("#selectDeptGraphs").val();
    var selectedMun = $("#selectMunGraphs").val();
    if (selectedDept != "Departamento" && selectedMun != "Municipio") {

        if (selectedGraph == "Torta") {
            renderPieChart();
            $.unblockUI();
        }
        else if (selectedGraph == "Linea de tiempo") {
            renderLineChart();
            $.unblockUI();
        }//selectedgraph!= torta
        else {
            renderColumnChart();
            $.unblockUI();
        }
    }//depto!= departamento
}
function renderLineChart() {
    
    setTimeout(drawChart, 0);
    function drawChart() {
        var header = ["Mes"];
        for (x in window.db) {
            header.push(x);
        }
        var mat = [];
        mat.push(header);
        months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        years = [];

        var currDate = new Date();
        for (var i = currDate.getMonth() + 1; i < 12; ++i) {
            mat.push([ months[i] ]);
            years.push("" + (currDate.getYear() + 1900 - 1));
        }
        var str = "";

        for (var i = 0; i <= currDate.getMonth(); ++i) {
            mat.push([ months[i] ]);
            str += months[i] + ",";
            years.push("" + (currDate.getYear() + 1900));
        }
        // alert(str);

        var depto = $("#selectDeptGraphs").val();
        var muni = $("#selectMunGraphs").val();
        for (var i = 1; i < header.length; ++i) {
            var desastre = header[i];
            for (var j = 1; j < mat.length; ++j) {
                var year = years[ j - 1 ];
                var month = mat[j][0];
                if (window.db[header[i]] != null &&
                    window.db[header[i]][year] != null &&
                    window.db[header[i]][year][ month ] != null &&
                    window.db[header[i]][year][ month ][ depto ] != null &&
                    window.db[header[i]][year][ month ][ depto ][ muni ] != null
                    ) {
                    mat[j].push(window.db[header[i]][year][ month ][ depto ][ muni ]);
                }
                else {
                    mat[j].push(0);
                }
            }
        }

        var data = google.visualization.arrayToDataTable(mat);

        var options = {
            title: 'EVENTOS EN ' + muni,
            legend: {position: 'none'}
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div3'));

        chart.draw(data, options);
    }
}

function renderPieChart() {
    $.unblockUI();
    setTimeout(drawChart, 0);

    function drawChart() {
        var months2 = [];
        months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        var years = [];
        var currDate = new Date();
        for (var i = currDate.getMonth() + 1; i < 12; ++i) {
            months2.push([ months[i] ]);
            years.push("" + (currDate.getYear() + 1900 - 1));
        }
        for (var i = 0; i <= currDate.getMonth(); ++i) {
            months2.push([ months[i] ]);
            years.push("" + (currDate.getYear() + 1900));
        }


        var data = [
            ['Desastres', 'Ocurrencias']
        ];
        var depto = $("#selectDeptGraphs").val();
        var muni = $("#selectMunGraphs").val();
        var total = 0;
        for (x in window.db) {
            var sum = 0;
            for (var i = 0; i < months2.length; ++i) {
                var month = months2[i];
                var year = years[i];
                if (window.db[x] != null &&

                    window.db[x][year] != null &&
                    window.db[x][year][ month ] != null &&
                    window.db[x][year][ month ][ depto ] != null &&
                    window.db[x][year][ month ][ depto ][ muni ] != null
                    ) {
                    sum += window.db[x][year][ month ][ depto ][ muni ];
                }
            }
            data.push([x, sum]);
            total+=sum;
        }
        if(total == 0) {

        }
        var data = google.visualization.arrayToDataTable(data);
        var options = {
               title: 'EVENTOS EN ' + muni,
            is3D: true
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart_div3'));
        chart.draw(data, options);
    }
}
function renderColumnChart() {
    $.unblockUI();
    //isStacked: true,
    setTimeout(drawChart, 0);
    function drawChart() {
        var header = ["Mes"];
        for (x in window.db) {
            header.push(x);
        }
        var mat = [];
        mat.push(header);
        months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        years = [];

        var currDate = new Date();
        for (var i = currDate.getMonth() + 1; i < 12; ++i) {
            mat.push([ months[i] ]);
            years.push("" + (currDate.getYear() + 1900 - 1));
        }
        var str = "";

        for (var i = 0; i <= currDate.getMonth(); ++i) {
            mat.push([ months[i] ]);
            str += months[i] + ",";
            years.push("" + (currDate.getYear() + 1900));
        }
        // alert(str);

        var depto = $("#selectDeptGraphs").val();
        var muni = $("#selectMunGraphs").val();
        for (var i = 1; i < header.length; ++i) {
            var desastre = header[i];
            for (var j = 1; j < mat.length; ++j) {
                var year = years[ j - 1 ];
                var month = mat[j][0];
                if (window.db[header[i]] != null &&
                    window.db[header[i]][year] != null &&
                    window.db[header[i]][year][ month ] != null &&
                    window.db[header[i]][year][ month ][ depto ] != null &&
                    window.db[header[i]][year][ month ][ depto ][ muni ] != null
                    ) {
                    mat[j].push(window.db[header[i]][year][ month ][ depto ][ muni ]);
                }
                else {
                    mat[j].push(0);
                }
            }
        }

        var data = google.visualization.arrayToDataTable(mat);

        var options = {
            title: 'EVENTOS EN ' + muni,
            legend: {position: 'none'},
            isStacked:true
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div3'));

        chart.draw(data, options);
    }
}