define('Footer.Simplified.View.Copyright', [
    'underscore',

    'Footer.Copyright',
    'Footer.Simplified.View'
], function FooterSimplifiedViewCopyright(
    _,

    FooterCopyright,
    FooterSimplifiedView
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            FooterSimplifiedView.prototype.installPlugin('postContext', {
                name: 'footerSimplifiedContext',
                priority: 10,
                execute: function execute(context, view) {
                    FooterCopyright.contextExecute(application, context, view);
                }
            });
        }
    };
});
