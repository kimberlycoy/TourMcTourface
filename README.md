# TourMcTourface
A guided tour library.

## Install
```bash
$ bower install git@github.com:kimberlycoy/TourMcTourface.git
```

Add the following to your html.
```html
<link rel="stylesheet" type="text/css" href="[bower]/TourMcTourface/tour.css">
<script src="[bower]/jquery/dist/jquery.min.js"></script>
<script src="[bower]/jquery.scrollTo/jquery.scrollTo.min.js"></script>
<script src="[bower]/arrive/minified/arrive.min.js"></script>
<script src="[bower]/TourMcTourface/tour.js"></script>
```

## Tour options
- reload: Reloads the current step if new steps are added, default:false.
- steps: An array of step options.

## Step options
- event: next | click | [any HTML or custom event]
- selector: CSS selector for element to highlite. If no selector is give, then the content is displayed w/o an arrow. (optional) 
- eventSelector: Listen for the event on this element (CSS selector). (optional)
- showNext: Show the next button, default:false. The next button is also show if event is set to 'next'. (optional)
- scrollTo: False or a settings object for https://github.com/flesler/jquery.scrollTo plus a delay property that is the timeout before scrollTo() is applied. (optional)
- margin: The margin around the selector element, default 0. (optional)
- position: left | right | bottom or css object. (optional)
- focus: Set the focus on the selector element, default:true. (optional)
- autoNext : Timeout in ms (autoAdvance : 5000) (optional)
- afterRefresh : Set "true" to refresh the browser window (default: false)

##### Custom Events
```javascript
{
    event: 'custom.event',
    eventType: 'custom',
    description: "I'm a custom event." 
}

tour.trigger('custom.event'); or $(document).trigger('custom.event');
```

# Events
* `start` - fires on the first step.
* `stop` - fires on the last step in the script.
* `step.start` - fires before the step is started. 
* `step.stop` - fires when the step is completed or 'Next' is clicked.
```javascript
/**
  @param: {string} event The event name.
  @param: {Tour} instance.
  @param: {Step} instance. 
**/ 
tour.on('step.start', function (event, tour, data) {
    // do something
});
```
