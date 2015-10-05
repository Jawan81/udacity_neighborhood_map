
var placesManager = {
    places: [],
    initialize: function(activeTypes, activeApis, googleMaps) {
        this.activeTypes = activeTypes;
        this.activeApis = activeApis;
        this.googleMaps = googleMaps;
    },
    addPlace: function(place) {
        var found = this.places.filter(function(p) {
            return p.id === place.id;
        });

        if (found.length > 0) {
            return;
        }

        place.active = true;
        this.places.push(place);
        this.googleMaps.createMarkerForPlace(place);
    },
    updateActiveApis: function(apis) {
        this.activeApis = apis;
        this.update();
    },
    updateActiveTypes: function(types) {
        this.activeTypes = types;
        this.update();
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
            && 0 <= this.activeTypes.indexOf(place.type);
    }

};
