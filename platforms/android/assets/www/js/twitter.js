function onTwitterReady() {
    $.blockUI({ message: 'Cargando tweets...'});
    $.get("http://yoreporto.herokuapp.com/twitter/tweets/", {"count": 20}, "json").
        done(function (data) {
            $.unblockUI();
            var lista = document.getElementById("tweets");
            for (x in data.tweets) {
                var trino = data.tweets[x].text;
                var image = data.tweets[x].profile_image_url;
                var el = document.createElement("il");
                var pe = document.createElement("p");
                pe.innerHTML = trino;
                var img = document.createElement("img");
                img.src = image;
                //el.textContent = trino;
                el.appendChild(img);
                el.appendChild(pe);
                //el.list-style-image = url(image);
                lista.appendChild(el);
            }
        }).fail(function (data) {
            alert('Fail :( => '+data);
            $.unblockUI();
        });

    $.get("http://yoreporto.herokuapp.com/twitter/banner/").
        done(function (data) {
            var lista = document.getElementById("sizes");
            var banner = data.sizes.web.url;
            var bannerTwitter = document.getElementById("twitterheader");
            bannerTwitter.src = banner;
        });


}
