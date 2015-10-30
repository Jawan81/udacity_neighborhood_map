"use strict";

/**
 * The Place object stores data for a specific place that can be displayed on a map.
 *
 * @param data The initialization data.
 * @constructor
 */
function Place(data) {
    var self = this;

    /**
     * Defines the object's properties.
     */
    Object.defineProperties(this, {
        /**
         * The id of the place.
         */
        "id": {
            get: function() {
                return data.id;
            }
        },
        /**
         * The name of the place.
         */
        "name": {
            get: function() {
                return data.name;
            }
        },
        /**
         * The name that will be rendered in the info box of the place (usually HTML).
         */
        "renderName": {
            get: function() {
                return data.renderName;
            }
        },
        /**
         * The latitude.
         */
        "lat": {
            get: function() {
                return data.lat;
            },
            set: function(lat) {
                data.lat = lat;
            }
        },
        /**
         * The longitude.
         */
        "lng": {
            get: function() {
                return data.lng;
            },
            set: function(lng) {
                data.lng = lng;
            }
        },
        /**
         * Boolean value to determine whether the place is active or not.
         * Only active places will be shown on the map.
         */
        "active": {
            get: function() {
                return data.active;
            },
            set: function(active) {
                data.active = active;
            }
        },
        /**
         * The location of the place. Corresponds to lat and lng.
         */
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
        /**
         * The address of the place.
         */
        "address": {
            get: function() {
                return data.address;
            }
        },
        /**
         * The icon for the map marker.
         */
        "icon": {
            get: function() {
                return data.icon;
            },
            set: function(icon) {
                data.icon = icon;
            }
        },
        /**
         * In case the place has a website its URL can be stored here.
         */
        "url": {
            get: function() {
                return data.url;
            },
            set: function(url) {
                data.url = url;
            }
        },
        /**
         * A reference to the Google Maps marker of the place.
         */
        "marker": {
            get: function() {
                return data.marker;
            },
            set: function(marker) {
                data.marker = marker;
            }
        },
        /**
         * The size of the icon in case it differs from the default size.
         */
        "iconSize": {
            get: function() {
                return data.iconSize;
            }
        },
        /**
         * All possible place types.
         */
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
        /**
         * Stores the type of the place. Must be one of "possibleTypes".
         */
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
        /**
         * The priority of the place.
         * Icons of places with higher priority will be shown on top of others.
         */
        "priority": {
            get: function() {
                if('undefined' !== typeof(data.priority)) {
                    return data.priority;
                }

                return 1;
            }
        },
        /**
         * The name of the API the place was created of.
         */
        "api": {
            get: function() {
                return data.api;
            }
        }
    });
}
