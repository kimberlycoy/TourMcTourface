$(function() {

    $('.one').draggable();

    var steps = [{
        event: 'next',
        content: 'Welcome'
    },{
        event: 'next',
        selector: '.one',
        content: "I'm at one! and a bit longer longer, and much longer"
    }, {
        event: 'click',
        //event: 'dragstart',
        selector: '.two',
        content: "I'm at two!"
    }, {
        event: 'click',
        //event: 'dragstart',
        selector: '.three',
        content: "Three"
    }];

    var tour = new Tour({
        steps: steps
    });

    tour.start();

});
