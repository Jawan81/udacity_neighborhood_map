"use strict";

var placesManager = {
    places: [],
    initialize: function(activeTypes, activeApis, googleMaps) {
        this.activeTypes = activeTypes;
        this.activeApis = activeApis;
        this.googleMaps = googleMaps;
        this.filterQuery = '';
    },
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
    updateActiveApis: function(apis) {
        this.activeApis = apis;
        this.update();
    },
    updateActiveTypes: function(types) {
        this.activeTypes = types;
        this.update();
    },
    updateIcon: function(place) {
        if (typeof(place.icon) !== 'undefined') {
            return;
        }
        place.icon = 'icon/' + place.type + '.png';
    },
    clearAll: function() {
        this.places.forEach(function(place) {
            place.active = false;
            self.googleMaps.showOrHidePlace(place);
        });
        this.places = [];
    },
    update: function() {
        var self = this;
        this.places.forEach(function(place) {
            self.updatePlaceActive(place);
            self.googleMaps.showOrHidePlace(place);
        });
    },
    updatePlaceActive: function(place) {
        place.active = this.isPlaceActive(place);
    },
    isPlaceActive: function(place) {
        return 0 <= this.activeApis.indexOf(place.api)
            && 0 <= this.activeTypes.indexOf(place.type)
            && (this.filterQuery === '' || 0 <= place.name.toLowerCase().indexOf(this.filterQuery));
    },
    updateFilterQuery: function(query) {
        this.filterQuery = query.toLowerCase();
        console.log(this.filterQuery);
        this.update();
    }
};
