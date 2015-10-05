"use strict";

var googlePlaces = {
    typesMap: {
        food: ['food', 'restaurant', 'cafe', 'bakery', 'grocery_or_supermarket'],
        shopping: ['book_store', 'bicycle_store', 'clothing_store', 'electronics_store', 'home_goods_store', 'shopping_mall'],
        sight: ['art_gallery', 'stadium', 'museum', 'amusement_park', 'zoo', 'church']
    },
    initialize: function(data) {
        this.map = data.map;
        this.resultCallback = data.resultCallback;
        this.service = new google.maps.places.PlacesService(this.map);
    },
    search: function(types) {
        var self = this;
        var location = self.map.getCenter();
        var gpTypes = [];
        types.forEach(function(type) {
            gpTypes = gpTypes.concat(self.typesMap[type]);
        });

        if (gpTypes.length === 0) {
            return;
        }

        var request = {
            location: location,
            radius: 1000,
            types: gpTypes
        };

        self.service.nearbySearch(request, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                //console.log('#### Google Places');
                //console.log(results);
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var place = new Place({
                        location: result.geometry.location,
                        name: self.determinePlaceInfo(result), // result.name,
                        type: self.determineType(result.types),
                        address: result.vicinity,
                        icon: result.icon,
                        api: 'googlePlaces'
                    });

                    self.resultCallback(place);
                }
            }
        });
    },
    determineType: function(gpTypes) {
        var keys = Object.keys(this.typesMap);
        for (var j in gpTypes) {
            var gpType = gpTypes[j];
            for (var i in keys) {
                if (0 <= this.typesMap[keys[i]].indexOf(gpType)) {
                    return keys[i];
                }
            }
        }

        return 'unknown';
    },
    determinePlaceInfo: function(apiResult) {
        var name = '<h3>'+apiResult.name+'</h3>';
        if (!apiResult.hasOwnProperty('photos')) {
            return name;
        }

        var photo = '<img src="'+apiResult.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 300})+'"/>';

        return name + photo;
    }
};
