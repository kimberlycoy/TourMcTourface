$(function() {

    $('.one').draggable();

    var steps = [
    {
        event: 'custom.event',
        // Both "description" and "content" work.
        description: `
            <h1>I'm a custom event</h1> <i>(w/html)!</i>
            <div style="margin-top: 20px; font-size: small;">
                Trigger me with <br>
                <code>$(document).trigger('custom.event');</code>
            </div>
            `
    },{
        event: 'next',
        content: 'Welcome, click next'
    },{
        event: 'dragstart',
        selector: '.one',
        content: "Drag me"
    }, {
        event: 'click',
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
