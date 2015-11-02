/*global
  googleMaps, console, Place, document, $
 */

/**
 * The Yelp API.
 *
 * IMPORTANT: The Yelp API v1.0 was removed by Yelp during project development. So it cannot be activated in this
 * project anymore. I left the code here to demonstrate that it was implemented once...
 * The API v2.0 cannot be used with JavaScript anymore as it requires API keys, OAuth and stuff.
 *
 * @type {{apiKey: string, numResults: number, mapBounds: {tlLat: number, tlLng: number, brLat: number, brLng: number}, lastResults: Array, requestUrl: string, resultsCallback: null, map: null, blocked: boolean, initialize: Function, setMapBounds: Function, setUpRequestUrl: Function, search: Function, processResults: Function}}
 */
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
    map: null,
    blocked: false,
    initialize: function(data) {
        this.apiKey = data.apiKey;
        this.resultsCallback = data.callback;

        if (undefined !== data.numResults) {
            this.numResults = parseInt(data.numResults);
        }

        this.map = data.map;
        this.setMapBounds();
    },
    setMapBounds: function() {
        var mapBounds = this.map.getBounds();
        this.mapBounds.tlLat = mapBounds.getSouthWest().lat();
        this.mapBounds.tlLng = mapBounds.getSouthWest().lng();
        this.mapBounds.brLat = mapBounds.getNorthEast().lat();
        this.mapBounds.brLng = mapBounds.getNorthEast().lng();
    },
    setUpRequestUrl: function(searchTerm) {
        var yelpUrl = "http://api.yelp.com/" +
            "business_review_search?" +
            "&term=" + encodeURIComponent(searchTerm) +
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

        // avoid calling the API too often
        if (self.blocked) {
            return;
        }
        self.blocked = true;
        setTimeout(function() {
            self.blocked = false;
        }, 2000);

        if ("string" === typeof data) {
            searchTerm = data;
        }

        if((typeof data === "object") && (data !== null)) {
            searchTerm = data.search;

            if (undefined !== data.callback) {
                self.resultsCallback = data.callback;
            }
        }

        if ('' === searchTerm) {
            return;
        }

        this.setMapBounds();
        this.setUpRequestUrl(searchTerm);

        $.ajax({
            url: this.requestUrl,
            jsonp: "callback",
            dataType: "jsonp"
        }).done(function(data) {
            self.processResults(data);
        }).fail(function(data) {
            console.log("Yelp request failed.");
            console.log(data);
        });
    },
    processResults: function(results) {
        var self = this;
        self.lastResults = [];

        console.log('processResults: ' + results.businesses.length);

        results.businesses.forEach(function(business) {
            var place = new Place({
                name: business.name,
                address: business.address1 + "," + business.zip + " " +
                    business.city + ", " + business.country,
                //type: "review",
                url: business.url,
                icon: 'icon/pagoda-2.png', // TODO: Yelp Icon
                api: 'yelp'
            });

            googleMaps.geocodePlace(place, function(updatedPlace) {
                self.lastResults.push(updatedPlace);
                self.resultsCallback(updatedPlace);
            });
        });
    }
};
