"use strict";

function Place(data) {
    var self = this;

    Object.defineProperties(this, {
        "id": {
            get: function() {
                return data.id;
            }
        },
        "name": {
            get: function() {
                return data.name;
            }
        },
        "renderName": {
            get: function() {
                return data.renderName;
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
                if ('undefined' !== typeof(data.location)) {
                    return data.location;
                }

                if ('undefined' === typeof(data.lng) || 'undefined' === typeof(data.lat)) {
                    return undefined;
                }

                return {
                    lng: data.lng,
                    lat: data.lat
                }
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
            },
            set: function(icon) {
                data.icon = icon;
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
        "iconSize": {
            get: function() {
                return data.iconSize;
            }
        },
        "possibleTypes": {
            get: function() {
                return [
                    "food",
                    "shopping",
                    "sight",
                    "wikipedia"
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
        "priority": {
            get: function() {
                if('undefined' !== typeof(data.priority)) {
                    return data.priority;
                }

                return 1;
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
