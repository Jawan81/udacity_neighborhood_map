/**
 * Manages the storage of places and location.
 *
 * @param data
 * @constructor
 */
function StorageManager(data) {
    "use strict";
    this.storage = data.storage;

    /**
     * Add a Place object to the storage.
     * @param place
     */
    this.addPlace = function(place) {
        var id = 'place_' + place.id;
        this.storage[id] = place.json;
    };

    /**
     * Returns an array of all places in the storage.
     * @returns {Array}
     */
    this.getPlaces = function() {
        var places = [];

        this.iteratePlaces(function(key, item) {
            var data = JSON.parse(item);
            var place = new Place(data);

            // markers can't be stored properly in local storage as they create
            // JSON circular reference errors
            googleMaps.createMarkerForPlace(place);
            places.push(place);
        });

        return places;
    };

    /**
     * Clears all places in the storage.
     */
    this.clearAllPlaces = function() {
        var self = this;
        self.iteratePlaces(function(key, item) {
            delete self.storage[key];
        });
    };

    /**
     * Iterates over all places in the storage and calls a callback
     * function per place found.
     *
     * @param callback
     */
    this.iteratePlaces = function(callback) {
        var self = this;
        Object.keys(this.storage).forEach(function(key) {
            if (key.indexOf('place_') === 0) {
                var item = self.storage.getItem(key);
                if ("undefined" === typeof(item)) {
                    delete self.storage[key];

                    return;
                }

                callback(key, item);
            }
        });
    };

    /**
     * Stores the current location.
     * @param location
     */
    this.storeLocation = function(location) {
        this.storage.location = JSON.stringify(location);
    };

    /**
     * Returns the location stored in the storage.
     * @returns {undefined}
     */
    this.getLocation = function() {
        if ("undefined" === typeof(this.storage.location)){
            return undefined;
        }

        return JSON.parse(this.storage.location);
    };
}
