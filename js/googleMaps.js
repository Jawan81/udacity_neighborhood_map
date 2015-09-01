
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
        this.markers = {};
        this.createMarker({location:latLng, name: address.name, icon: 'icon/moderntower.png'});
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
        this.createMarker(place);
    },
    createMarker: function(place, size) {
        var self = this;

        if (undefined === size) {
            size = { width: 71, height: 71 };
        }

        var zIndex = 0;
        if (undefined !== place.priority) {
            zIndex =  place.priority;
        }

        var image = {
            url: place.icon,
            size: new google.maps.Size(size.width, size.height),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(size.width / 3, size.width / 3)
        };

        var marker = new google.maps.Marker({
            map: self.map,
            position: place.location,
            icon: image,
            zIndex: zIndex
        });

        if (undefined === self.markers[place.api]) {
            self.markers[place.api] = [];
        }

        self.markers[place.api].push(marker);

        google.maps.event.addListener(marker, 'click', function() {
            self.infowindow.setContent(place.name);
            self.infowindow.open(self.map, this);
        });
    },
    hideMarkers: function(api) {
        this.setMarkersMap(api, null);
    },
    showMarkers: function(api) {
        this.setMarkersMap(api, this.map);
    },
    checkMarkers: function(api, activate) {
        if (activate) {
            googleMaps.showMarkers(api);
        } else {
            googleMaps.hideMarkers(api);
        }
    },
    clearMarkers: function() {
        var self = this;

        Object.keys(this.markers).forEach(function(api) {
            self.setMarkersMap(api, null);
        });

        this.markers = {};
    },
    setMarkersMap: function(api, map) {
        if (undefined === this.markers[api]) {
            return;
        }

        for (var i = 0; i < this.markers[api].length; i++) {
            this.markers[api][i].setMap(map);
        }
    }


};
