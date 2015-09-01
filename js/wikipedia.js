var wikiResponse = {};
var wikipedia  = {

    initialize: function(data) {
        this.addPlaceToMap = data.addPlaceToMap;

    },
    search: function(term) {

       // var url = 'http://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json';

        //var url = 'http://en.wikipedia.org/w/api.php?action=query&titles=' +
        //var url = 'http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&page=' +
        var url = ' http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=' +
            encodeURIComponent(term);
            //+ '&format=json';//&prop=revisions&rvprop=content

        //'/w/api.php?action=query&list=allpages&prop=info&format=json&apfrom=Hamburg';
        $.ajax( {
            url: url,
            //data: queryData,
            dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
            type: 'POST',
            headers: { 'Api-User-Agent': 'udacity-course/1.0' }
        }).done(function(data) {
            wikiResponse = data;
            var pages = data.query.pages;
            for(var index in pages) {
                if(pages.hasOwnProperty(index)) {
                    console.log('#### Wikipedia result: ' + term);
                    console.log(pages);//[index].extract);
                    var extract = pages[index].extract;
                    var place = new Place({
                        name: '<h2><img class="wikilogo" src="icon/dewiki.png"> Wikipedia</h2>' + extract,
                        address: term,
                        priority: 100,
                        icon: 'icon/dewiki.png', // TODO: Yelp Icon
                        api: 'wikipedia'
                    });

                    googleMaps.updateLatLng(place, function(updatedPlace) {
                        googleMaps.createMarker(updatedPlace, { width: 150, height: 150});
                    })
                }
            }
        }).fail(function() {
            console.log('Wikipedia search for term "' + term + '" failed');
        });
    }
};
