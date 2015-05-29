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
            //console.log('wikipedia');
            //console.log(data);
            wikiResponse = data;
            var pages = data.query.pages;
            for(var index in pages) {
                if(pages.hasOwnProperty(index)) {
                    console.log(pages[index].extract);
                }
            }
        }).fail(function() {
            console.log('wikipedia failed');
        });
    }
};
