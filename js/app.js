var SearchViewModel = function(address){
    var self = this;
    self.searchValue = ko.observable(address.name);

    self.search = function() {
        googleMaps.search(self.searchValue());
    };

    self.searchResults = ko.observableArray([]);

    self.selectAddress = function(selected) {
        if (undefined === selected) {
            return;
        }

        self.searchValue(selected.name);
        self.searchResults([]);
        googleMaps.setCenter({
            name: selected.name,
            location: selected.result.geometry.location,
            icon: 'icon/moderntower.png'
        });

        if (self.activateWikipedia()) {
            wikipedia.search(selected.name.slice(0, selected.name.indexOf(',')));
        }
    };

    googleMaps.searchResults.subscribe(function() {
        var results = googleMaps.searchResults();
        var formatted = [];

        results.forEach(function(result) {
            formatted.push({name: result.formatted_address, result: result});
        });

        self.searchResults(formatted);
    });

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

var initialAddress = {
    name: 'Hamburg, Germany',
    lat: 53.5510846,
    lng: 9.9936818
};

/**
 * Initialization
 */
$(document).ready(function() {
    var mapCanvas = document.getElementById("map-canvas");
    googleMaps.initialize(mapCanvas, initialAddress);
    var viewModel = new SearchViewModel(initialAddress);
    ko.applyBindings(viewModel);
    placesManager.initialize(viewModel.activatedTypes(), viewModel.activatedApis(), googleMaps);

    var addPlace = function(place) {
        placesManager.addPlace(place);
    };

    google.maps.event.addListenerOnce(googleMaps.map, 'idle', function(){
        foursquare.initialize({
            clientId: '2QOBCHZDJ3QLSXXB0WSGNRP0XUZABIFT1YPTEYPZ1YNYOU0M',
            clientSecret: 'ELAFO2AIFTJUKDAA3HO524T02KMLUDQK5DDEBCVHZ25SJQVO',
            resultCallback: addPlace
        });

        googlePlaces.initialize({
            map: googleMaps.map,
            resultCallback: addPlace
        });

        wikipedia.initialize({
            resultCallback: addPlace
        });

        foursquare.search(viewModel.activatedTypes(), googleMaps.getCenter());
        googlePlaces.search(viewModel.activatedTypes());
        wikipedia.search('Hamburg');
    });

    var update = function() {
        var center = googleMaps.getCenter();

        if (viewModel.activateFoursquare()){
            foursquare.search(viewModel.activatedTypes(), center);
        }

        //foursquare.search();

        if (viewModel.activateGooglePlaces()){
            googlePlaces.search(viewModel.activatedTypes());
        }
    };

    var timeout = 0;

    google.maps.event.addListener(googleMaps.map, 'center_changed', function() {
        timeout++;

        setTimeout(function() {
            timeout = timeout > 0 ? timeout - 1 : 0;
            if (timeout == 0) {
                update();
            }
        }, 500);
    });
});

