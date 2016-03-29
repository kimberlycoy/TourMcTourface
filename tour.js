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

    this.$document = $(document).trigger('tour.start', 'start', this);
    this.$window = $(window);
    this.$body = $('body');
}

Tour.prototype.on = function (event, handler) {
    this.$document.on('tour.' + event, function (e, event, tour, step) {
        (handler || $.noop)(event, tour, step);
    });
};

Tour.prototype.off = function (event, handler) {
    this.$document.off('tour.' + event, handler);
};

Tour.prototype.trigger = function (event) {
    this.$document.trigger(event);
};

Tour.prototype.start = function () {
    console.log('Tour.start');

    this.$body.addClass('tour-on');

    this.createContainer();
    this.createOverlay();
    this.next();
};

Tour.prototype.createContainer = function () {
    var self = this;
    this.$body.append(`
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

    this.$container = $('.tour-container');
    this.$arrow = $('.tour-arrow');
    this.$arrowPath = $('.tour-arrow-path');

    this.markerWidth = 6;
    this.nextButton = $('.tour-next').on('click', function (e) {
        self.next();
    });
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

    this.$body.append(this.overlay.top);
    this.$body.append(this.overlay.left);
    this.$body.append(this.overlay.right);
    this.$body.append(this.overlay.bottom);

    return this;
};



function Step(data, tour) {
    $.extend(this, data);
    this.tour = tour;
    this.overlay = tour.overlay;
}

Step.prototype.getMargin = function () {
    var margin = 0;
    if (this.element) margin = $.isNumeric(this.margin) ? this.margin : this.tour.options.margin;
    return margin;
};

Step.prototype.positionOverlay = function () {

    var max = {
        height: this.tour.$window.height(),
        width: this.tour.$document.outerWidth()
    };
    var margin = this.getMargin();

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

Step.prototype.setView = function () {
    this.view = {};
    $.extend(this.view, this.tour.$body[0].getBoundingClientRect());
    this.view.bottom = this.view.top + this.view.height;
    this.view.widthHalf = this.view.width / 2.0;
    return this;
};

Step.prototype.positionContent = function () {
    if (this.selector) {

        var position = {
            top: this.position.bottom + 75 + this.getMargin(),
            left: 'auto',
            right: 'auto',
            transform: ''
        };
        var description = 'bottom';

        if (this.position.right <= this.view.widthHalf) {
            // right of element
            position.left = this.position.left + 120;
            description = 'right';
        } else if (this.position.left >= this.view.widthHalf) {
            // left of element
            position.right = this.position.center.right + 120;
            description = 'left';
        } else {
            // below element
            position.left = this.position.center.left;
            position.transform = 'translateX(-50%)';
        }

        this.tour.$container.css(position).data('position', description);
    } else {
        this.tour.$container.css({
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
    if (this.selector) {
        var containerPosition = {};
        $.extend(containerPosition, this.tour.$container[0].getBoundingClientRect());
        containerPosition.right = this.position.left + this.position.width;
        containerPosition.bottom = this.position.top + this.position.height;
        containerPosition.description = this.tour.$container.data('position');

        var css = {
            opacity: 1,
            top: this.position.bottom + this.getMargin(),
            left: this.position.center.left - this.tour.markerWidth,
            right: 'auto'
        };
        var path = 'M5,2 C20,100 30,110 100,108';

        if (containerPosition.description === 'left') {
            path = 'M95,2 C80,100 70,110 0,108';
            css.left = css.left - 90;
        } else if (containerPosition.description === 'bottom') {
            css.height = 70;
            css.left = css.left - 40;
        }

        this.tour.$arrow.css(css);
        this.tour.$arrowPath.attr('d', path);
    } else {
        this.tour.$arrow.css({ opacity: 0 });
    }

    return this;
};

Step.prototype.setPosition = function () {
    if (this.element) {
        this.position = {};
        this.position = $.extend(this.position, this.element[0].getBoundingClientRect());
        this.position.right = this.position.left + this.position.width;
        this.position.bottom = this.position.top + this.position.height;
        this.position.widthHalf = this.position.width / 2.0;
        this.position.center = {
            right: this.view.width - this.position.right + this.position.widthHalf,
            left: this.position.left + this.position.widthHalf
        }
    } else {
        this.position = { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 };
    }
    return this;
};

Step.prototype.initScrollTo = function () {
    if (!this.element || this.scrollTo === false) return this;

    var self = this;
    var scrollTo = this.tour.options.scrollTo;
    $.extend(scrollTo, $.isPlainObject(self.scrollTo) ? self.scrollTo : {});

    setTimeout(function () {
        self.tour.$document.scrollTo(self.element, scrollTo);
    }, scrollTo.delay);
}

Step.prototype.on = function () {
    var self = this;

    this.tour.$document.arrive(this.selector || 'body', {
        existing: true,
        onceOnly: true
    }, function () {
        self.tour.$document.trigger('tour.step.start', ['step.start', self.tour, self]);
        self.setTarget()
            .setView()
            .setPosition()
            .positionOverlay()
            .setContent()
            .positionContent()
            .positionArrow();
        self.initScrollTo();
    });

    if (this.selector) {
        this.scrollListener = function () {
            self.setView()
                .setPosition()
                .positionOverlay()
                .positionContent()
                .positionArrow();
        };
        this.tour.$window.on('resize', self.scrollListener).on('scroll', self.scrollListener);
    }

    if (event !== 'next') {
        this.eventListener = function (event) {
            self.tour.next();
        };

        this.tour.$document.on(this.event, this.selector, this.eventListener);
    }

    // show/hide next button
    this.tour.showNext(this.showNext || this.event.toLowerCase() === 'next')

    return this;
};

Step.prototype.off = function () {
    this.tour.$document.trigger('tour.step.next', ['step.next', this.tour, this]);

    if (this.eventListener) this.tour.$document.off(this.event, this.selector, this.eventListener);
    if (this.scrollListener) this.tour.$window.off('resize', this.scrollListener).off('scroll', this.scrollListener);

    if (this.element) {
        this.element.removeClass('tour-target');
    }
    return this;
}
