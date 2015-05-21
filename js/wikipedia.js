var wikipedia  = {

    initialize: function() {

    },
    search: function(term) {

       // var url = 'http://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json';

        var url = 'http://en.wikipedia.org/w/api.php?action=query&titles=' +
            encodeURIComponent(term) +
            '&format=json';//&prop=revisions&rvprop=content

        //'/w/api.php?action=query&list=allpages&prop=info&format=json&apfrom=Hamburg';
        $.ajax( {
            url: url,
            //data: queryData,
            dataType: 'jsonp',
            jsonp: 'callback',
            type: 'POST',
            headers: { 'Api-User-Agent': 'udacity-course/1.0' }
        }).done(function(data) {
            console.log('wikipedia');
            console.log(data);
        }).fail(function() {
            console.log('wikipedia failed');
        });
    }
};
