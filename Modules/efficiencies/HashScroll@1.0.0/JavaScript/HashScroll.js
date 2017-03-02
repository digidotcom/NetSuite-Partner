define('HashScroll', [
    'underscore',
    'Backbone',
    'jQuery'
], function HashScroll(
    _,
    Backbone,
    jQuery
) {
    'use strict';

    /*
    Extension to re-implement hash anchors in a SPA, as a query parameter
    If you put ?target= (configurable here) as param, with a value, it perform a scroll to the matched html element:
    The algorithm for lookup is:
        - First try to match by id
        - Then by name
        - Finally by class

    If an element is found, then scroll to it.
     */
    return {
        /* settings */
        paramName: 'target',
        animated: true,

        mountToApp: function mountToApp(application) {
            var Layout = application.getLayout();

            var paramName = this.paramName;
            var animated = this.animated;

            Layout.on('afterAppendView', function afterAppendView(view) {
                var urlOptions;
                var param;
                var $target;

                if (view === Layout.currentView) {
                    urlOptions = _.parseUrlOptions(Backbone.history.fragment);
                    param = urlOptions[paramName];
                    if (param) {
                        $target = Layout.$('#' + param);
                        if (!$target.length) {
                            $target = Layout.$('[name="' + param + '"]');
                        }
                        if (!$target.length) {
                            $target = Layout.$('.' + param).eq(0);
                        }
                        if ($target.length) {
                            setTimeout(function timeout() {
                                var offset = $target.offset().top;
                                if (animated) {
                                    jQuery('html, body').animate({scrollTop: offset}, 500);
                                } else {
                                    jQuery('html, body').scrollTop(offset);
                                }
                            }, 0);
                        }
                    }
                }
            });
        }
    };
});