define('Footer.View.Copyright', [
    'underscore',

    'Footer.Copyright',
    'Footer.View'
], function FooterViewCopyright(
    _,

    FooterCopyright,
    FooterView
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            FooterView.prototype.installPlugin('postContext', {
                name: 'footerContext',
                priority: 10,
                execute: function execute(context, view) {
                    FooterCopyright.contextExecute(application, context, view);
                }
            });
        }
    };
});
