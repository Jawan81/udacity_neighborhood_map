/*global
 Place, google
 */

/**
 * The Google Maps API.
 *
 * @type {{initialize: Function, search: Function, geocodePlace: Function, geocode: Function, getCenter: Function, setCenter: Function, markerBounce: Function, selectMarker: Function, createMarkerForPlace: Function, showOrHidePlace: Function}}
 */
var googleMaps = {
    initialize: function(mapCanvas, address) {
        this.searchResults = ko.observableArray();
        var latLng = new google.maps.LatLng(address.lat, address.lng);
        var mapOptions = {
            center: latLng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.geocoder = new google.maps.Geocoder();
        this.map = new google.maps.Map(mapCanvas, mapOptions);
        this.infowindow =  new google.maps.InfoWindow();
        this.currentMarker = null;
    },
    /**
     * Uses the Google Geocoding API to determine addresses or cities that fit to
     * a search term the user typed in.
     *
     * @param {string} address The address.
     */
    search: function(address) {
        var self = this;
        this.geocode(address, function(results) {
            self.searchResults(results);
        });
    },
    /**
     * Tries to find the location (lat/lng) of a place by using the Google Geocoding API.
     * If successful the place is updated with the location and the callback function is called.
     *
     * @param {Place} place The place the location shall be determined for.
     * @param {function} callback A callback function that will be in case of success.
     */
    geocodePlace: function(place, callback) {
        this.geocode(place.address, function(results) {
            if ('undefined' === typeof(results[0])) {
                return;
            }
            var location = results[0].geometry.location;
            place.lat = location.lat();
            place.lng = location.lng();
            place.location = location;

            if (undefined !== callback) {
                callback(place);
            }
        });
    },
    /**
     * Executes the Google Geocoding API request.
     *
     * @param address The address the location shall be looked up for.
     * @param callback Callback Function.
     */
    geocode: function(address, callback) {
        this.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results);
            } else {
                callback([]);
            }
        });
    },
    /**
     * Returns the current center of the map.
     *
     * @returns {*} A LatLng object.
     */
    getCenter: function() {
        return this.map.getCenter();
    },
    /**
     * Sets the map center to the given place.
     *
     * @param {Place} place The new center.
     */
    setCenter: function(place) {
        var self = this;
        self.map.setCenter(place.location);
    },
    /**
     * Makes a Google Map marker bounce.
     *
     * @param marker The Google Map marker.
     */
    markerBounce: function(marker) {
        if (null !== this.currentMarker &&
            this.currentMarker !== marker &&
            this.currentMarker.getAnimation() !== null) {
            this.currentMarker.setAnimation(null);
        }

        if (this.currentMarker !== marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        this.currentMarker = marker;
    },
    /**
     * Initiates what shall happen when a map marker of a place is selected by the user.
     * Centers the map to the marker, makes the marker bounce and opens the info window.
     *
     * @param place The place that was selected.
     */
    selectMarker: function(place) {
        if (undefined === place || "undefined" === typeof(place.renderName)) {
            return;
        }

        this.map.panTo(place.marker.getPosition());
        this.markerBounce(place.marker);
        this.infowindow.setContent(place.renderName);
        this.infowindow.open(this.map, place.marker);

    },
    /**
     * Creates a Google Maps Marker for a specific place and adds it to the map.
     *
     * @param {Place} place The place a marker shall be created for.
     */
    createMarkerForPlace: function(place) {
        var self = this;
        var size = { width: 71, height: 71 };

        if (undefined !== place.iconSize) {
            size = place.iconSize;
        }

        var image = {
            url: place.icon,
            size: new google.maps.Size(size.width, size.height),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(size.width / 3, size.width / 3)
        };

        var marker = new google.maps.Marker({
            map: self.map,
            position: place.location,
            icon: image,
            zIndex: place.priority
        });

        place.marker = marker;

        marker.addListener('click', function() {
            self.selectMarker(place);
        });
    },
    /**
     * Shows or hides the marker of a place according to if it's active or not.
     *
     * @param {Place} place The place to hide or show.
     */
    showOrHidePlace: function(place) {
        if (!place.marker) {
            return;
        }

        if(place.active) {
            place.marker.setMap(this.map);
        } else {
            place.marker.setMap(null);
        }
    }
};
