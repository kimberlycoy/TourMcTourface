function Tour(options) {
    this.options = {
        margin: 0,
        scrollTo: {
            duration: 800,
            offset: { top: -10 },
            display: 500
        },
        reload: false
    };

    this.$document = $(document);
    this.$window = $(window);
    this.$body = $('body');

    this.init(options);
}

Tour.prototype.init = function (options) {
    $.extend(true, this.options, options || {});

    this.i = -1;
    this.steps = this.options.steps || [];
};

Tour.prototype.resetSteps = function () {
    this.steps.length = 0;
};

Tour.prototype.setSteps = function (steps) {
    this.resetSteps();
    this.addSteps(steps);
};

Tour.prototype.addSteps = function (steps) {
    this.steps = this.steps.concat(steps);
    if (this.options.reload && this.currentStep) {
        this.resetCurrentStep(); 
    }
};

Tour.prototype.resetCurrentStep = function () {
    if (!this.currentStep) return;
    this.currentStep.off();
    this.currentStep = new Step(this.steps[this.i], this).on();
};

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
    if (this.started) this.stop();
    this.started = true;

    console.log('Tour.start');

    this.$document.trigger('tour.start', 'start', this);
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
    if (this.currentStep) this.currentStep.off();
    this.i++;
    if (this.i < this.steps.length) {
        this.currentStep = new Step(this.steps[this.i], this).on();
    } else {
        this.stop();
    }
};

Tour.prototype.stop = function () {
    var self = this;
    this.$container.css({ opacity: 0 });
    this.$arrow.css({ opacity: 0 });
    $('.tour-overlay').css({ opacity: 0 });
    setTimeout(function () {
        self.$document = $(document).trigger('tour.stop', 'stop', this);
        self.$container.remove();
        self.$arrow.remove();
        $('.tour-overlay').remove();
        self.$body.removeClass('tour-on');
    }, 2000);
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
        bottom: $(div),
        center: $(div).addClass('tour-overlay-center')
    };

    this.$body.append(this.overlay.top);
    this.$body.append(this.overlay.left);
    this.$body.append(this.overlay.right);
    this.$body.append(this.overlay.bottom);
    this.$body.append(this.overlay.center);

    // turn off click events on the overlay
    $('.tour-overlay').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (self.currentStep) {
            self.currentStep._focus();
        }
    });

    return this;
};



function Step(data, tour) {
    $.extend(this, data);
    this.tour = tour;
    this.overlay = tour.overlay;
}

Step.prototype.getMargin = function () {
    var margin = 0;
    if (this._element) margin = $.isNumeric(this.margin) ? this.margin : this.tour.options.margin;
    return margin;
};

Step.prototype.positionOverlay = function () {

    var max = {
        height: this.tour.$window.height(),
        width: this.tour.$document.outerWidth()
    };
    var margin = this.getMargin();
    var height = this._position.height + margin * 2;
    var width = this._position.width + margin * 2;

    this.overlay.top.css({
        top: 0,
        left: 0,
        height: this._position.top - margin,
        width: '100vw'
    });

    this.overlay.bottom.css({
        top: this._position.bottom + margin,
        left: 0,
        height: max.height,
        width: '100vw'
    });

    this.overlay.left.css({
        top: this._position.top - margin,
        left: 0,
        height: height,
        width: this._position.left - margin
    });

    this.overlay.right.css({
        top: this._position.top - margin,
        left: this._position.right + margin,
        height: height,
        width: max.width
    });

    this.overlay.center.css({
        top: this._position.top - margin,
        left: this._position.left - margin,
        height: height,
        width: width,
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

Step.prototype.getPositionDescription = function () {
    if ($.type(this.position) === 'string') return this.position.toLowerCase();
    if ($.isPlainObject(this.position)) return "custom";
    if (this._position.right <= this.view.widthHalf) return 'right';
    if (this._position.left >= this.view.widthHalf) return 'left';
    return 'bottom';
};

Step.prototype.positionContent = function () {
    if (this.selector) {

        var position = {
            top: this._position.bottom + 75 + this.getMargin(),
            left: 'auto',
            right: 'auto',
            transform: ''
        };
        var description = this.getPositionDescription();

        if (description === 'right') {
            position.left = this._position.center.left + 110;
        } else if (description === 'left') {
            position.right = this._position.center.right + 110;
        } else if (description === 'custom') {
            $(position, this._position);
        } else {
            position.left = this._position.center.left;
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
    if (this.selector) {
        this._element = $(this.selector);
        this._element.addClass('tour-target');
    }

    this._eventSelector = this.eventSelector || this.event_selector || this.selector;
    if (this._eventSelector) {
        this._eventElement = $(this._eventSelector);
        this._focus();
    }

    return this;
};

Step.prototype.positionArrow = function () {
    if (this.selector) {
        var containerPosition = {};
        $.extend(containerPosition, this.tour.$container[0].getBoundingClientRect());
        containerPosition.right = this._position.left + this._position.width;
        containerPosition.bottom = this._position.top + this._position.height;
        containerPosition.description = this.tour.$container.data('position');

        var css = {
            top: this._position.bottom + this.getMargin(),
            left: this._position.center.left - this.tour.markerWidth,
            right: 'auto',
            height: 'auto'
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
    if (this._element) {
        this._position = {};
        this._position = $.extend(this._position, this._element[0].getBoundingClientRect());
        this._position.right = this._position.left + this._position.width;
        this._position.bottom = this._position.top + this._position.height;
        this._position.widthHalf = this._position.width / 2.0;
        this._position.center = {
            right: this.view.width - this._position.right + this._position.widthHalf,
            left: this._position.left + this._position.widthHalf
        }
    } else {
        this._position = { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 };
    }
    return this;
};

Step.prototype.initScrollTo = function () {
    if (!this._element || this.scrollTo === false) return this;

    var self = this;
    var scrollTo = this.tour.options.scrollTo;
    $.extend(scrollTo, $.isPlainObject(self.scrollTo) ? self.scrollTo : {});

    setTimeout(function () {
        self.tour.$document.scrollTo(self._element, scrollTo);
    }, scrollTo.delay);
}

Step.prototype.initScroll = function () {
    var self = this;

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

    return this;
};

Step.prototype._focus = function () {
    if (this.focus !== false && this._eventElement) this._eventElement.focus();
}

Step.prototype.initEvent = function () {
    var self = this;

    if (event !== 'next') {
        var triggered = false;

        this.eventListener = function (event) {
            var ok = true;
            if ($.type(self.require) === 'string' && self._eventElement.val() !== self.require) {
                ok = false;
            }
            if (ok) {
                triggered = true;
                self.tour.next();
            }
        };

        this.tour.$document.on(
            this.event,
            (this.eventType || this.event_type) === 'custom' ? undefined : self._eventSelector,
            this.eventListener);

        if (this.prevent) {
            this.tour.$document.on(this.prevent.event, this.prevent.selector, function (e) {
                if (triggered) {
                    self.tour.$document.off(self.prevent.event, self.prevent.selector);
                } else {
                    e.stopPropagation();
                    e.preventDefault();
                    self._focus();
                }
            });
        }

        if (this._eventElement && this._eventElement.is(':input')) {
            this._eventElement.on('blur', function (e) {
                self._focus();
            });
        }
    }

    return this;
};

Step.prototype.initNext = function () {
    // show/hide next button
    this.tour.showNext(this.showNext || this.event.toLowerCase() === 'next')
    return this;
};

Step.prototype.init = function () {
    var self = this;

    self.tour.$document.arrive(self.selector || 'body', {
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

    self.initScroll()
        .initEvent()
        .initNext();

    return this;
};

Step.prototype.on = function () {
    var self = this;

    setTimeout(function () {
        $('.tour-container, .tour-overlay-center').addClass('tour-display-on');
        if (self.selector) self.tour.$arrow.addClass('tour-display-on');
        self.init();
    }, self.timeout || 0);

    return this;
};

Step.prototype.off = function () {
    this.tour.$document.trigger('tour.step.next', ['step.next', this.tour, this]);

    $('.tour-container, .tour-arrow, .tour-overlay-center').removeClass('tour-display-on');

    if (this.eventListener) this.tour.$document.off(this.event, this._eventSelector, this.eventListener);
    if (this.scrollListener) this.tour.$window.off('resize', this.scrollListener).off('scroll', this.scrollListener);

    if (this._eventElement) this._eventElement.off('blur');
    if (this.prevent) this.tour.$document.off(this.prevent.event, this.prevent.selector);

    if (this._element) {
        this._element.removeClass('tour-target');
    }
    return this;
};
