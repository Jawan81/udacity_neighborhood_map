"use strict";
// clientId: 2QOBCHZDJ3QLSXXB0WSGNRP0XUZABIFT1YPTEYPZ1YNYOU0M
// clientSecret: ELAFO2AIFTJUKDAA3HO524T02KMLUDQK5DDEBCVHZ25SJQVO

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
        var ll = latlng.lat + ',' + latlng.lng;

        $.ajax({
            type: "GET",
            url: self.endpoint,
            data: {
                client_id: self.clientId,
                client_secret: self.clientSecret,
                v: '20130815',
                ll: ll,
                section: section
            }
        }).done(function(data) {
            console.log('########## FOURSQUARE:');
            console.log(data);
            var result = data.response;

            data.response.groups[0].items.forEach(function(item) {
                var place = new Place({
                    lat: item.venue.location.lat,
                    lng: item.venue.location.lng,
                    api: 'foursquare',
                    name: self.determinePlaceInfo(item),
                    id: 'fs_' + item.venue.id,
                    icon: 'icon/pagoda-2.png'
                });

                console.log('FOURESQUARE Place');
                console.log(place);
                self.resultCallback(place);
            });
        }).fail(function(data) {
            console.log("##### FOURSQUARE FAILED!");
            console.log(data);
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
        // TODO: URL, Photo etc.
        return apiResult.venue.name;
    }
};