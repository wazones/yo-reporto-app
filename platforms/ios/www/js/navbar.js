var navbar = {
    gotoReport: function () {
        $.mobile.navigate("#pg-report", {allowSamePageTransition: true, reloadPage: false, changeHash: false, transition: "none", speed: 200});
    },
    gotoGraphs: function () {
        $.mobile.navigate("#pg-graphs", {allowSamePageTransition: true, reloadPage: false, changeHash: false, transition: "none", speed: 500});
    },
    gotoTwitter: function () {
        $.mobile.navigate("#pg-twitter", {allowSamePageTransition: true, reloadPage: false, changeHash: false, transition: "none", speed: 800});
    },
    gotoAbout: function () {
        $.mobile.navigate("#pg-about", {allowSamePageTransition: true, reloadPage: false, changeHash: false, transition: "none", speed: 50});
    },
    gotoHome: function () {
        $.mobile.navigate("#pg-third", {allowSamePageTransition: true, reloadPage: false, changeHash: false, transition: "none", speed: 50});
    }
};