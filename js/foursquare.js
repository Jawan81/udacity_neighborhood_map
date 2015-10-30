"use strict";

var foursquare = {
    endpoint: 'https://api.foursquare.com/v2/venues/explore',
    initialize: function(data) {
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.resultCallback = data.resultCallback;
    },
    typesMap: {
        food: ['food', 'drinks', 'coffee'],
        shopping: ['shops'],
        sight: ['sights']
    },
    search: function(types, latlng) {
        var self = this;

        types.forEach(function(type) {
            if (!self.typesMap.hasOwnProperty(type)) {
                return;
            }
            self.typesMap[type].forEach(function(section) {
                self.request(section, latlng);
            })
        })
    },
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
            console.log("##### FOURSQUARE REQUEST FAILED!");
            console.log(data);
        });
    },
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
    determinePlaceInfo: function(apiResult) {
        var venue = apiResult.venue;
        var name = venue.name;

        if (typeof(venue.url) != 'undefined') {
            name = '<a href="' + venue.url + '" target="_blank">' + name + '</a>';
        }

        return '<h3>' + name + '</h3>';
    }
};
