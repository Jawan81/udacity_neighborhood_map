
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
        this.infowindow =  new google.maps.InfoWindow();
        this.createMarker({location:latLng, name: address.name}, 'icon/moderntower.png');
    },
    search: function(address) {
        var self = this;
        this.geocode(address, function(results) {
            self.searchResults(results);
        });
    },
    updateLatLng: function(place, callback) {
        this.geocode(place.address, function(results) {
            if (undefined === results[0]) {
                return;
            }
            var location = results[0].geometry.location;
            console.log(location);
            place.lat = location.A;
            place.lng = location.F;
            place.location = location;

            if (undefined !== callback) {
                callback(place);
            }
        });
    },
    geocode: function(address, callback) {
        this.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results);
            } else {
                callback([]);
            }
        });
    },
    setCenter: function(place) {
        var self = this;
        self.map.setCenter(place.location);
        this.createMarker(place, 'icon/moderntower.png');
    },
    createMarker: function(place, icon) {
        var self = this;

        var marker = new google.maps.Marker({
            map: self.map,
            position: place.location,
            icon: icon
        });

        google.maps.event.addListener(marker, 'click', function() {
            self.infowindow.setContent(place.name);
            self.infowindow.open(self.map, this);
        });
    }
};
