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
    var mapCanvas = document.getElementById("map-canvas");
    googleMaps.initialize(mapCanvas, initialAddress);
    ko.applyBindings(new SearchViewModel(initialAddress));
    google.maps.event.addListenerOnce(googleMaps.map, 'idle', function(){
        yelp.initialize({
            apiKey: "E64ahrrCO0X_zDyPHQDYrw",
            callback: function(place) {
                console.log('Yelp callback called');
                //console.log(places);

                //places.forEach(function(place) {
                    googleMaps.createMarker(place.location);
                //});
                // TODO: Do something with the places
            },
            map: googleMaps.map
        });

        // TODO: Define search terms
        yelp.search('cafes');
    });
    //var place = new Place({
    //    name: 'Hamburg',
    //    address: 'Berlin, Germany',
    //    updateGeoData: function(place) { googleMaps.updateLatLng(place);}
    //    //function(myPlace) {
    //    //    console.log("update geo data");
    //    //    myPlace.lat = 12.3;
    //    //    myPlace.lng = 56.7;
    //    //}
    //});

    //place.updateGeoData();
    //
    //console.log("place");
    //setTimeout(function() {
    //    console.log(place.name);
    //    console.log(place.address);
    //    console.log(place.lat);
    //    console.log(place.lng);
    //    console.log(place);
    //}, 2000);

    google.maps.event.addListener(googleMaps.map, 'center_changed', function() {

        yelp.search({
            search: 'cafes',
            map: googleMaps.map
        });
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        //window.setTimeout(function() {
        //    map.panTo(marker.getPosition());
        //}, 3000);
    });

    //var yelpKey = "E64ahrrCO0X_zDyPHQDYrw";
    //
    //
    //window.setTimeout(function() {
    //    var mapBounds = googleMaps.map.getBounds();
    //    var yelpUrl = "http://api.yelp.com/" +
    //        "business_review_search?"+
    //        //"callback=" + "handleResults" +
    //        "&term=" + "hamburg restaurant" + //document.getElementById("term").value +
    //        "&num_biz_requested=10" +
    //        "&tl_lat=" + mapBounds.getSouthWest().lat() +
    //        "&tl_long=" + mapBounds.getSouthWest().lng() +
    //        "&br_lat=" + mapBounds.getNorthEast().lat() +
    //        "&br_long=" + mapBounds.getNorthEast().lng() +
    //        "&ywsid=" + yelpKey;
    //    var yelpRequestUrl = encodeURI(yelpUrl);
    //
    //    $.ajax({
    //        url: yelpRequestUrl,
    //        jsonp: "callback",
    //        //success: function(data) {
    //        //    console.log("jsonp success() called:");
    //        //    console.log(data);
    //        //},
    //        //jsonpCallback: function(data){
    //        //    console.log("jsonp callback succeeded:");
    //        //    console.log(data);
    //        //},
    //        dataType: "jsonp"
    //    }).done(function(data) {
    //        console.log("Yelp request succeeded:");
    //        console.log(data);
    //    }).fail(function() {
    //        console.log("Yelp request failed.");
    //    });
    //
    //    //var script = document.createElement('script');
    //    //script.src = yelpUrl;
    //    //script.type = 'text/javascript';
    //    //var head = document.getElementsByTagName('head').item(0);
    //    //head.appendChild(script);
    //}, 3000);

});

