
var googleMaps = {
    initialize: function(mapCanvas, address) {
        this.searchResults = ko.observableArray();
        var latLng = new google.maps.LatLng(address.lat, address.lng);
        var mapOptions = {
            center: latLng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.geocoder = new google.maps.Geocoder();
        this.map = new google.maps.Map(mapCanvas, mapOptions);
        this.infowindow =  new google.maps.InfoWindow();
        this.currentMarker = null;
    },
    search: function(address) {
        var self = this;
        this.geocode(address, function(results) {
            self.searchResults(results);
        });
    },
    updateLatLng: function(place, callback) {
        this.geocode(place.address, function(results) {
            if ('undefined' === typeof(results[0])) {
                return;
            }
            var location = results[0].geometry.location;
            place.lat = location.lat();
            place.lng = location.lng();
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
    getCenter: function() {
        var gmCenter = this.map.getCenter();

        return {
            lat: gmCenter.lat(),
            lng: gmCenter.lng()
        };
    },
    setCenter: function(place) {
        var self = this;
        self.map.setCenter(place.location);
    },
    markerBounce: function(marker) {
        if (null !== this.currentMarker
            && this.currentMarker !== marker
            && this.currentMarker.getAnimation() !== null) {
            this.currentMarker.setAnimation(null);
        }

        if (this.currentMarker !== marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        this.currentMarker = marker;
    },
    createMarkerForPlace: function(place, size) {
        var self = this;

        if (undefined === size) {
            size = { width: 71, height: 71 };
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
            zIndex: place.priority
        });

        marker.addListener('click', function() {
            self.markerBounce(marker);
            self.infowindow.setContent(place.name);
            self.infowindow.open(self.map, this);
        });

        place.marker = marker;
    },
    showOrHidePlace: function(place) {
        if(place.active) {
            place.marker.setMap(this.map);
        } else {
            place.marker.setMap(null);
        }
    }
};
