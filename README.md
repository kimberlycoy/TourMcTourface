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
