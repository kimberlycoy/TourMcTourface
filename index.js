$(function () {

    $('.one-drag').draggable();
    $('.one-drop').droppable();

    var steps = [{
        event: 'custom.event',
        // Both "description" and "content" work.
        description: `
            <h1>I'm a custom event</h1> <i>(w/html)!</i>
            <div style="margin-top: 20px; font-size: small;">
                Trigger me with <br>
                <code>$(document).trigger('custom.event');</code>
            </div>
            `
    }, {
        event: 'next',
        content: 'Welcome, click next',
        timeout: 1000
    }, {
        event: 'dragstart',
        selector: '.one-drag',
        content: "Drag me. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nunc massa, imperdiet consectetur nisl eu, condimentum egestas eros. Nulla efficitur ornare justo ut luctus. Quisque efficitur rhoncus odio at venenatis. Cras mattis malesuada lacus et tristique. In porta hendrerit elit id placerat."
    }, {
        event: 'drop',
        selector: '.one-drop',
        content: "Drop Here",
        scrollTo: false
    }, {
        event: 'click',
        selector: '.two',
        content: "I'm at two!",
        margin: 10
    }, {
        event: 'next',
        selector: '.three',
        content: "Three. Aenean faucibus lobortis orci quis ullamcorper. Pellentesque nec faucibus massa, eget consequat arcu. Quisque hendrerit sapien congue metus iaculis, eu interdum mauris luctus. Vivamus non fermentum magna, eu pulvinar nibh. Donec eleifend at leo sit amet vulputate. Donec vel vehicula nibh."
    }, {
        event: 'next',
        selector: '.four',
        content: "Four"
    }];

    var tour = new Tour({
        steps: steps
    });

    // tour.on('step.next', function (e, tour, step) {
    //     console.log('event:', e, tour, step);
    // });
    // tour.on('step.start', function (e, tour, step) {
    //     console.log('event:', e, tour, step);
    // });

    tour.start();
});
