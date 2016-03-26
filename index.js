$(function() {

    $('.one').draggable();

    var steps = [{
        event: 'next',
        selector: '.one',
        content: "I'm at one! and a bit longer longer, and much longer",
        title: "The Title"
    }, {
        event: 'click',
        //event: 'dragstart',
        selector: '.two',
        content: "I'm at two!",
        title: "The Title"
    }, {
        event: 'click',
        //event: 'dragstart',
        selector: '.three',
        content: "Three",
        title: "The Title"
    }
    ];

    var tour = new Tour({
        steps: steps
    });

    tour.start();

});
