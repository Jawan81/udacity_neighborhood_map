"use strict";

function Place(data) {
    //this.name = data.name;
    //this.lat = data.lat;
    //this.lng = data.lng;
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
        "updateGeoData": {
            value: function() {
                if (undefined !== data.lng && undefined !== data.lat) {
                    return;
                }

                if (undefined !== data.updateGeoData && typeof data.updateGeoData === "function") {
                    data.updateGeoData(self);
                }
            }
        }
    });
}
