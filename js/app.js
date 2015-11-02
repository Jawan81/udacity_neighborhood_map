/*global
    ko, googleMaps, placesManager, wikipedia, Place, document, $
*/

/**
 * Defines Knockout's view model.
 *
 * @param address The initial address where the map should be centered.
 * @constructor
 */
var SearchViewModel = function(address){
    "use strict";
    var self = this;
    self.searchValue = ko.observable(address.name);

    self.search = function() {
        googleMaps.search(self.searchValue());
    };

    self.searchResults = ko.observableArray();

    self.selectAddress = function(selected) {
        if (undefined === selected) {
            return;
        }

        self.searchValue(selected.name);
        self.searchResults([]);
        placesManager.changeCity(selected);

        if (self.activateWikipedia()) {
            wikipedia.search(selected.name);
        }
    };

    self.activePlaces = ko.observableArray();
    self.selectedActivePlace = ko.observable();

    self.selectedActivePlace.subscribe(function(selectedPlace) {
        googleMaps.selectMarker(selectedPlace);
    });

    googleMaps.searchResults.subscribe(function() {
        var results = googleMaps.searchResults();
        var formatted = [];

        results.forEach(function(result) {
            formatted.push({name: result.formatted_address, result: result});
        });

        self.searchResults(formatted);
    });

    self.filterQuery = ko.observable();

    self.filter = function() {
        placesManager.updateFilterQuery(self.filterQuery());
    };

    self.activateWikipedia = ko.observable(true);
    self.activateFoursquare = ko.observable(true);
    self.activateGooglePlaces = ko.observable(true);
    self.activatedApis = ko.observableArray(['wikipedia', 'foursquare', 'googlePlaces']);

    self.activateApi = function(api, activate) {
        var index = self.activatedApis.indexOf(api);
        if (activate && index < 0) {
            self.activatedApis.push(api);
        } else if (!activate && index >= 0) {
            self.activatedApis.remove(api);
        }
    };

    self.activateWikipedia.subscribe(function(activate) {
        self.activateApi('wikipedia', activate);
    });

    self.activateFoursquare.subscribe(function(activate) {
        self.activateApi('foursquare', activate);
    });

    self.activateGooglePlaces.subscribe(function(activate) {
        self.activateApi('googlePlaces', activate);
    });

    self.activatedApis.subscribe(function(apis) {
        placesManager.updateActiveApis(apis);
    });

    self.clearAll = function() {
        placesManager.clearAll();
    };

    self.activateEating = ko.observable(true);
    self.activateShopping = ko.observable(true);
    self.activateSights = ko.observable(true);
    self.activatedTypes = ko.observableArray((new Place()).possibleTypes);

    self.activateType = function(type, activate) {
        var index = self.activatedTypes.indexOf(type);
        if (activate) {
            if (index < 0) {
                self.activatedTypes.push(type);
            }
        } else {
            if (index >= 0) {
                self.activatedTypes.remove(type);
            }
        }
    };
    self.activateEating.subscribe(function(activate){
        self.activateType('food', activate);
    });
    self.activateShopping.subscribe(function(activate){
        self.activateType('shopping', activate);
    });
    self.activateSights.subscribe(function(activate){
        self.activateType('sight', activate);
    });
    self.activatedTypes.subscribe(function(types) {
        placesManager.updateActiveTypes(types);
    });
};

/**
 * The initial address - as the name states.
 * We'll start in my dear old home town.
 *
 * @type {{name: string, lat: number, lng: number}}
 */
var initialAddress = {
    name: 'Hamburg, Germany',
    lat: 53.5510846,
    lng: 9.9936818
};

var domReady = false;
var googleMapReady = false;

/**
 * Event handler for the DOM ready event.
 *
 * Ensures that initialize() is only called when both the Google Maps library and the DOM are ready.
 */
document.addEventListener("DOMContentLoaded", function(event) {
    domReady = true;
    if (googleMapReady) {
        initialize();
    }
});

/**
 * Called by Google Maps JS as a callback after the library is loaded asynchronously.
 *
 * Ensures that initialize() is only called when both the Google Maps library and the DOM are ready.
 */
function initAsync() {
    googleMapReady = true;
    if (domReady) {
        initialize();
    }
}

/**
 * Initializes the project.
 */
function initialize() {
    "use strict";
    var mapCanvas = document.getElementById("map-canvas");
    var storageManager = new StorageManager({storage: window.localStorage});
    var location = storageManager.getLocation();

    if (typeof(location) === "undefined") {
        location = initialAddress;
        storageManager.storeLocation(location);
    }

    googleMaps.initialize(mapCanvas, location);
    var viewModel = new SearchViewModel(location);
    ko.applyBindings(viewModel);

    var addPlace = function(place) {
        placesManager.addPlace(place);
    };

    /**
     * we initialize the APIs when the map is going into the 'idle' state.
     */
    google.maps.event.addListenerOnce(googleMaps.map, 'idle', function(){
        foursquare.initialize({
            clientId: '2QOBCHZDJ3QLSXXB0WSGNRP0XUZABIFT1YPTEYPZ1YNYOU0M',
            clientSecret: 'ELAFO2AIFTJUKDAA3HO524T02KMLUDQK5DDEBCVHZ25SJQVO',
            resultCallback: addPlace
        });

        googlePlaces.initialize({
            placesService: new google.maps.places.PlacesService(googleMaps.map),
            resultCallback: addPlace
        });

        wikipedia.initialize({
            resultCallback: addPlace
        });

        var initiateSearch = placesManager.initialize({
            activePlaces: viewModel.activePlaces,
            activatedTypes: viewModel.activatedTypes(),
            activatedApis: viewModel.activatedApis(),
            googleMaps: googleMaps,
            storageManager: storageManager
        });

        if (initiateSearch) {
            update();
        }

        wikipedia.search(initialAddress.name);
    });

    /**
     * Triggers the search functions of the different Third-Party APIs.
     */
    var update = function() {
        var center = googleMaps.getCenter();
        var activatedTypes = viewModel.activatedTypes();

        if (viewModel.activateFoursquare()){
            foursquare.search(activatedTypes, center);
        }

        if (viewModel.activateGooglePlaces()){
            googlePlaces.search(activatedTypes, center);
        }
    };

    var timeout = 0;

    /**
     * Only start an update when the map center hasn't changed for half a second.
     */
    google.maps.event.addListener(googleMaps.map, 'center_changed', function() {
        timeout++;

        setTimeout(function() {
            timeout = timeout > 0 ? timeout - 1 : 0;
            if (timeout === 0) {
                update();
            }
        }, 500);
    });
}

