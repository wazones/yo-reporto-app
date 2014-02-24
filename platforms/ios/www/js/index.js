var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', this.onOffline, false);
    },
    onDeviceReady: function () {
        console.log('ready papa2');
    },
    onOffline: function () {
        console.log('offline papa');
        navigator.notification.alert('Para usar esta aplicación debes tener conexión a internet');
    }
};
