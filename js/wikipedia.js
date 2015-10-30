"use strict";

var wikipedia  = {
    endpoint: 'http://en.wikipedia.org/w/api.php',
    initialize: function(data) {
        this.resultCallback = data.resultCallback;
    },
    search: function(term) {
        var self = this;

        $.ajax( {
            url: self.endpoint,
            data: {
                action: 'query',
                prop: 'extracts',
                format: 'json',
                exintro: '',
                titles: encodeURIComponent(term)
            },
            dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
            type: 'POST',
            headers: { 'Api-User-Agent': 'udacity-course/1.0' }
        }).done(function(data) {
            if ('undefined' === typeof(data.query.pages)) {
                return;
            }

            var pages = data.query.pages;
            for(var index in pages) {
                if(pages.hasOwnProperty(index)) {
                    var extract = pages[index].extract;
                    var place = new Place({
                        name: '<h2><img class="wikilogo" src="icon/wikipedia.png">Wikipedia</h2>' + extract,
                        address: term,
                        priority: 5,
                        api: 'wikipedia',
                        type: 'wikipedia',
                        icon: 'icon/wikipedia.png',
                        iconSize: { width: 150, height: 150},
                        id: 'wiki_' + pages[index].pageid
                    });

                    self.resultCallback(place);
                }
            }
        }).fail(function() {
            console.log('Wikipedia search for term "' + term + '" failed');
        });
    }
};
