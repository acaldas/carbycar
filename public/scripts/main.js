var createMap = function() {
    var mapElement = document.getElementById("map-home");
    var location = {
        lat: parseFloat(mapElement.getAttribute("data-latitude")),
        lng: parseFloat(mapElement.getAttribute("data-longitude"))
    };
    var map = new google.maps.Map(mapElement, {
        center: location,
        zoom: 14
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    var infowindow = new google.maps.InfoWindow({
        content: "<b>" + mapElement.getAttribute("data-name") + "</b>"
    });
    infowindow.open(map, marker);
};

createMap();
