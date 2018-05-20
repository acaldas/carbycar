var createMap = function() {
    var location = { lat: 41.4516899, lng: -8.2731611 };
    var map = new google.maps.Map(document.getElementById("map-home"), {
        center: location,
        zoom: 14
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    var infowindow = new google.maps.InfoWindow({
        content: "<b>Agrupamento Santos Simões</b>"
    });
    infowindow.open(map, marker);
};

createMap();
