var school = { latitude: 41.4516899, longitude: -8.2731611 };

(function($) {
    var routeLink = $(".route-link");
    routeLink.click(function() {
        var link = jQuery(this);
        var url = link.attr("data-url");
        window.location.href = url;
    });

    var timePicker = $("select[name='time']");
    var locationLabel = $("label[for='location']");

    var updateLocationLabel = function() {
        var label =
            timePicker.prop("selectedIndex") === 0
                ? "Ponto de partida"
                : "Destino";
        locationLabel.text(label);
    };

    timePicker.change(updateLocationLabel);
    updateLocationLabel();

    var locationPicker = $("#location-picker");
    locationPicker.length &&
        locationPicker.locationpicker({
            radius: 10,
            location: school,
            inputBinding: {
                locationNameInput: $("input[name='locationText']"),
                latitudeInput: $("input[name='locationLatitude']"),
                longitudeInput: $("input[name='locationLongitude']")
            },
            enableAutocomplete: true
        });
})(jQuery);
