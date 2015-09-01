"use strict";

var googlePlaces = {
    initialize: function(data) {
        this.map = data.map;
        this.resultCallback = data.resultCallback;
        this.service = new google.maps.places.PlacesService(this.map);
    },
    search: function(types) {
        var self = this;
        var location = self.map.getCenter();
        var request = {
            location: location,
            radius: 500,
            types: types
        };

        self.service.nearbySearch(request, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log('#### Google Places');
                console.log(results);
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var place = new Place({
                        location: result.geometry.location,
                        name: result.name,
                        types: result.types, // TODO: wrapper für types
                        address: result.vicinity,
                        icon: result.icon,
                        api: 'googlePlaces'
                    });

                    self.resultCallback(place);
                }
            }
        });
    }
};
