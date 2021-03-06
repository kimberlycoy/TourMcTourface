$(function () {

    $('.one-drag').draggable();
    $('.one-drop').droppable();

    var steps = [{
        event: 'custom.event',
        eventType: 'custom',
        // Both "description" and "content" work.
        description: `
            <h1>I'm a custom event</h1> <i>(w/html)!</i>
            <div style="margin-top: 20px; font-size: small;">
                Trigger me with <br>
                <code>$(document).trigger('custom.event');</code>
            </div>
            `
    }, {
        type: 'video',
        content: "http://www.w3schools.com/html/mov_bbb.mp4",
        event: 'ended'
    }, {
        event: 'next',
        content: 'Welcome, click next',
        timeout: 1000
    }, {
        event: 'click',
        selector: '.dropdown',
        eventSelector: '.dropdown button',
        margin: 5,
        content: 'Open the dropdown'
    }, {
        event: 'click',
        selector: '.dropdown-menu li:nth-child(2) a',
        content: 'Select "Another Action"',
        css: [
            {
                selector: '.dropdown, .dropdown *',
                css: {
                    'pointer-events': 'none'
                }
            }, {
                selector: '.dropdown-menu li:nth-child(2) a',
                css: {
                    'pointer-events': 'auto'
                }
            }
        ],
        class: [
            {
                selector: '.dropdown', 
                class: 'smith'
            }
        ]
    }, {
        event: 'change',
        selector: 'input[type="checkbox"]',
        content: 'Check me',
        require: 'on'
    }, {
        event: 'change',
        selector: 'input[placeholder="go"]',
        content: 'Enter "go".',
        require: 'g.+',
        showNext: true
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
        position: 'top',
        content: "Three. Aenean faucibus lobortis orci quis ullamcorper. Pellentesque nec faucibus massa, eget consequat arcu. Quisque hendrerit sapien congue metus iaculis, eu interdum mauris luctus."
    }, {
        event: 'next',
        selector: '.three',
        position: 'top',
        content: "Three. top short" 
    }, {
        event: 'next',
        selector: '.four',
        content: "Four"
    }, {
        event: 'click',
        selector: '.five',
        position: 'left',
        content: 'position:left is bigger and a little bit more must to make it a bit bigger'
    }, {
        event: 'click',
        selector: '.five',
        position: 'top-left',
        content: "Big five<br>Aenean faucibus lobortis orci quis ullamcorper. Pellentesque nec faucibus massa, eget consequat arcu."
    }, {
        event: 'click',
        event_selector: '.six',
        selector: '.six-container',
        position: 'right',
        content: 'position:right'
    }, {
        event: 'click',
        event_selector: '.six',
        selector: '.six-container',
        position: 'top-right',
        content: 'position:top-right'
    },{
        content: 'This will automatically advance in 5 seconds, and refresh the page',
        autoNext:5000,
        afterRefresh:true
    }];

    var tour = new Tour({
        steps: steps
    });

    var logEvent = function (e, t, step) {
        console.log('event:', e, t.i, step ? step.i : '');
    };

    tour.on('start', logEvent); 
    tour.on('stop', logEvent); 
    tour.on('step.start', logEvent); 
    tour.on('step.stop', logEvent); 

    tour.start();
});
