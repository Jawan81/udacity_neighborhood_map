
var googleMaps = {
    initialize: function(mapCanvas, address) {
        this.searchResults = ko.observableArray();
        var latLng = new google.maps.LatLng(address.lat, address.lng);
        var mapOptions = {
            center: latLng,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.geocoder = new google.maps.Geocoder();
        this.map = new google.maps.Map(mapCanvas, mapOptions);
        this.createMarker(latLng, 'icons/moderntower.png');
    },
    search: function(address) {
        var self = this;
        this.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                self.searchResults(results);
            } else {
                self.searchResults([]);
            }
        });
    },
    setLocation: function(geoResult) {
        var self = this;
        var location = geoResult.geometry.location;
        self.map.setCenter(location);
        this.createMarker(location, 'icons/moderntower.png');
    },
    createMarker: function(location, icon) {
        var self = this;

        var marker = new google.maps.Marker({
            map: self.map,
            position: location,
            icon: icon
        });
    }
};
