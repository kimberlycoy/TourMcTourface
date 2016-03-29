# TourMcTourface
A guided tour library.

# Step options
- event: next | click | [etc]
- showNext: Show the next button, default:false. The next button is also show if event is set to 'next'.
- custom events:
```javascript
    {
        event: 'custom.event',
        description: "I'm a custom event." 
    }

    $(document).trigger('custom.event');
```
- scrollTo: False or a settings object for https://github.com/flesler/jquery.scrollTo plus a delay property that is the timeout before scrollTo() is applied. 
- margin: The margin around the selector element, default 5.

# Events
* `start` - fires on the first step.
* `end` - fires on the last step in the script.
* `step.start` - fires before the step is started. 
* `step.next` - fires when the step is completed or 'Next' is clicked.
```javascript
/**
  @param: {string} event The event name.
  @param: {Tour} instance.
  @param: {Step} instance. 
**/ 
enjoyhint_instance.on('step.start', function (event, tour, data) {
    // do something
});
```
