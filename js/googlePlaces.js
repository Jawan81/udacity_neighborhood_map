"use strict";

/**
 * The Google Places API.
 *
 * @type {{typesMap: {food: string[], shopping: string[], sight: string[]}, initialize: Function, search: Function, determineType: Function, determinePlaceInfo: Function}}
 */
var googlePlaces = {
    typesMap: {
        food: ['food', 'restaurant', 'cafe', 'bakery', 'grocery_or_supermarket'],
        shopping: ['book_store', 'bicycle_store', 'clothing_store', 'electronics_store', 'home_goods_store', 'shopping_mall'],
        sight: ['art_gallery', 'stadium', 'museum', 'amusement_park', 'zoo', 'church']
    },
    initialize: function(data) {
        this.resultCallback = data.resultCallback;
        this.service = data.placesService;
    },
    /**
     * Searches places around latlng of specific types and calls the resultCallback for every
     * place found in case of success.
     *
     * @param types The types to be search for.
     * @param latlng The location around which the search shall be initiated.
     */
    search: function(types, latlng) {
        var self = this;

        var gpTypes = [];
        types.forEach(function(type) {
            gpTypes = gpTypes.concat(self.typesMap[type]);
        });

        if (gpTypes.length === 0) {
            return;
        }

        var request = {
            location: latlng,
            radius: 1000,
            types: gpTypes
        };

        self.service.nearbySearch(request, function(results, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                return;
            }

            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var place = new Place({
                    location: result.geometry.location,
                    name: result.name,
                    renderName: self.determinePlaceInfo(result),
                    type: self.determineType(result.types),
                    address: result.vicinity,
                    icon: result.icon,
                    api: 'googlePlaces',
                    id: 'gp_' + result.id
                });

                self.resultCallback(place);
            }
        });
    },
    /**
     * Determines the internal place type from the Google Places types received from the API.
     *
     * @param gpTypes Array of Google Places types.
     * @returns {string} The internal place type.
     */
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
    /**
     * Puts together the HTMl that will be shown in the Place's Info Box.
     *
     * @param apiResult The result returned from the Google Places API.
     * @returns {string} HTML code.
     */
    determinePlaceInfo: function(apiResult) {
        var name = '<h3>'+apiResult.name+'</h3>';
        if (!apiResult.hasOwnProperty('photos')) {
            return name;
        }

        var photo = '<img src="'+apiResult.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 300})+'"/>';

        return name + photo;
    }
};
