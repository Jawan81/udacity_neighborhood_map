var Location = function(lat, lng) {
    this.lat = lat;
    this.lng = lng;
};



var googleMaps = {
    initialize: function(htmlElement, lat, lng) {
        this.searchResults = ko.observableArray();
        var latLng = new google.maps.LatLng(lat, lng);
        var mapOptions = {
            center: latLng,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.geocoder = new google.maps.Geocoder();
        this.map = new google.maps.Map(htmlElement, mapOptions);
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


var SearchViewModel = function(){
    var self = this;
    self.searchValue = ko.observable('Hamburg');

    self.search = function() {
        googleMaps.search(self.searchValue());
    };

    self.searchResults = ko.observableArray([]);
    self.selectedAddress = ko.observable();
    self.selectAddress = function() {
        self.selectedAddress(this);
    };

    googleMaps.searchResults.subscribe(function() {
        var results = googleMaps.searchResults();
        var formatted = [];

        results.forEach(function(result) {
            formatted.push({name: result.formatted_address, result: result});
        });

        self.searchResults(formatted);
    });

    self.selectedAddress.subscribe(function(selected) {
        if (undefined === selected) {
            return;
        }
        self.searchValue(selected.name);
        googleMaps.setLocation(selected.result);
    });
};

googleMaps.initialize(document.getElementById("map_canvas"),
    53.5510846, 9.9936818);
ko.applyBindings(new SearchViewModel());

//$(document).ready(function() {
//    setTimeout(function() {
//        googleMaps.search('Berlin, Germany');
//    }, 5000);
//});

//$('#location-search').keyup(function(event) {
//    var $test = $('#test');
//    var pattern = /^[A-Z0-9]/i;
//    if (event.key.match(pattern)) {
//        $test.text($test.text() + event.key);
//    }
//});