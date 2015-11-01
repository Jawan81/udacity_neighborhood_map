"use strict";

/**
 * The Foursquare API.
 *
 * @type {{endpoint: string, initialize: Function, typesMap: {food: string[], shopping: string[], sight: string[]}, search: Function, request: Function, determineType: Function, determinePlaceInfo: Function}}
 */
var foursquare = {
    endpoint: 'https://api.foursquare.com/v2/venues/explore',
    initialize: function(data) {
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.resultCallback = data.resultCallback;
    },
    /**
     * Maps our Place types to Foursquare's.
     */
    typesMap: {
        food: ['food', 'drinks', 'coffee'],
        shopping: ['shops'],
        sight: ['sights']
    },
    /**
     * Initiates a Place search.
     *
     * @param types An array of the types of Places to be searched for.
     * @param latlng A LatLng object where to search.
     */
    search: function(types, latlng) {
        var self = this;

        types.forEach(function(type) {
            if (!self.typesMap.hasOwnProperty(type)) {
                return;
            }
            self.typesMap[type].forEach(function(section) {
                self.request(section, latlng);
            });
        });
    },
    /**
     * Initiates an AJAX request to the Foursquare API.
     *
     * @param section The 'section' of Foursquare is what is called 'type' internally.
     * @param latlng A LatLng object where to search.
     */
    request: function(section, latlng) {
        var self = this;
        var ll = latlng.lat() + ',' + latlng.lng();

        $.ajax({
            type: "GET",
            url: self.endpoint,
            crossDomain: true,
            dataType: 'jsonp',
            data: {
                client_id: self.clientId,
                client_secret: self.clientSecret,
                v: '20130815',
                ll: ll,
                section: section
            }
        }).done(function(data) {
            if (data.response.groups.length === 0) {
                return;
            }

            var type = self.determineType(data.response.query);

            data.response.groups[0].items.forEach(function(item) {
                // Create a Place for every successful response.
                var place = new Place({
                    lat: item.venue.location.lat,
                    lng: item.venue.location.lng,
                    api: 'foursquare',
                    name: item.venue.name,
                    renderName: self.determinePlaceInfo(item),
                    type: type,
                    id: 'fs_' + item.venue.id
                });

                self.resultCallback(place);
            });
        }).fail(function(data) {
            // ignore failed requests.
        });
    },
    /**
     * Re-Maps a Foursquare type to an internal one.
     *
     * @param fsType The Foursquare type.
     * @returns {string} The name of the internal type.
     */
    determineType: function(fsType) {
        var keys = Object.keys(this.typesMap);
        for (var i in keys) {
            if (0 <= this.typesMap[keys[i]].indexOf(fsType)) {
                return keys[i];
            }
        }

        // only when 'sights' were requested the Foursquare API returns an empty 'query' field
        return 'sight';
    },
    /**
     * Puts together the HTMl that will be shown in the Place's Info Box.
     *
     * @param apiResult The result returned from the Foursquare API.
     * @returns {string} HTML code.
     */
    determinePlaceInfo: function(apiResult) {
        var venue = apiResult.venue;
        var name = venue.name;

        if (typeof(venue.url) != 'undefined') {
            name = '<a href="' + venue.url + '" target="_blank">' + name + '</a>';
        }

        return '<h3>' + name + '</h3>';
    }
};
