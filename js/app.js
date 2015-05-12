var SearchViewModel = function(address){
    var self = this;
    self.searchValue = ko.observable(address.name);

    self.search = function() {
        googleMaps.search(self.searchValue());
    };

    self.searchResults = ko.observableArray([]);
    //self.selectedAddress = ko.observable();
    self.selectAddress = function(selected) {
        if (undefined === selected) {
            return;
        }
        //    self.selectedAddress(this);
        self.searchValue(selected.name);
        self.searchResults([]);
        googleMaps.setLocation(selected.result);
    };

    googleMaps.searchResults.subscribe(function() {
        var results = googleMaps.searchResults();
        var formatted = [];

        results.forEach(function(result) {
            formatted.push({name: result.formatted_address, result: result});
        });

        self.searchResults(formatted);
    });

    //self.selectedAddress.subscribe(function(selected) {
    // TODO
    //});
};

var initialAddress = {
    name: 'Hamburg, Germany',
    lat: 53.5510846,
    lng: 9.9936818
};

$(document).ready(function() {
    var mapCanvas = document.getElementById("map_canvas");
    googleMaps.initialize(mapCanvas, initialAddress);
    ko.applyBindings(new SearchViewModel(initialAddress));
});

