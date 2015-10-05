"use strict";

function Place(data) {
    var self = this;

    Object.defineProperties(this, {
        "name": {
            get: function() {
                return data.name;
            }
        },
        "lat": {
            get: function() {
                return data.lat;
            },
            set: function(lat) {
                data.lat = lat;
            }
        },
        "lng": {
            get: function() {
                return data.lng;
            },
            set: function(lng) {
                data.lng = lng;
            }
        },
        "active": {
            get: function() {
                return data.active;
            },
            set: function(active) {
                data.active = active;
            }
        },
        "location": {
            get: function() {
                return data.location;
            },
            set: function(location) {
                data.location = location;
            }
        },
        "address": {
            get: function() {
                return data.address;
            }
        },
        "icon": {
            get: function() {
                return data.icon;
            }
        },
        "url": {
            get: function() {
                return data.url;
            },
            set: function(url) {
                data.url = url;
            }
        },
        "marker": {
            get: function() {
                return data.marker;
            },
            set: function(marker) {
                data.marker = marker;
            }
        },
        "possibleTypes": {
            get: function() {
                return [
                    "food",
                    "shopping",
                    "sight",
                    "city"
                ]
            }
        },
        "type": {
            get: function() {
                return data.type;
            },
            set: function(type) {
                if (0 <= self.possibleTypes.indexOf(type)) {
                    data.type = type;
                }
            }
        },
        "updateGeoData": {
            value: function() {
                if (undefined !== data.lng && undefined !== data.lat) {
                    return;
                }

                if (undefined !== data.updateGeoData && typeof data.updateGeoData === "function") {
                    data.updateGeoData(self);
                }
            }
        },
        "api": {
            get: function() {
                return data.api;
            }
        }
    });
}
