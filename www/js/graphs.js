function onGraphsReady() {
    $.blockUI({ message: 'Cargando departamentos'});
    window.localStorage.setItem("URL", "http://www.gestiondelriesgo.gov.co/ServicioApp/EventosComunidad.asmx");
    window.localStorage.setItem("RequestHeader", '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>');

    llenarDeptos();
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
        $.blockUI({ message: 'Cargando eventos'});
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
            navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 20000, enableHighAccuracy: false });
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
        //$.blockUI({ message: 'Cargando Municipios...'});
        window.localStorage.setItem("Latitud", position.coords.latitude);
        window.localStorage.setItem("Longitud", position.coords.longitude);

        var latitud = window.localStorage.getItem("Latitud");
        var longitud = window.localStorage.getItem("Longitud");
        $.get("http://yoreporto.herokuapp.com/coordinates/", {"lat": latitud, "long": longitud, count: 1}, "json").
            done(function (data) {
                //Solo 1 muni
                data.nearest.forEach(function (elem) {
                    var muni = {};
                    muni.id = elem.ID_MUNICIPIO;
                    muni.nombre = elem.NOMBRE_MUNICIPIO;
                    muni.codDepto = elem.ID_DEPARTAMENTO;
                    muni.nombreDepto = elem.NOMBRE_DEPARTAMENTO;
                    $("#selectDeptGraphs").val(muni.nombreDepto);
                    $("#selectDeptGraphs").trigger('change');
                    $("#selectMunGraphs").one('loadMunis', function () {
                        $("#selectMunGraphs").val(muni.nombre);
                        $("#selectMunGraphs").trigger("change");
                    });
                    //$("#selectMunGraphs").val(muni.nombre);
                    //render();
                });
                // $.unblockUI();
            }).fail(function () {
                // $.unblockUI();
                alert('Intenta más tarde');
            });
    };

    function onTimeout(button) {
        //alert("seleccionaste: "+button);

        if (button == 2) {
            $.blockUI({ message: 'Cargando posición por red...'});
            watchID = navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 20000, enableHighAccuracy: false });
        }
        else {
            $.blockUI({ message: 'Cargando posición por GPS...'});
            watchID = navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 10000, enableHighAccuracy: true });
        }


    }
}
function getCodeDept(depto) {
    return mapaDeptos.get(depto);
}


function getMunicipiosDepto() {
    $('#selectMunGraphs').val('Municipio');
    $('#selectMunGraphs').selectmenu('refresh');

    var selectedDept = $("#selectDeptGraphs").val();
    if (selectedDept != "Departamento") {
        $.blockUI({ message: 'Cargando municipios...'});
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

function renderPieChart() {
    $('#chart_div canvas').remove();
    $('#legend').remove();
    var elementID = 'chartCanvas'; // Unique ID
    $('<canvas>').attr({
        id: elementID
    }).css({
            background: "#FFFFFF"
        }).appendTo('#chart_div');

    $('<div>').attr({
        id: 'legend'
    }).css({
            background: "#FFFFFF"
        }).appendTo('#chart_div');
    var canvas = document.getElementById(elementID); // Use the created element
    var ctx = canvas.getContext("2d");

    var monthsAndYears = genMonthsAndYears();
    var months = monthsAndYears.months;
    var years = monthsAndYears.years;
    var datasets = [];
    var depto = $("#selectDeptGraphs").val();
    var muni = $("#selectMunGraphs").val();
    var total = 0;
    for (x in window.db) {
        var data = 0;
        var hasEvents = false;
        for(var i = 0;i<months.length;++i) {
            if (window.db[x] != null &&
                window.db[x][years[i]] != null &&
                window.db[x][years[i]][ months[i] ] != null &&
                window.db[x][years[i]][ months[i] ][ depto ] != null &&
                window.db[x][years[i]][ months[i] ][ depto ][ muni ] != null
                ) {
                total+=(window.db[x][years[i]][ months[i] ][ depto ][ muni ]);
                data+=(window.db[x][years[i]][ months[i] ][ depto ][ muni ]);
                hasEvents = true;
            }
        }
        if(hasEvents) {
            var color = new RandomRgb().toString();
            datasets.push({title:x,value:data,color:color});
        }
    }
    if(datasets.length > 0) {
        for(x in datasets) {
            datasets[x].title+=( " "+((datasets[x].value*100)/total).toFixed(2)+"%" );
        }
        new Chart(ctx).Pie(
            datasets,
            {animation: true, animationSteps:10}
        );
        legend(document.getElementById('legend'), datasets);
    }
    else {
        $('#chart_div canvas').remove();
        $('#legend').remove();
        $('<div>No hay eventos registrados</div>').attr({
            id: 'legend'
        }).css({
                background: "#FFFFFF"
            }).appendTo('#chart_div');
    }
}
function renderColumnChart() {
    $('#chart_div canvas').remove();
    $('#legend').remove();
    var elementID = 'chartCanvas'; // Unique ID
    $('<canvas>').attr({
        id: elementID
    }).css({
            background: "#FFFFFF"
        }).appendTo('#chart_div');

    $('<div>').attr({
        id: 'legend'
    }).css({
            background: "#FFFFFF"
        }).appendTo('#chart_div');
    var canvas = document.getElementById(elementID); // Use the created element
    var ctx = canvas.getContext("2d");

    var monthsAndYears = genMonthsAndYears();
    var months = monthsAndYears.months;
    var years = monthsAndYears.years;
    var datasets = [];
    var depto = $("#selectDeptGraphs").val();
    var muni = $("#selectMunGraphs").val();
    for (x in window.db) {
        var data = [];
        var hasEvents = false;
        for(var i = 0;i<months.length;++i) {
            if (window.db[x] != null &&
                window.db[x][years[i]] != null &&
                window.db[x][years[i]][ months[i] ] != null &&
                window.db[x][years[i]][ months[i] ][ depto ] != null &&
                window.db[x][years[i]][ months[i] ][ depto ][ muni ] != null
                ) {
                data.push(window.db[x][years[i]][ months[i] ][ depto ][ muni ]);
                hasEvents = true;
            }
            else {
                data.push(0);
            }
        }
        if(hasEvents) {
            datasets.push(new DataSet({title:x,data:data}));
        }
    }
    if(datasets.length > 0) {
        var chartData = {labels: months,datasets:datasets};
        new Chart(ctx).Bar(
            chartData,
            {animation: true, animationSteps:10 ,scaleShowLabels: true,scaleFontSize:9}
        );
        legend(document.getElementById('legend'), chartData);
    }
    else {
        $('#chart_div canvas').remove();
        $('#legend').remove();
        $('<div>No hay eventos registrados</div>').attr({
            id: 'legend'
        }).css({
                background: "#FFFFFF"
            }).appendTo('#chart_div');
    }
}
function renderLineChart() {
    $('#chart_div canvas').remove();
    $('#legend').remove();
    var elementID = 'chartCanvas'; // Unique ID
    $('<canvas>').attr({
        id: elementID
    }).css({
            background: "#FFFFFF"
        }).appendTo('#chart_div');

    $('<div>').attr({
        id: 'legend'
    }).css({
            background: "#FFFFFF"
        }).appendTo('#chart_div');
    var canvas = document.getElementById(elementID); // Use the created element
    var ctx = canvas.getContext("2d");

    var monthsAndYears = genMonthsAndYears();
    var months = monthsAndYears.months;
    var years = monthsAndYears.years;
    var datasets = [];
    var depto = $("#selectDeptGraphs").val();
    var muni = $("#selectMunGraphs").val();
    for (x in window.db) {
        var data = [];
        var hasEvents = false;
        for(var i = 0;i<months.length;++i) {
             if (window.db[x] != null &&
             window.db[x][years[i]] != null &&
             window.db[x][years[i]][ months[i] ] != null &&
             window.db[x][years[i]][ months[i] ][ depto ] != null &&
             window.db[x][years[i]][ months[i] ][ depto ][ muni ] != null
             ) {
                data.push(window.db[x][years[i]][ months[i] ][ depto ][ muni ]);
                 hasEvents = true;
             }
             else {
                data.push(0);
             }
        }
        if(hasEvents) {
            datasets.push(new DataSet({title:x,data:data}));
        }
    }
    if(datasets.length > 0) {
        var chartData = {labels: months,datasets:datasets};
        new Chart(ctx).Line(
            chartData,
            {animation: true, animationSteps:10 ,scaleShowLabels: true,scaleFontSize:9}
        );
        legend(document.getElementById('legend'), chartData);
    }
    else {
        $('#chart_div canvas').remove();
        $('#legend').remove();
        $('<div>No hay eventos registrados</div>').attr({
            id: 'legend'
        }).css({
                background: "#FFFFFF"
            }).appendTo('#chart_div');
    }

}

function legend(parent, data) {
    parent.className = 'legend';
    var datas = data.hasOwnProperty('datasets') ? data.datasets : data;

    datas.forEach(function (d) {
        var title = document.createElement('span');
        title.className = 'title';
        title.style.borderColor = d.hasOwnProperty('strokeColor') ? d.strokeColor : d.color;
        title.style.borderStyle = 'solid';
        parent.appendChild(title);

        var text = document.createTextNode(d.title);
        title.appendChild(text);
    });
}
function DataSet(options) {
    if (!options) {
        options = {};
    }
    var myColor =  new RandomRgb();
    this.fillColor = myColor.alpha(0.5).toString();
    this.strokeColor = myColor.alpha(1).toString();
    this.pointColor = myColor.alpha(1).toString();
    this.pointStrokeColor = "#fff";
    this.data = options.data || [];
    this.title = options.title || "";
}

function RandomRgb() {
    this.r = randomColor();
    this.g = randomColor();
    this.b = randomColor();
    this.a = 1;

    this.alpha = function(_a) {
        this.a=_a;
        return this;
    };
    this.toString=  function() {
        return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
    }
    function randomColor() {
        return Math.floor(((1 + Math.floor(Math.random() * 254))+254)/2);
    }
}
 function genMonthsAndYears() {
     var months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

     var years = [];
     var months2 = []

     var currDate = new Date();
     for (var i = currDate.getMonth() + 1; i < 12; ++i) {
         months2.push(months[i]);
         years.push("" + (currDate.getYear() + 1900 - 1));
     }
     for (var i = 0; i <= currDate.getMonth(); ++i) {
         months2.push(months[i]);
         years.push("" + (currDate.getYear() + 1900));
     }
     return {
         months:months2,
         years:years
     };
 }