
var yelp = {
    apiKey: '',
    numResults: 10,
    mapBounds: {
        tlLat: 0,
        tlLng: 0,
        brLat: 0,
        brLng: 0
    },
    lastResults: [],
    requestUrl: "http://api.yelp.com",
    resultsCallback: null,
    initialize: function(data) {
        this.apiKey = data.apiKey;
        this.resultsCallback = data.callback;

        if (undefined !== data.numResults) {
            this.numResults = parseInt(data.numResults);
        }

        if (undefined !== data.map) {
            this.setMapBounds(data.map);
        }
    },
    setMapBounds: function(map) {
        var mapBounds = map.getBounds();
        this.mapBounds.tlLat = mapBounds.getSouthWest().lat();
        this.mapBounds.tlLng = mapBounds.getSouthWest().lng();
        this.mapBounds.brLat = mapBounds.getNorthEast().lat();
        this.mapBounds.brLng = mapBounds.getNorthEast().lng();
    },
    setUpRequestUrl: function(searchTerm) {
        var yelpUrl = "http://api.yelp.com/" +
            "business_review_search?" +
            "&term=" + searchTerm +
            "&num_biz_requested=" + this.numResults +
            "&tl_lat=" + this.mapBounds.tlLat +
            "&tl_long=" + this.mapBounds.tlLng +
            "&br_lat=" + this.mapBounds.brLat +
            "&br_long=" + this.mapBounds.brLng +
            "&ywsid=" + this.apiKey;

        this.requestUrl = encodeURI(yelpUrl);
    },
    search: function(data) {
        var self = this;
        var searchTerm = '';

        if ("string" === typeof data) {
            searchTerm = data;
        }

        if((typeof data === "object") && (data !== null)) {
            searchTerm = data.search;

            if (undefined !== data.map) {
                this.setMapBounds(data.map);
            }
            if (undefined !== data.callback) {
                this.resultsCallback = data.callback;
            }
        }

        if ('' === searchTerm) {
            return;
        }

        this.setUpRequestUrl(searchTerm);

        $.ajax({
            url: this.requestUrl,
            jsonp: "callback",
            dataType: "jsonp"
        }).done(function(data) {
            self.processResults(data);
        }).fail(function() {
            console.log("Yelp request failed.");
        });
    },
    processResults: function(results) {
        var self = this;
        self.lastResults = [];

        console.log('processResults');
        console.log(results);

        //var numBusinesses = results.businesses.length;
        //var numUpdated = 0;

        results.businesses.forEach(function(business) {
            var place = new Place({
                name: business.name,
                address: business.address1 + "," + business.zip + " " +
                    business.city + ", " + business.country,
                //type: "review",
                url: business.url
            });

            googleMaps.updateLatLng(place, function(updatedPlace) {
                self.lastResults.push(updatedPlace);
                self.resultsCallback(updatedPlace);
            });
        });
    }
};
