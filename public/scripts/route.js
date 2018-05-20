(function($) {
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

    $("#location-picker").locationpicker({
        radius: 10,
        location: { latitude: 41.4516899, longitude: -8.2731611 },
        inputBinding: {
            locationNameInput: $("input[name='locationText']"),
            latitudeInput: $("input[name='locationLatitude']"),
            longitudeInput: $("input[name='locationLongitude']")
        },
        enableAutocomplete: true
    });
})(jQuery);
