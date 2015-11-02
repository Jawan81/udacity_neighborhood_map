/*global
    googleMaps
 */

/**
 * The Places Manager manages the array of currently stored places and active places.
 *
 * @type {{places: Array, initialize: Function, addPlace: Function, changeCity: Function, updateActiveApis: Function, updateActiveTypes: Function, updateIcon: Function, clearAll: Function, update: Function, sortActivePlaces: Function, updatePlaceActive: Function, isPlaceActive: Function, updateFilterQuery: Function}}
 */
var placesManager = {
    places: [],
    initialize: function(activePlaces, activeTypes, activeApis, googleMaps) {
        this.activePlaces = activePlaces;
        this.activeTypes = activeTypes;
        this.activeApis = activeApis;
        this.googleMaps = googleMaps;
        this.filterQuery = '';
    },
    /**
     * Adds a place.
     * It will be immediately shown on the map.
     *
     * @param {Place} place The place to be added.
     */
    addPlace: function(place) {
        var self = this;
        var found = this.places.filter(function(p) {
            return p.id === place.id;
        });

        if (found.length > 0) {
            return;
        }

        this.updateIcon(place);
        place.active = true;
        this.activePlaces.push(place);
        self.sortActivePlaces();

        if (undefined === place.location) {
            // Geocode in case the Place's location is unknown
            googleMaps.geocodePlace(place, function (updatedPlace) {
                self.places.push(updatedPlace);
                googleMaps.createMarkerForPlace(updatedPlace);
            });
        } else {
            this.places.push(place);
            this.googleMaps.createMarkerForPlace(place);
        }
    },
    /**
     * In case the user has switched to another city the current places will be cleared
     * and the map center will be set to the new city.
     *
     * @param selected
     */
    changeCity: function(selected) {
        this.clearAll();

        googleMaps.setCenter({
            name: selected.name,
            location: selected.result.geometry.location
        });
    },
    /**
     * Must be called when the user filters the currently active APIs to only show
     * relevant places.
     *
     * @param apis
     */
    updateActiveApis: function(apis) {
        this.activeApis = apis;
        this.update();
    },
    /**
     * Must be called when the user filters the currently active types to only show
     * relevant places.
     *
     * @param types
     */
    updateActiveTypes: function(types) {
        this.activeTypes = types;
        this.update();
    },
    /**
     * Sets the correct icon image according to the place's type.
     *
     * @param place
     */
    updateIcon: function(place) {
        if (typeof(place.icon) !== 'undefined') {
            return;
        }
        place.icon = 'dist/icon/' + place.type + '.png';
    },
    /**
     * Deletes all places.
     */
    clearAll: function() {
        var self = this;
        this.places.forEach(function(place) {
            place.active = false;
            self.googleMaps.showOrHidePlace(place);
        });
        this.activePlaces.removeAll();
        this.places = [];
    },
    /**
     * Updates all current places so only active places are shown.
     */
    update: function() {
        var self = this;
        self.activePlaces.removeAll();
        this.places.forEach(function(place) {
            self.updatePlaceActive(place);
            self.googleMaps.showOrHidePlace(place);
        });
        self.sortActivePlaces();
    },
    /**
     * Sorts the array of active places in alphabetic order by the place's name.
     */
    sortActivePlaces: function() {
        this.activePlaces.sort(function(left, right) {
            var l = left.name.toLowerCase();
            var r = right.name.toLowerCase();
            return l == r ? 0 : (l < r ? -1 : 1);
        });
    },
    /**
     * Pushes a place the array of active places in case it is active.
     *
     * @param place The place to update.
     */
    updatePlaceActive: function(place) {
        place.active = this.isPlaceActive(place);

        if (place.active) {
            this.activePlaces.push(place);
        }
    },
    /**
     * Checks if a place is active or not according to the filters the user set.
     *
     * @param place
     * @returns {boolean}
     */
    isPlaceActive: function(place) {
        return 0 <= this.activeApis.indexOf(place.api) &&
            0 <= this.activeTypes.indexOf(place.type) &&
            (this.filterQuery === '' || 0 <= place.name.toLowerCase().indexOf(this.filterQuery));
    },
    /**
     * In case the user changed the filter query this function must be called.
     * It initiates an update so that only filtered places are presented to the user.
     *
     * @param {string} query The filter query the user typed into the query field.
     */
    updateFilterQuery: function(query) {
        this.filterQuery = query.toLowerCase();
        this.update();
    }
};
