"use strict";
// clientId: 2QOBCHZDJ3QLSXXB0WSGNRP0XUZABIFT1YPTEYPZ1YNYOU0M
// clientSecret: ELAFO2AIFTJUKDAA3HO524T02KMLUDQK5DDEBCVHZ25SJQVO

var foursquare = {
    endpoint: 'https://api.foursquare.com/v2/venues/explore?client_id=2QOBCHZDJ3QLSXXB0WSGNRP0XUZABIFT1YPTEYPZ1YNYOU0M&client_secret=ELAFO2AIFTJUKDAA3HO524T02KMLUDQK5DDEBCVHZ25SJQVO',
//    &ll=40.7,-74
//&query=sushi',
    initialize: function(data) {

    },
    typesMap: {
        food: ['food', 'drinks', 'coffee'],
        shopping: ['shops'],
        sight: ['sights']
    },
    search: function(types) {
        var self = this;

        $.ajax({
            type: "GET",
            url: self.endpoint,
            data: {
                v: '20130815',
                ll: '40.7,-74',
                section: 'food'
            }
        }).done(function(data) {
            console.log('########## FOURSQUARE:');
            console.log(data);
        }).fail(function() {
            console.log("##### FOURSQUARE FAILED!");
        });
    }
};