function Tour(options) {
    this.options = {
        margin: 5,
        scrollTo: {
            duration: 800,
            offset: { top: -10 },
            display: 500
        }
    };
    $.extend(true, this.options, options);

    this.i = -1;
    this.steps = this.options.steps;
    delete this.options.steps;

    console.log('Tour.config:', this);
}

Tour.prototype.start = function () {
    console.log('Tour.start');

    $('body').addClass('tour-on');

    this.createContainer();
    this.createOverlay();
    this.next();
};

Tour.prototype.createContainer = function () {
    var self = this;
    $('body')
        .append(`
            <div class="tour-container">
                <div class="tour-content"></div>
                <div class="tour-buttons">
                    <button class="tour-next">Next</button>
                </div>
            </div>
            <svg class="tour-arrow" width="100" height="110">
            <defs>
                <marker id="markerArrow"
                    viewBox="0 0 10 10"
                    refX="1" refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto">
                    <path d="M 10 10 L 0 5 L 10 0"/>
                </marker>
            </defs>
            <path d="M5,2 C20,100 30,110 100,108"
                class="tour-arrow-path"
                style="marker-start: url(#markerArrow);"/>
            </svg>
            `);
    this.markerWidth = 6;
    this.nextButton = $('.tour-next').on('click', function (e) {
        self.next();
    });
};

Tour.prototype.showNext = function (show) {
    show ? this.nextButton.show() : this.nextButton.hide();
};

Tour.prototype.createOverlay = function () {
    var div = '<div class="tour-overlay"></div>';
    this.overlay = {
        top: $(div),
        left: $(div),
        right: $(div),
        bottom: $(div)
    };

    var body = $('body');
    body.append(this.overlay.top);
    body.append(this.overlay.left);
    body.append(this.overlay.right);
    body.append(this.overlay.bottom);

    return this;
};

Tour.prototype.next = function () {
    $('.tour-container, .tour-arrow').removeClass('tour-display-on');

    if (this.currentStep) {
        this.currentStep.off();
        $('.tour-overlay').addClass('tour-transition');
    }

    this.i++;

    this.currentStep = new Step(this.steps[this.i], this).on();

    $('.tour-container, .tour-arrow').addClass('tour-display-on');
    setTimeout(function () {
        $('.tour-overlay').removeClass('tour-transition');
    }, 250);
};


function Step(data, tour) {
    $.extend(this, data);
    this.tour = tour;
    this.overlay = tour.overlay;
}

Step.prototype.positionOverlay = function () {

    var max = {
        height: $(window).height(),
        width: $(document).outerWidth()
    };
    var margin = $.isNumeric(this.margin) ? this.margin : this.tour.options.margin;

    console.log('positionOverlay, margin:', margin);

    this.overlay.bottom.css({
        top: this.position.bottom + margin,
        left: this.position.left - margin,
        height: max.height,
        width: this.position.width + (margin * 2)
    });

    this.overlay.top.css({
        top: 0,
        left: 0,
        height: this.position.top - margin,
        width: "100%"
    });

    this.overlay.right.css({
        top: this.position.top - margin,
        left: this.position.right + margin,
        height: max.height,
        width: max.width
    });

    this.overlay.left.css({
        top: this.position.top - margin,
        left: 0,
        height: $(window).height(),
        width: this.position.left - margin
    });

    return this;
};


Step.prototype.positionContent = function () {
    if (this.selector) {
        $('.tour-container').css({
            top: this.position.bottom + 84,
            left: this.position.left + 140,
            transform: ''
        });
    } else {
        $('.tour-container').css({
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        });
    }
    return this;
};

Step.prototype.setContent = function () {
    $('.tour-content').html(this.content || this.description);
    return this;
};

Step.prototype.setTarget = function () {
    if (!this.selector) return this;

    this.element = $(this.selector);
    this.element.addClass('tour-target');

    return this;
};

Step.prototype.positionArrow = function () {
    if (!this.selector) return this;

    var left = this.position.left + (this.position.width / 2.0) - this.tour.markerWidth;
    $('.tour-arrow').css({
        left: left,
        top: this.position.bottom + 5
    });

    return this;
};

Step.prototype.setPosition = function () {
    if (this.element) {
        this.position = this.element.offset();
        this.position.top = this.position.top - $(window).scrollTop();
        this.position.left = this.position.left - $(window).scrollLeft();
        this.position.width = this.element.outerWidth();
        this.position.height = this.element.outerHeight();
        this.position.right = this.position.left + this.position.width;
        this.position.bottom = this.position.top + this.position.height;
    } else {
        this.position = { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 };
    }
    return this;
};

Step.prototype.initScrollTo = function () {
    if (this.scrollTo === false) return this;

    var self = this;
    var scrollTo = this.tour.options.scrollTo;
    $.extend(scrollTo, $.isPlainObject(self.scrollTo) ? self.scrollTo : {});

    setTimeout(function () {
        $(document).scrollTo(self.element, scrollTo);
    }, scrollTo.delay);
}

Step.prototype.on = function () {
    this.setTarget()
        .setPosition()
        .positionOverlay()
        .setContent()
        .positionContent()
        .positionArrow();

    var self = this;
    $(window).on('resize', function () {
        self.setPosition()
            .positionOverlay()
            .positionArrow()
            .positionContent();
    }).on('scroll', function () {
        self.setPosition()
            .positionOverlay()
            .positionArrow()
            .positionContent();
    });

    if (this.element) {
        $(document).on(this.event, this.selector, function (event) {
            self.tour.next();
        });
        self.initScrollTo();
    } else {
        $(document).on(this.event, function (event) {
            self.tour.next();
        });
    }

    // show/hide next button
    this.tour.showNext(this.showNext || this.event.toLowerCase() === 'next')

    return this;
};

Step.prototype.off = function () {
    if (!this.element) return this;
    this.element.removeClass('tour-target');
}
