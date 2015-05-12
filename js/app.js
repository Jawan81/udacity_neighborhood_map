var SearchViewModel = function(){
    var self = this;
    self.searchValue = ko.observable('Hamburg');

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

googleMaps.initialize(document.getElementById("map_canvas"),
    53.5510846, 9.9936818);
ko.applyBindings(new SearchViewModel());

//$(document).ready(function() {
//});

